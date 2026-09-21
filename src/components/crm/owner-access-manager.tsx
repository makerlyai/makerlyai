"use client";

import React, { useState, useEffect } from "react";
import {
  AuthSession,
} from "@/lib/crm/auth-store";
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
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const refreshRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/crm/auth/manage-access");
      const data = await res.json();
      if (data.success && data.users) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to load access requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshRequests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAction = async (email: string, action: "approve" | "reject" | "revoke") => {
    try {
      const res = await fetch("/api/crm/auth/manage-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, action }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshRequests();
        if (onRequestsUpdated) onRequestsUpdated();
      }
    } catch (err) {
      console.error("Action error:", err);
    }
  };

  // Only show partners in access manager (owners are permanent)
  const partners = users.filter((u) => u.role === "partner");
  const filteredUsers = partners.filter((u) => {
    if (filter === "pending") return u.status === "pending";
    if (filter === "approved") return u.status === "approved";
    return true;
  });

  const pendingCount = partners.filter((u) => u.status === "pending").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150 text-slate-900">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200/80 flex items-center justify-center text-brand-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Supabase Partner Authorizations
                </h3>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {pendingCount} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Verified exclusively by Tousif Raza ({currentSession.email})
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

        {/* Filter Bar */}
        <div className="px-5 py-3 border-b border-slate-100 bg-white flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === "all"
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              All Partners ({partners.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === "pending"
                  ? "bg-amber-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Pending Approval ({pendingCount})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === "approved"
                  ? "bg-emerald-600 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              Approved ({partners.filter((u) => u.status === "approved").length})
            </button>
          </div>

          <button
            onClick={refreshRequests}
            disabled={loading}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs flex items-center gap-1 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Requests List */}
        <div className="max-h-[380px] overflow-y-auto p-5 space-y-3">
          {filteredUsers.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              <UserCheck className="w-8 h-8 mx-auto mb-2 opacity-40" />
              No partner access requests in this category.
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">{user.name}</span>
                      {user.status === "pending" && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                      {user.status === "approved" && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Approved
                        </span>
                      )}
                      {user.status === "rejected" && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Rejected
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {user.email}
                      </span>
                      {user.organization && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {user.organization}
                        </span>
                      )}
                    </div>

                    {user.note && (
                      <p className="text-[11px] text-slate-600 bg-slate-50 rounded-lg p-2 mt-1 border border-slate-100">
                        {user.note}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {user.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleAction(user.email, "approve")}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all flex items-center gap-1 shadow-xs cursor-pointer"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleAction(user.email, "reject")}
                          className="px-2.5 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-rose-700 text-xs font-semibold transition-all cursor-pointer"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {user.status === "approved" && (
                      <button
                        onClick={() => handleAction(user.email, "revoke")}
                        className="px-2.5 py-1 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px] font-semibold transition-all cursor-pointer"
                      >
                        Revoke Access
                      </button>
                    )}
                    {user.status === "rejected" && (
                      <button
                        onClick={() => handleAction(user.email, "approve")}
                        className="px-2.5 py-1 rounded-lg border border-emerald-200 hover:bg-emerald-50 text-emerald-700 text-[11px] font-semibold transition-all cursor-pointer"
                      >
                        Re-Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs text-slate-500">
          <span>Outsider protection: Only approved partners can receive login verification codes.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
