import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Database, CheckCircle2, ShieldCheck, Clock, MessageCircle, Server, Zap, Cpu, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Open Source CRM & Twenty Development Company | MakerlyAI",
  description:
    "Deploy, customize, and self-host Twenty CRM — the open-source AI alternative to Salesforce and HubSpot. Custom integrations, PostgreSQL data sovereignty, and WhatsApp/AI agent synchronization by MakerlyAI.",
  keywords: [
    "Twenty CRM development",
    "Twenty CRM customization",
    "open source CRM developers",
    "Salesforce alternative self hosted",
    "HubSpot open source replacement",
    "Twenty CRM consulting",
    "custom CRM engineering",
    "Makerly AI Twenty CRM",
    "Tousif Raza CRM developer",
  ],
  alternates: { canonical: "/services/open-source-crm-twenty" },
};

export default function TwentyCRMServicePage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12 selection:bg-brand-blue/30">
      <div className="max-w-5xl mx-auto">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 mb-6">
          <Link href="/" className="hover:text-brand-blue transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-brand-blue transition-colors">
            Services
          </Link>
          <span>/</span>
          <span className="text-brand-blue font-semibold">Open-Source CRM (Twenty)</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <Database className="w-4 h-4 text-cyan-400" />
          <span>Self-Hosted • 100% Data Sovereignty • $0 Per-Seat Subscriptions</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Custom Open-Source CRM &amp; <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-emerald-400">
            Twenty Implementation
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          Break free from $300/user/month Salesforce and HubSpot lock-in. MakerlyAI deploys, customizes, and integrates <strong>Twenty CRM</strong> on your own cloud infrastructure — paired with autonomous voice bots, WhatsApp pipelines, and 100% data ownership.
        </p>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <div className="w-12 h-12 rounded-xl bg-brand-blue/20 flex items-center justify-center text-cyan-400 mb-4">
              <Server className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Self-Hosted PostgreSQL Sovereignty</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              Your customer leads, deals, and records stay in your private PostgreSQL database. Fully compliant with GDPR, HIPAA, and Indian DPDP data residency standards with zero vendor snooping.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 mb-4">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">AI Agents &amp; Voice Telephony Sync</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              Native real-time sync with Groq, Sarvam AI voice receptionists, and WhatsApp bots. When a customer speaks with your AI, meeting transcripts, deal stages, and contact info update in Twenty automatically.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Custom Data Models &amp; Views</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              Tailored custom objects designed for your industry: real estate property listings and broker commissions, clinic patient appointments, B2B SaaS MRR cohorts, or e-commerce merchant pipelines.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-4">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Zero License Fees for Life</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              Stop paying tens of thousands of dollars every year as your sales team scales. Add unlimited sales reps, account managers, and executives without ever paying a per-seat software tax.
            </p>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="mb-20 rounded-2xl border border-white/10 bg-white/[0.02] p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-white">Why Modern Founders Choose Twenty Over Salesforce</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-foreground/50 uppercase text-xs">
                  <th className="pb-4">Feature</th>
                  <th className="pb-4 text-emerald-400 font-bold">Twenty CRM (Deployed by MakerlyAI)</th>
                  <th className="pb-4 text-foreground/50">Salesforce / HubSpot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-light">
                <tr>
                  <td className="py-4 font-semibold text-white">License Cost</td>
                  <td className="py-4 text-emerald-400 font-medium">$0 / user (Open Source)</td>
                  <td className="py-4 text-rose-400">$150 - $300 / user / month</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-white">Data Hosting</td>
                  <td className="py-4 text-emerald-400 font-medium">Your AWS / VPS / Supabase Postgres</td>
                  <td className="py-4 text-rose-400">Proprietary US Multi-Tenant Cloud</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-white">AI Native Architecture</td>
                  <td className="py-4 text-emerald-400 font-medium">Built-in GraphQL, REST &amp; Webhooks</td>
                  <td className="py-4 text-rose-400">Expensive add-ons &amp; rigid SDKs</td>
                </tr>
                <tr>
                  <td className="py-4 font-semibold text-white">Code Customization</td>
                  <td className="py-4 text-emerald-400 font-medium">100% full source code ownership</td>
                  <td className="py-4 text-rose-400">0% (Vendor Lock-in)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Guarantees & CTA */}
        <div className="rounded-3xl border border-brand-blue/30 bg-gradient-to-b from-brand-blue/10 to-transparent p-8 md:p-12 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center md:text-left">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="text-sm font-medium">Live Staging Preview in 24-48 Hours</span>
            </div>
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
              <span className="text-sm font-medium">100% IP &amp; Code Transfer</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple-400 shrink-0" />
              <span className="text-sm font-medium">Custom WhatsApp &amp; Voice Bot Integrations</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Ready to deploy your custom AI CRM?</h3>
              <p className="text-sm text-foreground/70">
                Book a consultation with founder Tousif Raza for a tailored architecture roadmap.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-blue text-white font-bold hover:bg-brand-blue/90 shadow-lg shadow-brand-blue/20 transition-all text-sm uppercase tracking-wider shrink-0"
            >
              <span>Get 24-Hour Preview</span>
              <MessageCircle className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Solutions</span>
        </Link>
      </div>
    </main>
  );
}
