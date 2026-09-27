import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | Makerly AI",
  description: "Learn how Makerly AI protects, processes, and respects your data and confidential project information.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-black text-slate-100 pt-32 pb-24 px-6 sm:px-12">
      <div className="max-w-4xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 mb-10 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Homepage</span>
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
            <h2 className="text-xl font-bold text-white">5. Age Restrictions & Minor Protection (COPPA & Global Standards)</h2>
            <p>
              Makerly AI services and websites are strictly intended for business enterprises and individuals who are at least 18 years of age (or the age of legal majority in their jurisdiction). We do not knowingly solicit, collect, or process personal data from children under the age of 18 (or under 16 in the EEA/UK). If you become aware that a minor has provided us with personal data, please contact us immediately, and we will permanently delete such information from all production systems.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">6. European & UK Data Protection (GDPR / UK-GDPR)</h2>
            <p>
              For users located within the European Economic Area (EEA), the United Kingdom, or Switzerland, processing of personal data is governed under Regulation (EU) 2016/679 (GDPR). Our lawful bases include Legitimate Interest (responding to inquiries, delivering architectural proposals) and Contractual Necessity (executing software development sprints).
            </p>
            <p>Under the GDPR, you maintain statutory rights to:</p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-400">
              <li><strong>Right of Access & Portability:</strong> Request confirmation and an export copy of all personal records.</li>
              <li><strong>Right to Rectification:</strong> Correct any inaccurate or incomplete details.</li>
              <li><strong>Right to Erasure ("Right to Be Forgotten"):</strong> Request immediate permanent purging of your records.</li>
              <li><strong>Right to Restrict or Object:</strong> Restrict processing or object to processing under legitimate interests.</li>
              <li><strong>Right to Lodge a Complaint:</strong> File a grievance with your local supervisory data protection authority.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">7. California Privacy Rights (CCPA / CPRA)</h2>
            <p>
              Under the California Consumer Privacy Act as amended by the California Privacy Rights Act (CPRA), California residents enjoy specific privacy disclosures:
            </p>
            <ul className="list-disc pl-6 space-y-1.5 text-slate-400">
              <li><strong>Right to Know & Access:</strong> The categories of personal information collected, sources, and commercial purposes.</li>
              <li><strong>Right to Delete:</strong> Deletion of collected personal information subject to legal audit retention exceptions.</li>
              <li><strong>No Sale or Sharing:</strong> <em>Makerly AI does not sell, rent, or share personal data or sensitive personal information with third parties for cross-context behavioral advertising.</em></li>
              <li><strong>Non-Discrimination:</strong> We will never discriminate against you, alter pricing, or degrade service quality for exercising your privacy rights.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-white">8. Exercising Your Global Privacy Rights</h2>
            <p>
              To exercise any statutory privacy rights under GDPR, CCPA, DPDP Act (India), or other global privacy regulations, submit your request to our Data Protection Officer at <a href="mailto:tousif@makerlyai.in" className="text-brand-400 underline">tousif@makerlyai.in</a> or <a href="mailto:support@makerlyai.in" className="text-brand-400 underline">support@makerlyai.in</a>. We verify and respond to all authenticated requests within 30 days without charge.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
