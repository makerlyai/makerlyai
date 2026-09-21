"use client";

import React, { useState, useEffect } from "react";
import {
  OWNER_EMAILS,
  setAuthSession,
  AuthSession,
} from "@/lib/crm/auth-store";
import { MakerlyLogoIcon } from "./makerly-logo";
import {
  ShieldCheck,
  Mail,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Clock,
  UserCheck,
  RefreshCw,
  Send,
  ArrowLeft,
  UserPlus,
  LogIn,
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
  const [ownerError, setOwnerError] = useState<string | null>(null);
  const [ownerLoading, setOwnerLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Partner flow state
  const [partnerMode, setPartnerMode] = useState<"signin" | "register">("signin");
  const [partnerLoginEmail, setPartnerLoginEmail] = useState("");
  const [partnerStep, setPartnerStep] = useState<"email" | "code">("email");
  const [partnerCode, setPartnerCode] = useState("");
  const [partnerError, setPartnerError] = useState<string | null>(null);
  const [partnerLoading, setPartnerLoading] = useState(false);
  const [partnerResendCooldown, setPartnerResendCooldown] = useState(0);

  // Partner register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regOrg, setRegOrg] = useState("");
  const [regNote, setRegNote] = useState("");
  const [regSubmitted, setRegSubmitted] = useState(false);
  const [regMessage, setRegMessage] = useState("");

  // Owner cooldown
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Partner cooldown
  useEffect(() => {
    if (partnerResendCooldown > 0) {
      const timer = setTimeout(() => setPartnerResendCooldown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [partnerResendCooldown]);

  // 1. Owner: Send Code via Supabase backend
  const handleRequestOwnerCode = async (targetEmail?: string) => {
    const emailToUse = targetEmail || ownerCustomEmail.trim() || selectedOwnerEmail;
    setOwnerError(null);
    setOwnerLoading(true);

    try {
      const res = await fetch("/api/crm/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to dispatch verification email.");
      }

      setOwnerStep("code");
      setResendCooldown(45);
    } catch (err: any) {
      setOwnerError(err.message || "Failed to dispatch email verification.");
    } finally {
      setOwnerLoading(false);
    }
  };

  // 2. Owner: Verify Code via Supabase backend
  const handleVerifyOwnerCode = async () => {
    const emailToUse = ownerCustomEmail.trim() || selectedOwnerEmail;
    const cleanCode = ownerCode.trim();

    if (!cleanCode || cleanCode.length !== 6) {
      setOwnerError("Please enter the complete 6-digit confirmation code.");
      return;
    }

    setOwnerError(null);
    setOwnerLoading(true);

    try {
      const res = await fetch("/api/crm/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailToUse,
          code: cleanCode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.session) {
        throw new Error(data.message || "Invalid or expired confirmation code.");
      }

      setAuthSession(data.session);
      onAuthorized(data.session);
    } catch (err: any) {
      setOwnerError(err.message || "Verification failed. Please try again.");
    } finally {
      setOwnerLoading(false);
    }
  };

  // 3. Partner: Send Code via Supabase backend
  const handleRequestPartnerCode = async () => {
    const emailToUse = partnerLoginEmail.trim().toLowerCase();
    if (!emailToUse) {
      setPartnerError("Please enter your registered partner work email.");
      return;
    }

    setPartnerError(null);
    setPartnerLoading(true);

    try {
      const res = await fetch("/api/crm/auth/send-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to dispatch partner code.");
      }

      setPartnerStep("code");
      setPartnerResendCooldown(45);
    } catch (err: any) {
      setPartnerError(err.message || "Access denied or verification failed.");
    } finally {
      setPartnerLoading(false);
    }
  };

  // 4. Partner: Verify Code via Supabase backend
  const handleVerifyPartnerCode = async () => {
    const emailToUse = partnerLoginEmail.trim().toLowerCase();
    const cleanCode = partnerCode.trim();

    if (!cleanCode || cleanCode.length !== 6) {
      setPartnerError("Please enter the complete 6-digit code.");
      return;
    }

    setPartnerError(null);
    setPartnerLoading(true);

    try {
      const res = await fetch("/api/crm/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: emailToUse,
          code: cleanCode,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success || !data.session) {
        throw new Error(data.message || "Invalid or expired confirmation code.");
      }

      setAuthSession(data.session);
      onAuthorized(data.session);
    } catch (err: any) {
      setPartnerError(err.message || "Verification failed.");
    } finally {
      setPartnerLoading(false);
    }
  };

  // 5. Partner: Submit Request via Supabase backend
  const handleRegisterPartner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) {
      setPartnerError("Full name and valid email are required.");
      return;
    }

    setPartnerError(null);
    setPartnerLoading(true);

    try {
      const res = await fetch("/api/crm/auth/request-partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          organization: regOrg.trim(),
          note: regNote.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit partner request.");
      }

      setRegSubmitted(true);
      setRegMessage(data.message);
    } catch (err: any) {
      setPartnerError(err.message || "Submission failed.");
    } finally {
      setPartnerLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-4 selection:bg-brand-500/20">
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
              makerlyai.in/crm • Supabase Protected Gate
            </span>
          </div>

          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-[#efe7d1] border border-brand-200/60 flex items-center justify-center shadow-sm">
              <MakerlyLogoIcon className="w-10 h-10" color="#2952cc" />
            </div>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            MakerlyAI.in CRM
          </h1>
          <p className="text-xs text-brand-700 font-semibold tracking-wide uppercase mt-0.5">
            Big Tech for small business.
          </p>
          <p className="text-xs text-slate-500 mt-2 max-w-sm mx-auto">
            Authorized Lead Management Workspace. Access is strictly email-verified with zero outsider loopholes.
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
              className={`py-2.5 px-4 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
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
              className={`py-2.5 px-4 text-xs font-semibold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === "partner"
                  ? "bg-white text-brand-700 shadow-xs border border-slate-200/60 font-bold"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <UserCheck className="w-4 h-4 text-slate-500" />
              Partner Portal
            </button>
          </div>

          {/* TAB 1: OWNER ACCESS */}
          {activeTab === "owner" && (
            <div className="p-6">
              {ownerStep === "email" ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Select Authorized Owner Account
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
                              <div className="text-xs font-bold flex items-center gap-1.5 text-slate-900">
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

                  {ownerError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{ownerError}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={ownerLoading}
                      onClick={() => handleRequestOwnerCode()}
                      className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      {ownerLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Sending Verification Code via Email...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Send Verification Code to {selectedOwnerEmail}
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <span className="text-[11px] text-slate-400">
                      Security policy: 1-tap bypass is disabled. Every login requires a 6-digit email confirmation code.
                    </span>
                  </div>
                </div>
              ) : (
                /* Step 2: Owner Enter Code */
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-200/80 text-xs text-brand-900">
                    <div className="font-semibold flex items-center gap-1.5 mb-1 text-brand-950">
                      <Mail className="w-4 h-4 text-brand-700" />
                      Verification Code Dispatched
                    </div>
                    <p className="text-[11px] text-brand-800 leading-relaxed">
                      A 6-digit confirmation code has been emailed to{" "}
                      <strong className="font-mono text-brand-950">{selectedOwnerEmail}</strong>.
                      Please open your email inbox, copy the code, and enter it below.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Enter 6-Digit Verification Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      value={ownerCode}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setOwnerCode(val);
                        if (ownerError) setOwnerError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && ownerCode.length === 6) {
                          handleVerifyOwnerCode();
                        }
                      }}
                      placeholder="000000"
                      className="w-full text-center tracking-[0.4em] font-mono text-2xl py-3 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-slate-900 bg-white shadow-inner"
                    />
                  </div>

                  {ownerError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{ownerError}</span>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={ownerLoading}
                      onClick={() => {
                        setOwnerStep("email");
                        setOwnerError(null);
                      }}
                      className="w-1/3 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                      Back
                    </button>
                    <button
                      type="button"
                      disabled={ownerLoading || ownerCode.length !== 6}
                      onClick={() => handleVerifyOwnerCode()}
                      className="w-2/3 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                    >
                      {ownerLoading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-3.5 h-3.5" />
                          Verify & Open CRM
                        </>
                      )}
                    </button>
                  </div>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      disabled={resendCooldown > 0 || ownerLoading}
                      onClick={() => handleRequestOwnerCode()}
                      className="text-xs text-brand-600 hover:text-brand-800 font-semibold disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
                    >
                      {resendCooldown > 0
                        ? `Resend Code in ${resendCooldown}s`
                        : "Didn't receive the email? Resend Code"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PARTNER PORTAL */}
          {activeTab === "partner" && (
            <div className="p-6">
              {/* Mode Switcher: Sign In vs Request Access */}
              <div className="flex rounded-lg bg-slate-100 p-1 mb-5">
                <button
                  type="button"
                  onClick={() => {
                    setPartnerMode("signin");
                    setPartnerError(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    partnerMode === "signin"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Partner Email Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPartnerMode("register");
                    setPartnerError(null);
                  }}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    partnerMode === "register"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Request Access
                </button>
              </div>

              {/* Sub-mode A: Partner Email Sign In */}
              {partnerMode === "signin" && (
                <>
                  {partnerStep === "email" ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Enter Approved Partner Work Email
                        </label>
                        <input
                          type="email"
                          value={partnerLoginEmail}
                          onChange={(e) => setPartnerLoginEmail(e.target.value)}
                          placeholder="partner@company.com"
                          className="w-full text-xs py-2.5 px-3.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900"
                        />
                        <p className="text-[11px] text-slate-500 mt-1">
                          Only pre-approved partner emails can receive login verification codes.
                        </p>
                      </div>

                      {partnerError && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                          <div>{partnerError}</div>
                        </div>
                      )}

                      <button
                        type="button"
                        disabled={partnerLoading || !partnerLoginEmail.trim()}
                        onClick={handleRequestPartnerCode}
                        className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {partnerLoading ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Checking Authorization...
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4" />
                            Send Partner Verification Code
                          </>
                        )}
                      </button>
                    </div>
                  ) : (
                    /* Partner Step 2: Enter Code */
                    <div className="space-y-4">
                      <div className="p-3.5 rounded-xl bg-brand-50/70 border border-brand-200/80 text-xs text-brand-900">
                        <div className="font-semibold flex items-center gap-1.5 mb-1 text-brand-950">
                          <Mail className="w-4 h-4 text-brand-700" />
                          Partner Verification Code Sent
                        </div>
                        <p className="text-[11px] text-brand-800 leading-relaxed">
                          A 6-digit confirmation code was sent to{" "}
                          <strong className="font-mono text-brand-950">{partnerLoginEmail}</strong>.
                          Enter the code from your inbox to sign in.
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Enter 6-Digit Code
                        </label>
                        <input
                          type="text"
                          maxLength={6}
                          autoFocus
                          value={partnerCode}
                          onChange={(e) => setPartnerCode(e.target.value.replace(/\D/g, ""))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && partnerCode.length === 6) {
                              handleVerifyPartnerCode();
                            }
                          }}
                          placeholder="000000"
                          className="w-full text-center tracking-[0.4em] font-mono text-2xl py-3 px-4 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-slate-900 bg-white shadow-inner"
                        />
                      </div>

                      {partnerError && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{partnerError}</span>
                        </div>
                      )}

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setPartnerStep("email");
                            setPartnerError(null);
                          }}
                          className="w-1/3 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="button"
                          disabled={partnerLoading || partnerCode.length !== 6}
                          onClick={handleVerifyPartnerCode}
                          className="w-2/3 py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 cursor-pointer"
                        >
                          {partnerLoading ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              Verifying...
                            </>
                          ) : (
                            <>
                              <KeyRound className="w-3.5 h-3.5" />
                              Verify & Enter CRM
                            </>
                          )}
                        </button>
                      </div>

                      <div className="text-center pt-2">
                        <button
                          type="button"
                          disabled={partnerResendCooldown > 0 || partnerLoading}
                          onClick={handleRequestPartnerCode}
                          className="text-xs text-brand-600 hover:text-brand-800 font-semibold disabled:text-slate-400 cursor-pointer disabled:cursor-not-allowed transition-colors"
                        >
                          {partnerResendCooldown > 0
                            ? `Resend Code in ${partnerResendCooldown}s`
                            : "Didn't receive the email? Resend Code"}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Sub-mode B: Register Partner Access Request */}
              {partnerMode === "register" && (
                <>
                  {regSubmitted ? (
                    <div className="space-y-4 text-center py-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Request Submitted to Tousif Raza
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
                        {regMessage || "Your request is registered. Once Tousif approves your email, you can log in with an email code."}
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setRegSubmitted(false);
                          setPartnerMode("signin");
                        }}
                        className="py-2 px-4 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-black transition-all cursor-pointer"
                      >
                        Back to Partner Login
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRegisterPartner} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
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
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="partner@company.com"
                          className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Agency / Company
                        </label>
                        <input
                          type="text"
                          value={regOrg}
                          onChange={(e) => setRegOrg(e.target.value)}
                          placeholder="Agency / Company Name"
                          className="w-full text-xs py-2 px-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Brief Note to Tousif Raza
                        </label>
                        <input
                          type="text"
                          value={regNote}
                          onChange={(e) => setRegNote(e.target.value)}
                          placeholder="Reason for requesting partner access"
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
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                      >
                        {partnerLoading ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Dispatching Request...
                          </>
                        ) : (
                          <>
                            <Send className="w-3.5 h-3.5" />
                            Submit Partner Request to Tousif Raza
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
