"use client";

import { useState } from "react";
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Code2, 
  Github, 
  ExternalLink, 
  FileText, 
  Briefcase, 
  Clock, 
  Sparkles,
  DollarSign
} from "lucide-react";

interface CareersApplicationFormProps {
  initialRole?: string;
  roles: Array<{ id: string; title: string }>;
}

export default function CareersApplicationForm({
  initialRole,
  roles,
}: CareersApplicationFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    roleTitle: initialRole || roles[0]?.title || "Senior Full-Stack Next.js / TypeScript Architect",
    experienceYears: "3 - 5 Years",
    primaryTechStack: "",
    githubUrl: "",
    liveProjectUrl: "",
    portfolioUrl: "",
    resumeUrl: "",
    hardestProblem: "",
    availability: "Immediate (Within 48 Hours)",
    expectedSalary: "",
  });

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/careers/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit application.");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-b from-emerald-950/40 to-slate-950/80 p-8 md:p-12 text-center backdrop-blur-2xl shadow-2xl shadow-emerald-950/40">
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-400" />
        </div>
        <span className="inline-block px-3.5 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold uppercase tracking-wider mb-4">
          Application Received
        </span>
        <h3 className="text-2xl md:text-4xl font-black text-white mb-4 tracking-tight">
          Proof of Work Dispatched to Tousif Raza
        </h3>
        <p className="text-slate-300 text-sm md:text-base max-w-xl mx-auto leading-relaxed mb-8">
          Thank you, <strong className="text-white">{formData.fullName}</strong>. An automated confirmation has been sent to{" "}
          <strong className="text-cyan-300">{formData.email}</strong> from <span className="font-mono text-emerald-400">careers@makerlyai.in</span>.
          We personally review your GitHub repository and live project within <strong className="text-white">48 hours</strong>.
        </p>
        <button
          onClick={() => {
            setStatus("idle");
            setFormData({
              fullName: "",
              email: "",
              phone: "",
              roleTitle: roles[0]?.title || "",
              experienceYears: "3 - 5 Years",
              primaryTechStack: "",
              githubUrl: "",
              liveProjectUrl: "",
              portfolioUrl: "",
              resumeUrl: "",
              hardestProblem: "",
              availability: "Immediate (Within 48 Hours)",
              expectedSalary: "",
            });
          }}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white text-xs font-bold uppercase tracking-wider transition-all"
        >
          Submit Another Application
        </button>
      </div>
    );
  }

  return (
    <div id="apply-form" className="scroll-mt-32 rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-950/20 via-slate-950/60 to-black/80 p-6 md:p-12 backdrop-blur-2xl shadow-2xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-blue-500/40 bg-blue-500/10 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast-Track Engineering Intake</span>
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-white tracking-tight">
            Apply to the Makerly AI Pod
          </h2>
          <p className="text-slate-300 text-sm mt-1">
            Zero HR fluff. Submit your real code, production projects, and engineering solutions.
          </p>
        </div>
        <div className="text-xs font-mono text-slate-400 bg-white/5 border border-white/10 px-4 py-2 rounded-xl self-start md:self-auto">
          Reviewed directly by Founder Tousif Raza
        </div>
      </div>

      {status === "error" && (
        <div className="mb-8 p-4 rounded-2xl border border-red-500/40 bg-red-950/40 text-red-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-400 mt-0.5" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection */}
        <div>
          <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
            <span>Role You Are Applying For *</span>
          </label>
          <select
            name="roleTitle"
            value={formData.roleTitle}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3.5 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer"
          >
            {roles.map((r) => (
              <option key={r.id} value={r.title} className="bg-slate-900 text-white">
                {r.title}
              </option>
            ))}
            <option value="Open Application / Other Specialist" className="bg-slate-900 text-white">
              Open Application / Other Engineering Specialist
            </option>
          </select>
        </div>

        {/* Basic Candidate Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              placeholder="e.g. Alex Rivera"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              placeholder="alex@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
              Phone / WhatsApp *
            </label>
            <input
              type="tel"
              name="phone"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
        </div>

        {/* Experience & Core Stack */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
              Years of Relevant Experience *
            </label>
            <select
              name="experienceYears"
              value={formData.experienceYears}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer"
            >
              <option value="1 - 3 Years" className="bg-slate-900 text-white">1 - 3 Years</option>
              <option value="3 - 5 Years" className="bg-slate-900 text-white">3 - 5 Years</option>
              <option value="5 - 8 Years" className="bg-slate-900 text-white">5 - 8 Years</option>
              <option value="8+ Years (Senior / Staff Architect)" className="bg-slate-900 text-white">8+ Years (Senior / Staff Architect)</option>
              <option value="Self-Taught / Prodigy (< 1 Year)" className="bg-slate-900 text-white">Self-Taught / Prodigy (&lt; 1 Year)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Primary Tech Stack &amp; Tools *</span>
            </label>
            <input
              type="text"
              name="primaryTechStack"
              placeholder="e.g. Next.js 15, Turbopack, LangGraph, Python, WebSockets"
              value={formData.primaryTechStack}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>
        </div>

        {/* Proof of Work URLs */}
        <div className="p-6 rounded-2xl border border-white/10 bg-white/[0.02] space-y-6">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
            <Github className="w-4 h-4" />
            <span>Proof of Work &amp; Repositories (Mandatory)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                GitHub / GitLab Profile URL *
              </label>
              <input
                type="url"
                name="githubUrl"
                placeholder="https://github.com/username"
                value={formData.githubUrl}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
                <span>Live Project / Production App URL *</span>
              </label>
              <input
                type="url"
                name="liveProjectUrl"
                placeholder="https://yourapp.com or live deployment"
                value={formData.liveProjectUrl}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>Resume / CV Link * (Public Drive / Notion / Dropbox)</span>
              </label>
              <input
                type="url"
                name="resumeUrl"
                placeholder="https://drive.google.com/... or Notion link"
                value={formData.resumeUrl}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                Portfolio / LinkedIn URL (Optional)
              </label>
              <input
                type="url"
                name="portfolioUrl"
                placeholder="https://linkedin.com/in/... or personal site"
                value={formData.portfolioUrl}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Screening Questions */}
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
              Hardest Technical Challenge You Solved *
            </label>
            <p className="text-xs text-slate-400 mb-2">
              Explain a difficult bug, concurrency issue, latency bottleneck, or complex system you designed and solved.
            </p>
            <textarea
              name="hardestProblem"
              rows={4}
              placeholder="e.g. Diagnosed a high latency memory leak in a WebSocket event loop by analyzing heap dumps... or engineered an autonomous fallback pipeline..."
              value={formData.hardestProblem}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-white/15 bg-white/5 p-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Notice Period / Earliest Availability *</span>
              </label>
              <select
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer"
              >
                <option value="Immediate (Within 48 Hours)" className="bg-slate-900 text-white">
                  Immediate (Within 48 Hours)
                </option>
                <option value="15 Days Notice" className="bg-slate-900 text-white">
                  15 Days Notice
                </option>
                <option value="30 Days Notice" className="bg-slate-900 text-white">
                  30 Days Notice
                </option>
                <option value="Part-Time / High-Impact Sprints" className="bg-slate-900 text-white">
                  Part-Time / High-Impact Sprints
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-amber-400" />
                <span>Expected Monthly Compensation (INR / USD) *</span>
              </label>
              <input
                type="text"
                name="expectedSalary"
                placeholder="e.g. ₹1,25,000 / month or $2,500 / month"
                value={formData.expectedSalary}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 transition-all"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Direct intake &bull; 48-hour founder review commitment</span>
          </div>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 text-black font-extrabold text-sm uppercase tracking-wider hover:opacity-90 transition-all shadow-xl shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
          >
            {status === "submitting" ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Dispatching Proof of Work...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Engineering Application</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
