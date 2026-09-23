"use client";

import React, { useState, useEffect } from "react";
import { AuthSession } from "@/lib/crm/auth-store";
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Building2,
  Mail,
  X,
  RefreshCw,
  UserPlus,
  Trash2,
  AlertCircle,
  Sparkles,
} from "lucide-react";

interface AuthorizedUserRecord {
  id: string;
  name: string;
  email: string;
  role: "owner" | "partner";
  status: "approved" | "pending" | "rejected" | "revoked";
  organization?: string;
  note?: string;
  created_at: string;
  approved_at?: string;
  approved_by?: string;
}

interface OwnerAccessManagerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSession: AuthSession;
  onRequestsUpdated?: () => void;
}

export function OwnerAccessManager({
  isOpen,
  onClose,
  currentSession,
  onRequestsUpdated,
}: OwnerAccessManagerProps) {
  const [users, setUsers] = useState<AuthorizedUserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"whitelist" | "pending" | "add">("whitelist");

  // Add new email form state
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newRole, setNewRole] = useState<"partner" | "owner">("partner");
  const [newOrg, setNewOrg] = useState("");
  const [newNote, setNewNote] = useState("");
  const [addLoading, setAddLoading] = useState(false);
  const [addSuccessMsg, setAddSuccessMsg] = useState<string | null>(null);
  const [addErrorMsg, setAddErrorMsg] = useState<string | null>(null);

  const refreshUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/auth/manage-access", {
        headers: {
          Authorization: `Bearer ${currentSession.token}`,
        },
      });
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshUsers();
      setAddSuccessMsg(null);
      setAddErrorMsg(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Add Email
  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) {
      setAddErrorMsg("Email address is required.");
      return;
    }

    setAddLoading(true);
    setAddSuccessMsg(null);
    setAddErrorMsg(null);

    try {
      const res = await fetch("/api/crm/auth/manage-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentSession.token}`,
        },
        body: JSON.stringify({
          action: "add",
          email: newEmail.trim().toLowerCase(),
          name: newName.trim() || newEmail.trim().split("@")[0],
          role: newRole,
          organization: newOrg.trim() || undefined,
          note: newNote.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to authorize email.");
      }

      setAddSuccessMsg(`${newEmail} has been added to the whitelist and can now apply for email verification!`);
      setNewEmail("");
      setNewName("");
      setNewOrg("");
      setNewNote("");
      await refreshUsers();
      if (onRequestsUpdated) onRequestsUpdated();
    } catch (err: any) {
      setAddErrorMsg(err.message || "Failed to add email.");
    } finally {
      setAddLoading(false);
    }
  };

  // Handle Approve / Reject / Revoke / Delete
  const handleAction = async (email: string, action: "approve" | "reject" | "revoke" | "delete") => {
    try {
      const res = await fetch("/api/crm/auth/manage-access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentSession.token}`,
        },
        body: JSON.stringify({ email, action }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshUsers();
        if (onRequestsUpdated) onRequestsUpdated();
      }
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  const approvedUsers = users.filter((u) => u.status === "approved");
  const pendingUsers = users.filter((u) => u.status === "pending");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-900 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200/80 flex items-center justify-center text-brand-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  CRM Authorization Whitelist
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-brand-100 text-brand-800 border border-brand-200">
                  {approvedUsers.length} Authorized
                </span>
                {pendingUsers.length > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {pendingUsers.length} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Managed exclusively by Tousif Raza • Only approved emails can request email verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="px-5 py-2.5 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("whitelist")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "whitelist"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Authorized Emails ({approvedUsers.length})
            </button>
            <button
              onClick={() => setActiveTab("add")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "add"
                  ? "bg-brand-600 text-white shadow-xs"
                  : "text-brand-700 bg-brand-50 hover:bg-brand-100"
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              + Add Email to Whitelist
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "pending"
                  ? "bg-amber-600 text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Incoming Requests ({pendingUsers.length})
            </button>
          </div>

          <button
            onClick={refreshUsers}
            disabled={loading}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: ADD EMAIL FORM */}
          {activeTab === "add" && (
            <div className="max-w-xl mx-auto space-y-4">
              <div className="p-4 rounded-xl bg-brand-50/70 border border-brand-200 text-xs text-brand-900">
                <div className="font-semibold flex items-center gap-1.5 mb-1 text-brand-950">
                  <Sparkles className="w-4 h-4 text-brand-600" />
                  Pre-Authorize Email for CRM Verification
                </div>
                <p className="text-[11px] text-brand-800 leading-relaxed">
                  Only emails registered here in Supabase can request a 6-digit confirmation code on
                  the sign-in screen. Outsider emails will be blocked automatically.
                </p>
              </div>

              {addSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <strong className="block font-bold">Authorized Successfully!</strong>
                    {addSuccessMsg}
                  </div>
                </div>
              )}

              {addErrorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>{addErrorMsg}</div>
                </div>
              )}

              <form onSubmit={handleAddEmail} className="space-y-3.5 bg-slate-50/70 p-5 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address to Authorize *
                  </label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="partner@company.com or member@makerlyai.in"
                    className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white text-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Role & Permissions *
                    </label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as "partner" | "owner")}
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white text-slate-900"
                    >
                      <option value="partner">Partner (Lead Generation / Sales)</option>
                      <option value="owner">Co-Owner / Admin (Full Access)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Agency / Organization (Optional)
                    </label>
                    <input
                      type="text"
                      value={newOrg}
                      onChange={(e) => setNewOrg(e.target.value)}
                      placeholder="e.g. Apex Growth Agency"
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Internal Note (Optional)
                    </label>
                    <input
                      type="text"
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="e.g. Key closer for North America"
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white text-slate-900"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={addLoading || !newEmail.trim()}
                  className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {addLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Authorizing and Notifying...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Authorize & Add to Whitelist
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: AUTHORIZED WHITELIST */}
          {activeTab === "whitelist" && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1 px-1">
                <span>
                  Showing {approvedUsers.length} approved account{approvedUsers.length === 1 ? "" : "s"} allowed to request verification codes.
                </span>
                <button
                  onClick={() => setActiveTab("add")}
                  className="text-brand-600 hover:text-brand-700 font-semibold cursor-pointer"
                >
                  + Add another email
                </button>
              </div>

              {approvedUsers.map((u) => {
                const isPrimaryOwner =
                  u.email === "iamtousifraza@gmail.com" || u.email === "getmakerlyai@gmail.com";

                return (
                  <div
                    key={u.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">{u.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-mono font-medium ${
                            u.role === "owner"
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : "bg-brand-100 text-brand-800 border border-brand-200"
                          }`}
                        >
                          {u.role === "owner" ? "Owner" : "Partner"}
                        </span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Authorized
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 font-mono">
                        <span>{u.email}</span>
                        {u.organization && (
                          <span className="font-sans text-slate-600">• {u.organization}</span>
                        )}
                        {u.approved_by && (
                          <span className="font-sans text-slate-400">• By {u.approved_by}</span>
                        )}
                      </div>
                    </div>

                    {!isPrimaryOwner && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAction(u.email, "revoke")}
                          className="px-2.5 py-1.5 rounded-lg border border-amber-200 hover:bg-amber-50 text-amber-700 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Revoke
                        </button>
                        <button
                          onClick={() => handleAction(u.email, "delete")}
                          title="Remove completely"
                          className="p-1.5 rounded-lg border border-slate-200 hover:border-rose-300 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: PENDING REQUESTS */}
          {activeTab === "pending" && (
            <div className="space-y-3">
              {pendingUsers.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs">
                  <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  No pending partner access requests.
                </div>
              ) : (
                pendingUsers.map((u) => (
                  <div
                    key={u.id}
                    className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{u.name}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Pending Review
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-slate-500 font-mono">
                          <span>{u.email}</span>
                          {u.organization && (
                            <span className="font-sans text-slate-600">• {u.organization}</span>
                          )}
                        </div>

                        {u.note && (
                          <p className="text-[11px] text-slate-600 bg-slate-50 rounded-lg p-2 mt-1 border border-slate-100">
                            {u.note}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleAction(u.email, "approve")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve & Whitelist
                        </button>
                        <button
                          onClick={() => handleAction(u.email, "reject")}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <span>Outsider protection: Only emails on the whitelist can request email verification codes.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
