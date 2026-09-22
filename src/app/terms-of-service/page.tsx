import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms of Service | Makerly AI",
  description: "Terms and conditions governing software development services, deliverables, and intellectual property ownership.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-black text-slate-100 py-20 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-brand-400 hover:text-white mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Makerly AI
        </Link>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-brand-blue/20 text-brand-400 border border-brand-blue/30">
            <FileText className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Client Contract Terms
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Terms of Service
        </h1>
        <p className="text-sm font-mono text-slate-400 mb-12">
          Effective Date: January 1, 2025 • Last Updated: September 2025
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Engagement Structure & Scopes</h2>
            <p>
              Makerly AI operates as a custom software engineering and digital product studio. Work is structured under mutually agreed Statements of Work (SOW) or milestone sprints outlining technical deliverables, architectures, and timelines.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. 100% Intellectual Property (IP) Transfer</h2>
            <p>
              Upon receipt of final milestone payments, <strong>you own 100% of all custom code, user interfaces, database schemas, and documentation</strong> created specifically for your project. Makerly AI claims zero perpetual royalties, vendor lock-in, or proprietary hold on your production source code.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Development Milestones & Sprints</h2>
            <p>
              Sprint deliverables undergo staging reviews on live preview URLs. Revisions within the defined project scope are addressed promptly. Material scope changes outside the initial agreement are estimated as separate sprint extensions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Payment Terms & Invoicing</h2>
            <p>
              Projects typically proceed under a 50% kick-off deposit and 50% upon final acceptance, or milestone-based tranches for larger architectures. Invoices are settled via direct bank transfer, Stripe, or standard escrow mechanisms.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Satisfaction Guarantee</h2>
            <p>
              Our preview sprint satisfaction guarantee is governed strictly under our <Link href="/refund-policy" className="text-brand-400 underline">Refund Policy</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
