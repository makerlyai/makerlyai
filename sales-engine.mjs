#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────
//  MakerlyAI Autonomous B2B Lead Generation & Sales Engine
//  Master CLI & Orchestration System
//
//  Synthesizes:
//  - ericosiu/ai-marketing-skills (Growth Engine & A/B testing)
//  - SuiteCRM (Lead stages, pipeline tracking, deal values)
//  - zubair-trabzada/ai-sales-team-claude (BANT + MEDDIC qualifier & 4-touch sequences)
//  - Madi-S/Lead-Generation & eracle/OpenOutreach (B2B multi-channel discovery)
//  - xeneta/LeadQualifier (LLM Lead Quality Scoring)
//  - BillionMail (Deliverability, mailbox rotation, strict 20/day safety cap)
//  - D4Vinci/Scrapling (Stealth anti-bot scraping)
// ─────────────────────────────────────────────────────────────────

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { SALES_ENGINE_CONFIG } from './src/lib/sales-engine/config.mjs';
import { discoverTargetsFromWeb } from './src/lib/sales-engine/scrapers/serp-discovery.mjs';
import { enrichWebsite } from './src/lib/sales-engine/scrapers/website-enricher.mjs';
import { qualifyLead } from './src/lib/sales-engine/qualifier.mjs';
import { generateSequence } from './src/lib/sales-engine/sequence-generator.mjs';
import { buildSalesEmailHtml, buildSalesEmailText } from './src/lib/sales-engine/email-template.mjs';
import {
  sendOutreachEmail,
  loadDailyTracker,
  getNextAvailableMailbox,
  getRandomHumanDelay
} from './src/lib/sales-engine/deliverability-rotator.mjs';
import {
  loadCachedLeads,
  syncLeadToCRM,
  getPipelineStats
} from './src/lib/sales-engine/crm-sync.mjs';
import {
  loadExperiments,
  createExperiment,
  assignVariant
} from './src/lib/sales-engine/growth-experiment-engine.mjs';

function printBanner() {
  console.log(`
\x1b[36m╔════════════════════════════════════════════════════════════════════╗
║                ⚡  MAKERLYAI AUTONOMOUS SALES ENGINE  ⚡            ║
║     B2B Lead Discovery • BANT/MEDDIC Qualification • AI Outreach   ║
╚════════════════════════════════════════════════════════════════════╝\x1b[0m
`);
}

// ── Command: Discover ─────────────────────────────────────────────
async function handleDiscover(args) {
  const niche = args.find(a => a.startsWith('--niche='))?.split('=')[1] || 'd2c';
  const limitArg = args.find(a => a.startsWith('--limit='))?.split('=')[1];
  const limit = limitArg ? parseInt(limitArg, 10) : 5;
  const query = args.find(a => a.startsWith('--query='))?.split('=')[1] || null;

  console.log(`\x1b[33m[*] Starting Discovery Pipeline for Niche: [${niche.toUpperCase()}] (Target Limit: ${limit})...\x1b[0m`);

  // 1. Run Scrapling Stealth Harvester + Web Discovery
  let targets = [];
  try {
    console.log(`\x1b[35m[*] Invoking Scrapling Stealth Harvester (D4Vinci/Scrapling anti-bot engine)...\x1b[0m`);
    const { execSync } = await import('child_process');
    const pyCmd = `python src/lib/sales-engine/scrapers/scrapling_harvester.py --niche ${niche} --limit ${limit}`;
    const pyOutput = execSync(pyCmd, { encoding: 'utf-8', timeout: 35000 });
    const parsed = JSON.parse(pyOutput);
    if (parsed.leads && parsed.leads.length > 0) {
      targets = parsed.leads;
      console.log(`\x1b[32m[+] Scrapling successfully harvested ${targets.length} stealth B2B targets.\x1b[0m`);
    }
  } catch (pyErr) {
    console.log(`   [!] Scrapling notice: ${pyErr.message?.slice(0, 100)}. Falling back to native SERP discovery...`);
  }

  if (targets.length < limit) {
    const fallbackTargets = await discoverTargetsFromWeb({ niche, limit: limit - targets.length, query });
    targets.push(...fallbackTargets);
  }
  console.log(`\x1b[32m[+] Total targets for enrichment: ${targets.length}\x1b[0m`);

  // 2. Deep Website Enrichment & Contact Extraction
  console.log(`\n\x1b[33m[*] Crawling websites & extracting verified emails, tech stack, and pain points...\x1b[0m`);
  let enrichedCount = 0;

  for (let i = 0; i < targets.length; i++) {
    const target = targets[i];
    console.log(`   [${i + 1}/${targets.length}] Analyzing: ${target.websiteUrl} (${target.businessName})...`);

    const enrichment = await enrichWebsite(target.websiteUrl);

    target.emails = enrichment.emails || [];
    target.phones = enrichment.phones || [];
    target.techStack = enrichment.techStack || [];
    target.painPointsIdentified = enrichment.painPointsIdentified || [];
    target.metaDescription = enrichment.metaDescription || '';
    target.title = enrichment.title || target.title;
    target.h1s = enrichment.h1s || [];
    target.socialLinks = enrichment.socialLinks || {};
    target.hasValidMx = enrichment.hasValidMx;

    if (target.emails.length > 0) {
      target.email = target.emails[0];
      console.log(`       \x1b[32m✓ Email found: ${target.email} | MX Valid: ${target.hasValidMx}\x1b[0m`);
    } else {
      console.log(`       \x1b[90m- No public email detected on website\x1b[0m`);
    }

    if (target.techStack.length > 0) {
      console.log(`       \x1b[34mℹ Tech: ${target.techStack.join(', ')}\x1b[0m`);
    }

    // Sync to CRM
    await syncLeadToCRM(target);
    enrichedCount++;
  }

  console.log(`\n\x1b[32m[✓] Discovery complete! Enriched and saved ${enrichedCount} leads to CRM.\x1b[0m`);
  console.log(`    Next step: Run 'node sales-engine.mjs qualify' to score them with BANT + MEDDIC.`);
}

// ── Command: Qualify ──────────────────────────────────────────────
async function handleQualify() {
  console.log(`\x1b[33m[*] Loading unrated leads from CRM store for BANT + MEDDIC qualification...\x1b[0m`);
  const leads = loadCachedLeads();

  const toQualify = leads.filter(l => !l.qualificationScore || l.status === 'Discovered');

  if (toQualify.length === 0) {
    console.log(`\x1b[32m[✓] All ${leads.length} leads in CRM have already been qualified!\x1b[0m`);
    return;
  }

  console.log(`\x1b[36m[*] Found ${toQualify.length} leads ready for Groq AI scoring...\x1b[0m\n`);

  for (let i = 0; i < toQualify.length; i++) {
    const lead = toQualify[i];
    console.log(`   [${i + 1}/${toQualify.length}] Evaluating ${lead.businessName} (${lead.niche})...`);

    const evalResult = await qualifyLead(lead);

    lead.qualificationScore = evalResult.qualificationScore;
    lead.tier = evalResult.tier;
    lead.isHighTicket = evalResult.isHighTicket;
    lead.dealValue = evalResult.dealValue;
    lead.bant = evalResult.bant;
    lead.meddic = evalResult.meddic;
    lead.personalizedHook = evalResult.personalizedHook;
    lead.recommendedOffer = evalResult.recommendedOffer;
    lead.status = evalResult.qualificationScore >= 60 ? 'Qualified' : 'Unqualified';

    // Generate 4-touch sequence if lead is qualified
    if (evalResult.qualificationScore >= 55) {
      console.log(`       Generating 4-touch outreach sequence...`);
      lead.sequence = await generateSequence(lead);
    }

    await syncLeadToCRM(lead);

    const scoreColor = lead.qualificationScore >= 80 ? '\x1b[32m' : lead.qualificationScore >= 60 ? '\x1b[33m' : '\x1b[31m';
    console.log(`       ${scoreColor}Score: ${lead.qualificationScore}/100 | ${lead.tier} | Deal Value: ₹${lead.dealValue.toLocaleString('en-IN')}\x1b[0m`);
    console.log(`       Hook: "${lead.personalizedHook.slice(0, 90)}..."\n`);
  }

  console.log(`\x1b[32m[✓] Qualification complete! All scored leads and sequences synced with CRM.\x1b[0m`);
}

// ── Command: Campaign ─────────────────────────────────────────────
async function handleCampaign(args) {
  const isSend = args.includes('--send');
  const isDryRun = args.includes('--dry-run') || !isSend;
  const batchArg = args.find(a => a.startsWith('--batch='))?.split('=')[1];
  const batchSize = batchArg ? parseInt(batchArg, 10) : 5;

  const tracker = loadDailyTracker();
  console.log(`\x1b[36m[*] Mode: ${isDryRun ? '[DRY RUN - Safe Preview]' : '[LIVE SENDING - Delivering Real Emails]'}\x1b[0m`);
  console.log(`[*] Today's Date (IST): ${tracker.date} | Total Sent Today: ${tracker.totalSent}/40 cap`);

  const nextMailbox = getNextAvailableMailbox();
  if (!nextMailbox && !isDryRun) {
    console.log(`\x1b[31m[!] Daily quota reached on all mailboxes (20 emails/day cap strictly enforced). Halting.\x1b[0m`);
    return;
  }

  const leads = loadCachedLeads();
  // Find leads that have a valid email, are qualified (score >= 55), and have not completed Touch 1
  const candidates = leads.filter(l => 
    l.email && 
    l.email.includes('@') && 
    (l.qualificationScore || 0) >= 55 &&
    (!l.touchCount || l.touchCount === 0)
  ).slice(0, batchSize);

  if (candidates.length === 0) {
    console.log(`\x1b[33m[!] No qualified leads currently pending Touch 1 outreach.\x1b[0m`);
    console.log(`    Run 'node sales-engine.mjs discover' then 'node sales-engine.mjs qualify' first.`);
    return;
  }

  console.log(`\x1b[32m[+] Selected ${candidates.length} qualified leads for Touch #1 outreach batch.\x1b[0m\n`);

  for (let i = 0; i < candidates.length; i++) {
    const lead = candidates[i];
    const seq = lead.sequence?.touch1 || {
      subject: `quick idea for ${lead.businessName}`,
      bodyPlain: `At MakerlyAI, we build custom high-converting web apps and AI workflows...`,
      bodyHtml: `<p>At MakerlyAI, we build custom high-converting web apps and AI workflows...</p>`,
      ctaText: 'Book a 15-Min Strategy Call'
    };

    const sender = nextMailbox || SALES_ENGINE_CONFIG.mailboxes[0];

    const html = buildSalesEmailHtml({
      recipientName: lead.clientName || 'there',
      businessName: lead.businessName,
      subject: seq.subject,
      touchNumber: 1,
      personalizedHook: lead.personalizedHook,
      bodyContent: seq.bodyHtml,
      ctaText: seq.ctaText || 'Book a 15-Minute Strategy Call',
      senderName: sender.name,
      senderTitle: sender.title,
      senderEmail: sender.email,
      recipientEmail: lead.email,
    });

    const plain = buildSalesEmailText({
      recipientName: lead.clientName || 'there',
      businessName: lead.businessName,
      personalizedHook: lead.personalizedHook,
      bodyContentPlain: seq.bodyPlain,
      senderName: sender.name,
      senderTitle: sender.title,
      senderEmail: sender.email,
      recipientEmail: lead.email,
    });

    console.log(`   [${i + 1}/${candidates.length}] ${isDryRun ? 'Previewing' : 'Sending'} to ${lead.email} (${lead.businessName})...`);
    console.log(`       Subject: "${seq.subject}"`);
    console.log(`       Mailbox: ${sender.email}`);

    const res = await sendOutreachEmail({
      recipientEmail: lead.email,
      recipientName: lead.clientName || 'Decision Maker',
      businessName: lead.businessName,
      subject: seq.subject,
      htmlContent: html,
      plainTextContent: plain,
      touchNumber: 1,
      dryRun: isDryRun,
    });

    if (res.success) {
      if (!isDryRun) {
        lead.touchCount = 1;
        lead.lastTouchAt = new Date().toISOString();
        lead.status = 'Contacted';
        lead.mailboxUsed = res.mailboxUsed;
        await syncLeadToCRM(lead);
        console.log(`       \x1b[32m✓ Email delivered successfully (MessageID: ${res.messageId})\x1b[0m`);

        // Randomized human pause if there are remaining leads in this batch
        if (i < candidates.length - 1) {
          const delay = getRandomHumanDelay();
          console.log(`       \x1b[90m⏳ Humanized deliverability pause: waiting ${(delay / 1000).toFixed(0)}s before next dispatch...\x1b[0m`);
          await new Promise(r => setTimeout(r, delay));
        }
      } else {
        console.log(`       \x1b[36m✓ DRY RUN validated: MX valid, HTML template rendered perfectly.\x1b[0m`);
      }
    } else {
      console.log(`       \x1b[31m✗ Skipped/Failed: ${res.reason || res.error}\x1b[0m`);
    }
  }

  console.log(`\n\x1b[32m[✓] Campaign run finished.\x1b[0m`);
}

// ── Command: Pipeline Overview ────────────────────────────────────
function handlePipeline() {
  const stats = getPipelineStats();
  const tracker = loadDailyTracker();

  console.log(`\x1b[34m┌─────────────────────────────────────────────────────────────┐\x1b[0m`);
  console.log(`\x1b[34m│\x1b[0m               \x1b[1mMAKERLYAI SALES PIPELINE OVERVIEW\x1b[0m             \x1b[34m│\x1b[0m`);
  console.log(`\x1b[34m├─────────────────────────────────────────────────────────────┤\x1b[0m`);
  console.log(`  \x1b[37mTotal Leads in CRM:\x1b[0m            ${stats.totalLeads}`);
  console.log(`  \x1b[32mBANT/MEDDIC Qualified:\x1b[0m         ${stats.qualifiedCount}`);
  console.log(`  \x1b[33m🔥 High Ticket Deals (> ₹1L):\x1b[0m  ${stats.highTicketCount}`);
  console.log(`  \x1b[36mContacted / In Outreach:\x1b[0m       ${stats.contactedCount}`);
  console.log(`  \x1b[35m💰 Total Pipeline Value:\x1b[0m       ₹${stats.totalPipelineValue.toLocaleString('en-IN')}`);
  console.log(`\x1b[34m├─────────────────────────────────────────────────────────────┤\x1b[0m`);
  console.log(`  \x1b[1mDaily Sending Quota (20/day safety cap):\x1b[0m`);
  console.log(`  • tousif@makerlyai.in:  ${tracker.mailboxes.founder?.sentCount || 0} / 20 sent today`);
  console.log(`  • hello@makerlyai.in:   ${tracker.mailboxes.growth?.sentCount || 0} / 20 sent today`);
  console.log(`  • Total Outbound Today: ${tracker.totalSent} / 40 total limit`);
  console.log(`\x1b[34m├─────────────────────────────────────────────────────────────┤\x1b[0m`);
  console.log(`  \x1b[1mBy Niche:\x1b[0m`);
  for (const [niche, count] of Object.entries(stats.byNiche)) {
    console.log(`  • ${niche.toUpperCase()}: ${count} leads`);
  }
  console.log(`\x1b[34m└─────────────────────────────────────────────────────────────┘\x1b[0m\n`);
}

// ── Command: Add Single Lead ──────────────────────────────────────
async function handleAdd(args) {
  const url = args.find(a => a.startsWith('--url='))?.split('=')[1];
  const company = args.find(a => a.startsWith('--company='))?.split('=')[1] || 'Target Brand';
  const name = args.find(a => a.startsWith('--name='))?.split('=')[1] || 'Decision Maker';
  const niche = args.find(a => a.startsWith('--niche='))?.split('=')[1] || 'd2c';
  const email = args.find(a => a.startsWith('--email='))?.split('=')[1] || '';

  if (!url) {
    console.log(`\x1b[31m[!] Please provide --url=<website>\x1b[0m`);
    return;
  }

  console.log(`[*] Adding and analyzing: ${company} (${url})...`);
  const enrichment = await enrichWebsite(url);
  const lead = {
    id: `lead-${Date.now().toString(36)}`,
    businessName: company,
    clientName: name,
    websiteUrl: url,
    email: email || enrichment.emails[0] || '',
    emails: enrichment.emails,
    phones: enrichment.phones,
    techStack: enrichment.techStack,
    metaDescription: enrichment.metaDescription,
    h1s: enrichment.h1s,
    painPointsIdentified: enrichment.painPointsIdentified,
    niche,
    status: 'Discovered',
  };

  console.log(`[*] Qualifying lead with BANT + MEDDIC...`);
  const evalResult = await qualifyLead(lead);
  lead.qualificationScore = evalResult.qualificationScore;
  lead.tier = evalResult.tier;
  lead.isHighTicket = evalResult.isHighTicket;
  lead.dealValue = evalResult.dealValue;
  lead.personalizedHook = evalResult.personalizedHook;
  lead.recommendedOffer = evalResult.recommendedOffer;
  lead.status = 'Qualified';
  lead.sequence = await generateSequence(lead);

  await syncLeadToCRM(lead);
  console.log(`\x1b[32m[✓] Added & Qualified ${lead.businessName} (Score: ${lead.qualificationScore}/100 | Deal Value: ₹${lead.dealValue.toLocaleString('en-IN')})\x1b[0m`);
}

// ── Command: Growth Experiments (ai-marketing-skills) ─────────────
function handleExperiment(args) {
  const isCreate = args.includes('create');
  if (isCreate) {
    const hypothesis = args.find(a => a.startsWith('--hypothesis='))?.split('=')[1] || 'Variant A outperforms Variant B';
    const variable = args.find(a => a.startsWith('--variable='))?.split('=')[1] || 'messaging_hook';
    const variantsRaw = args.find(a => a.startsWith('--variants='))?.split('=')[1] || '["Variant A", "Variant B"]';
    const metric = args.find(a => a.startsWith('--metric='))?.split('=')[1] || 'reply_rate';

    let variants = ['Variant A', 'Variant B'];
    try {
      variants = JSON.parse(variantsRaw);
    } catch {}

    const exp = createExperiment({ hypothesis, variable, variants, metric });
    console.log(`\x1b[32m[✓] Experiment Created Successfully!\x1b[0m`);
    console.log(`    ID:         ${exp.id}`);
    console.log(`    Hypothesis: "${exp.hypothesis}"`);
    console.log(`    Variable:   ${exp.variable}`);
    console.log(`    Variants:   ${exp.variants.map(v => v.name).join(' vs ')}`);
    console.log(`    Metric:     ${exp.metric}\n`);
    return;
  }

  const experiments = loadExperiments();
  console.log(`\x1b[35m┌─────────────────────────────────────────────────────────────┐\x1b[0m`);
  console.log(`\x1b[35m│\x1b[0m             \x1b[1mMAKERLYAI GROWTH EXPERIMENT ENGINE\x1b[0m              \x1b[35m│\x1b[0m`);
  console.log(`\x1b[35m├─────────────────────────────────────────────────────────────┤\x1b[0m`);
  if (experiments.length === 0) {
    console.log(`  No experiments currently running.`);
    console.log(`  Create one with: node sales-engine.mjs experiment create --hypothesis="..." --variable=format --variants='["A","B"]'`);
  } else {
    for (const exp of experiments) {
      console.log(`  🧪 \x1b[1m${exp.name}\x1b[0m [${exp.status}]`);
      console.log(`     Hypothesis: "${exp.hypothesis}"`);
      console.log(`     Variable: ${exp.variable} | Metric: ${exp.metric}`);
      for (const v of exp.variants) {
        console.log(`     • ${v.name}: ${v.impressions} sent, ${v.conversions} replies (${(v.rate * 100).toFixed(1)}%)`);
      }
      if (exp.winningVariant) {
        console.log(`     🏆 \x1b[32mWinner: ${exp.winningVariant}\x1b[0m`);
      }
      console.log('');
    }
  }
  console.log(`\x1b[35m└─────────────────────────────────────────────────────────────┘\x1b[0m\n`);
}

// ── Main Router ───────────────────────────────────────────────────
async function main() {
  printBanner();
  const args = process.argv.slice(2);
  const command = args[0] || 'pipeline';

  switch (command) {
    case 'discover':
      await handleDiscover(args.slice(1));
      break;
    case 'qualify':
      await handleQualify();
      break;
    case 'campaign':
      await handleCampaign(args.slice(1));
      break;
    case 'pipeline':
    case 'status':
      handlePipeline();
      break;
    case 'experiment':
      handleExperiment(args.slice(1));
      break;
    case 'add':
      await handleAdd(args.slice(1));
      break;
    case 'help':
    default:
      console.log(`
Usage: node sales-engine.mjs <command> [options]

Commands:
  discover    Find B2B targets using Scrapling anti-bot & enrich websites
              --niche=d2c|saas|high-ticket (default: d2c)
              --limit=10 (default: 5)

  qualify     Score leads with BANT + MEDDIC & generate 4-touch sequences

  campaign    Dispatch cold outreach with 20/day limit & mailbox rotation
              --dry-run (preview safely)
              --send (dispatch real authenticated emails)
              --batch=5

  pipeline    View visual SuiteCRM-style pipeline statistics & quotas

  experiment  View or create A/B growth experiments (ai-marketing-skills)
              create --hypothesis="..." --variable=hook --variants='["A","B"]'

  add         Manually add a website to scrape, qualify, and sequence
              --url=https://target.com --company="Target" --name="Founder" --niche=d2c
`);
      break;
  }
}

main().catch(err => {
  console.error('\x1b[31m[Fatal Error]\x1b[0m', err);
});
