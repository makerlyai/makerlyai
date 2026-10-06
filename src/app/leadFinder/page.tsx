"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Mail,
  Zap,
  Building2,
  TrendingUp,
  Search,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Send,
  Sparkles,
  RefreshCw,
  LogOut,
  Target,
  BarChart3,
  SlidersHorizontal,
  Eye,
  X,
  PlusCircle,
  Briefcase,
  FileText,
  Play,
  Trash2,
  Layers,
  Bot,
  Cpu,
  Globe,
  Radio,
  Sliders,
  Award,
  ChevronRight,
  Flame,
  ArrowUpRight
} from "lucide-react";

export default function LeadFinderPage() {
  // ─────────────────────────────────────────────────────────────
  // 1. Owner Authentication State (Strictly tousif@makerlyai.in)
  // ─────────────────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [authMode, setAuthMode] = useState<"otp" | "password" | "reset">("otp");
  const [emailInput, setEmailInput] = useState<string>("tousif@makerlyai.in");
  const [otpInput, setOtpInput] = useState<string>("");
  const [passwordInput, setPasswordInput] = useState<string>("");
  const [newPasswordInput, setNewPasswordInput] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");
  const [authSuccess, setAuthSuccess] = useState<string>("");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState<boolean>(false);

  // ─────────────────────────────────────────────────────────────
  // 2. Command Cockpit & Architecture State
  // ─────────────────────────────────────────────────────────────
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingDashboard, setLoadingDashboard] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<
    "autopilot" | "pipeline" | "scrapling" | "sales_team" | "deliverability" | "experiments" | "add"
  >("autopilot");

  // Autonomous Flywheel Controls
  const [autoPilotNiche, setAutoPilotNiche] = useState<string>("b2b");
  const [autoPilotLimit, setAutoPilotLimit] = useState<number>(3);
  const [autoPilotAutoOutreach, setAutoPilotAutoOutreach] = useState<boolean>(false);
  const [autoPilotDryRun, setAutoPilotDryRun] = useState<boolean>(true);
  const [isAutoPilotRunning, setIsAutoPilotRunning] = useState<boolean>(false);
  const [liveTerminalLogs, setLiveTerminalLogs] = useState<any[]>([
    {
      id: "init-1",
      timestamp: "02:20:00",
      stage: "Telemetry",
      message: "LeadFinder Pro Cockpit online. All 7 engine architectures synchronized.",
      level: "info",
    },
    {
      id: "init-2",
      timestamp: "02:20:01",
      stage: "Deliverability",
      message: "Mailbox rotator armed with strict 20/day safety cap per account.",
      level: "success",
    },
  ]);

  // Scrapling Discovery Controls
  const [selectedNiche, setSelectedNiche] = useState<string>("b2b");
  const [discoveryLimit, setDiscoveryLimit] = useState<number>(4);
  const [customQuery, setCustomQuery] = useState<string>("");
  const [isDiscovering, setIsDiscovering] = useState<boolean>(false);

  // Qualification State
  const [isQualifying, setIsQualifying] = useState<boolean>(false);

  // Campaign Outreach Controls
  const [campaignMode, setCampaignMode] = useState<"dry_run" | "live">("dry_run");
  const [campaignBatch, setCampaignBatch] = useState<number>(3);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [campaignResults, setCampaignResults] = useState<any[] | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [stageFilter, setStageFilter] = useState<string>("all");

  // Interactive Modals
  const [selectedSequenceLead, setSelectedSequenceLead] = useState<any | null>(null);
  const [selectedProposalLead, setSelectedProposalLead] = useState<any | null>(null);
  const [activeProposal, setActiveProposal] = useState<any | null>(null);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState<boolean>(false);
  const [sendTouchModalLead, setSendTouchModalLead] = useState<any | null>(null);
  const [sendTouchNumber, setSendTouchNumber] = useState<number>(1);
  const [isSendingIndividualTouch, setIsSendingIndividualTouch] = useState<boolean>(false);
  const [copiedItem, setCopiedItem] = useState<string | null>(null);

  // Manual Add Form
  const [manualForm, setManualForm] = useState({
    url: "",
    company: "",
    name: "",
    niche: "b2b",
    email: "",
  });
  const [isAddingManual, setIsAddingManual] = useState<boolean>(false);

  // Growth Experiment Form
  const [experimentForm, setExperimentForm] = useState({
    name: "",
    hypothesis: "",
    variable: "messaging_hook",
    variantA: "2-Minute Teardown Video",
    variantB: "Fixed 2-Week Sprint Guarantee",
    metric: "reply_rate",
  });
  const [isCreatingExp, setIsCreatingExp] = useState<boolean>(false);

  // ─────────────────────────────────────────────────────────────
  // 3. Lifecycle & Session Verification
  // ─────────────────────────────────────────────────────────────
  useEffect(() => {
    checkSavedSession();
  }, []);

  async function checkSavedSession() {
    setAuthLoading(true);
    const token = localStorage.getItem("makerly_leadfinder_session");
    if (!token) {
      setAuthLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/leadFinder/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_session", sessionToken: token }),
      });
      const data = await res.json();
      if (data.valid) {
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        localStorage.removeItem("makerly_leadfinder_session");
      }
    } catch {
      localStorage.removeItem("makerly_leadfinder_session");
    } finally {
      setAuthLoading(false);
    }
  }

  async function fetchDashboardData() {
    setLoadingDashboard(true);
    try {
      const res = await fetch("/api/sales-engine", { method: "GET" });
      const data = await res.json();
      if (data.success) {
        setDashboardData(data);
      }
    } catch (err: any) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoadingDashboard(false);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 4. Authentication Handlers
  // ─────────────────────────────────────────────────────────────
  async function handleSendOtp(purpose: string = "login") {
    setAuthError("");
    setAuthSuccess("");
    setIsSubmittingAuth(true);

    try {
      const res = await fetch("/api/leadFinder/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "send_otp", email: emailInput.trim().toLowerCase(), purpose }),
      });
      const data = await res.json();

      if (data.success) {
        setOtpSent(true);
        setOtpInput("");
        setAuthSuccess(`6-digit authorization code dispatched to ${emailInput.trim().toLowerCase()}`);
      } else {
        setAuthError(data.message || "Failed to dispatch security code.");
      }
    } catch (err: any) {
      setAuthError(err.message || "Network error sending OTP.");
    } finally {
      setIsSubmittingAuth(false);
    }
  }

  async function handleVerifyOtp() {
    setAuthError("");
    setIsSubmittingAuth(true);

    try {
      const res = await fetch("/api/leadFinder/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "verify_otp", email: emailInput.trim().toLowerCase(), code: otpInput.trim() }),
      });
      const data = await res.json();

      if (data.success && data.sessionToken) {
        localStorage.setItem("makerly_leadfinder_session", data.sessionToken);
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        setAuthError(data.message || "Invalid security code.");
      }
    } catch (err: any) {
      setAuthError(err.message || "Verification failed.");
    } finally {
      setIsSubmittingAuth(false);
    }
  }

  async function handleLoginPassword() {
    setAuthError("");
    setIsSubmittingAuth(true);

    try {
      const res = await fetch("/api/leadFinder/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login_password", email: emailInput.trim().toLowerCase(), password: passwordInput.trim() }),
      });
      const data = await res.json();

      if (data.success && data.sessionToken) {
        localStorage.setItem("makerly_leadfinder_session", data.sessionToken);
        setIsAuthenticated(true);
        fetchDashboardData();
      } else {
        setAuthError(data.message || "Invalid master password.");
      }
    } catch (err: any) {
      setAuthError(err.message || "Password sign-in failed.");
    } finally {
      setIsSubmittingAuth(false);
    }
  }

  async function handleSetOrResetPassword() {
    setAuthError("");
    setAuthSuccess("");
    setIsSubmittingAuth(true);

    try {
      const res = await fetch("/api/leadFinder/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set_or_reset_password",
          email: emailInput.trim().toLowerCase(),
          code: otpInput.trim(),
          newPassword: newPasswordInput.trim(),
        }),
      });
      const data = await res.json();

      if (data.success && data.sessionToken) {
        localStorage.setItem("makerly_leadfinder_session", data.sessionToken);
        setIsAuthenticated(true);
        setAuthSuccess("Master password updated successfully!");
        fetchDashboardData();
      } else {
        setAuthError(data.message || "Failed to update password.");
      }
    } catch (err: any) {
      setAuthError(err.message || "Password update error.");
    } finally {
      setIsSubmittingAuth(false);
    }
  }

  function handleSignOut() {
    localStorage.removeItem("makerly_leadfinder_session");
    setIsAuthenticated(false);
    setOtpSent(false);
    setOtpInput("");
    setPasswordInput("");
  }

  // ─────────────────────────────────────────────────────────────
  // 5. Autonomous Auto-Pilot Execution
  // ─────────────────────────────────────────────────────────────
  async function triggerAutoPilotCycle() {
    setIsAutoPilotRunning(true);
    setLiveTerminalLogs((prev) => [
      {
        id: `start-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString("en-IN", { hour12: false }),
        stage: "Flywheel Core",
        message: `Engaging autonomous flywheel for [${autoPilotNiche.toUpperCase()}] &bull; ${autoPilotLimit} prospects &bull; Outreach: ${autoPilotAutoOutreach ? (autoPilotDryRun ? "Dry Run" : "LIVE") : "Manual Approval"}`,
        level: "info",
      },
      ...prev,
    ]);

    try {
      const res = await fetch("/api/sales-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "autopilot",
          niche: autoPilotNiche,
          limit: autoPilotLimit,
          autoOutreach: autoPilotAutoOutreach,
          dryRun: autoPilotDryRun,
        }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.logs && data.logs.length > 0) {
          setLiveTerminalLogs((prev) => [...data.logs.reverse(), ...prev]);
        }
        await fetchDashboardData();
      } else {
        alert("Auto-Pilot notice: " + (data.error || "Execution failed"));
      }
    } catch (err: any) {
      alert("Auto-Pilot error: " + err.message);
    } finally {
      setIsAutoPilotRunning(false);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 6. Direct Lead Actions (Send Touch, Stage Change, Proposal)
  // ─────────────────────────────────────────────────────────────
  async function handleSendIndividualTouch(lead: any, touchNumber: number, dryRun: boolean = false) {
    setIsSendingIndividualTouch(true);
    try {
      const res = await fetch("/api/sales-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "send_single_touch",
          leadId: lead.id,
          touchNumber,
          dryRun,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSendTouchModalLead(null);
        await fetchDashboardData();
        setLiveTerminalLogs((prev) => [
          {
            id: `touch-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString("en-IN", { hour12: false }),
            stage: "Direct Outreach",
            message: `${dryRun ? "[Safe Preview Verified]" : "[Live Dispatched]"} Touch #${touchNumber} to ${lead.businessName} (${lead.email})`,
            level: "success",
          },
          ...prev,
        ]);
      } else {
        alert("Touch dispatch error: " + (data.error || "Failed"));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsSendingIndividualTouch(false);
    }
  }

  async function handleUpdateLeadStage(leadId: string, newStatus: string) {
    try {
      const res = await fetch("/api/sales-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_lead_stage",
          leadId,
          status: newStatus,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchDashboardData();
      }
    } catch (err: any) {
      console.error("Stage update error:", err);
    }
  }

  async function handleGenerateProposal(lead: any) {
    setSelectedProposalLead(lead);
    setActiveProposal(lead.proposal || null);
    setIsGeneratingProposal(true);

    try {
      const res = await fetch("/api/sales-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generate_proposal", leadId: lead.id }),
      });
      const data = await res.json();
      if (data.success) {
        setActiveProposal(data.proposal);
        await fetchDashboardData();
        setLiveTerminalLogs((prev) => [
          {
            id: `proposal-${Date.now()}`,
            timestamp: new Date().toLocaleTimeString("en-IN", { hour12: false }),
            stage: "AI Sales Team",
            message: `Synthesized custom proposal & meeting playbook for ${lead.businessName} (₹${(lead.dealValue || 99000).toLocaleString("en-IN")})`,
            level: "success",
          },
          ...prev,
        ]);
      }
    } catch (err: any) {
      alert("Proposal generation error: " + err.message);
    } finally {
      setIsGeneratingProposal(false);
    }
  }

  async function handleDeleteLead(leadId: string) {
    if (!confirm("Are you sure you want to dismiss this prospect from the pipeline?")) return;
    try {
      await fetch("/api/sales-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete_lead", leadId }),
      });
      await fetchDashboardData();
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  }

  // ─────────────────────────────────────────────────────────────
  // 7. Scrapling Discovery & Campaign
  // ─────────────────────────────────────────────────────────────
  async function triggerDiscovery() {
    setIsDiscovering(true);
    try {
      const res = await fetch("/api/sales-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "discover",
          niche: selectedNiche,
          limit: discoveryLimit,
          query: customQuery || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await triggerQualify();
      }
    } catch (err: any) {
      alert("Discovery error: " + err.message);
    } finally {
      setIsDiscovering(false);
      fetchDashboardData();
    }
  }

  async function triggerQualify() {
    setIsQualifying(true);
    try {
      await fetch("/api/sales-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "qualify" }),
      });
      await fetchDashboardData();
    } catch (err: any) {
      console.error("Qualify error:", err);
    } finally {
      setIsQualifying(false);
    }
  }

  async function triggerCampaign() {
    setIsDispatching(true);
    setCampaignResults(null);
    try {
      const res = await fetch("/api/sales-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "campaign",
          dryRun: campaignMode === "dry_run",
          batch: campaignBatch,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCampaignResults(data.results);
        await fetchDashboardData();
      } else {
        alert("Notice: " + (data.message || data.error));
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsDispatching(false);
    }
  }

  async function handleManualAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!manualForm.url) return;
    setIsAddingManual(true);
    try {
      const res = await fetch("/api/sales-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "add_lead",
          url: manualForm.url,
          company: manualForm.company,
          name: manualForm.name,
          niche: manualForm.niche,
          email: manualForm.email,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setManualForm({ url: "", company: "", name: "", niche: "b2b", email: "" });
        setActiveTab("pipeline");
        await fetchDashboardData();
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsAddingManual(false);
    }
  }

  async function handleCreateExperiment(e: React.FormEvent) {
    e.preventDefault();
    setIsCreatingExp(true);
    try {
      const res = await fetch("/api/sales-engine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "experiment_create",
          name: experimentForm.name || `Test: ${experimentForm.variable}`,
          hypothesis: experimentForm.hypothesis,
          variable: experimentForm.variable,
          variants: [experimentForm.variantA, experimentForm.variantB],
          metric: experimentForm.metric,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setExperimentForm({
          name: "",
          hypothesis: "",
          variable: "messaging_hook",
          variantA: "",
          variantB: "",
          metric: "reply_rate",
        });
        await fetchDashboardData();
        alert("Growth experiment created successfully!");
      }
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setIsCreatingExp(false);
    }
  }

  function copyTextToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopiedItem(id);
    setTimeout(() => setCopiedItem(null), 2500);
  }

  // Filtered Leads
  const leads = dashboardData?.leads || [];
  const filteredLeads = leads.filter((l: any) => {
    const matchesSearch =
      !searchQuery ||
      l.businessName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.websiteUrl?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStage =
      stageFilter === "all" ||
      (stageFilter === "high_ticket" && l.isHighTicket) ||
      (stageFilter === "qualified" && (l.qualificationScore || 0) >= 60) ||
      (stageFilter === "contacted" && (l.touchCount > 0 || l.status === "Contacted")) ||
      (stageFilter === "won" && l.status === "Closed Won") ||
      (stageFilter === "replied" && l.status === "Replied");

    return matchesSearch && matchesStage;
  });

  const stats = dashboardData?.stats || {
    totalLeads: 0,
    qualifiedCount: 0,
    highTicketCount: 0,
    contactedCount: 0,
    totalPipelineValue: 0,
  };

  const tracker = dashboardData?.dailyTracker || {
    totalSent: 0,
    mailboxes: {
      founder: { sentCount: 0, limit: 20 },
      growth: { sentCount: 0, limit: 20 },
    },
  };

  // ─────────────────────────────────────────────────────────────
  // RENDER: Loading Initial Security State
  // ─────────────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#03060d] flex items-center justify-center text-slate-300 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xs font-mono tracking-widest text-cyan-400 uppercase">
            Synchronizing Secure Owner Clearance...
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: Owner Authentication Gateway (Unauthenticated)
  // ─────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#03060d] text-slate-100 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {/* Ambient Dark Mesh */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-cyan-500/10 via-emerald-500/5 to-purple-600/10 rounded-full blur-[160px] pointer-events-none"></div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-[#070d1a]/95 backdrop-blur-2xl border border-white/[0.08] rounded-3xl shadow-2xl p-8 relative z-10"
        >
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-semibold uppercase tracking-wider mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              Owner Clearance Required
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center justify-center gap-2 font-lemon-milk">
              Makerly<span className="text-cyan-400">AI</span>
              <span className="text-slate-600 font-normal text-lg">|</span>
              <span className="text-emerald-400 text-xl font-bold font-sans">LeadFinder Pro</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1.5 font-mono">
              Autonomous Growth Engine &bull; Reserved for <strong className="text-slate-200">Tousif Raza</strong>
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-[#040813] p-1 rounded-xl border border-white/[0.06] mb-6 text-xs font-medium">
            <button
              onClick={() => { setAuthMode("otp"); setAuthError(""); setAuthSuccess(""); }}
              className={`py-2 rounded-lg transition-all ${
                authMode === "otp" ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              Email OTP
            </button>
            <button
              onClick={() => { setAuthMode("password"); setAuthError(""); setAuthSuccess(""); }}
              className={`py-2 rounded-lg transition-all ${
                authMode === "password" ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              Password
            </button>
            <button
              onClick={() => { setAuthMode("reset"); setAuthError(""); setAuthSuccess(""); }}
              className={`py-2 rounded-lg transition-all ${
                authMode === "reset" ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20" : "text-slate-400 hover:text-white"
              }`}
            >
              Set / Reset
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{authError}</span>
            </div>
          )}
          {authSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{authSuccess}</span>
            </div>
          )}

          {authMode === "otp" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Owner Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#040813] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                    placeholder="tousif@makerlyai.in"
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  onClick={() => handleSendOtp("login")}
                  disabled={isSubmittingAuth}
                  className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
                >
                  {isSubmittingAuth ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><KeyRound className="w-4 h-4" /> Send 6-Digit Authorization Code</>}
                </button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1.5">
                      Enter 6-Digit Security Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-[#040813] border border-cyan-500/50 rounded-xl text-center py-3 text-2xl font-mono tracking-[0.3em] text-white focus:outline-none focus:border-cyan-400"
                      placeholder="000000"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isSubmittingAuth || otpInput.length !== 6}
                    className="w-full py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isSubmittingAuth ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Authorize & Enter Command Cockpit"}
                  </button>
                  <div className="text-center">
                    <button
                      onClick={() => handleSendOtp("login")}
                      className="text-xs text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      Didn&apos;t receive code? Resend code
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {authMode === "password" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Owner Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#040813] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Master Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-[#040813] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <button
                onClick={handleLoginPassword}
                disabled={isSubmittingAuth || !passwordInput}
                className="w-full mt-2 py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmittingAuth ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Sign In with Master Password"}
              </button>
            </div>
          )}

          {authMode === "reset" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                  Owner Email
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#040813] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {!otpSent ? (
                <button
                  onClick={() => handleSendOtp("reset")}
                  disabled={isSubmittingAuth}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-semibold text-xs rounded-xl transition-all"
                >
                  {isSubmittingAuth ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : "Send Password Reset OTP"}
                </button>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1.5">
                      6-Digit Security Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-[#040813] border border-cyan-500/50 rounded-xl text-center py-2 text-xl font-mono text-white focus:outline-none focus:border-cyan-400"
                      placeholder="000000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5">
                      New Strong Password (Min 8 Characters)
                    </label>
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="w-full bg-[#040813] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-cyan-400"
                      placeholder="Enter new strong password"
                    />
                  </div>
                  <button
                    onClick={handleSetOrResetPassword}
                    disabled={isSubmittingAuth || otpInput.length !== 6 || newPasswordInput.length < 8}
                    className="w-full py-3 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all disabled:opacity-50"
                  >
                    {isSubmittingAuth ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : "Save New Master Password"}
                  </button>
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => handleSendOtp("reset")}
                      className="text-xs text-slate-500 hover:text-cyan-400 transition-colors"
                    >
                      Didn&apos;t receive code? Resend code
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────
  // RENDER: Authenticated LeadFinder Command Cockpit
  // ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#03060d] text-slate-100 font-sans selection:bg-cyan-400 selection:text-black">
      {/* Top Cockpit Header */}
      <header className="border-b border-white/[0.07] bg-[#070d1a]/90 backdrop-blur-xl sticky top-0 z-30 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-base shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform font-lemon-milk">
                M
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white font-lemon-milk">
                Makerly<span className="text-cyan-400">AI</span>
              </span>
            </a>
            <div className="h-4 w-px bg-white/[0.1]"></div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                LeadFinder Cockpit
              </span>
              <span className="hidden sm:inline px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono">
                7 Engines Active
              </span>
            </div>
          </div>

          {/* Mailbox Quotas & Tousif Owner Profile */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-[#0a1224] border border-white/[0.07] rounded-xl">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>tousif@: {tracker.mailboxes?.founder?.sentCount || 0}/20</span>
              </div>
              <div className="h-3 w-px bg-white/[0.1]"></div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <span>hello@: {tracker.mailboxes?.growth?.sentCount || 0}/20</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#0a1224] border border-cyan-500/30 px-3 py-1.5 rounded-xl text-slate-200">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Tousif Raza (Owner)</span>
            </div>

            <button
              onClick={handleSignOut}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Executive Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Executive SuiteCRM Metric Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#070d1a] border border-white/[0.07] rounded-2xl p-4 shadow-lg hover:border-cyan-500/40 transition-all">
            <div className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Pipeline Leads</span>
              <Building2 className="w-4 h-4 text-slate-500" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              {stats.totalLeads}
            </div>
            <div className="text-[11px] text-cyan-400 font-mono mt-1.5 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Scrapling &amp; Web Enriched
            </div>
          </div>

          <div className="bg-[#070d1a] border border-white/[0.07] rounded-2xl p-4 shadow-lg hover:border-emerald-500/40 transition-all">
            <div className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>BANT / MEDDIC Qualified</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 mt-1">
              {stats.qualifiedCount}
            </div>
            <div className="text-[11px] text-emerald-300 font-mono mt-1.5">
              Groq Evaluated &ge; 60 Score
            </div>
          </div>

          <div className="bg-[#070d1a] border border-white/[0.07] rounded-2xl p-4 shadow-lg hover:border-amber-500/40 transition-all">
            <div className="text-slate-400 text-xs font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>High-Ticket Pipeline</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 mt-1">
              {stats.highTicketCount}
            </div>
            <div className="text-[11px] text-amber-300 font-mono mt-1.5">
              Deals &ge; ₹1.0L+ Value
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0a1224] to-[#041a23] border border-cyan-500/30 rounded-2xl p-4 shadow-lg">
            <div className="text-cyan-300 text-xs font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Total Pipeline Value</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white mt-1">
              ₹{(stats.totalPipelineValue || 0).toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-cyan-200/80 font-mono mt-1.5">
              Est. Contract Value Generated
            </div>
          </div>
        </div>

        {/* Repositories & Tech Stack Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-3 mb-6">
          <div className="flex items-center gap-1.5 bg-[#060a14] p-1 rounded-2xl border border-white/[0.07] text-xs font-medium overflow-x-auto">
            <button
              onClick={() => setActiveTab("autopilot")}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === "autopilot"
                  ? "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" /> ⚡ Auto-Pilot Flywheel
            </button>

            <button
              onClick={() => setActiveTab("pipeline")}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === "pipeline"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> SuiteCRM Pipeline ({filteredLeads.length})
            </button>

            <button
              onClick={() => setActiveTab("scrapling")}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === "scrapling"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Scrapling Stealth
            </button>

            <button
              onClick={() => setActiveTab("sales_team")}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === "sales_team"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Bot className="w-3.5 h-3.5" /> AI Sales Team
            </button>

            <button
              onClick={() => setActiveTab("deliverability")}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === "deliverability"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Send className="w-3.5 h-3.5" /> BillionMail Rotator
            </button>

            <button
              onClick={() => setActiveTab("experiments")}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === "experiments"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Growth A/B Lab
            </button>

            <button
              onClick={() => setActiveTab("add")}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === "add"
                  ? "bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Target
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerQualify}
              disabled={isQualifying}
              className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5"
            >
              {isQualifying ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Target className="w-3 h-3" />}
              Qualify Unrated
            </button>
            <button
              onClick={fetchDashboardData}
              disabled={loadingDashboard}
              className="p-1.5 bg-[#060a14] hover:bg-slate-800 border border-white/[0.07] rounded-xl text-slate-400 hover:text-white transition-all"
              title="Refresh Pipeline"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingDashboard ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 1: AUTOPILOT FLYWHEEL & LIVE MISSION CONTROL          */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "autopilot" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Autonomous Flywheel Configuration & Launch */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#070d1a] border border-white/[0.07] rounded-3xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-400 to-emerald-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/20">
                    ⚡
                  </div>
                  <div>
                    <h2 className="text-base font-extrabold text-white">Autonomous Flywheel Hub</h2>
                    <p className="text-xs text-slate-400">
                      Discovers &bull; Enriches &bull; Qualifies &bull; Outreaches automatically
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Niche Target */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                      Target Market Preset
                    </label>
                    <select
                      value={autoPilotNiche}
                      onChange={(e) => setAutoPilotNiche(e.target.value)}
                      className="w-full bg-[#040813] border border-white/[0.08] rounded-xl px-3 py-2.5 text-xs font-semibold text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value="b2b">B2B Enterprise &amp; Corporate Services</option>
                      <option value="d2c">D2C &amp; E-Commerce Stores (Shopify / Woo)</option>
                      <option value="saas">B2B SaaS &amp; AI Tech Startups</option>
                      <option value="high-ticket">High-Ticket Regional Manufacturers &amp; B2B</option>
                    </select>
                  </div>

                  {/* Limit Targets */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                      Batch Extraction Count
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[3, 5, 8].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setAutoPilotLimit(n)}
                          className={`py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                            autoPilotLimit === n
                              ? "bg-cyan-500 text-slate-950 border-cyan-400 font-extrabold shadow-md shadow-cyan-500/20"
                              : "bg-[#040813] border-white/[0.07] text-slate-400"
                          }`}
                        >
                          {n} Leads
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auto-Outreach Mode & Dry Run */}
                  <div className="p-4 bg-[#040813] border border-white/[0.06] rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Automated Outreach Dispatch</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Routes Touch 1 through deliverability rotator
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoPilotAutoOutreach}
                        onChange={(e) => setAutoPilotAutoOutreach(e.target.checked)}
                        className="w-4 h-4 rounded text-cyan-500 bg-slate-900 border-slate-700 cursor-pointer"
                      />
                    </div>

                    {autoPilotAutoOutreach && (
                      <div className="pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs">
                        <span className="text-slate-400">Dispatch Safety:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAutoPilotDryRun(true)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                              autoPilotDryRun ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 font-bold" : "text-slate-500"
                            }`}
                          >
                            Dry Run (Safe Preview)
                          </button>
                          <button
                            type="button"
                            onClick={() => setAutoPilotDryRun(false)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all ${
                              !autoPilotDryRun ? "bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold" : "text-slate-500"
                            }`}
                          >
                            Live Sending
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Launch Flywheel Button */}
                  <button
                    onClick={triggerAutoPilotCycle}
                    disabled={isAutoPilotRunning}
                    className="w-full py-4 bg-gradient-to-r from-cyan-400 via-emerald-400 to-teal-400 hover:opacity-95 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-xl shadow-cyan-500/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isAutoPilotRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Autonomous Cycle In Progress...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-slate-950" />
                        <span>Launch Full Auto-Pilot Cycle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Technology Stack Grid Card */}
              <div className="bg-[#070d1a] border border-white/[0.07] rounded-3xl p-5 shadow-lg text-xs space-y-3">
                <h3 className="font-mono uppercase tracking-wider text-slate-400 text-[11px] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" /> Integrated Technical Architectures
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-3 bg-[#040813] rounded-xl border border-white/[0.06]">
                    <span className="text-cyan-400 font-bold">D4Vinci/Scrapling</span>
                    <div className="text-slate-500 text-[10px] mt-0.5">Stealth anti-bot crawler</div>
                  </div>
                  <div className="p-3 bg-[#040813] rounded-xl border border-white/[0.06]">
                    <span className="text-emerald-400 font-bold">SuiteCRM</span>
                    <div className="text-slate-500 text-[10px] mt-0.5">Enterprise pipeline &amp; CRM</div>
                  </div>
                  <div className="p-3 bg-[#040813] rounded-xl border border-white/[0.06]">
                    <span className="text-amber-400 font-bold">ai-sales-team</span>
                    <div className="text-slate-500 text-[10px] mt-0.5">BANT + MEDDIC &amp; proposals</div>
                  </div>
                  <div className="p-3 bg-[#040813] rounded-xl border border-white/[0.06]">
                    <span className="text-purple-400 font-bold">BillionMail</span>
                    <div className="text-slate-500 text-[10px] mt-0.5">20/day safe delivery cap</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Real-Time Live Activity Feed & Audit Terminal */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#070d1a] border border-white/[0.07] rounded-3xl p-5 shadow-xl flex flex-col h-[520px]">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.07] mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
                    <h3 className="font-mono text-xs uppercase tracking-wider text-slate-300 font-bold">
                      Live Telemetry Stream &bull; Tousif Oversight Console
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">
                    {liveTerminalLogs.length} events logged
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
                  {liveTerminalLogs.map((log) => {
                    const badgeColor =
                      log.level === "success"
                        ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                        : log.level === "warning"
                        ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
                        : "text-cyan-400 bg-cyan-500/10 border-cyan-500/30";

                    return (
                      <div
                        key={log.id}
                        className="p-3 bg-[#040813] rounded-xl border border-white/[0.06] flex items-start gap-2.5"
                      >
                        <span className="text-slate-500 text-[10px] shrink-0 mt-0.5">{log.timestamp}</span>
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-bold shrink-0 ${badgeColor}`}>
                          {log.stage}
                        </span>
                        <span className="text-slate-300 text-xs leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: log.message }}></span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 2: SUITECRM PIPELINE & LEADS COCKPIT                  */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "pipeline" && (
          <div>
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by brand name, domain, contact email, or tech stack..."
                  className="w-full bg-[#070d1a] border border-white/[0.07] rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-[#060a14] p-1 rounded-2xl border border-white/[0.07] text-xs overflow-x-auto">
                <button
                  onClick={() => setStageFilter("all")}
                  className={`px-3 py-1.5 rounded-xl ${stageFilter === "all" ? "bg-slate-800 text-white font-bold" : "text-slate-400"}`}
                >
                  All ({leads.length})
                </button>
                <button
                  onClick={() => setStageFilter("high_ticket")}
                  className={`px-3 py-1.5 rounded-xl ${stageFilter === "high_ticket" ? "bg-amber-500/20 text-amber-400 font-bold" : "text-slate-400"}`}
                >
                  🔥 High Ticket
                </button>
                <button
                  onClick={() => setStageFilter("qualified")}
                  className={`px-3 py-1.5 rounded-xl ${stageFilter === "qualified" ? "bg-emerald-500/20 text-emerald-400 font-bold" : "text-slate-400"}`}
                >
                  Qualified (&ge;60)
                </button>
                <button
                  onClick={() => setStageFilter("contacted")}
                  className={`px-3 py-1.5 rounded-xl ${stageFilter === "contacted" ? "bg-cyan-500/20 text-cyan-400 font-bold" : "text-slate-400"}`}
                >
                  Contacted
                </button>
                <button
                  onClick={() => setStageFilter("replied")}
                  className={`px-3 py-1.5 rounded-xl ${stageFilter === "replied" ? "bg-purple-500/20 text-purple-400 font-bold" : "text-slate-400"}`}
                >
                  Replied / Warm
                </button>
              </div>
            </div>

            {/* Leads Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredLeads.map((lead: any) => {
                const score = lead.qualificationScore || 0;
                const scoreColor =
                  score >= 80 ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10" :
                  score >= 60 ? "text-amber-400 border-amber-500/40 bg-amber-500/10" :
                  "text-slate-400 border-slate-700 bg-slate-800/40";

                return (
                  <div
                    key={lead.id}
                    className="bg-[#070d1a] border border-white/[0.07] hover:border-cyan-500/40 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Business Name, High-Ticket Badge, Score */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-extrabold text-base text-white tracking-tight">
                              {lead.businessName}
                            </h3>
                            {lead.isHighTicket && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-[10px] font-mono font-bold">
                                🔥 HIGH TICKET
                              </span>
                            )}
                          </div>
                          {lead.websiteUrl && (
                            <a
                              href={lead.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-cyan-400 hover:underline flex items-center gap-1 mt-0.5 font-mono"
                            >
                              <span>{lead.websiteUrl.replace(/^https?:\/\//, "").slice(0, 32)}</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>

                        <div className="flex flex-col items-end">
                          <span className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-bold ${scoreColor}`}>
                            {score}/100 &bull; {lead.tier ? lead.tier.split(" ")[0] : "Pending"}
                          </span>
                          <span className="text-xs font-mono font-bold text-white mt-1">
                            ₹{(lead.dealValue || 99000).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Contact & Stage Controls */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {lead.email ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#040813] border border-white/[0.07] text-xs font-mono text-slate-200">
                            <Mail className="w-3 h-3 text-cyan-400" />
                            <span>{lead.email}</span>
                            {lead.hasValidMx && (
                              <span className="text-emerald-400 text-[10px] font-bold" title="DNS MX Record Verified">
                                ✓ MX
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">No public email found</span>
                        )}

                        <span className="px-2 py-1 rounded-lg bg-[#040813] border border-white/[0.07] text-[11px] text-slate-400 font-mono uppercase">
                          {lead.niche || "B2B"}
                        </span>

                        {/* SuiteCRM Stage Dropdown */}
                        <select
                          value={lead.status || "Discovered"}
                          onChange={(e) => handleUpdateLeadStage(lead.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-[#040813] border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-semibold focus:outline-none"
                        >
                          <option value="Discovered">Stage: Discovered</option>
                          <option value="Qualified">Stage: Qualified</option>
                          <option value="Contacted">Stage: Contacted</option>
                          <option value="Replied">Stage: Replied</option>
                          <option value="Meeting Booked">Stage: Meeting Booked</option>
                          <option value="Proposal Sent">Stage: Proposal Sent</option>
                          <option value="Closed Won">Stage: Closed Won 🏆</option>
                          <option value="Unqualified">Stage: Unqualified</option>
                        </select>
                      </div>

                      {/* Tech Stack Detected */}
                      {lead.techStack && lead.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {lead.techStack.map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md bg-[#040813] text-[10px] font-mono text-slate-300 border border-white/[0.06]"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Personalized Observation Hook */}
                      {lead.personalizedHook && (
                        <div className="p-3 bg-[#040813] rounded-xl border-l-2 border-cyan-400 text-xs text-slate-300 italic mb-4 line-clamp-3">
                          &ldquo;{lead.personalizedHook}&rdquo;
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer for Tousif */}
                    <div className="pt-3 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        {lead.sequence && (
                          <button
                            onClick={() => setSelectedSequenceLead(lead)}
                            className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 font-semibold rounded-lg transition-all flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" /> 4-Touch Sequence
                          </button>
                        )}

                        <button
                          onClick={() => handleGenerateProposal(lead)}
                          className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-semibold rounded-lg transition-all flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" /> Proposal &amp; Brief
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {lead.email && (
                          <button
                            onClick={() => {
                              setSendTouchModalLead(lead);
                              setSendTouchNumber(Math.min((lead.touchCount || 0) + 1, 4));
                            }}
                            className="px-3 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-400 font-bold rounded-lg transition-all flex items-center gap-1"
                          >
                            <Send className="w-3 h-3" /> Send Touch #{(lead.touchCount || 0) + 1}
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg"
                          title="Dismiss Lead"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredLeads.length === 0 && (
              <div className="text-center py-16 bg-[#070d1a] border border-white/[0.07] rounded-3xl">
                <Target className="w-10 h-10 text-slate-600 mx-auto mb-3" />
                <h4 className="text-base font-bold text-white">No Leads In Pipeline</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Launch the Auto-Pilot Flywheel or Scrapling Discovery above to harvest fresh prospects.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 3: SCRAPLING STEALTH HARVESTER                        */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "scrapling" && (
          <div className="max-w-2xl mx-auto bg-[#070d1a] border border-white/[0.07] rounded-3xl p-7 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Scrapling Stealth Lead Harvester</h2>
                <p className="text-xs text-slate-400">
                  Adaptive bypass-grade B2B extractor powered by D4Vinci/Scrapling with Patchright Chromium.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Target Niche Preset
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setSelectedNiche("b2b")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedNiche === "b2b"
                        ? "bg-cyan-500/15 border-cyan-400 text-white font-bold"
                        : "bg-[#040813] border-white/[0.07] text-slate-400"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-cyan-400" /> B2B Enterprise &amp; Services
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">Consultancies, industrial suppliers, logistics</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedNiche("d2c")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedNiche === "d2c"
                        ? "bg-cyan-500/15 border-cyan-400 text-white font-bold"
                        : "bg-[#040813] border-white/[0.07] text-slate-400"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-emerald-400" /> D2C &amp; E-Commerce
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">Shopify/WooCommerce scaling brands</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedNiche("saas")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedNiche === "saas"
                        ? "bg-cyan-500/15 border-cyan-400 text-white font-bold"
                        : "bg-[#040813] border-white/[0.07] text-slate-400"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> B2B SaaS &amp; AI Startups
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">Founders building AI tech apps</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedNiche("high-ticket")}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      selectedNiche === "high-ticket"
                        ? "bg-cyan-500/15 border-cyan-400 text-white font-bold"
                        : "bg-[#040813] border-white/[0.07] text-slate-400"
                    }`}
                  >
                    <div className="font-bold flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-amber-400" /> High-Ticket Regional B2B
                    </div>
                    <div className="text-[11px] text-slate-500 mt-1">Uniform makers, healthcare, distributors</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                  Target Lead Count
                </label>
                <div className="flex gap-2">
                  {[3, 5, 8, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDiscoveryLimit(num)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                        discoveryLimit === num
                          ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20"
                          : "bg-[#040813] border-white/[0.07] text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {num} Targets
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Custom Search Query (Optional Override)
                </label>
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="e.g. corporate gifting Bangalore website contact"
                  className="w-full bg-[#040813] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                onClick={triggerDiscovery}
                disabled={isDiscovering}
                className="w-full py-4 bg-gradient-to-r from-cyan-400 to-emerald-400 hover:opacity-95 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-xl shadow-cyan-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isDiscovering ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Executing Scrapling Stealth Crawl...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" /> Launch Scrapling Stealth Discovery
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 4: AI SALES TEAM (BANT + MEDDIC LAB)                   */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "sales_team" && (
          <div className="space-y-6">
            <div className="bg-[#070d1a] border border-white/[0.07] rounded-3xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Bot className="w-5 h-5 text-cyan-400" />
                    zubair-trabzada/ai-sales-team-claude Qualification Lab
                  </h2>
                  <p className="text-xs text-slate-400">
                    Dual enterprise evaluation framework: BANT (Budget, Authority, Need, Timeline) &amp; MEDDIC.
                  </p>
                </div>
                <button
                  onClick={triggerQualify}
                  disabled={isQualifying}
                  className="px-3.5 py-2 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
                >
                  {isQualifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Target className="w-3.5 h-3.5" />}
                  Score All Leads with Groq LLM
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leads.slice(0, 6).map((l: any) => (
                  <div key={l.id} className="p-4 bg-[#040813] rounded-2xl border border-white/[0.07] text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-bold text-white text-sm">{l.businessName}</div>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono font-bold">
                        Score: {l.qualificationScore || 0}/100
                      </span>
                    </div>

                    {l.meddic ? (
                      <div className="space-y-1.5 text-slate-300 font-mono text-[11px] mb-3">
                        <div><strong className="text-slate-400">Metrics:</strong> {l.meddic.metrics || "Conversion lift"}</div>
                        <div><strong className="text-slate-400">Economic Buyer:</strong> {l.meddic.economicBuyer || "Founder"}</div>
                        <div><strong className="text-slate-400">Identified Pain:</strong> {l.meddic.identifiedPain || "Manual bottlenecks"}</div>
                      </div>
                    ) : (
                      <div className="text-slate-500 italic text-[11px] mb-3">BANT / MEDDIC pending analysis</div>
                    )}

                    <button
                      onClick={() => handleGenerateProposal(l)}
                      className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl transition-all flex items-center justify-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5 text-purple-400" />
                      View Full Proposal &amp; Meeting Playbook
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 5: BILLIONMAIL DELIVERABILITY ROTATOR CONTROL          */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "deliverability" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-[#070d1a] border border-white/[0.07] rounded-3xl p-7 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Send className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">BillionMail Deliverability Rotator</h2>
                  <p className="text-xs text-slate-400">
                    Rotated multi-mailbox dispatch enforcing strict 20/day safety caps and human delays.
                  </p>
                </div>
              </div>

              {/* Mailbox Daily Status */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#040813] rounded-2xl border border-white/[0.07] mb-6 text-xs font-mono">
                <div>
                  <div className="text-slate-400 mb-1">Mailbox 1: tousif@makerlyai.in</div>
                  <div className="text-white font-bold text-base">
                    {tracker.mailboxes?.founder?.sentCount || 0} / 20 sent today
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-emerald-400 h-full rounded-full transition-all"
                      style={{ width: `${((tracker.mailboxes?.founder?.sentCount || 0) / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="text-slate-400 mb-1">Mailbox 2: hello@makerlyai.in</div>
                  <div className="text-white font-bold text-base">
                    {tracker.mailboxes?.growth?.sentCount || 0} / 20 sent today
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-cyan-400 h-full rounded-full transition-all"
                      style={{ width: `${((tracker.mailboxes?.growth?.sentCount || 0) / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Campaign Batch Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Execution Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setCampaignMode("dry_run")}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        campaignMode === "dry_run"
                          ? "bg-cyan-500/15 border-cyan-400 text-white font-bold"
                          : "bg-[#040813] border-white/[0.07] text-slate-400"
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Safe Preview (Dry Run)
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">Verifies MX &amp; renders without sending</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCampaignMode("live")}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        campaignMode === "live"
                          ? "bg-rose-500/15 border-rose-400 text-white font-bold"
                          : "bg-[#040813] border-white/[0.07] text-slate-400"
                      }`}
                    >
                      <div className="font-bold flex items-center gap-1.5">
                        <Send className="w-4 h-4 text-rose-400" /> Live Dispatch
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">Sends live emails with 45s-180s human pacing</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-2">
                    Batch Size
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCampaignBatch(num)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-mono font-bold transition-all ${
                          campaignBatch === num
                            ? "bg-cyan-500 text-slate-950 border-cyan-400 shadow-md shadow-cyan-500/20"
                            : "bg-[#040813] border-white/[0.07] text-slate-400"
                        }`}
                      >
                        {num} Emails
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={triggerCampaign}
                  disabled={isDispatching}
                  className={`w-full py-4 font-black text-sm rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 ${
                    campaignMode === "live"
                      ? "bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950"
                      : "bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950"
                  }`}
                >
                  {isDispatching ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      {campaignMode === "live" ? "Dispatch Live Campaign Batch" : "Run Safe Preview (Dry Run)"}
                    </>
                  )}
                </button>
              </div>
            </div>

            {campaignResults && (
              <div className="bg-[#070d1a] border border-white/[0.07] rounded-3xl p-6 shadow-xl">
                <h3 className="font-bold text-sm text-white mb-3">Batch Execution Results</h3>
                <div className="space-y-2 text-xs">
                  {campaignResults.map((r, i) => (
                    <div key={i} className="p-3 bg-[#040813] rounded-xl border border-white/[0.06] flex items-center justify-between">
                      <div>
                        <div className="font-bold text-white">{r.lead} &bull; <span className="font-mono text-cyan-400">{r.email}</span></div>
                        <div className="text-slate-400 text-[11px] mt-0.5">Subject: &ldquo;{r.subject}&rdquo;</div>
                      </div>
                      <span className="px-2 py-1 rounded bg-emerald-500/15 text-emerald-400 font-mono font-bold text-[10px]">
                        {r.res?.dryRun ? "DRY RUN OK" : "SENT"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 6: GROWTH EXPERIMENTS A/B LAB                         */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "experiments" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white">Growth A/B Experiments Lab</h2>
              <p className="text-xs text-slate-400">
                Synthesized from ericosiu/ai-marketing-skills (growth-engine).
              </p>
            </div>

            <div className="space-y-4">
              {(dashboardData?.experiments || []).map((exp: any) => (
                <div key={exp.id} className="bg-[#070d1a] border border-white/[0.07] rounded-2xl p-5 shadow-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 text-xs font-mono font-bold">
                        {exp.status}
                      </span>
                      <h4 className="font-bold text-sm text-white">{exp.name}</h4>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">Metric: {exp.metric}</span>
                  </div>

                  <p className="text-xs text-slate-300 italic mb-4">
                    Hypothesis: &ldquo;{exp.hypothesis}&rdquo;
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {exp.variants?.map((v: any) => (
                      <div key={v.name} className="p-3 bg-[#040813] rounded-xl border border-white/[0.06] text-xs">
                        <div className="font-bold text-cyan-300">{v.name}</div>
                        <div className="flex items-center justify-between mt-2 text-slate-400 font-mono text-[11px]">
                          <span>Sent: {v.impressions}</span>
                          <span>Replies: {v.conversions}</span>
                          <span className="text-emerald-400 font-bold">{((v.rate || 0) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleCreateExperiment} className="bg-[#070d1a] border border-white/[0.07] rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="font-bold text-sm text-white">Create New A/B Growth Experiment</h3>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Experiment Name</label>
                <input
                  type="text"
                  value={experimentForm.name}
                  onChange={(e) => setExperimentForm({ ...experimentForm, name: e.target.value })}
                  placeholder="e.g. Teardown Video vs Case Study"
                  className="w-full bg-[#040813] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Hypothesis</label>
                <input
                  type="text"
                  value={experimentForm.hypothesis}
                  onChange={(e) => setExperimentForm({ ...experimentForm, hypothesis: e.target.value })}
                  placeholder="e.g. Video teardown offer generates 2x reply rate compared to general intro"
                  className="w-full bg-[#040813] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Variant A (Control)</label>
                  <input
                    type="text"
                    value={experimentForm.variantA}
                    onChange={(e) => setExperimentForm({ ...experimentForm, variantA: e.target.value })}
                    className="w-full bg-[#040813] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Variant B (Challenger)</label>
                  <input
                    type="text"
                    value={experimentForm.variantB}
                    onChange={(e) => setExperimentForm({ ...experimentForm, variantB: e.target.value })}
                    className="w-full bg-[#040813] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingExp}
                className="w-full py-3.5 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-cyan-500/20"
              >
                {isCreatingExp ? "Creating..." : "Launch Growth Experiment"}
              </button>
            </form>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 7: ADD INDIVIDUAL TARGET WEBSITE                      */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "add" && (
          <div className="max-w-xl mx-auto bg-[#070d1a] border border-white/[0.07] rounded-3xl p-7 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-1">Add Individual Target Website</h2>
            <p className="text-xs text-slate-400 mb-6">
              Crawls website, extracts tech stack, scores BANT + MEDDIC, and crafts 4-touch sequences automatically.
            </p>

            <form onSubmit={handleManualAdd} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1 uppercase">Website URL *</label>
                <input
                  type="url"
                  value={manualForm.url}
                  onChange={(e) => setManualForm({ ...manualForm, url: e.target.value })}
                  placeholder="https://examplebrand.com"
                  className="w-full bg-[#040813] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white font-sans focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 uppercase">Company Name</label>
                <input
                  type="text"
                  value={manualForm.company}
                  onChange={(e) => setManualForm({ ...manualForm, company: e.target.value })}
                  placeholder="e.g. Acme Corporation"
                  className="w-full bg-[#040813] border border-white/[0.08] rounded-xl px-3 py-2.5 text-sm text-white font-sans focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 uppercase">Contact / Founder Name</label>
                  <input
                    type="text"
                    value={manualForm.name}
                    onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#040813] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white font-sans focus:outline-none focus:border-cyan-400"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 uppercase">Direct Email (Optional)</label>
                  <input
                    type="email"
                    value={manualForm.email}
                    onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                    placeholder="founder@example.com"
                    className="w-full bg-[#040813] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white font-sans focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 uppercase">Target Niche</label>
                <select
                  value={manualForm.niche}
                  onChange={(e) => setManualForm({ ...manualForm, niche: e.target.value })}
                  className="w-full bg-[#040813] border border-white/[0.08] rounded-xl px-3 py-2 text-sm text-white font-sans focus:outline-none focus:border-cyan-400"
                >
                  <option value="b2b">B2B Enterprise &amp; Corporate Services</option>
                  <option value="d2c">D2C &amp; E-Commerce Brands</option>
                  <option value="saas">B2B SaaS &amp; AI Startups</option>
                  <option value="high-ticket">High-Ticket Regional B2B</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={isAddingManual}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-400 to-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 mt-4"
              >
                {isAddingManual ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Scrape, Qualify & Generate Sequences"}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4-TOUCH SEQUENCE VIEWER MODAL                                 */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedSequenceLead && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-3xl bg-[#070d1a] border border-cyan-500/40 rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-white/[0.07] flex items-center justify-between bg-[#040813]">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    {selectedSequenceLead.businessName} &bull; <span className="text-cyan-400 font-mono">4-Touch Sequence</span>
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono">
                    Scored {selectedSequenceLead.qualificationScore}/100 &bull; Estimated Deal: ₹{(selectedSequenceLead.dealValue || 99000).toLocaleString("en-IN")}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSequenceLead(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5">
                {[
                  { key: "touch1", title: "Touch #1: The Precision Hook (Day 1)", data: selectedSequenceLead.sequence?.touch1 },
                  { key: "touch2", title: "Touch #2: Concrete Case Study & ROI (Day 3)", data: selectedSequenceLead.sequence?.touch2 },
                  { key: "touch3", title: "Touch #3: Free 2-Min Teardown Video (Day 7)", data: selectedSequenceLead.sequence?.touch3 },
                  { key: "touch4", title: "Touch #4: Graceful Breakup (Day 12)", data: selectedSequenceLead.sequence?.touch4 },
                ].map(({ key, title, data }) => (
                  <div key={key} className="bg-[#040813] border border-white/[0.07] rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-mono font-bold text-cyan-400">{title}</div>
                      {data && (
                        <button
                          onClick={() => copyTextToClipboard(data.bodyPlain, key)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 flex items-center gap-1 font-mono"
                        >
                          {copiedItem === key ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy Text
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {data ? (
                      <div className="space-y-2 text-xs">
                        <div className="text-slate-400 font-mono">
                          <strong className="text-slate-300">Subject:</strong> &ldquo;{data.subject}&rdquo;
                        </div>
                        <div className="p-3 bg-[#0a1020] rounded-xl border border-white/[0.05] text-slate-200 whitespace-pre-line font-sans leading-relaxed">
                          {data.bodyPlain}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-500 italic">No sequence step defined</div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* AI PROPOSAL & FOUNDER MEETING BRIEF MODAL                      */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProposalLead && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-4xl bg-[#070d1a] border border-purple-500/40 rounded-3xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-white/[0.07] flex items-center justify-between bg-[#040813]">
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    {selectedProposalLead.businessName} &bull; <span className="text-purple-300 font-mono">Proposal &amp; Meeting Playbook</span>
                  </h3>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono">
                    Synthesized via AI Sales Team &bull; Proposed Deal: ₹{(selectedProposalLead.dealValue || 99000).toLocaleString("en-IN")}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProposalLead(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 text-xs leading-relaxed">
                {isGeneratingProposal ? (
                  <div className="py-16 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-purple-400 mx-auto" />
                    <div className="text-sm font-bold text-white font-lemon-milk">Synthesizing Proposal with Groq LLM...</div>
                    <div className="text-slate-400 text-xs font-mono">Analyzing bottlenecks, tech stack &amp; meeting talking points...</div>
                  </div>
                ) : activeProposal ? (
                  <>
                    {/* Executive Summary */}
                    <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-2xl">
                      <div className="text-xs font-mono font-bold uppercase text-purple-300 mb-1">Executive Summary</div>
                      <div className="text-slate-200 text-sm leading-relaxed">{activeProposal.executiveSummary}</div>
                    </div>

                    {/* Client Context & Bottlenecks */}
                    {activeProposal.clientContext && (
                      <div className="bg-[#040813] border border-white/[0.07] rounded-2xl p-4 space-y-2">
                        <div className="font-mono text-cyan-400 font-bold uppercase text-[11px]">Client Context &amp; Identified Bottlenecks</div>
                        <div className="text-slate-300 leading-relaxed">{activeProposal.clientContext.currentSituation}</div>
                        {activeProposal.clientContext.criticalBottlenecks && (
                          <ul className="list-disc pl-5 text-slate-400 space-y-1 mt-2">
                            {activeProposal.clientContext.criticalBottlenecks.map((b: string, i: number) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {/* Recommended Solution & Deliverables */}
                    {activeProposal.recommendedSolution && (
                      <div className="bg-[#040813] border border-white/[0.07] rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="font-mono text-emerald-400 font-bold uppercase text-[11px]">
                            {activeProposal.recommendedSolution.architectureTitle || "MakerlyAI Sprint Deliverables"}
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[10px]">
                            {activeProposal.recommendedSolution.timelineWeeks || 3} Weeks Delivery
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {activeProposal.recommendedSolution.deliverables?.map((d: any, i: number) => (
                            <div key={i} className="p-3.5 bg-[#0a1020] rounded-xl border border-white/[0.06]">
                              <div className="font-bold text-white mb-1">{d.title}</div>
                              <div className="text-slate-400 text-[11px] leading-relaxed">{d.description}</div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/[0.07] font-mono text-[11px]">
                          <span className="text-slate-400">Expected ROI: <strong className="text-white">{activeProposal.recommendedSolution.expectedRoiMetric}</strong></span>
                          <span className="text-cyan-400 font-bold">Investment: ₹{(activeProposal.recommendedSolution.proposedInvestmentInr || selectedProposalLead.dealValue || 99000).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    )}

                    {/* Founder Meeting Playbook & Talking Points */}
                    {activeProposal.meetingBrief && (
                      <div className="bg-[#040813] border border-white/[0.07] rounded-2xl p-4 space-y-3">
                        <div className="font-mono text-amber-400 font-bold uppercase text-[11px]">
                          Tousif Raza Founder Meeting Playbook &amp; Strategy
                        </div>

                        {activeProposal.meetingBrief.talkingPoints && (
                          <div>
                            <div className="font-bold text-slate-300 mb-1">Key Value Pitch Points:</div>
                            <ul className="list-disc pl-5 text-slate-400 space-y-1">
                              {activeProposal.meetingBrief.talkingPoints.map((tp: string, i: number) => (
                                <li key={i}>{tp}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {activeProposal.meetingBrief.discoveryQuestions && (
                          <div className="pt-2 border-t border-white/[0.07]">
                            <div className="font-bold text-slate-300 mb-1">Discovery Questions:</div>
                            <ul className="list-disc pl-5 text-slate-400 space-y-1">
                              {activeProposal.meetingBrief.discoveryQuestions.map((dq: string, i: number) => (
                                <li key={i}>{dq}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center py-10 text-slate-500 italic">No proposal generated yet. Click generate above.</div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* INDIVIDUAL TOUCH DISPATCH MODAL                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {sendTouchModalLead && (
          <div className="fixed inset-0 bg-black/85 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="w-full max-w-lg bg-[#070d1a] border border-emerald-500/40 rounded-3xl shadow-2xl p-6 relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-base text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-400" />
                  Dispatch Touch #{sendTouchNumber} to {sendTouchModalLead.businessName}
                </h3>
                <button onClick={() => setSendTouchModalLead(null)} className="p-1 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-3.5 bg-[#040813] rounded-2xl border border-white/[0.07] space-y-1.5">
                  <div><strong className="text-slate-400">Recipient:</strong> {sendTouchModalLead.email}</div>
                  <div><strong className="text-slate-400">Company:</strong> {sendTouchModalLead.businessName}</div>
                  <div><strong className="text-slate-400">Touch Sequence:</strong> Step #{sendTouchNumber}</div>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSendTouchNumber(t)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-bold transition-all ${
                        sendTouchNumber === t
                          ? "bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/20"
                          : "bg-[#040813] border-white/[0.07] text-slate-400"
                      }`}
                    >
                      Touch #{t}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => handleSendIndividualTouch(sendTouchModalLead, sendTouchNumber, true)}
                    disabled={isSendingIndividualTouch}
                    className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs rounded-xl transition-all"
                  >
                    Test Safe Preview (Dry Run)
                  </button>
                  <button
                    onClick={() => handleSendIndividualTouch(sendTouchModalLead, sendTouchNumber, false)}
                    disabled={isSendingIndividualTouch}
                    className="flex-1 py-3 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                  >
                    {isSendingIndividualTouch ? "Sending..." : "Dispatch Live Email"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
