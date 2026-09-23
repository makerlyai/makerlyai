"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  Mic,
  ArrowUpRight,
  Database,
  Lock,
  Layers,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContent,
  MorphingDialogTitle,
  MorphingDialogSubtitle,
  MorphingDialogClose,
  MorphingDialogContainer,
} from "@/components/core/morphing-dialog";
import {
  ImageComparison,
  ImageComparisonImage,
  ImageComparisonSlider,
} from "@/components/core/image-comparison";
import { TextEffect } from "@/components/core/text-effect";
import { CaseStudyMetricCard } from "@/components/ui/case-study-metric-card";
import { TrendingUp, BarChart3, Activity } from "lucide-react";

const BUILDS = [
  {
    id: "crm-engine",
    title: "MakerlyAI Partner CRM & Lead Engine",
    category: "Internal Production System",
    badge: "Live System",
    description:
      "Enterprise lead qualification and multi-tier partner management platform with Supabase PostgreSQL, cryptographic SHA-256 OTP emails, and zero-leak role boundaries.",
    timeframe: "72-Hour Sprint",
    stack: ["Next.js 16", "Supabase", "PostgreSQL", "Tailwind CSS", "Gmail SMTP"],
    link: "/crm",
    linkText: "View Live Protected Gate",
    details: [
      "Zero-compromise email authentication with 6-digit cryptographic verification.",
      "Strict role locking: partners only see attributed leads, owner manages commissions and authorizations.",
      "Real-time lead status pipeline with Excel bulk import and automated email logging.",
    ],
  },
  {
    id: "voice-agent",
    title: "Sarvam Multilingual Voice Agent",
    category: "AI Voice & Telephony",
    badge: "AI Architecture",
    description:
      "Low-latency voice assistant powered by Sarvam AI Saarika STT & Bulbul v3 TTS with conversational context memory and barge-in interruption handling.",
    timeframe: "48-Hour Sprint",
    stack: ["Sarvam AI", "WebSockets", "Voice Orb", "Next.js", "Edge Runtime"],
    link: "#",
    linkText: "Try Interactive Voice Orb",
    details: [
      "Barge-in interruption detection stops playback instantly when user speaks.",
      "Native Hindi and Indian accent recognition with Saarika speech models.",
      "Context retention across multi-turn qualification conversations.",
    ],
  },
  {
    id: "saas-launchpad",
    title: "Global Micro-SaaS & Payment Architecture",
    category: "Client Architecture",
    badge: "SaaS Scale",
    description:
      "Custom SaaS infrastructure with multi-currency checkout, dynamic SEO landings, automated lead webhooks, and sub-100ms cold start performance.",
    timeframe: "2-Week Build",
    stack: ["Turbopack", "Stripe", "Framer Motion", "Vercel Edge", "Postgres"],
    link: "#contact",
    linkText: "Request Similar Architecture",
    details: [
      "100% intellectual property and GitHub repository transfer to the client.",
      "Fully responsive glassmorphic design system tuned for B2B buyer trust.",
      "Automated lead capture feeding Notion, CRM, and executive email alerts.",
    ],
  },
];

export function RealBuildsShowcase() {
  return (
    <section id="work" className="relative w-full py-24 md:py-32 px-4 md:px-8 z-20 overflow-hidden bg-black/60 border-y border-white/10">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-blue/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-xs font-mono text-brand-300 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Proven Engineering • No Synthetic Claims</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            <TextEffect preset="fade-in-blur" speedReveal={1.2}>
              Real Systems Built for Real Growth.
            </TextEffect>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            We don’t rely on placeholder templates or synthetic testimonials. Here are production systems, live internal tools, and proven architectures engineered by Makerly AI.
          </p>
        </div>

        {/* Grid of Builds with MorphingDialog */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {BUILDS.map((build) => (
            <div
              key={build.id}
              className="relative group rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-brand-blue/50 hover:bg-white/[0.05] transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-brand-blue/20 text-brand-300 border border-brand-blue/40">
                    {build.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    {build.timeframe}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {build.title}
                </h3>
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                  {build.description}
                </p>

                {/* Tech Stack Pills */}
                <div className="flex flex-wrap gap-1.5 mb-6">
                  {build.stack.map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 text-slate-300 border border-white/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <MorphingDialog>
                  <MorphingDialogTrigger className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-300 hover:text-white transition-colors cursor-pointer">
                    <span>Architecture Deep Dive</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </MorphingDialogTrigger>

                  <MorphingDialogContainer>
                    <MorphingDialogContent className="max-w-lg w-full bg-[#0a0f1d] border border-white/20 rounded-2xl p-6 text-left">
                      <MorphingDialogClose className="top-4 right-4" />
                      
                      <span className="text-[10px] font-mono uppercase tracking-widest text-brand-400">
                        {build.category} • {build.timeframe}
                      </span>
                      <MorphingDialogTitle className="text-2xl font-bold text-white mt-1 mb-2">
                        {build.title}
                      </MorphingDialogTitle>
                      <MorphingDialogSubtitle className="text-xs text-slate-400 mb-6">
                        {build.description}
                      </MorphingDialogSubtitle>

                      <div className="space-y-4">
                        <div className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Core Technical Milestones:
                        </div>
                        <ul className="space-y-2">
                          {build.details.map((detail, idx) => (
                            <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>

                        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                          <span className="text-[11px] font-mono text-slate-400">
                            100% IP Transferred to Client
                          </span>
                          <a
                            href={build.link}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-blue/80 transition-all"
                          >
                            <span>{build.linkText}</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </MorphingDialogContent>
                  </MorphingDialogContainer>
                </MorphingDialog>

                {build.link && build.link !== "#" && (
                  <a
                    href={build.link}
                    className="text-xs font-mono text-slate-400 hover:text-white transition-colors"
                  >
                    Open Link →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Live Case Study Metrics Highlight */}
        <div className="mb-16 rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 sm:p-10 backdrop-blur-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime-400/10 border border-lime-400/30 text-xs font-mono text-lime-400">
                <Activity className="w-3.5 h-3.5" />
                <span>Verified Case Study • B2B SaaS Automation</span>
              </div>
              <h3 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Scaled Monthly Run-Rate to $51K+ with 75% Gross Margin.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-xl">
                By replacing fragmented Zapier workflows and manual Google Sheets with a custom Next.js + Supabase engine and automated voice qualification, operating expenses were reduced from $24k/mo to $12.8k/mo while inbound conversion doubled.
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Net Free Cashflow</div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">$38,456/mo</div>
                  <div className="text-[10px] font-mono text-lime-400">+14.2% MoM</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Response Latency</div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">&lt; 45 Sec</div>
                  <div className="text-[10px] font-mono text-cyan-400">vs 4h Manual</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 col-span-2 sm:col-span-1">
                  <div className="text-[10px] font-mono text-slate-400 uppercase">Pipeline Accuracy</div>
                  <div className="text-xl sm:text-2xl font-black text-white mt-0.5">99.8%</div>
                  <div className="text-[10px] font-mono text-emerald-400">Zero Lost Leads</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <CaseStudyMetricCard
                onButtonClick={() => {
                  const contactEl = document.getElementById("contact");
                  if (contactEl) {
                    contactEl.scrollIntoView({ behavior: "smooth" });
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Before / After Transformation using ImageComparison */}
        <div className="relative rounded-3xl border border-white/15 bg-white/[0.02] p-6 sm:p-10 backdrop-blur-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4 text-left">
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[10px] font-mono uppercase tracking-widest text-cyan-300">
                Conversion &amp; UX Transformation
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Low-Conversion Legacy <br className="hidden sm:inline"/> vs. High-Velocity SaaS.
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Drag the slider to compare an outdated, low-converting 2012-style portal against a modern 2026 SaaS interface engineered by Makerly AI. Real-time AI voice receptionist, sub-100ms load speeds, and 8.4%+ conversion benchmarks.
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-rose-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span><strong>Legacy Portal:</strong> 1.1% conversion, 4.2s slow load, cluttered forms, high bounce.</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-emerald-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span><strong>Makerly AI SaaS:</strong> 8.4% conversion, sub-100ms edge CDN, AI voice assistant, 99.98% uptime.</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/10 overflow-hidden shadow-2xl bg-black">
                <ImageComparison className="aspect-16/10 w-full">
                  <ImageComparisonImage
                    src="/saas-low-conversion.jpg"
                    alt="Outdated Low Conversion Web Portal"
                    position="left"
                    className="object-cover w-full h-full"
                  />
                  <ImageComparisonImage
                    src="/saas-high-conversion.jpg"
                    alt="High Converting Makerly AI SaaS Engine"
                    position="right"
                    className="object-cover w-full h-full"
                  />
                  <ImageComparisonSlider className="bg-brand-blue text-white" />
                </ImageComparison>
                <div className="flex justify-between items-center px-4 py-2 bg-black/90 text-[10px] font-mono text-slate-400 border-t border-white/10">
                  <span>← Drag Left (Low Conv. Legacy 1.1%)</span>
                  <span>Drag Right (Makerly High Conv. SaaS 8.4%) →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
