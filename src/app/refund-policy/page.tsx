import React from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Satisfaction Guarantee & Refund Policy | Makerly AI",
  description: "Clear, transparent terms governing our initial preview sprint and satisfaction guarantee.",
};

export default function RefundPolicyPage() {
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
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Founder Protection Guarantee
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Satisfaction Guarantee & Refund Policy
        </h1>
        <p className="text-sm font-mono text-slate-400 mb-12">
          Effective Date: January 1, 2025 • Last Updated: September 2025
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. The "Preview Sprint" Satisfaction Guarantee</h2>
            <p>
              To remove vendor risk for founders, initial prototype and MVP sprints include a formal Stage 1 Preview Review. Within 48–72 hours of project kick-off, we deploy a working preview link demonstrating the initial user flow, layout architecture, and core interaction design.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. What "Pay $0 If Not Satisfied" Means</h2>
            <p>
              If the Stage 1 preview architecture materially fails to fulfill the agreed specifications, and you decide not to proceed with development:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-400">
              <li><strong>Decision Deadline:</strong> You have 5 business days following the delivery of the Stage 1 Preview link to provide feedback or exercise the guarantee.</li>
              <li><strong>Zero Retained Balance:</strong> Any unspent initial milestone fees are refunded in full within 5–7 business days.</li>
              <li><strong>Code &amp; IP Status:</strong> If the guarantee is exercised and a refund issued, the preview prototype, source code, and design files remain the exclusive intellectual property of Makerly AI and cannot be deployed commercially.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Completed Milestones & Approvals</h2>
            <p>
              Once a milestone is formally reviewed, accepted, and deployed to your production environment or transferred to your GitHub organization, the fees associated with that completed phase are non-refundable, as engineering labor and IP transfer have concluded.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Ongoing Retainers & Support</h2>
            <p>
              Monthly retainer and fractional engineering packages may be cancelled at any time with 14 days written notice prior to the start of the next billing cycle.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
