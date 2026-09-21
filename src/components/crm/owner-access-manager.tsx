"use client";

import React, { useState, useEffect } from "react";
import {
  AccessRequest,
  getAccessRequests,
  approveAccessRequest,
  rejectAccessRequest,
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
  Sparkles,
} from "lucide-react";

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
  const [requests, setRequests] = useState<AccessRequest[]>([]);
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");

  const refreshRequests = () => {
    setRequests(getAccessRequests());
  };

  useEffect(() => {
    if (isOpen) {
      refreshRequests();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleApprove = (id: string) => {
    approveAccessRequest(id, currentSession.email);
    refreshRequests();
    if (onRequestsUpdated) onRequestsUpdated();
  };

  const handleReject = (id: string) => {
    rejectAccessRequest(id);
    refreshRequests();
    if (onRequestsUpdated) onRequestsUpdated();
  };

  const filteredRequests = requests.filter((r) => {
    if (filter === "pending") return r.status === "pending";
    if (filter === "approved") return r.status === "approved";
    return true;
  });

  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 border border-brand-200/80 flex items-center justify-center text-brand-700">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Partner Personal Authorizations
                </h3>
                {pendingCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    {pendingCount} Pending
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Decided and verified exclusively by Tousif Raza ({currentSession.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-200/60 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-5 pt-4 pb-2 flex items-center gap-2 border-b border-slate-100">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === "all"
                ? "bg-slate-900 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            All Requests ({requests.length})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === "pending"
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("approved")}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filter === "approved"
                ? "bg-emerald-600 text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            Approved ({requests.filter((r) => r.status === "approved").length})
          </button>
        </div>

        {/* Requests List */}
        <div className="p-5 max-h-[440px] overflow-y-auto space-y-3">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-10 text-slate-400 text-xs">
              No authorization requests found in this view.
            </div>
          ) : (
            filteredRequests.map((req) => (
              <div
                key={req.id}
                className={`p-4 rounded-xl border transition-all ${
                  req.status === "pending"
                    ? "bg-amber-50/40 border-amber-200/80"
                    : req.status === "approved"
                    ? "bg-white border-slate-200"
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900">{req.name}</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          req.status === "pending"
                            ? "bg-amber-100 text-amber-800"
                            : req.status === "approved"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {req.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="flex items-center gap-1 font-mono">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {req.email}
                      </span>
                      {req.organization && (
                        <span className="flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5 text-slate-400" />
                          {req.organization}
                        </span>
                      )}
                    </div>

                    {req.note && (
                      <p className="text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded border border-slate-200/60 mt-1">
                        &ldquo;{req.note}&rdquo;
                      </p>
                    )}

                    <div className="text-[10px] text-slate-400 flex items-center gap-2 mt-1">
                      <span>Requested: {new Date(req.requestedAt).toLocaleDateString()}</span>
                      {req.approvedBy && (
                        <span>• Confirmed by: {req.approvedBy}</span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    {req.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleReject(req.id)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-xs font-semibold text-slate-600"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleApprove(req.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Approve Access
                        </button>
                      </>
                    ) : req.status === "approved" ? (
                      <button
                        onClick={() => handleReject(req.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50"
                      >
                        Revoke Access
                      </button>
                    ) : (
                      <button
                        onClick={() => handleApprove(req.id)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-emerald-600 hover:bg-emerald-50"
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
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Approved partners can log in at makerlyai.in/CRM with confirmation codes.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-semibold text-xs hover:bg-black"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

