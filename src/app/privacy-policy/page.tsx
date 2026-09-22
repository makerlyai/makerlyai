import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Makerly AI",
  description: "Learn how Makerly AI protects, processes, and respects your data and confidential project information.",
};

export default function PrivacyPolicyPage() {
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
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
            Transparency & Security
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white mb-4">
          Privacy Policy
        </h1>
        <p className="text-sm font-mono text-slate-400 mb-12">
          Effective Date: January 1, 2025 • Last Updated: September 2025
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">1. Information We Collect</h2>
            <p>
              When you interact with Makerly AI (via makerlyai.in, our contact form, or direct communications), we only collect information necessary to evaluate and deliver engineering services:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-400">
              <li><strong>Contact Details:</strong> Your full name, work email address, phone number, and company name.</li>
              <li><strong>Project Specifications:</strong> Blueprints, technical requirements, timelines, budget expectations, and architecture preferences you share.</li>
              <li><strong>Communications:</strong> Messages exchanged through our contact forms, voice assistant sessions, and scheduled consultations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">2. How We Use Your Information</h2>
            <p>
              We process your data strictly to:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-400">
              <li>Prepare software proposals, architectural roadmaps, and scope estimates.</li>
              <li>Execute development sprints, client communications, and milestone updates.</li>
              <li>Maintain administrative and legal compliance records.</li>
            </ul>
            <p className="font-semibold text-white">
              We never sell, lease, or monetize your contact details or project data to third-party data brokers or advertisers.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">3. Strict Confidentiality & NDAs</h2>
            <p>
              We treat all client concepts, proprietary algorithms, database schemas, and commercial logic as confidential trade secrets. Mutual Non-Disclosure Agreements (NDAs) are executed prior to sharing any proprietary codebases or sensitive business assets upon request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">4. Data Storage & Security</h2>
            <p>
              Our internal systems use enterprise-grade cloud databases with encryption in transit (TLS 1.3) and at rest (AES-256). Access is strictly restricted to authorized engineering personnel using multi-factor verification.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">5. Your Rights</h2>
            <p>
              You may request an export or permanent deletion of your contact records and submitted project data at any time by emailing our data officer at <a href="mailto:contact@makerlyai.in" className="text-brand-400 underline">contact@makerlyai.in</a> or <a href="mailto:getmakerlyai@gmail.com" className="text-brand-400 underline">getmakerlyai@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
