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
      <div className="min-h-screen bg-[#08090D] flex items-center justify-center text-zinc-300 font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin"></div>
          <div className="text-xs font-mono tracking-wider text-zinc-400">
            Checking session...
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
      <div className="min-h-screen bg-[#08090D] text-zinc-100 flex items-center justify-center p-4 font-sans relative">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-md bg-[#11131A] border border-zinc-800 rounded-2xl shadow-xl p-8 relative z-10"
        >
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-[11px] font-mono tracking-wider uppercase mb-3">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Owner Access Required</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              MakerlyAI LeadFinder
            </h1>
            <p className="text-xs text-zinc-400 mt-1.5">
              Outbound pipeline &amp; intelligence &bull; tousif@makerlyai.in
            </p>
          </div>

          <div className="grid grid-cols-3 gap-1 bg-[#0A0C11] p-1 rounded-xl border border-zinc-800/80 mb-6 text-xs font-medium">
            <button
              onClick={() => { setAuthMode("otp"); setAuthError(""); setAuthSuccess(""); }}
              className={`py-2 rounded-lg transition-all ${
                authMode === "otp" ? "bg-zinc-800 text-white font-medium border border-zinc-700 shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Email Code
            </button>
            <button
              onClick={() => { setAuthMode("password"); setAuthError(""); setAuthSuccess(""); }}
              className={`py-2 rounded-lg transition-all ${
                authMode === "password" ? "bg-zinc-800 text-white font-medium border border-zinc-700 shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Password
            </button>
            <button
              onClick={() => { setAuthMode("reset"); setAuthError(""); setAuthSuccess(""); }}
              className={`py-2 rounded-lg transition-all ${
                authMode === "reset" ? "bg-zinc-800 text-white font-medium border border-zinc-700 shadow-sm" : "text-zinc-400 hover:text-white"
              }`}
            >
              Set / Reset
            </button>
          </div>

          {authError && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/30 border border-red-800/50 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{authError}</span>
            </div>
          )}
          {authSuccess && (
            <div className="mb-4 p-3 rounded-xl bg-zinc-800/50 border border-zinc-700 text-zinc-200 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{authSuccess}</span>
            </div>
          )}

          {authMode === "otp" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#0A0C11] border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                    placeholder="tousif@makerlyai.in"
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  onClick={() => handleSendOtp("login")}
                  disabled={isSubmittingAuth}
                  className="w-full mt-2 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAuth ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><KeyRound className="w-4 h-4" /> Send Sign-In Code</>}
                </button>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-1.5">
                      Enter 6-Digit Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-[#0A0C11] border border-zinc-700 rounded-xl text-center py-3 text-2xl font-mono tracking-[0.25em] text-white focus:outline-none focus:border-zinc-400 transition-colors"
                      placeholder="000000"
                      autoFocus
                    />
                  </div>
                  <button
                    onClick={handleVerifyOtp}
                    disabled={isSubmittingAuth || otpInput.length !== 6}
                    className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmittingAuth ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify & Sign In"}
                  </button>
                  <div className="text-center pt-1">
                    <button
                      onClick={() => handleSendOtp("login")}
                      className="text-xs text-zinc-400 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                    >
                      Didn&apos;t receive code? Resend
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {authMode === "password" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full bg-[#0A0C11] border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="w-full bg-[#0A0C11] border border-zinc-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <button
                onClick={handleLoginPassword}
                disabled={isSubmittingAuth || !passwordInput}
                className="w-full mt-2 py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isSubmittingAuth ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Sign In"}
              </button>
            </div>
          )}

          {authMode === "reset" && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full bg-[#0A0C11] border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              {!otpSent ? (
                <button
                  onClick={() => handleSendOtp("reset")}
                  disabled={isSubmittingAuth}
                  className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingAuth ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : "Send Password Reset Code"}
                </button>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-mono text-zinc-300 uppercase tracking-wider mb-1.5">
                      6-Digit Security Code
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ""))}
                      className="w-full bg-[#0A0C11] border border-zinc-700 rounded-xl text-center py-2.5 text-xl font-mono text-white focus:outline-none focus:border-zinc-400 transition-colors"
                      placeholder="000000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider mb-1.5">
                      New Password (Min 8 Characters)
                    </label>
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      className="w-full bg-[#0A0C11] border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500 transition-colors"
                      placeholder="Enter new master password"
                    />
                  </div>
                  <button
                    onClick={handleSetOrResetPassword}
                    disabled={isSubmittingAuth || otpInput.length !== 6 || newPasswordInput.length < 8}
                    className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wider uppercase rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm"
                  >
                    {isSubmittingAuth ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : "Update Password & Sign In"}
                  </button>
                  <div className="text-center pt-1">
                    <button
                      type="button"
                      onClick={() => handleSendOtp("reset")}
                      className="text-xs text-zinc-400 hover:text-white transition-colors underline underline-offset-4 cursor-pointer"
                    >
                      Didn&apos;t receive code? Resend
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
    <div className="min-h-screen bg-[#08090D] text-zinc-100 font-sans selection:bg-zinc-800 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-zinc-800/80 bg-[#0B0D13]/90 backdrop-blur-md sticky top-0 z-30 px-6 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-md bg-zinc-800 border border-zinc-700/80 flex items-center justify-center font-bold text-white text-xs font-mono">
                M
              </div>
              <span className="font-semibold text-sm tracking-tight text-white">
                MakerlyAI <span className="text-zinc-400 font-normal">LeadFinder</span>
              </span>
            </a>
            <div className="h-4 w-px bg-zinc-800"></div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-zinc-800/60 border border-zinc-700/60 text-zinc-300 text-xs font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Active</span>
              </span>
            </div>
          </div>

          {/* Mailbox Quotas & Owner Profile */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 bg-[#0D0F17] border border-zinc-800 rounded-xl">
              <div className="flex items-center gap-1.5 text-zinc-300">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-400"></span>
                <span>tousif@: {tracker.mailboxes?.founder?.sentCount || 0}/20</span>
              </div>
              <div className="h-3 w-px bg-zinc-800"></div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                <span>hello@: {tracker.mailboxes?.growth?.sentCount || 0}/20</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#0D0F17] border border-zinc-800 px-3 py-1.5 rounded-xl text-zinc-200">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
              <span>Tousif Raza</span>
            </div>

            <button
              onClick={handleSignOut}
              className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Executive Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Executive Metric Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#0F1117] border border-zinc-800/80 rounded-2xl p-4 shadow-sm hover:border-zinc-700 transition-all">
            <div className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Pipeline Leads</span>
              <Building2 className="w-4 h-4 text-zinc-500" />
            </div>
            <div className="text-2xl font-semibold tracking-tight text-white mt-1">
              {stats.totalLeads}
            </div>
            <div className="text-[11px] text-zinc-500 font-mono mt-1 flex items-center gap-1">
              Verified &amp; Enriched
            </div>
          </div>

          <div className="bg-[#0F1117] border border-zinc-800/80 rounded-2xl p-4 shadow-sm hover:border-zinc-700 transition-all">
            <div className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Qualified Deals</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-semibold tracking-tight text-white mt-1">
              {stats.qualifiedCount}
            </div>
            <div className="text-[11px] text-zinc-500 font-mono mt-1">
              BANT &amp; MEDDIC &ge; 60 Score
            </div>
          </div>

          <div className="bg-[#0F1117] border border-zinc-800/80 rounded-2xl p-4 shadow-sm hover:border-zinc-700 transition-all">
            <div className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>High-Value Prospects</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-semibold tracking-tight text-white mt-1">
              {stats.highTicketCount}
            </div>
            <div className="text-[11px] text-zinc-500 font-mono mt-1">
              Estimated &ge; ₹1.0L Value
            </div>
          </div>

          <div className="bg-[#0F1117] border border-zinc-800/80 rounded-2xl p-4 shadow-sm hover:border-zinc-700 transition-all">
            <div className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Pipeline Value</span>
              <TrendingUp className="w-4 h-4 text-zinc-400" />
            </div>
            <div className="text-2xl font-semibold tracking-tight text-white mt-1">
              ₹{(stats.totalPipelineValue || 0).toLocaleString("en-IN")}
            </div>
            <div className="text-[11px] text-zinc-500 font-mono mt-1">
              Projected Deal Value
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-3 mb-6">
          <div className="flex items-center gap-1.5 bg-[#0B0D13] p-1 rounded-xl border border-zinc-800/80 text-xs font-medium overflow-x-auto">
            <button
              onClick={() => setActiveTab("autopilot")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "autopilot"
                  ? "bg-white text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Cpu className="w-3.5 h-3.5" /> Outreach Engine
            </button>

            <button
              onClick={() => setActiveTab("pipeline")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "pipeline"
                  ? "bg-white text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" /> Pipeline ({filteredLeads.length})
            </button>

            <button
              onClick={() => setActiveTab("scrapling")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "scrapling"
                  ? "bg-white text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Globe className="w-3.5 h-3.5" /> Target Discovery
            </button>

            <button
              onClick={() => setActiveTab("sales_team")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "sales_team"
                  ? "bg-white text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Bot className="w-3.5 h-3.5" /> Proposal Studio
            </button>

            <button
              onClick={() => setActiveTab("deliverability")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "deliverability"
                  ? "bg-white text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <Send className="w-3.5 h-3.5" /> Deliverability
            </button>

            <button
              onClick={() => setActiveTab("experiments")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "experiments"
                  ? "bg-white text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" /> Outreach Testing
            </button>

            <button
              onClick={() => setActiveTab("add")}
              className={`px-3.5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === "add"
                  ? "bg-white text-zinc-950 font-semibold shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add Prospect
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={triggerQualify}
              disabled={isQualifying}
              className="px-3 py-1.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-750 text-zinc-300 text-xs font-medium rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isQualifying ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Target className="w-3 h-3 text-zinc-400" />}
              Qualify Unrated
            </button>
            <button
              onClick={fetchDashboardData}
              disabled={loadingDashboard}
              className="p-1.5 bg-[#0B0D13] hover:bg-zinc-800 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-all cursor-pointer"
              title="Refresh Pipeline"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingDashboard ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 1: OUTREACH ENGINE & ACTIVITY LOG                     */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "autopilot" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Configuration & Launch */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0F1117] border border-zinc-800/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-xl bg-zinc-850 border border-zinc-700/80 flex items-center justify-center text-zinc-200">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-white tracking-tight">Automated Prospecting</h2>
                    <p className="text-xs text-zinc-400">
                      Discovers, enriches, qualifies, and sequences outreach.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Niche Target */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Target Market Preset
                    </label>
                    <select
                      value={autoPilotNiche}
                      onChange={(e) => setAutoPilotNiche(e.target.value)}
                      className="w-full bg-[#0B0D13] border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-medium text-white focus:outline-none focus:border-zinc-500"
                    >
                      <option value="b2b">B2B Enterprise &amp; Corporate Services</option>
                      <option value="d2c">D2C &amp; E-Commerce Stores (Shopify / Woo)</option>
                      <option value="saas">B2B SaaS &amp; AI Tech Startups</option>
                      <option value="high-ticket">High-Ticket Regional Manufacturers &amp; B2B</option>
                    </select>
                  </div>

                  {/* Limit Targets */}
                  <div>
                    <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                      Batch Extraction Count
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[3, 5, 8].map((n) => (
                        <button
                          key={n}
                          type="button"
                          onClick={() => setAutoPilotLimit(n)}
                          className={`py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                            autoPilotLimit === n
                              ? "bg-zinc-800 text-white border-zinc-600 font-semibold"
                              : "bg-[#0B0D13] border-zinc-800 text-zinc-400 hover:text-zinc-200"
                          }`}
                        >
                          {n} Leads
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Auto-Outreach Mode & Dry Run */}
                  <div className="p-4 bg-[#0B0D13] border border-zinc-800/80 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs font-medium text-white flex items-center gap-1.5">
                          <Send className="w-3.5 h-3.5 text-zinc-400" />
                          <span>Automated Outreach Dispatch</span>
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          Routes Touch 1 through deliverability rotator
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoPilotAutoOutreach}
                        onChange={(e) => setAutoPilotAutoOutreach(e.target.checked)}
                        className="w-4 h-4 rounded text-zinc-900 bg-zinc-800 border-zinc-700 cursor-pointer accent-white"
                      />
                    </div>

                    {autoPilotAutoOutreach && (
                      <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between text-xs">
                        <span className="text-zinc-400">Dispatch Mode:</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setAutoPilotDryRun(true)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                              autoPilotDryRun ? "bg-zinc-800 text-white border border-zinc-700 font-medium" : "text-zinc-500"
                            }`}
                          >
                            Dry Run (Preview)
                          </button>
                          <button
                            type="button"
                            onClick={() => setAutoPilotDryRun(false)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all cursor-pointer ${
                              !autoPilotDryRun ? "bg-red-950/40 text-red-300 border border-red-800/60 font-medium" : "text-zinc-500"
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
                    className="w-full py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isAutoPilotRunning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Processing Prospects...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-zinc-950" />
                        <span>Run Outreach Cycle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Connected Systems Grid Card */}
              <div className="bg-[#0F1117] border border-zinc-800/80 rounded-2xl p-5 shadow-sm text-xs space-y-3">
                <h3 className="font-mono uppercase tracking-wider text-zinc-400 text-[11px] flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-zinc-400" /> Connected Systems
                </h3>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-3 bg-[#0B0D13] rounded-xl border border-zinc-850">
                    <span className="text-zinc-200 font-semibold">Discovery Engine</span>
                    <div className="text-zinc-500 text-[10px] mt-0.5">Automated web extraction</div>
                  </div>
                  <div className="p-3 bg-[#0B0D13] rounded-xl border border-zinc-850">
                    <span className="text-zinc-200 font-semibold">CRM Database</span>
                    <div className="text-zinc-500 text-[10px] mt-0.5">Pipeline tracking &amp; history</div>
                  </div>
                  <div className="p-3 bg-[#0B0D13] rounded-xl border border-zinc-850">
                    <span className="text-zinc-200 font-semibold">Qualification</span>
                    <div className="text-zinc-500 text-[10px] mt-0.5">BANT &amp; MEDDIC criteria</div>
                  </div>
                  <div className="p-3 bg-[#0B0D13] rounded-xl border border-zinc-850">
                    <span className="text-zinc-200 font-semibold">Delivery Rotator</span>
                    <div className="text-zinc-500 text-[10px] mt-0.5">20/day safety cap per inbox</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Activity Log & Audit Trail */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-[#0F1117] border border-zinc-800/80 rounded-2xl p-5 shadow-sm flex flex-col h-[520px]">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-300 font-semibold">
                      Activity Log &bull; Tousif Oversight Console
                    </h3>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {liveTerminalLogs.length} events logged
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 font-mono text-xs">
                  {liveTerminalLogs.map((log) => {
                    const badgeColor =
                      log.level === "success"
                        ? "text-zinc-200 bg-zinc-800/80 border-zinc-700"
                        : log.level === "warning"
                        ? "text-amber-300 bg-amber-950/40 border-amber-800/50"
                        : "text-zinc-300 bg-zinc-900 border-zinc-800";

                    return (
                      <div
                        key={log.id}
                        className="p-3 bg-[#0B0D13] rounded-xl border border-zinc-850 flex items-start gap-2.5"
                      >
                        <span className="text-zinc-500 text-[10px] shrink-0 mt-0.5">{log.timestamp}</span>
                        <span className={`px-2 py-0.5 rounded-md border text-[10px] font-semibold shrink-0 ${badgeColor}`}>
                          {log.stage}
                        </span>
                        <span className="text-zinc-300 text-xs leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: log.message }}></span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 2: PIPELINE & PROSPECTS LIST                          */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "pipeline" && (
          <div>
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-500" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by brand name, domain, contact email, or tech stack..."
                  className="w-full bg-[#0F1117] border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500"
                />
              </div>

              <div className="flex items-center gap-1.5 bg-[#0B0D13] p-1 rounded-xl border border-zinc-800/80 text-xs overflow-x-auto">
                <button
                  onClick={() => setStageFilter("all")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${stageFilter === "all" ? "bg-zinc-800 text-white font-medium border border-zinc-700" : "text-zinc-400 hover:text-white"}`}
                >
                  All ({leads.length})
                </button>
                <button
                  onClick={() => setStageFilter("high_ticket")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${stageFilter === "high_ticket" ? "bg-zinc-800 text-amber-300 font-medium border border-zinc-700" : "text-zinc-400 hover:text-white"}`}
                >
                  High Value
                </button>
                <button
                  onClick={() => setStageFilter("qualified")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${stageFilter === "qualified" ? "bg-zinc-800 text-emerald-300 font-medium border border-zinc-700" : "text-zinc-400 hover:text-white"}`}
                >
                  Qualified (&ge;60)
                </button>
                <button
                  onClick={() => setStageFilter("contacted")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${stageFilter === "contacted" ? "bg-zinc-800 text-white font-medium border border-zinc-700" : "text-zinc-400 hover:text-white"}`}
                >
                  Contacted
                </button>
                <button
                  onClick={() => setStageFilter("replied")}
                  className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${stageFilter === "replied" ? "bg-zinc-800 text-white font-medium border border-zinc-700" : "text-zinc-400 hover:text-white"}`}
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
                  score >= 80 ? "text-zinc-200 border-zinc-700 bg-zinc-800/80" :
                  score >= 60 ? "text-amber-300 border-amber-800/60 bg-amber-950/30" :
                  "text-zinc-400 border-zinc-800 bg-zinc-900";

                return (
                  <div
                    key={lead.id}
                    className="bg-[#0F1117] border border-zinc-800/80 hover:border-zinc-700 rounded-xl p-5 shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Business Name, High-Value Badge, Score */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-base text-white tracking-tight">
                              {lead.businessName}
                            </h3>
                            {lead.isHighTicket && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-950/40 border border-amber-800/60 text-amber-300 text-[10px] font-mono font-medium">
                                High Value
                              </span>
                            )}
                          </div>
                          {lead.websiteUrl && (
                            <a
                              href={lead.websiteUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 mt-0.5 font-mono transition-colors"
                            >
                              <span>{lead.websiteUrl.replace(/^https?:\/\//, "").slice(0, 32)}</span>
                              <ExternalLink className="w-3 h-3 text-zinc-500" />
                            </a>
                          )}
                        </div>

                        <div className="flex flex-col items-end">
                          <span className={`px-2.5 py-1 rounded-lg border text-xs font-mono font-medium ${scoreColor}`}>
                            {score}/100 &bull; {lead.tier ? lead.tier.split(" ")[0] : "Pending"}
                          </span>
                          <span className="text-xs font-mono font-medium text-white mt-1">
                            ₹{(lead.dealValue || 99000).toLocaleString("en-IN")}
                          </span>
                        </div>
                      </div>

                      {/* Contact & Stage Controls */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        {lead.email ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0B0D13] border border-zinc-800 text-xs font-mono text-zinc-300">
                            <Mail className="w-3 h-3 text-zinc-400" />
                            <span>{lead.email}</span>
                            {lead.hasValidMx && (
                              <span className="text-emerald-400 text-[10px] font-medium" title="DNS MX Verified">
                                ✓ MX
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-zinc-500 italic">No public email found</span>
                        )}

                        <span className="px-2 py-1 rounded-lg bg-[#0B0D13] border border-zinc-800 text-[11px] text-zinc-400 font-mono uppercase">
                          {lead.niche || "B2B"}
                        </span>

                        {/* Stage Dropdown */}
                        <select
                          value={lead.status || "Discovered"}
                          onChange={(e) => handleUpdateLeadStage(lead.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg bg-[#0B0D13] border border-zinc-700/80 text-zinc-200 text-[11px] font-mono font-medium focus:outline-none focus:border-zinc-500"
                        >
                          <option value="Discovered">Stage: Discovered</option>
                          <option value="Qualified">Stage: Qualified</option>
                          <option value="Contacted">Stage: Contacted</option>
                          <option value="Replied">Stage: Replied</option>
                          <option value="Meeting Booked">Stage: Meeting Booked</option>
                          <option value="Proposal Sent">Stage: Proposal Sent</option>
                          <option value="Closed Won">Stage: Closed Won</option>
                          <option value="Unqualified">Stage: Unqualified</option>
                        </select>
                      </div>

                      {/* Tech Stack Detected */}
                      {lead.techStack && lead.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {lead.techStack.map((tech: string) => (
                            <span
                              key={tech}
                              className="px-2 py-0.5 rounded-md bg-[#0B0D13] text-[10px] font-mono text-zinc-400 border border-zinc-850"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Personalized Observation Hook */}
                      {lead.personalizedHook && (
                        <div className="p-3 bg-[#0B0D13] rounded-xl border-l-2 border-zinc-600 text-xs text-zinc-300 italic mb-4 line-clamp-3">
                          &ldquo;{lead.personalizedHook}&rdquo;
                        </div>
                      )}
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        {lead.sequence && (
                          <button
                            onClick={() => setSelectedSequenceLead(lead)}
                            className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-zinc-400" /> 4-Touch Sequence
                          </button>
                        )}

                        <button
                          onClick={() => handleGenerateProposal(lead)}
                          className="px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 font-medium rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5 text-zinc-400" /> Proposal &amp; Brief
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {lead.email && (
                          <button
                            onClick={() => {
                              setSendTouchModalLead(lead);
                              setSendTouchNumber(Math.min((lead.touchCount || 0) + 1, 4));
                            }}
                            className="px-3 py-1 bg-white hover:bg-zinc-200 text-zinc-950 font-medium rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-sm"
                          >
                            <Send className="w-3 h-3" /> Send Touch #{(lead.touchCount || 0) + 1}
                          </button>
                        )}

                        <button
                          onClick={() => handleDeleteLead(lead.id)}
                          className="p-1.5 text-zinc-500 hover:text-red-400 rounded-lg cursor-pointer transition-colors"
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
              <div className="text-center py-16 bg-[#0F1117] border border-zinc-800/80 rounded-2xl">
                <Target className="w-10 h-10 text-zinc-600 mx-auto mb-3" />
                <h4 className="text-base font-semibold text-white">No Leads In Pipeline</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Launch Outreach Engine or Target Discovery to source fresh prospects.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 3: TARGET DISCOVERY                                   */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "scrapling" && (
          <div className="max-w-2xl mx-auto bg-[#0F1117] border border-zinc-800/80 rounded-2xl p-7 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-200">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-white tracking-tight">Target Discovery</h2>
                <p className="text-xs text-zinc-400">
                  Extract structured company profiles, verified decision-maker emails, and technical stacks.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Target Niche Preset
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  <button
                    type="button"
                    onClick={() => setSelectedNiche("b2b")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedNiche === "b2b"
                        ? "bg-zinc-800 border-zinc-600 text-white font-semibold"
                        : "bg-[#0B0D13] border-zinc-850 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1.5 text-zinc-200">
                      <Briefcase className="w-3.5 h-3.5 text-zinc-400" /> B2B Enterprise &amp; Services
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1">Consultancies, industrial suppliers, logistics</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedNiche("d2c")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedNiche === "d2c"
                        ? "bg-zinc-800 border-zinc-600 text-white font-semibold"
                        : "bg-[#0B0D13] border-zinc-850 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1.5 text-zinc-200">
                      <Zap className="w-3.5 h-3.5 text-zinc-400" /> D2C &amp; E-Commerce
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1">Shopify and WooCommerce commercial brands</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedNiche("saas")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedNiche === "saas"
                        ? "bg-zinc-800 border-zinc-600 text-white font-semibold"
                        : "bg-[#0B0D13] border-zinc-850 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1.5 text-zinc-200">
                      <Sparkles className="w-3.5 h-3.5 text-zinc-400" /> B2B SaaS &amp; Tech Startups
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1">Founders building software and cloud tools</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedNiche("high-ticket")}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedNiche === "high-ticket"
                        ? "bg-zinc-800 border-zinc-600 text-white font-semibold"
                        : "bg-[#0B0D13] border-zinc-850 text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    <div className="font-semibold flex items-center gap-1.5 text-zinc-200">
                      <Flame className="w-3.5 h-3.5 text-zinc-400" /> High-Ticket Regional B2B
                    </div>
                    <div className="text-[11px] text-zinc-500 mt-1">Contract manufacturers, healthcare, distributors</div>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                  Target Lead Count
                </label>
                <div className="flex gap-2">
                  {[3, 5, 8, 12].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setDiscoveryLimit(num)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                        discoveryLimit === num
                          ? "bg-zinc-800 text-white border-zinc-600 font-semibold"
                          : "bg-[#0B0D13] border-zinc-850 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      {num} Targets
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
                  Custom Search Query (Optional Override)
                </label>
                <input
                  type="text"
                  value={customQuery}
                  onChange={(e) => setCustomQuery(e.target.value)}
                  placeholder="e.g. corporate gifting Bangalore website contact"
                  className="w-full bg-[#0B0D13] border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-zinc-500"
                />
              </div>

              <button
                onClick={triggerDiscovery}
                disabled={isDiscovering}
                className="w-full py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isDiscovering ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Searching &amp; Extracting Contacts...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-zinc-950" /> Start Target Discovery
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 4: PROPOSAL STUDIO & DEAL QUALIFICATION               */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "sales_team" && (
          <div className="space-y-6">
            <div className="bg-[#0F1117] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-semibold text-white flex items-center gap-2">
                    <Bot className="w-4 h-4 text-zinc-400" />
                    Proposal Studio &amp; Deal Qualification
                  </h2>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Structured enterprise evaluation framework: BANT (Budget, Authority, Need, Timeline) &amp; MEDDIC.
                  </p>
                </div>
                <button
                  onClick={triggerQualify}
                  disabled={isQualifying}
                  className="px-3.5 py-2 bg-white hover:bg-zinc-200 text-zinc-950 font-medium text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  {isQualifying ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Target className="w-3.5 h-3.5" />}
                  Score Unrated Leads
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {leads.slice(0, 6).map((l: any) => (
                  <div key={l.id} className="p-4 bg-[#0B0D13] rounded-xl border border-zinc-850 text-xs">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-semibold text-white text-sm">{l.businessName}</div>
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono font-medium">
                        Score: {l.qualificationScore || 0}/100
                      </span>
                    </div>

                    {l.meddic ? (
                      <div className="space-y-1.5 text-zinc-300 font-mono text-[11px] mb-3">
                        <div><strong className="text-zinc-400">Metrics:</strong> {l.meddic.metrics || "Conversion lift"}</div>
                        <div><strong className="text-zinc-400">Economic Buyer:</strong> {l.meddic.economicBuyer || "Founder"}</div>
                        <div><strong className="text-zinc-400">Identified Pain:</strong> {l.meddic.identifiedPain || "Manual bottlenecks"}</div>
                      </div>
                    ) : (
                      <div className="text-zinc-500 italic text-[11px] mb-3">BANT / MEDDIC pending analysis</div>
                    )}

                    <button
                      onClick={() => handleGenerateProposal(l)}
                      className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 font-medium rounded-xl transition-all flex items-center justify-center gap-1.5 border border-zinc-800 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-zinc-400" />
                      View Full Proposal &amp; Meeting Playbook
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 5: MAILBOX ROTATOR & DELIVERABILITY                   */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "deliverability" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-[#0F1117] border border-zinc-800/80 rounded-2xl p-7 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-200">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-semibold text-white tracking-tight">Mailbox Rotator &amp; Deliverability</h2>
                  <p className="text-xs text-zinc-400">
                    Rotated multi-mailbox dispatch enforcing strict 20/day safety caps and human delay intervals.
                  </p>
                </div>
              </div>

              {/* Mailbox Daily Status */}
              <div className="grid grid-cols-2 gap-3 p-4 bg-[#0B0D13] rounded-xl border border-zinc-850 mb-6 text-xs font-mono">
                <div>
                  <div className="text-zinc-400 mb-1">Mailbox 1: tousif@makerlyai.in</div>
                  <div className="text-white font-semibold text-base">
                    {tracker.mailboxes?.founder?.sentCount || 0} / 20 sent today
                  </div>
                  <div className="w-full bg-zinc-850 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all"
                      style={{ width: `${((tracker.mailboxes?.founder?.sentCount || 0) / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="text-zinc-400 mb-1">Mailbox 2: hello@makerlyai.in</div>
                  <div className="text-white font-semibold text-base">
                    {tracker.mailboxes?.growth?.sentCount || 0} / 20 sent today
                  </div>
                  <div className="w-full bg-zinc-850 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-zinc-400 h-full rounded-full transition-all"
                      style={{ width: `${((tracker.mailboxes?.growth?.sentCount || 0) / 20) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Campaign Batch Controls */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Execution Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => setCampaignMode("dry_run")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        campaignMode === "dry_run"
                          ? "bg-zinc-800 border-zinc-600 text-white font-semibold"
                          : "bg-[#0B0D13] border-zinc-850 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <div className="font-semibold flex items-center gap-1.5 text-zinc-200">
                        <CheckCircle2 className="w-4 h-4 text-zinc-400" /> Safe Preview (Dry Run)
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1">Verifies MX records and renders without dispatching</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCampaignMode("live")}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                        campaignMode === "live"
                          ? "bg-red-950/40 border-red-800/60 text-red-200 font-semibold"
                          : "bg-[#0B0D13] border-zinc-850 text-zinc-400 hover:text-zinc-200"
                      }`}
                    >
                      <div className="font-semibold flex items-center gap-1.5">
                        <Send className="w-4 h-4 text-red-400" /> Live Dispatch
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1">Sends live emails with 45s-180s human pacing</div>
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                    Batch Size
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setCampaignBatch(num)}
                        className={`flex-1 py-2 rounded-xl border text-xs font-mono transition-all cursor-pointer ${
                          campaignBatch === num
                            ? "bg-zinc-800 text-white border-zinc-600 font-semibold"
                            : "bg-[#0B0D13] border-zinc-850 text-zinc-400 hover:text-zinc-200"
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
                  className="w-full py-3.5 bg-white hover:bg-zinc-200 text-zinc-950 font-semibold text-xs tracking-wider uppercase rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isDispatching ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {campaignMode === "live" ? "Dispatch Live Campaign Batch" : "Run Safe Preview (Dry Run)"}
                    </>
                  )}
                </button>
              </div>
            </div>

            {campaignResults && (
              <div className="bg-[#0F1117] border border-zinc-800/80 rounded-2xl p-6 shadow-sm">
                <h3 className="font-semibold text-sm text-white mb-3">Batch Execution Results</h3>
                <div className="space-y-2 text-xs">
                  {campaignResults.map((r, i) => (
                    <div key={i} className="p-3 bg-[#0B0D13] rounded-xl border border-zinc-850 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-white">{r.lead} &bull; <span className="font-mono text-zinc-400">{r.email}</span></div>
                        <div className="text-zinc-400 text-[11px] mt-0.5">Subject: &ldquo;{r.subject}&rdquo;</div>
                      </div>
                      <span className="px-2 py-1 rounded bg-zinc-800 text-zinc-200 border border-zinc-700 font-mono font-medium text-[10px]">
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
        {/* TAB 6: OUTREACH EXPERIMENTS A/B LAB                       */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "experiments" && (
          <div className="max-w-3xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-medium text-white">Outreach Experiments Lab</h2>
              <p className="text-xs text-zinc-400">
                Controlled split-testing of value hooks, teardown offers, and subject line variants.
              </p>
            </div>

            <div className="space-y-4">
              {(dashboardData?.experiments || []).map((exp: any) => (
                <div key={exp.id} className="bg-[#0F1117] border border-zinc-800 rounded-2xl p-5 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 text-xs font-mono font-medium border border-zinc-700/50">
                        {exp.status}
                      </span>
                      <h4 className="font-medium text-sm text-white">{exp.name}</h4>
                    </div>
                    <span className="text-xs text-zinc-500 font-mono">Metric: {exp.metric}</span>
                  </div>

                  <p className="text-xs text-zinc-400 italic mb-4">
                    Hypothesis: &ldquo;{exp.hypothesis}&rdquo;
                  </p>

                  <div className="grid grid-cols-2 gap-3">
                    {exp.variants?.map((v: any) => (
                      <div key={v.name} className="p-3 bg-[#161822] rounded-xl border border-zinc-800/80 text-xs">
                        <div className="font-medium text-zinc-200">{v.name}</div>
                        <div className="flex items-center justify-between mt-2 text-zinc-400 font-mono text-[11px]">
                          <span>Sent: {v.impressions}</span>
                          <span>Replies: {v.conversions}</span>
                          <span className="text-white font-bold">{((v.rate || 0) * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleCreateExperiment} className="bg-[#0F1117] border border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="font-medium text-sm text-white">New Outreach Experiment</h3>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Experiment Name</label>
                <input
                  type="text"
                  value={experimentForm.name}
                  onChange={(e) => setExperimentForm({ ...experimentForm, name: e.target.value })}
                  placeholder="e.g. Teardown Video vs Case Study"
                  className="w-full bg-[#161822] border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Hypothesis</label>
                <input
                  type="text"
                  value={experimentForm.hypothesis}
                  onChange={(e) => setExperimentForm({ ...experimentForm, hypothesis: e.target.value })}
                  placeholder="e.g. Video teardown offer generates 2x reply rate compared to general intro"
                  className="w-full bg-[#161822] border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Variant A (Control)</label>
                  <input
                    type="text"
                    value={experimentForm.variantA}
                    onChange={(e) => setExperimentForm({ ...experimentForm, variantA: e.target.value })}
                    className="w-full bg-[#161822] border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1">Variant B (Challenger)</label>
                  <input
                    type="text"
                    value={experimentForm.variantB}
                    onChange={(e) => setExperimentForm({ ...experimentForm, variantB: e.target.value })}
                    className="w-full bg-[#161822] border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isCreatingExp}
                className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-medium text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
              >
                {isCreatingExp ? "Creating..." : "Launch Experiment"}
              </button>
            </form>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────── */}
        {/* TAB 7: ADD INDIVIDUAL TARGET WEBSITE                      */}
        {/* ───────────────────────────────────────────────────────── */}
        {activeTab === "add" && (
          <div className="max-w-xl mx-auto bg-[#0F1117] border border-zinc-800 rounded-2xl p-7 shadow-sm">
            <h2 className="text-lg font-medium text-white mb-1">Add Target Prospect</h2>
            <p className="text-xs text-zinc-400 mb-6">
              Crawls domain, inspects technical stack, evaluates qualification score, and generates sequence copy.
            </p>

            <form onSubmit={handleManualAdd} className="space-y-4 text-xs font-mono">
              <div>
                <label className="block text-zinc-400 mb-1 uppercase tracking-wider text-[11px]">Website URL *</label>
                <input
                  type="url"
                  value={manualForm.url}
                  onChange={(e) => setManualForm({ ...manualForm, url: e.target.value })}
                  placeholder="https://examplebrand.com"
                  className="w-full bg-[#161822] border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white font-sans placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase tracking-wider text-[11px]">Company Name</label>
                <input
                  type="text"
                  value={manualForm.company}
                  onChange={(e) => setManualForm({ ...manualForm, company: e.target.value })}
                  placeholder="e.g. Acme Corporation"
                  className="w-full bg-[#161822] border border-zinc-800 rounded-xl px-3 py-2.5 text-sm text-white font-sans placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 uppercase tracking-wider text-[11px]">Contact / Founder Name</label>
                  <input
                    type="text"
                    value={manualForm.name}
                    onChange={(e) => setManualForm({ ...manualForm, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className="w-full bg-[#161822] border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-sans placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 uppercase tracking-wider text-[11px]">Direct Email (Optional)</label>
                  <input
                    type="email"
                    value={manualForm.email}
                    onChange={(e) => setManualForm({ ...manualForm, email: e.target.value })}
                    placeholder="founder@example.com"
                    className="w-full bg-[#161822] border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-sans placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1 uppercase tracking-wider text-[11px]">Target Niche</label>
                <select
                  value={manualForm.niche}
                  onChange={(e) => setManualForm({ ...manualForm, niche: e.target.value })}
                  className="w-full bg-[#161822] border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white font-sans focus:outline-none focus:border-zinc-500 transition-colors"
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
                className="w-full py-3 bg-white hover:bg-zinc-200 text-zinc-950 font-medium text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
              >
                {isAddingManual ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Analyze Domain & Generate Sequence"}
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-3xl bg-[#0F1117] border border-zinc-800 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#161822]">
                <div>
                  <h3 className="font-medium text-base text-white flex items-center gap-2">
                    {selectedSequenceLead.businessName} &bull; <span className="text-zinc-300 font-mono text-xs">4-Touch Sequence</span>
                  </h3>
                  <div className="text-xs text-zinc-400 mt-0.5 font-mono">
                    Score: {selectedSequenceLead.qualificationScore}/100 &bull; Estimated Deal: ₹{(selectedSequenceLead.dealValue || 99000).toLocaleString("en-IN")}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedSequenceLead(null)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-4">
                {[
                  { key: "touch1", title: "Touch 1: Initial Hook (Day 1)", data: selectedSequenceLead.sequence?.touch1 },
                  { key: "touch2", title: "Touch 2: Case Study & Proof (Day 3)", data: selectedSequenceLead.sequence?.touch2 },
                  { key: "touch3", title: "Touch 3: Video Teardown Offer (Day 7)", data: selectedSequenceLead.sequence?.touch3 },
                  { key: "touch4", title: "Touch 4: Direct Follow-up (Day 12)", data: selectedSequenceLead.sequence?.touch4 },
                ].map(({ key, title, data }) => (
                  <div key={key} className="bg-[#161822] border border-zinc-800/80 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-mono font-medium text-zinc-300">{title}</div>
                      {data && (
                        <button
                          onClick={() => copyTextToClipboard(data.bodyPlain, key)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-[11px] text-zinc-300 flex items-center gap-1 font-mono transition-colors"
                        >
                          {copiedItem === key ? (
                            <>
                              <Check className="w-3 h-3 text-white" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {data ? (
                      <div className="space-y-2 text-xs">
                        <div className="text-zinc-400 font-mono">
                          <strong className="text-zinc-300">Subject:</strong> &ldquo;{data.subject}&rdquo;
                        </div>
                        <div className="p-3.5 bg-[#0A0B0E] rounded-xl border border-zinc-800/60 text-zinc-200 whitespace-pre-line font-sans leading-relaxed">
                          {data.bodyPlain}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-zinc-500 italic">No sequence step defined</div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* PROPOSAL & FOUNDER MEETING BRIEF MODAL                         */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedProposalLead && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-4xl bg-[#0F1117] border border-zinc-800 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#161822]">
                <div>
                  <h3 className="font-medium text-base text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-zinc-400" />
                    {selectedProposalLead.businessName} &bull; <span className="text-zinc-300 font-mono text-xs">Proposal &amp; Strategy</span>
                  </h3>
                  <div className="text-xs text-zinc-400 mt-0.5 font-mono">
                    Estimated Deal: ₹{(selectedProposalLead.dealValue || 99000).toLocaleString("en-IN")}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedProposalLead(null)}
                  className="p-1.5 text-zinc-400 hover:text-white rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto space-y-5 text-xs leading-relaxed">
                {isGeneratingProposal ? (
                  <div className="py-16 text-center space-y-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-zinc-400 mx-auto" />
                    <div className="text-sm font-medium text-white">Synthesizing Proposal...</div>
                    <div className="text-zinc-400 text-xs font-mono">Analyzing bottlenecks, technical stack, and engagement roadmap...</div>
                  </div>
                ) : activeProposal ? (
                  <>
                    {/* Executive Summary */}
                    <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-xl">
                      <div className="text-xs font-mono font-medium uppercase text-zinc-300 mb-1">Executive Summary</div>
                      <div className="text-zinc-300 text-sm leading-relaxed">{activeProposal.executiveSummary}</div>
                    </div>

                    {/* Client Context & Bottlenecks */}
                    {activeProposal.clientContext && (
                      <div className="bg-[#161822] border border-zinc-800 rounded-xl p-4 space-y-2">
                        <div className="font-mono text-zinc-300 font-medium uppercase text-[11px]">Client Context &amp; Identified Bottlenecks</div>
                        <div className="text-zinc-300 leading-relaxed">{activeProposal.clientContext.currentSituation}</div>
                        {activeProposal.clientContext.criticalBottlenecks && (
                          <ul className="list-disc pl-5 text-zinc-400 space-y-1 mt-2">
                            {activeProposal.clientContext.criticalBottlenecks.map((b: string, i: number) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}

                    {/* Recommended Solution & Deliverables */}
                    {activeProposal.recommendedSolution && (
                      <div className="bg-[#161822] border border-zinc-800 rounded-xl p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="font-mono text-zinc-200 font-medium uppercase text-[11px]">
                            {activeProposal.recommendedSolution.architectureTitle || "MakerlyAI Deliverables"}
                          </div>
                          <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-zinc-200 font-mono font-medium text-[10px] border border-zinc-700/50">
                            {activeProposal.recommendedSolution.timelineWeeks || 3} Weeks Delivery
                          </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {activeProposal.recommendedSolution.deliverables?.map((d: any, i: number) => (
                            <div key={i} className="p-3.5 bg-[#0A0B0E] rounded-xl border border-zinc-800/60">
                              <div className="font-medium text-white mb-1">{d.title}</div>
                              <div className="text-zinc-400 text-[11px] leading-relaxed">{d.description}</div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-zinc-800 font-mono text-[11px]">
                          <span className="text-zinc-400">Expected ROI: <strong className="text-white">{activeProposal.recommendedSolution.expectedRoiMetric}</strong></span>
                          <span className="text-white font-medium">Investment: ₹{(activeProposal.recommendedSolution.proposedInvestmentInr || selectedProposalLead.dealValue || 99000).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    )}

                    {/* Founder Meeting Playbook & Talking Points */}
                    {activeProposal.meetingBrief && (
                      <div className="bg-[#161822] border border-zinc-800 rounded-xl p-4 space-y-3">
                        <div className="font-mono text-zinc-300 font-medium uppercase text-[11px]">
                          Founder Meeting Strategy &amp; Talking Points
                        </div>

                        {activeProposal.meetingBrief.talkingPoints && (
                          <div>
                            <div className="font-medium text-zinc-300 mb-1">Key Value Pitch Points:</div>
                            <ul className="list-disc pl-5 text-zinc-400 space-y-1">
                              {activeProposal.meetingBrief.talkingPoints.map((tp: string, i: number) => (
                                <li key={i}>{tp}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {activeProposal.meetingBrief.discoveryQuestions && (
                          <div className="pt-2 border-t border-zinc-800">
                            <div className="font-medium text-zinc-300 mb-1">Discovery Questions:</div>
                            <ul className="list-disc pl-5 text-zinc-400 space-y-1">
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
                  <div className="text-center py-10 text-zinc-500 italic">No proposal generated yet. Click generate above.</div>
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
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="w-full max-w-lg bg-[#0F1117] border border-zinc-800 rounded-2xl shadow-2xl p-6 relative"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-base text-white flex items-center gap-2">
                  <Send className="w-4 h-4 text-zinc-400" />
                  Dispatch Touch #{sendTouchNumber} to {sendTouchModalLead.businessName}
                </h3>
                <button onClick={() => setSendTouchModalLead(null)} className="p-1 text-zinc-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs font-mono">
                <div className="p-3.5 bg-[#161822] rounded-xl border border-zinc-800 space-y-1.5">
                  <div><strong className="text-zinc-400">Recipient:</strong> {sendTouchModalLead.email}</div>
                  <div><strong className="text-zinc-400">Company:</strong> {sendTouchModalLead.businessName}</div>
                  <div><strong className="text-zinc-400">Touch Sequence:</strong> Step #{sendTouchNumber}</div>
                </div>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSendTouchNumber(t)}
                      className={`flex-1 py-2 rounded-xl border text-xs font-medium transition-colors ${
                        sendTouchNumber === t
                          ? "bg-white text-zinc-950 border-white font-bold"
                          : "bg-[#161822] border-zinc-800 text-zinc-400 hover:text-white"
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
                    className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs rounded-xl transition-colors cursor-pointer"
                  >
                    Preview Dry Run
                  </button>
                  <button
                    onClick={() => handleSendIndividualTouch(sendTouchModalLead, sendTouchNumber, false)}
                    disabled={isSendingIndividualTouch}
                    className="flex-1 py-2.5 bg-white hover:bg-zinc-200 text-zinc-950 font-medium text-xs rounded-xl transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isSendingIndividualTouch ? "Sending..." : "Dispatch Email"}
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
