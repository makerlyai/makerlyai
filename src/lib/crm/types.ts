export type UserRole = "admin" | "partner";

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Interested"
  | "Proposal Sent"
  | "Negotiation"
  | "Closed Won"
  | "Closed Lost";

export const PIPELINE_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Interested",
  "Proposal Sent",
  "Negotiation",
  "Closed Won",
  "Closed Lost",
];

export type RequirementType =
  | "AI Agents & Automation"
  | "Custom Web Application"
  | "SaaS MVP Development"
  | "CRM & Workflow Automation"
  | "Growth & Conversion Optimization"
  | "Other";

export const REQUIREMENT_OPTIONS: RequirementType[] = [
  "AI Agents & Automation",
  "Custom Web Application",
  "SaaS MVP Development",
  "CRM & Workflow Automation",
  "Growth & Conversion Optimization",
  "Other",
];

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  approved: boolean;
  avatarUrl?: string;
  partnerCode?: string;
}

export interface Lead {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  businessName: string;
  requirement: string;
  reason?: string; // specific reason / pain point
  notes?: string;
  status: LeadStatus;
  assignedTo?: string | null;
  assignedToName?: string | null;
  createdBy: string;
  createdByName: string;
  dealValue: number;
  commission: number; // calculated commission payout
  commissionRate?: number; // 15% standard, 20% for high ticket (> ₹100k) decided by owner Tousif Raza
  isHighTicket?: boolean; // dealValue >= 100,000
  commissionApprovedBy?: string | null; // Tousif Raza
  nextFollowupDate?: string | null; // ISO string
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export type ActivityType =
  | "email"
  | "status"
  | "assignment"
  | "note"
  | "followup"
  | "action";

export interface Activity {
  id: string;
  leadId: string;
  type: ActivityType;
  content: string;
  createdByName: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
}

export interface EmailTemplate {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
}

export interface CRMStats {
  totalLeads: number;
  activePipelineCount: number;
  totalPipelineValue: number;
  closedWonCount: number;
  closedWonValue: number;
  totalCommissionDue: number;
  overdueFollowupsCount: number;
}

