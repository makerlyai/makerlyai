"use client";

import { Lead, Activity, User, LeadStatus, CRMStats } from "./types";
import { SEED_LEADS, SEED_ACTIVITIES, SEED_USERS } from "./seed-data";
import { calculateCommission } from "./commission";

const LEADS_STORAGE_KEY = "makerlyai_crm_leads_v5";
const ACTIVITIES_STORAGE_KEY = "makerlyai_crm_activities_v5";
const USERS_STORAGE_KEY = "makerlyai_crm_users_v5";
const ACTIVE_USER_KEY = "makerlyai_crm_active_user_v5";

/**
 * Initializes and retrieves data from local storage or seed data
 */
export function getStoredLeads(): Lead[] {
  if (typeof window === "undefined") return SEED_LEADS;
  try {
    const data = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(SEED_LEADS));
      return SEED_LEADS;
    }
    return JSON.parse(data);
  } catch {
    return SEED_LEADS;
  }
}

export function saveStoredLeads(leads: Lead[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error("Failed to save leads to storage", err);
  }
}

export function getStoredActivities(): Activity[] {
  if (typeof window === "undefined") return SEED_ACTIVITIES;
  try {
    const data = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(SEED_ACTIVITIES));
      return SEED_ACTIVITIES;
    }
    return JSON.parse(data);
  } catch {
    return SEED_ACTIVITIES;
  }
}

export function saveStoredActivities(activities: Activity[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
  } catch (err) {
    console.error("Failed to save activities to storage", err);
  }
}

export function getStoredUsers(): User[] {
  if (typeof window === "undefined") return SEED_USERS;
  try {
    const data = localStorage.getItem(USERS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
      return SEED_USERS;
    }
    return JSON.parse(data);
  } catch {
    return SEED_USERS;
  }
}

export function getActiveUser(): User {
  if (typeof window === "undefined") return SEED_USERS[0];
  try {
    const data = localStorage.getItem(ACTIVE_USER_KEY);
    if (!data) {
      localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(SEED_USERS[0]));
      return SEED_USERS[0];
    }
    return JSON.parse(data);
  } catch {
    return SEED_USERS[0];
  }
}

export function setActiveUser(user: User): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACTIVE_USER_KEY, JSON.stringify(user));
  } catch (err) {
    console.error("Failed to set active user", err);
  }
}

/**
 * Creates a new activity record
 */
export function createActivity(
  leadId: string,
  type: Activity["type"],
  content: string,
  userName: string,
  metadata?: Record<string, unknown>
): Activity {
  const newActivity: Activity = {
    id: "act-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    leadId,
    type,
    content,
    createdByName: userName,
    createdAt: new Date().toISOString(),
    metadata,
  };

  const current = getStoredActivities();
  const updated = [newActivity, ...current];
  saveStoredActivities(updated);
  return newActivity;
}

/**
 * Creates a new lead (Partner Submission)
 */
export function createLead(
  leadData: {
    clientName: string;
    phone: string;
    email: string;
    businessName: string;
    requirement: string;
    reason?: string;
    notes?: string;
    dealValue?: number;
  },
  user: User
): Lead {
  const val = Number(leadData.dealValue) || 0;
  const isHigh = val >= 100000;
  const newLead: Lead = {
    id: "lead-" + Date.now().toString(36),
    clientName: leadData.clientName,
    phone: leadData.phone,
    email: leadData.email,
    businessName: leadData.businessName,
    requirement: leadData.requirement,
    reason: leadData.reason || "",
    notes: leadData.notes || "",
    status: "New",
    assignedTo: null,
    assignedToName: null,
    createdBy: user.id,
    createdByName: user.name,
    dealValue: val,
    commission: 0,
    commissionRate: isHigh ? 20 : 15,
    isHighTicket: isHigh,
    commissionApprovedBy: isHigh ? "MakerlyAI (Tousif Raza)" : null,
    nextFollowupDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const leads = getStoredLeads();
  saveStoredLeads([newLead, ...leads]);

  createActivity(
    newLead.id,
    "note",
    `Lead submitted by partner ${user.name} for ${newLead.businessName}${isHigh ? " (🔥 High Ticket Deal > ₹1,00,000)" : ""}`,
    user.name
  );

  return newLead;
}

/**
 * Creates multiple leads in bulk (from Excel/CSV import)
 */
export function createBulkLeads(
  leadsData: Array<{
    clientName: string;
    phone: string;
    email: string;
    businessName: string;
    requirement: string;
    reason?: string;
    notes?: string;
    dealValue?: number;
  }>,
  user: User
): Lead[] {
  const currentLeads = getStoredLeads();
  const newLeads: Lead[] = [];

  leadsData.forEach((item, index) => {
    const val = Number(item.dealValue) || 0;
    const isHigh = val >= 100000;
    const newLead: Lead = {
      id: "lead-" + Date.now().toString(36) + "-" + index,
      clientName: item.clientName,
      phone: item.phone,
      email: item.email,
      businessName: item.businessName,
      requirement: item.requirement || "AI Agents & Automation",
      reason: item.reason || "",
      notes: item.notes || "",
      status: "New",
      assignedTo: null,
      assignedToName: null,
      createdBy: user.id,
      createdByName: user.name,
      dealValue: val,
      commission: 0,
      commissionRate: isHigh ? 20 : 15,
      isHighTicket: isHigh,
      commissionApprovedBy: isHigh ? "MakerlyAI (Tousif Raza)" : null,
      nextFollowupDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    newLeads.push(newLead);
  });

  saveStoredLeads([...newLeads, ...currentLeads]);

  // Log bulk activity for the first lead or as a batch
  if (newLeads.length > 0) {
    createActivity(
      newLeads[0].id,
      "note",
      `Bulk imported ${newLeads.length} leads with adaptable field detection by ${user.name}`,
      user.name
    );
  }

  return newLeads;
}

/**
 * Updates a lead (Admin or Partner)
 */
export function updateLead(
  leadId: string,
  updates: Partial<Lead>,
  user: User
): Lead | null {
  const leads = getStoredLeads();
  const index = leads.findIndex((l) => l.id === leadId);
  if (index === -1) return null;

  const oldLead = leads[index];
  const newStatus = updates.status || oldLead.status;
  const newDealValue = updates.dealValue !== undefined ? Number(updates.dealValue) : oldLead.dealValue;
  const isHigh = newDealValue >= 100000;
  
  // Effective rate: owner override takes precedence, else 20% if high ticket, else 15%
  const effectiveRate = updates.commissionRate || oldLead.commissionRate || (isHigh ? 20 : 15);
  
  // Auto calculate commission if Closed Won
  const newCommission = calculateCommission(newDealValue, newStatus, effectiveRate);

  const updatedLead: Lead = {
    ...oldLead,
    ...updates,
    dealValue: newDealValue,
    commission: newCommission,
    commissionRate: effectiveRate,
    isHighTicket: isHigh,
    updatedAt: new Date().toISOString(),
  };

  // Log status change
  if (updates.status && updates.status !== oldLead.status) {
    const commissionNote =
      updates.status === "Closed Won"
        ? ` 🎉 Deal won! ${effectiveRate}% partner commission (₹${newCommission.toLocaleString("en-IN")}) credited${isHigh ? " [🔥 20% High Ticket Approved by Owner]" : ""}.`
        : "";
    createActivity(
      leadId,
      "status",
      `Status updated from "${oldLead.status}" to "${updates.status}".${commissionNote}`,
      user.name
    );
  }

  // Log assignment
  if (updates.assignedToName && updates.assignedToName !== oldLead.assignedToName) {
    createActivity(
      leadId,
      "assignment",
      `Lead assigned to ${updates.assignedToName}`,
      user.name
    );
  }

  // Log follow-up change
  if (updates.nextFollowupDate && updates.nextFollowupDate !== oldLead.nextFollowupDate) {
    const formattedDate = new Date(updates.nextFollowupDate).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    createActivity(
      leadId,
      "followup",
      `Follow-up scheduled for ${formattedDate}`,
      user.name
    );
  }

  leads[index] = updatedLead;
  saveStoredLeads(leads);
  return updatedLead;
}

/**
 * Updates a lead's partner commission rate (Authority: MakerlyAI Owner Tousif Raza only)
 */
export function updateLeadCommissionRate(
  leadId: string,
  ratePercentage: number,
  user: User
): Lead | null {
  if (user.role !== "admin") {
    console.warn("Only MakerlyAI Owner (Tousif Raza) can adjust commission percentages.");
    return null;
  }

  const leads = getStoredLeads();
  const index = leads.findIndex((l) => l.id === leadId);
  if (index === -1) return null;

  const old = leads[index];
  const newCommission = calculateCommission(old.dealValue, old.status, ratePercentage);

  const updated: Lead = {
    ...old,
    commissionRate: ratePercentage,
    commission: newCommission,
    commissionApprovedBy: user.name,
    updatedAt: new Date().toISOString(),
  };

  leads[index] = updated;
  saveStoredLeads(leads);

  createActivity(
    leadId,
    "action",
    `👑 ${user.name} adjusted partner commission rate to ${ratePercentage}%${ratePercentage >= 20 ? " (🔥 High Ticket Approved)" : ""}. Projected payout: ₹${newCommission.toLocaleString("en-IN")}`,
    user.name
  );

  return updated;
}

/**
 * Executes one-tap actions
 */
export function executeOneTapAction(
  leadId: string,
  action:
    | "markContacted"
    | "assignSenior"
    | "scheduleFollowup"
    | "logEmailSent"
    | "boostHighTicketCommission",
  user: User,
  payload?: any
): Lead | null {
  switch (action) {
    case "boostHighTicketCommission":
      return updateLeadCommissionRate(leadId, 20, user);

    case "markContacted":
      return updateLead(leadId, { status: "Contacted" }, user);

    case "assignSenior": {
      const seniorAdmin = SEED_USERS.find((u) => u.role === "admin") || user;
      return updateLead(
        leadId,
        {
          assignedTo: seniorAdmin.id,
          assignedToName: seniorAdmin.name,
        },
        user
      );
    }

    case "scheduleFollowup": {
      const days = payload?.days || 2;
      const targetDate = new Date(Date.now() + 86400000 * days).toISOString();
      return updateLead(leadId, { nextFollowupDate: targetDate }, user);
    }

    case "logEmailSent": {
      createActivity(
        leadId,
        "email",
        `Sent email "${payload?.subject || "Follow-up"}" to ${payload?.to || "client"}`,
        user.name,
        payload
      );
      // Also advance status to Contacted if still New
      const leads = getStoredLeads();
      const current = leads.find((l) => l.id === leadId);
      if (current && current.status === "New") {
        return updateLead(leadId, { status: "Contacted" }, user);
      }
      return current || null;
    }

    default:
      return null;
  }
}

/**
 * Calculates CRM stats for dashboard
 */
export function calculateStats(leads: Lead[], activeUser: User): CRMStats {
  const visibleLeads =
    activeUser.role === "partner"
      ? leads.filter((l) => l.createdBy === activeUser.id)
      : leads;

  const now = new Date().getTime();
  const activePipeline = visibleLeads.filter(
    (l) => l.status !== "Closed Won" && l.status !== "Closed Lost"
  );
  const closedWon = visibleLeads.filter((l) => l.status === "Closed Won");

  const overdueFollowups = visibleLeads.filter((l) => {
    if (!l.nextFollowupDate || l.status === "Closed Won" || l.status === "Closed Lost") return false;
    return new Date(l.nextFollowupDate).getTime() < now;
  });

  return {
    totalLeads: visibleLeads.length,
    activePipelineCount: activePipeline.length,
    totalPipelineValue: visibleLeads.reduce((sum, l) => sum + (l.dealValue || 0), 0),
    closedWonCount: closedWon.length,
    closedWonValue: closedWon.reduce((sum, l) => sum + (l.dealValue || 0), 0),
    totalCommissionDue: closedWon.reduce((sum, l) => sum + (l.commission || 0), 0),
    overdueFollowupsCount: overdueFollowups.length,
  };
}

