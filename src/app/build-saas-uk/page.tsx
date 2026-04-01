import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Build SaaS in the UK | MakerlyAI — AI-Powered Software Development",
  description:
    "Build your SaaS platform in the United Kingdom with MakerlyAI. Working preview in 24 hours. Custom software, AI agents, web & mobile apps for UK startups and businesses.",
  alternates: { canonical: "/build-saas-uk" },
  openGraph: {
    title: "Build SaaS in the UK | MakerlyAI",
    description:
      "Working preview in 24 hours. Pay £0 if not satisfied. Premium SaaS development for UK businesses.",
    url: "https://makerlyai.in/build-saas-uk",
  },
};

export default function BuildSaaSUK() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <p className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-semibold tracking-widest text-brand-blue mb-6 uppercase">
          United Kingdom
        </p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
          Build Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-300">
            SaaS Platform
          </span>{" "}
          in the UK
        </h1>
        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-12 max-w-3xl">
          MakerlyAI partners with UK-based startups, agencies, and enterprises to ship production-grade software
          at unprecedented speed. Get a real, working preview of your product within 24 hours — pay nothing if
          it doesn&apos;t meet your standards.
        </p>

        <section className="space-y-10 mb-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why UK Businesses Choose MakerlyAI</h2>
            <ul className="space-y-3 text-foreground/70 list-disc list-inside text-base md:text-lg">
              <li>24-hour turnaround on working previews — faster than any London agency</li>
              <li>Zero-risk: pay only if the preview exceeds your expectations</li>
              <li>Full-stack mastery: Next.js, React, Node.js, Python, AI/ML pipelines</li>
              <li>UK/GMT timezone-aligned communication</li>
              <li>GDPR-compliant architecture and data handling practices</li>
              <li>Trusted by founders from London, Manchester, Edinburgh, and beyond</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">What We Build for UK Businesses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["B2B SaaS Platforms","AI Chatbots & Agents","FinTech Applications","EdTech Platforms","E-Commerce Solutions","Healthcare & MedTech Tools","Internal Business Dashboards","Mobile Apps (iOS & Android)"].map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm md:text-base font-medium">{item}</div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Is MakerlyAI based in the UK?", a: "We serve clients globally including the UK, with timezone-friendly communication and processes aligned to BST/GMT working hours." },
                { q: "Do you comply with GDPR?", a: "Yes. All applications we build follow GDPR best practices for data handling, storage, and user consent." },
                { q: "What's the pricing in GBP?", a: "We provide transparent quotes in your preferred currency (£/$/€) after you review your 24-hour preview." },
                { q: "Can you build FinTech-compliant applications?", a: "Yes. We have experience building applications that meet PSD2, FCA, and Open Banking compliance requirements." },
              ].map((faq) => (
                <div key={faq.q}>
                  <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                  <p className="text-foreground/70 text-base">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/#contact" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-brand-blue text-white font-bold text-base hover:bg-brand-blue/90 transition-colors">Start Your Project</Link>
          <Link href="/" className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/20 bg-white/5 font-bold text-base hover:bg-white/10 transition-colors">Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
