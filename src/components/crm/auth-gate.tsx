"use client";

import React, { useState, useEffect } from "react";
import {
  OWNER_EMAILS,
  OwnerEmail,
  isOwnerEmail,
  generateConfirmationCode,
  verifyConfirmationCode,
  getActiveCodeForEmail,
  loginAsOwnerDirect,
  submitAccessRequest,
  getAccessRequests,
  AuthSession,
  AccessRequest,
} from "@/lib/crm/auth-store";
import { MakerlyLogoIcon, MakerlyBrand } from "./makerly-logo";
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  UserCheck,
  Building2,
  RefreshCw,
  Send,
} from "lucide-react";

interface AuthGateProps {
  onAuthorized: (session: AuthSession) => void;
}

export function AuthGate({ onAuthorized }: AuthGateProps) {
  const [activeTab, setActiveTab] = useState<"owner" | "partner">("owner");

  // Owner flow state
  const [selectedOwnerEmail, setSelectedOwnerEmail] = useState<string>(OWNER_EMAILS[0]);
  const [ownerCustomEmail, setOwnerCustomEmail] = useState("");
  const [ownerStep, setOwnerStep] = useState<"email" | "code">("email");
  const [ownerCode, setOwnerCode] = useState("");
  const [dispatchedCode, setDispatchedCode] = useState<string | null>(null);
  const [ownerError, setOwnerError] = useState<string | null>(null);
  const [ownerLoading, setOwnerLoading] = useState(false);

  // Partner flow state
  const [partnerName, setPartnerName] = useState("");
  const [partnerEmail, setPartnerEmail] = useState("");
  const [partnerOrg, setPartnerOrg] = useState("");
  const [partnerNote, setPartnerNote] = useState("");
  const [partnerStep, setPartnerStep] = useState<"form" | "pending" | "code">("form");
  const [partnerCode, setPartnerCode] = useState("");
  const [partnerMsg, setPartnerMsg] = useState<string | null>(null);
  const [partnerError, setPartnerError] = useState<string | null>(null);
  const [partnerLoading, setPartnerLoading] = useState(false);

  // Handle Owner Request Code
  const handleRequestOwnerCode = (targetEmail?: string) => {
    const emailToUse = targetEmail || ownerCustomEmail.trim() || selectedOwnerEmail;
    setOwnerError(null);
    setOwnerLoading(true);

    setTimeout(() => {
      const { code } = generateConfirmationCode(emailToUse);
      setDispatchedCode(code);
      setOwnerStep("code");
      setOwnerLoading(false);
    }, 450);
  };

  // Handle Owner Code Verification
  const handleVerifyOwnerCode = (codeToVerify?: string) => {
    const emailToUse = ownerCustomEmail.trim() || selectedOwnerEmail;
    const finalCode = codeToVerify || ownerCode;
    setOwnerError(null);

    const result = verifyConfirmationCode(emailToUse, finalCode);
    if (result.success && result.session) {
      onAuthorized(result.session);
    } else {
      setOwnerError(result.message);
    }
  };

  // 1-Tap Direct Owner Login
  const handleDirectOwnerLogin = (email: OwnerEmail) => {
    const session = loginAsOwnerDirect(email);
    onAuthorized(session);
  };

  // Handle Partner Request
  const handleSubmitPartnerRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerName.trim() || !partnerEmail.trim()) {
      setPartnerError("Name and valid email are required.");
      return;
    }
    setPartnerError(null);
    setPartnerLoading(true);

    setTimeout(() => {
      const res = submitAccessRequest({
        name: partnerName,
        email: partnerEmail,
        organization: partnerOrg,
        note: partnerNote,
      });

      setPartnerLoading(false);
      if (res.request.status === "approved") {
        // Pre-approved! Generate code
        const { code } = generateConfirmationCode(partnerEmail);
        setDispatchedCode(code);
        setPartnerStep("code");
      } else {
        setPartnerStep("pending");
        setPartnerMsg(res.message);
      }
    }, 500);
  };

  // Handle Partner Code Verification
  const handleVerifyPartnerCode = () => {
    setPartnerError(null);
    const result = verifyConfirmationCode(partnerEmail, partnerCode);
    if (result.success && result.session) {
      onAuthorized(result.session);
    } else {
      setPartnerError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 selection:bg-brand-500/20">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-brand-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Top Branding Card */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/80 shadow-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
            <span className="text-xs font-mono font-medium text-slate-700 tracking-tight">
              makerlyai.in/CRM • Secure Gate
            </span>
          </div>

          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-[#efe7d1] border border-brand-200/60 flex items-center justify-center shadow-sm">
              <MakerlyLogoIcon className="w-10 h-10" color="#2952cc" />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            MakerlyAI.in
          </h1>
          <p className="text-xs text-brand-700 font-semibold tracking-wide uppercase mt-0.5">
            Big Tech for small business.
          </p>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
            Authorized Lead Management System. Access requires personal confirmation by Tousif Raza.
          </p>
        </div>

        {/* Auth Box */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden">
          {/* Tab Switcher */}
          <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50/60 p-1">
            <button
              onClick={() => {
                setActiveTab("owner");
                setOwnerError(null);
              }}
              className={`py-2.5 px-4 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === "owner"
                  ? "bg-white text-brand-700 shadow-xs border border-slate-200/60 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-brand-600" />
              Owner Access (Tousif Raza)
            </button>
            <button
              onClick={() => {
                setActiveTab("partner");
                setPartnerError(null);
              }}
              className={`py-2.5 px-4 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
                activeTab === "partner"
                  ? "bg-white text-brand-700 shadow-xs border border-slate-200/60 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserCheck className="w-4 h-4 text-slate-500" />
              Partner Access Request
            </button>
          </div>

          {/* Tab 1: Owner Flow */}
          {activeTab === "owner" && (
            <div className="p-6">
              {ownerStep === "email" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Select Tousif Raza Authorized Account
                    </label>
                    <div className="space-y-2">
                      {OWNER_EMAILS.map((email) => (
                        <div
                          key={email}
                          onClick={() => {
                            setSelectedOwnerEmail(email);
                            setOwnerCustomEmail("");
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            selectedOwnerEmail === email && !ownerCustomEmail
                              ? "bg-brand-50/70 border-brand-300 ring-1 ring-brand-400/40 text-brand-950"
                              : "bg-white border-slate-200 hover:bg-slate-50 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-[#efe7d1] border border-brand-200 flex items-center justify-center text-brand-700">
                              <MakerlyLogoIcon className="w-4 h-4" color="#2952cc" />
                            </div>
                            <div>
                              <div className="text-xs font-bold flex items-center gap-1.5">
                                Tousif Raza
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-brand-100 text-brand-800">
                                  Owner
                                </span>
                              </div>
                              <div className="text-[11px] font-mono text-slate-500">{email}</div>
                            </div>
                          </div>
                          <div className="w-4 h-4 rounded-full border flex items-center justify-center border-brand-500">
                            {selectedOwnerEmail === email && !ownerCustomEmail && (
                              <div className="w-2 h-2 rounded-full bg-brand-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={ownerLoading}
                      onClick={() => handleRequestOwnerCode()}
                      className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
                    >
                      {ownerLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Generating Email Confirmation...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Send Confirmation Code to {selectedOwnerEmail}
                        </>
                      )}
                    </button>
                  </div>

                  {/* 1-Tap Quick Authorization Bypass for Tousif Raza */}
                  <div className="pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => handleDirectOwnerLogin(selectedOwnerEmail as OwnerEmail)}
                      className="w-full py-2 px-3 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200 text-emerald-800 text-[11px] font-semibold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      Instant 1-Tap Owner Login (Tousif Raza Verified)
                    </button>
                  </div>
                </div>
              ) : (
                /* Step 2: Enter Code */
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-200/80 text-xs text-brand-900">
                    <div className="font-semibold flex items-center gap-1.5 mb-1">
                      <Mail className="w-3.5 h-3.5 text-brand-700" />
                      Email Confirmation Sent
                    </div>
                    <p className="text-[11px] text-brand-800">
                      A 6-digit confirmation code was sent to{" "}
                      <strong className="font-mono text-brand-950">{selectedOwnerEmail}</strong>.
                    </p>
                  </div>

                  {/* Live Simulation Notice for Testing */}
                  {dispatchedCode && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">
                          Email Code:
                        </span>{" "}
                        <span className="font-mono font-bold text-sm tracking-widest text-amber-950 ml-1">
                          {dispatchedCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setOwnerCode(dispatchedCode);
                          handleVerifyOwnerCode(dispatchedCode);
                        }}
                        className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold transition-all"
                      >
                        Auto-Fill & Enter ➔
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Enter 6-Digit Confirmation Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={ownerCode}
                      onChange={(e) => setOwnerCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-slate-900"
                    />
                  </div>

                  {ownerError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      {ownerError}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setOwnerStep("email")}
                      className="w-1/3 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVerifyOwnerCode()}
                      className="w-2/3 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      Verify & Open CRM
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Partner Request Flow */}
          {activeTab === "partner" && (
            <div className="p-6">
              {partnerStep === "form" && (
                <form onSubmit={handleSubmitPartnerRequest} className="space-y-3.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                    <p className="font-semibold text-slate-900 mb-0.5">
                      Partner Personal Authorization Gate
                    </p>
                    <p className="text-[11px]">
                      Lead generation partners require personal email authorization from Tousif Raza
                      before gaining access to submit and track leads.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={partnerName}
                      onChange={(e) => setPartnerName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={partnerEmail}
                      onChange={(e) => setPartnerEmail(e.target.value)}
                      placeholder="partner@company.com"
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Agency / Organization
                    </label>
                    <input
                      type="text"
                      value={partnerOrg}
                      onChange={(e) => setPartnerOrg(e.target.value)}
                      placeholder="Your Agency / Company"
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Note to Tousif Raza
                    </label>
                    <input
                      type="text"
                      value={partnerNote}
                      onChange={(e) => setPartnerNote(e.target.value)}
                      placeholder="Reason for requesting partner CRM access"
                      className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                    />
                  </div>

                  {partnerError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                      {partnerError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={partnerLoading}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2"
                  >
                    {partnerLoading ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Submitting to Tousif Raza...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        Request Personal Authorization from Tousif Raza
                      </>
                    )}
                  </button>
                </form>
              )}

              {partnerStep === "pending" && (
                <div className="space-y-4 text-center py-3">
                  <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto">
                    <Clock className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Authorization Request Sent
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                      Your request has been dispatched to <strong>Tousif Raza</strong> at:
                    </p>
                    <div className="mt-2 inline-flex flex-col gap-1 text-[11px] font-mono text-brand-700 bg-brand-50/80 px-3 py-1.5 rounded-lg border border-brand-200">
                      <span>iamtousifraza@gmail.com</span>
                      <span>getmakerlyai@gmail.com</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Once Tousif confirms your email, you will be able to log in immediately with a
                    confirmation code.
                  </p>

                  <button
                    type="button"
                    onClick={() => setPartnerStep("form")}
                    className="py-2 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    Back to Request Form
                  </button>
                </div>
              )}

              {partnerStep === "code" && (
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
                    <div className="font-semibold flex items-center gap-1.5 mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Account Pre-Approved by Tousif Raza!
                    </div>
                    <p className="text-[11px]">
                      Enter your 6-digit confirmation code sent to{" "}
                      <strong className="font-mono text-emerald-950">{partnerEmail}</strong>.
                    </p>
                  </div>

                  {dispatchedCode && (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-amber-700">Code:</span>{" "}
                        <span className="font-mono font-bold text-sm tracking-widest text-amber-950 ml-1">
                          {dispatchedCode}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setPartnerCode(dispatchedCode);
                        }}
                        className="px-2 py-1 rounded bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold"
                      >
                        Auto-Fill
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={partnerCode}
                      onChange={(e) => setPartnerCode(e.target.value.replace(/\D/g, ""))}
                      placeholder="000000"
                      className="w-full text-center tracking-[0.4em] font-mono text-xl py-3 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-slate-900"
                    />
                  </div>

                  {partnerError && (
                    <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                      {partnerError}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setPartnerStep("form")}
                      className="w-1/3 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleVerifyPartnerCode}
                      className="w-2/3 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold"
                    >
                      Verify & Access CRM
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Footer Security Badge */}
          <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span className="flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-slate-400" />
              Direct Owner Authority
            </span>
            <span className="text-slate-400">makerlyai.in/CRM</span>
          </div>
        </div>
      </div>
    </div>
  );
}

