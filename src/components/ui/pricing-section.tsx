"use client";

import React from "react";
import Link from "next/link";
import { Check, ShieldCheck, ArrowRight, Sparkles, HelpCircle } from "lucide-react";
import { BorderTrail } from "@/components/core/border-trail";
import { GlowEffect } from "@/components/core/glow-effect";
import { TextEffect } from "@/components/core/text-effect";

const TIERS = [
  {
    name: "Rapid MVP Sprint",
    badge: "Fastest Time-to-Market",
    priceINR: "₹99,000",
    priceUSD: "$1,200",
    period: "fixed-scope sprint",
    timeline: "2–3 Weeks",
    description: "Full functional MVP with authentication, database, UI/UX, and core commercial user flows.",
    features: [
      "Working interactive preview in 48–72 hours",
      "Full Next.js 16 + Tailwind + Supabase/Postgres stack",
      "Stripe / Razorpay payment and billing setup",
      "Mobile responsive & SEO meta optimization",
      "100% Intellectual Property and GitHub transfer",
    ],
    popular: false,
    cta: "Start MVP Sprint",
  },
  {
    name: "AI Agent & Voice Engine",
    badge: "Most Requested",
    priceINR: "₹1,99,000",
    priceUSD: "$2,400",
    period: "custom deployment",
    timeline: "3–4 Weeks",
    description: "Intelligent multilingual voice receptionists, autonomous AI workflows, and CRM lead engines.",
    features: [
      "Sarvam AI Saarika STT + Bulbul v3 TTS integration",
      "Barge-in interruption detection and voice orb UI",
      "Multilingual Hindi & English conversational flow",
      "Automated lead qualification and CRM database sync",
      "Post-launch monitoring and API tuning included",
    ],
    popular: true,
    cta: "Build Custom AI Agent",
  },
  {
    name: "Dedicated Scale Retainer",
    badge: "For Growing Teams",
    priceINR: "Custom",
    priceUSD: "Milestone-Based",
    period: "monthly / milestone",
    timeline: "Ongoing",
    description: "Fractional CTO and full-stack engineering team dedicated to scaling your product without agency overhead.",
    features: [
      "Direct Slack/Discord access to Tousif Raza",
      "Weekly sprint cadence with staging deployments",
      "Continuous feature ship, bug fixes & database scaling",
      "Enterprise security review & load testing",
      "14-day cancellation notice at any time",
    ],
    popular: false,
    cta: "Schedule Discovery Call",
  },
];

export function PricingSection() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="pricing" className="relative w-full py-24 md:py-32 px-4 md:px-8 z-20 overflow-hidden bg-black/80">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-xs font-mono text-brand-300 mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Transparent Engagement Models</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            <TextEffect preset="fade-in-blur" speedReveal={1.2}>
              Predictable Pricing. Zero Hidden Fees.
            </TextEffect>
          </h2>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Every build is scoped with exact deliverables and milestone deadlines. No vague hourly meters or surprise invoices.
          </p>
        </div>

        {/* Tiers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16 items-stretch">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-3xl p-8 flex flex-col justify-between transition-all ${
                tier.popular
                  ? "bg-[#0d152a] border-2 border-brand-blue shadow-[0_0_50px_rgba(41,82,204,0.25)] scale-[1.02]"
                  : "bg-white/[0.03] border border-white/10 hover:border-white/20"
              }`}
            >
              {tier.popular && <BorderTrail size={90} />}

              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span
                    className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      tier.popular
                        ? "bg-brand-blue text-white"
                        : "bg-white/10 text-slate-300"
                    }`}
                  >
                    {tier.badge}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    ⏱ {tier.timeline}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                  {tier.description}
                </p>

                <div className="mb-6 pb-6 border-b border-white/10">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white">{tier.priceINR}</span>
                    <span className="text-sm font-mono text-slate-400">
                      / {tier.priceUSD}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-brand-300">
                    {tier.period}
                  </span>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                      <div className="mt-0.5 rounded-full p-0.5 bg-brand-blue/30 text-brand-300">
                        <Check className="w-3 h-3" />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="relative">
                  {tier.popular && (
                    <GlowEffect
                      colors={["#2952cc", "#00d2ff", "#a855f7", "#2952cc"]}
                      mode="colorShift"
                      blur="soft"
                      duration={4}
                      scale={0.95}
                    />
                  )}
                  <button
                    onClick={scrollToContact}
                    className={`w-full py-3.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      tier.popular
                        ? "bg-brand-blue hover:bg-brand-blue/90 text-white shadow-lg shadow-brand-blue/40"
                        : "bg-white/10 hover:bg-white/20 text-white border border-white/15"
                    }`}
                  >
                    <span>{tier.cta}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Credibility & Satisfaction Guarantee Box */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 text-left backdrop-blur-md">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                Pay $0 If Not Satisfied on Stage 1 Preview
              </h4>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Within 48–72 hours of project kick-off, we deploy a working interactive preview link. If the initial architecture does not meet the technical specification agreed upon, you may cancel with zero retained fees.
              </p>
            </div>
          </div>

          <Link
            href="/refund-policy"
            className="shrink-0 px-4 py-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 text-xs font-mono font-semibold transition-colors flex items-center gap-1.5"
          >
            <span>Read Refund Terms</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
