// ─────────────────────────────────────────────────────────────────
//  MakerlyAI Autonomous Sales Engine - CRM Synchronization & Store
//  Integrates directly with Supabase crm_leads and local fallback
// ─────────────────────────────────────────────────────────────────

import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { SALES_ENGINE_CONFIG } from './config.mjs';

const CACHE_FILE = SALES_ENGINE_CONFIG.crm.localCacheFile;

let supabase = null;
if (SALES_ENGINE_CONFIG.crm.supabaseUrl && SALES_ENGINE_CONFIG.crm.supabaseKey) {
  try {
    supabase = createClient(
      SALES_ENGINE_CONFIG.crm.supabaseUrl,
      SALES_ENGINE_CONFIG.crm.supabaseKey
    );
  } catch (err) {
    console.warn('[CRM Sync] Supabase client init notice:', err.message);
  }
}

/**
 * Loads leads from local cache file
 */
export function loadCachedLeads() {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'));
    }
  } catch (err) {
    console.error('[CRM Sync] Error reading cache file:', err.message);
  }
  return [];
}

/**
 * Saves leads to local cache file
 */
export function saveCachedLeads(leads) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(leads, null, 2), 'utf-8');
  } catch (err) {
    console.error('[CRM Sync] Error writing cache file:', err.message);
  }
}

/**
 * Upserts a lead into both local cache and Supabase CRM
 */
export async function syncLeadToCRM(lead) {
  if (!lead.id) {
    lead.id = `lead-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  const leads = loadCachedLeads();
  const existingIdx = leads.findIndex(l => 
    (lead.email && l.email && l.email.toLowerCase() === lead.email.toLowerCase()) ||
    (lead.websiteUrl && l.websiteUrl && l.websiteUrl.toLowerCase() === lead.websiteUrl.toLowerCase()) ||
    (lead.id && l.id && l.id === lead.id)
  );

  const updatedLead = {
    ...lead,
    updatedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    leads[existingIdx] = { ...leads[existingIdx], ...updatedLead };
  } else {
    leads.unshift(updatedLead);
  }
  saveCachedLeads(leads);

  // Sync with Supabase crm_leads if available
  let supabaseSynced = false;
  if (supabase) {
    try {
      const payload = {
        client_name: lead.clientName || 'Decision Maker',
        phone: lead.phone || 'Not provided',
        email: lead.email || null,
        business_name: lead.businessName,
        requirement: lead.recommendedOffer || `Growth & AI Pipeline (${lead.niche || 'B2B'})`,
        notes: `[Autonomous Sales Engine]\nScore: ${lead.qualificationScore || 'N/A'}/100 (${lead.tier || 'Unranked'})\nPersonalized Hook: ${lead.personalizedHook || 'N/A'}\nWebsite: ${lead.websiteUrl || 'N/A'}`,
        status: mapStatusToSupabase(lead.status || 'New'),
        deal_value: lead.dealValue || 99000,
        is_high_ticket: lead.isHighTicket || false,
        commission_amount: 0,
        created_by_email: 'growth-engine@makerlyai.in',
        created_by_name: 'MakerlyAI Sales Engine',
        created_by_role: 'system',
        lead_source: 'outbound_autonomous',
      };

      const { data, error } = await supabase
        .from('crm_leads')
        .upsert(payload, { onConflict: 'email' })
        .select('id')
        .single();

      if (!error) {
        supabaseSynced = true;
        // Log activity
        await supabase.from('crm_activities').insert({
          lead_id: data.id,
          type: 'status_change',
          title: `Autonomous Engine: Lead Qualified (${lead.qualificationScore}/100)`,
          description: `BANT/MEDDIC qualified for ${lead.businessName}. Estimated deal: ₹${lead.dealValue?.toLocaleString('en-IN')}`,
          created_by_name: 'MakerlyAI Sales Engine'
        });
      }
    } catch (dbErr) {
      console.warn('[CRM Sync] Supabase sync notice:', dbErr.message);
    }
  }

  return { success: true, localSaved: true, supabaseSynced, lead: updatedLead };
}

/**
 * Maps engine status to Supabase enum
 */
function mapStatusToSupabase(status) {
  const map = {
    'New': 'new',
    'Discovered': 'new',
    'Qualified': 'new',
    'Contacted': 'contacted',
    'Interested': 'interested',
    'Proposal Sent': 'proposal_sent',
    'Negotiation': 'negotiation',
    'Closed Won': 'closed_won',
    'Closed Lost': 'closed_lost',
  };
  return map[status] || 'new';
}

/**
 * Returns complete CRM pipeline statistics
 */
export function getPipelineStats() {
  const leads = loadCachedLeads();

  const stats = {
    totalLeads: leads.length,
    qualifiedCount: leads.filter(l => (l.qualificationScore || 0) >= 60).length,
    highTicketCount: leads.filter(l => l.isHighTicket).length,
    contactedCount: leads.filter(l => l.touchCount && l.touchCount > 0).length,
    totalPipelineValue: leads.reduce((acc, l) => acc + (l.dealValue || 0), 0),
    byNiche: {},
    byTier: {
      'Tier 1 (High Ticket)': 0,
      'Tier 2 (Mid Market)': 0,
      'Tier 3 (Unqualified)': 0,
    }
  };

  for (const lead of leads) {
    const niche = lead.niche || 'other';
    stats.byNiche[niche] = (stats.byNiche[niche] || 0) + 1;
    if (lead.tier && stats.byTier[lead.tier] !== undefined) {
      stats.byTier[lead.tier] += 1;
    }
  }

  return stats;
}

/**
 * Updates status of a lead and syncs to CRM
 */
export async function updateLeadStatusInCRM(leadId, newStatus) {
  const leads = loadCachedLeads();
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return null;

  lead.status = newStatus;
  lead.updatedAt = new Date().toISOString();
  saveCachedLeads(leads);

  if (supabase) {
    try {
      await supabase
        .from('crm_leads')
        .update({ status: mapStatusToSupabase(newStatus) })
        .eq('email', lead.email);
    } catch {}
  }
  return lead;
}

/**
 * Attaches generated proposal to a lead
 */
export async function saveLeadProposal(leadId, proposal) {
  const leads = loadCachedLeads();
  const lead = leads.find(l => l.id === leadId);
  if (!lead) return null;

  lead.proposal = proposal;
  lead.status = 'Proposal Sent';
  lead.updatedAt = new Date().toISOString();
  saveCachedLeads(leads);
  return lead;
}

/**
 * Deletes or archives a lead from the CRM cache
 */
export function deleteLeadFromCRM(leadId) {
  const leads = loadCachedLeads();
  const filtered = leads.filter(l => l.id !== leadId);
  saveCachedLeads(filtered);
  return true;
}
