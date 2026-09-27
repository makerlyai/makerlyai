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
            <h2 className="text-xl font-bold text-white">5. Age Eligibility & User Warranty</h2>
            <p>
              By accessing our site, requesting software development estimates, or entering into contracts with Makerly AI, you represent and warrant that you are at least 18 years of age (or the legal age of majority in your jurisdiction) and possess full legal capacity to enter into binding agreements. If you represent a legal entity, you warrant that you are duly authorized to bind such entity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. Satisfaction Guarantee & Refund Policy</h2>
            <p>
              Our preview sprint satisfaction guarantee is governed strictly under our <Link href="/refund-policy" className="text-brand-400 underline">Refund Policy</Link>. In the event that a 24-48h working preview does not meet your specifications, no completion fees are owed, and the deposit refund terms specified in the SOW shall govern.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">7. Complete Disclaimer of Warranties ("AS-IS")</h2>
            <p>
              EXCEPT AS EXPLICITLY SET FORTH IN A FORMAL STATEMENT OF WORK, ALL CODE, SOFTWARE, ARCHITECTURES, ARTIFICIAL INTELLIGENCE MODELS, INTEGRATIONS, AND CONSULTATIONS ARE PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS. MAKERLY AI DISCLAIMS ALL EXPRESS OR IMPLIED WARRANTIES, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, ACCURACY, OR CONTINUOUS UNINTERRUPTED OPERATION. THIRD-PARTY APIS AND AI FOUNDATION MODELS (SUCH AS OPENAI, GROQ, ANTHROPIC, OR SARVAM) OPERATE INDEPENDENTLY, AND MAKERLY AI IS NOT LIABLE FOR UPSTREAM OUTAGES OR BEHAVIORAL SHIFTS IN THIRD-PARTY AI PROVIDERS.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">8. Strict Limitation of Liability & Cap on Damages</h2>
            <p>
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE GLOBAL LAW, UNDER NO CIRCUMSTANCES SHALL MAKERLY AI, ITS FOUNDERS, EMPLOYEES, CONTRACTORS, OR AFFILIATES BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES—INCLUDING BUT NOT LIMITED TO LOSS OF REVENUE, LOSS OF PROFITS, DATA LOSS, REPUTATIONAL DAMAGE, WORK STOPPAGE, OR BUSINESS INTERRUPTION—ARISING FROM OR RELATED TO YOUR USE OF DELIVERABLES OR ENGAGEMENT WITH US, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p>
              IN NO EVENT SHALL MAKERLY AI'S TOTAL AGGREGATE LIABILITY ARISING FROM ALL CLAIMS UNDER CONTRACT, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE EXCEED THE TOTAL AMOUNT ACTUALLY PAID BY YOU TO MAKERLY AI IN THE THREE (3) MONTHS PRECEDING THE CLAIM, OR USD $500 (WHICHEVER IS LESS).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">9. Mutual Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Makerly AI and its representatives from and against any third-party claims, liabilities, damages, judgments, or expenses (including reasonable attorney fees) arising from: (a) content, assets, or software logic provided or directed by you; (b) any breach of these Terms; or (c) violation of applicable third-party rights or global laws.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">10. Governing Law, Binding Arbitration & Class Action Waiver</h2>
            <p>
              These Terms and any project engagements are governed exclusively by the laws of India, without regard to conflict of law principles. Any dispute, claim, or controversy arising out of or relating to these Terms shall be resolved exclusively through final and binding arbitration administered in Jamshedpur / Jharkhand, India, or conducted virtually by a mutually agreed arbitrator.
            </p>
            <p className="font-semibold text-white">
              YOU EXPRESSLY AGREE THAT ALL DISPUTES MUST BE BROUGHT IN AN INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">11. Notices, Billing & Support Inquiries</h2>
            <p>
              All formal notices, invoice queries, and contract communications should be addressed to our relevant operational channels:
            </p>
            <ul className="space-y-1 font-mono text-xs text-slate-300">
              <li>• Invoicing &amp; Milestone Payments: <a href="mailto:billing@makerlyai.in" className="text-brand-400 underline">billing@makerlyai.in</a></li>
              <li>• Client Support &amp; Active Sprints: <a href="mailto:support@makerlyai.in" className="text-brand-400 underline">support@makerlyai.in</a></li>
              <li>• Founder &amp; Executive Management: <a href="mailto:tousif@makerlyai.in" className="text-brand-400 underline">tousif@makerlyai.in</a></li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
