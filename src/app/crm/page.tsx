"use client";

import React, { useState, useEffect } from "react";
import {
  Lead,
  Activity,
  User,
  LeadStatus,
  CRMStats,
} from "@/lib/crm/types";
import {
  getStoredLeads,
  getStoredActivities,
  getStoredUsers,
  getActiveUser,
  setActiveUser,
  createLead,
  createBulkLeads,
  updateLead,
  executeOneTapAction,
  createActivity,
  calculateStats,
} from "@/lib/crm/crm-store";
import { CRMHeader } from "@/components/crm/crm-header";
import { StatsRibbon } from "@/components/crm/stats-ribbon";
import { LeadTable } from "@/components/crm/lead-table";
import { LeadKanban } from "@/components/crm/lead-kanban";
import { LeadDetailDrawer } from "@/components/crm/lead-detail-drawer";
import { EmailComposerModal } from "@/components/crm/email-composer-modal";
import { LeadSubmissionModal } from "@/components/crm/lead-submission-modal";
import { BulkImportModal } from "@/components/crm/bulk-import-modal";
import { MakerlyLogoIcon } from "@/components/crm/makerly-logo";
import { AuthGate } from "@/components/crm/auth-gate";
import { OwnerAccessManager } from "@/components/crm/owner-access-manager";
import {
  AuthSession,
  getAuthSession,
  logoutSession,
  getAccessRequests,
} from "@/lib/crm/auth-store";
import { ShieldCheck, UserCheck, Sparkles, Filter, FileSpreadsheet } from "lucide-react";

export default function CRMPage() {
  const [mounted, setMounted] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeUser, setActiveUserState] = useState<User>(getActiveUser());
  const [authSession, setAuthSessionState] = useState<AuthSession | null>(null);
  const [isAccessManagerOpen, setIsAccessManagerOpen] = useState(false);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "kanban">("table");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [emailComposerLead, setEmailComposerLead] = useState<Lead | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Load stored state on mount
  useEffect(() => {
    setLeads(getStoredLeads());
    setActivities(getStoredActivities());
    const storedUsers = getStoredUsers();
    setUsers(storedUsers);
    setActiveUserState(getActiveUser());

    // Load auth session
    const session = getAuthSession();
    setAuthSessionState(session);

    // Refresh pending requests count
    const reqs = getAccessRequests();
    setPendingRequestsCount(reqs.filter((r) => r.status === "pending").length);

    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("dark");
    }
    setMounted(true);
  }, []);

  const handleAuthorized = (session: AuthSession) => {
    setAuthSessionState(session);
    if (session.role === "owner") {
      const ownerUser =
        users.find((u) => u.email === "getmakerlyai@gmail.com") || getActiveUser();
      setActiveUser(ownerUser);
      setActiveUserState(ownerUser);
    } else {
      const partnerUser = users.find(
        (u) => u.email.toLowerCase() === session.email.toLowerCase()
      ) || {
        id: "user-" + Date.now(),
        name: session.name,
        email: session.email,
        role: "partner" as const,
        approved: true,
      };
      setActiveUser(partnerUser);
      setActiveUserState(partnerUser);
    }
  };

  const handleLockCRM = () => {
    logoutSession();
    setAuthSessionState(null);
  };

  const refreshPendingCount = () => {
    const reqs = getAccessRequests();
    setPendingRequestsCount(reqs.filter((r) => r.status === "pending").length);
  };

  const handleUserChange = (user: User) => {
    setActiveUser(user);
    setActiveUserState(user);
  };

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => {
      const next = !prev;
      if (typeof document !== "undefined") {
        if (next) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      }
      return next;
    });
  };

  // Status update
  const handleUpdateStatus = (leadId: string, status: LeadStatus) => {
    const updated = updateLead(leadId, { status }, activeUser);
    if (updated) {
      setLeads(getStoredLeads());
      setActivities(getStoredActivities());
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
    }
  };

  // Lead update (e.g. deal value, assignment)
  const handleUpdateLead = (leadId: string, updates: Partial<Lead>) => {
    const updated = updateLead(leadId, updates, activeUser);
    if (updated) {
      setLeads(getStoredLeads());
      setActivities(getStoredActivities());
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
    }
  };

  // Add note
  const handleAddNote = (leadId: string, noteContent: string) => {
    createActivity(leadId, "note", noteContent, activeUser.name);
    setActivities(getStoredActivities());
  };

  // One-tap actions
  const handleMarkContacted = (leadId: string) => {
    const updated = executeOneTapAction(leadId, "markContacted", activeUser);
    if (updated) {
      setLeads(getStoredLeads());
      setActivities(getStoredActivities());
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
    }
  };

  const handleScheduleFollowup = (leadId: string, days: number) => {
    const updated = executeOneTapAction(leadId, "scheduleFollowup", activeUser, {
      days,
    });
    if (updated) {
      setLeads(getStoredLeads());
      setActivities(getStoredActivities());
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
    }
  };

  const handleAssignSenior = (leadId: string) => {
    const updated = executeOneTapAction(leadId, "assignSenior", activeUser);
    if (updated) {
      setLeads(getStoredLeads());
      setActivities(getStoredActivities());
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
    }
  };

  // High ticket boost to 20% by Owner Tousif Raza
  const handleBoostCommission = (leadId: string) => {
    const updated = executeOneTapAction(leadId, "boostHighTicketCommission", activeUser);
    if (updated) {
      setLeads(getStoredLeads());
      setActivities(getStoredActivities());
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(updated);
      }
    }
  };

  const handleSendEmail = (payload: {
    leadId: string;
    to: string;
    subject: string;
    body: string;
    templateId: string;
  }) => {
    const updated = executeOneTapAction(payload.leadId, "logEmailSent", activeUser, {
      subject: payload.subject,
      to: payload.to,
      templateId: payload.templateId,
    });
    if (updated) {
      setLeads(getStoredLeads());
      setActivities(getStoredActivities());
      if (selectedLead && selectedLead.id === payload.leadId) {
        setSelectedLead(updated);
      }
    }
  };

  const handleCreateLead = (leadData: {
    clientName: string;
    phone: string;
    email: string;
    businessName: string;
    requirement: string;
    notes?: string;
  }) => {
    const newLead = createLead(leadData, activeUser);
    setLeads(getStoredLeads());
    setActivities(getStoredActivities());
  };

  const handleBulkImport = (
    importedLeads: Array<{
      clientName: string;
      phone: string;
      email: string;
      businessName: string;
      requirement: string;
      notes?: string;
      dealValue?: number;
    }>
  ) => {
    createBulkLeads(importedLeads, activeUser);
    setLeads(getStoredLeads());
    setActivities(getStoredActivities());
  };

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#F8FAFC] dark:bg-obsidian-950 text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-3 text-sm font-medium">
          <div className="w-9 h-9 rounded-xl bg-[#efe7d1] border border-[#2952cc]/30 flex items-center justify-center shadow-xs p-1">
            <MakerlyLogoIcon className="w-full h-full" color="#2952cc" />
          </div>
          <span>Initializing MakerlyAI.in CRM...</span>
        </div>
      </div>
    );
  }

  // Personal Authorization Gate Check
  if (!authSession || !authSession.isAuthorized) {
    return <AuthGate onAuthorized={handleAuthorized} />;
  }

  // Filter leads based on global search & partner permissions
  const partnerFilteredLeads =
    activeUser.role === "partner"
      ? leads.filter((l) => l.createdBy === activeUser.id)
      : leads;

  const searchedLeads = partnerFilteredLeads.filter((l) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      l.clientName.toLowerCase().includes(q) ||
      l.businessName.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      l.phone.includes(q) ||
      l.requirement.toLowerCase().includes(q)
    );
  });

  const stats = calculateStats(leads, activeUser);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-obsidian-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      {/* Top Header with Personal Authorization Controls */}
      <CRMHeader
        activeUser={activeUser}
        onUserChange={handleUserChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenSubmitModal={() => setIsSubmitModalOpen(true)}
        onOpenBulkImportModal={() => setIsBulkImportOpen(true)}
        isDarkMode={isDarkMode}
        onToggleTheme={handleToggleTheme}
        authSession={authSession}
        pendingRequestsCount={pendingRequestsCount}
        onOpenAccessManager={() => setIsAccessManagerOpen(true)}
        onLockCRM={handleLockCRM}
      />

      {/* Main CRM Workspace */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* Role Notice & Action Banner */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-900/60 px-4 py-3 shadow-sm backdrop-blur-md">
          <div className="flex items-center gap-3">
            {activeUser.role === "admin" ? (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#efe7d1] border border-[#2952cc]/30 shadow-xs p-1.5 transition-transform hover:scale-105">
                <MakerlyLogoIcon className="w-full h-full" color="#2952cc" />
              </div>
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700 dark:bg-brand-500/20 dark:text-brand-400 border border-brand-200 dark:border-brand-500/30">
                <UserCheck className="h-5 w-5" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  Active View: {activeUser.name}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                    activeUser.role === "admin"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-300 dark:border-emerald-500/30"
                      : "bg-brand-50 text-brand-800 border border-brand-300 dark:bg-brand-500/20 dark:text-brand-300 dark:border-brand-500/30"
                  }`}
                >
                  {activeUser.role === "admin"
                    ? "Owner & Decision Maker"
                    : "Lead Partner • 15% Comm (High Ticket: 20%)"}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                {activeUser.role === "admin"
                  ? "Owner controls: High ticket sales (> ₹1,00,000) qualify for 20% commission boost, decided and approved only by you (Tousif Raza)."
                  : `Partner access: Showing only leads submitted by ${activeUser.name}. Standard commission is 15%; high-ticket sales (> ₹1,00,000) are eligible for 20% on Owner Tousif Raza's review.`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBulkImportOpen(true)}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300 px-3 py-1.5 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all active:scale-95 shadow-xs"
            >
              <FileSpreadsheet className="h-3.5 w-3.5" />
              <span>Bulk Import (Excel/CSV)</span>
            </button>
            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 text-white dark:bg-brand-600 px-3.5 py-1.5 text-xs font-semibold hover:bg-slate-800 dark:hover:bg-brand-500 transition-all active:scale-95 shadow-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Submit Single Lead</span>
            </button>
          </div>
        </div>

        {/* Financial & Pipeline Stats Ribbon */}
        <StatsRibbon stats={stats} activeUser={activeUser} />

        {/* Content View: Table vs Kanban */}
        {viewMode === "table" ? (
          <LeadTable
            leads={searchedLeads}
            activeUser={activeUser}
            onSelectLead={(lead) => setSelectedLead(lead)}
            onUpdateStatus={handleUpdateStatus}
            onOpenEmailComposer={(lead) => setEmailComposerLead(lead)}
            onBoostCommission={handleBoostCommission}
          />
        ) : (
          <LeadKanban
            leads={searchedLeads}
            activeUser={activeUser}
            onSelectLead={(lead) => setSelectedLead(lead)}
            onUpdateStatus={handleUpdateStatus}
            onOpenEmailComposer={(lead) => setEmailComposerLead(lead)}
            onBoostCommission={handleBoostCommission}
          />
        )}
      </main>

      {/* Slide-out Lead Detail Drawer */}
      <LeadDetailDrawer
        lead={selectedLead}
        activities={activities}
        users={users}
        activeUser={activeUser}
        isOpen={Boolean(selectedLead)}
        onClose={() => setSelectedLead(null)}
        onUpdateLead={handleUpdateLead}
        onAddNote={handleAddNote}
        onOpenEmailComposer={(lead) => setEmailComposerLead(lead)}
        onMarkContacted={handleMarkContacted}
        onScheduleFollowup={handleScheduleFollowup}
        onAssignSenior={handleAssignSenior}
        onBoostCommission={handleBoostCommission}
      />

      {/* Email Composer Modal */}
      {emailComposerLead && (
        <EmailComposerModal
          lead={emailComposerLead}
          activeUser={activeUser}
          isOpen={Boolean(emailComposerLead)}
          onClose={() => setEmailComposerLead(null)}
          onSendEmail={handleSendEmail}
        />
      )}

      {/* Lead Submission Modal */}
      <LeadSubmissionModal
        isOpen={isSubmitModalOpen}
        activeUser={activeUser}
        onClose={() => setIsSubmitModalOpen(false)}
        onOpenBulkImport={() => {
          setIsSubmitModalOpen(false);
          setIsBulkImportOpen(true);
        }}
        onSubmit={handleCreateLead}
      />

      {/* Bulk Import Modal (.xlsx, .xls, .csv, paste) */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        activeUser={activeUser}
        onClose={() => setIsBulkImportOpen(false)}
        onBulkImport={handleBulkImport}
      />

      {/* Owner Authorizations Management Modal */}
      {authSession && (
        <OwnerAccessManager
          isOpen={isAccessManagerOpen}
          onClose={() => setIsAccessManagerOpen(false)}
          currentSession={authSession}
          onRequestsUpdated={refreshPendingCount}
        />
      )}
    </div>
  );
}

