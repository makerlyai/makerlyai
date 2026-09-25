import type { Metadata } from "next";
import Link from "next/link";
import { Rocket, CheckCircle2, ShieldCheck, Clock, MessageCircle, Code2, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Startup MVP Development in 24 Hours | MakerlyAI",
  description:
    "Turn your startup idea into a production-grade working MVP in 24 hours. Full-stack Next.js, AI integrations, payment gateways, and scalable cloud database engineered by Tousif Raza & MakerlyAI.",
  keywords: [
    "startup MVP development",
    "build MVP in 24 hours",
    "MVP developer for hire",
    "startup software agency",
    "rapid MVP development company",
    "SaaS MVP builder",
    "Tousif Raza MVP",
    "Makerly AI MVP",
  ],
  alternates: { canonical: "/services/mvp-development-for-startups" },
};

export default function MvpDevelopmentPage() {
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
          <span className="text-brand-blue font-semibold">Startup MVP in 24 Hours</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>Idea to Interactive Prototype in 24 Hours • Zero Risk</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Rapid Startup MVP <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-emerald-400">
            Development Studio
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          Stop waiting 6 months and burning seed capital with slow agencies. MakerlyAI turns your product requirements into a production-grade working preview in 24 hours. Test with users, pitch to investors, and launch fast.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold text-white mb-3">24-Hour Functional Preview</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              See real interactive code, responsive UI, database schemas, and live auth flows in 24 hours.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold text-white mb-3">Modern Silicon-Valley Tech Stack</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              Engineered with Next.js 15, React 19, TypeScript, Tailwind CSS, Supabase / Neon PostgreSQL, and Cloudflare CDN.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold text-white mb-3">Built-in AI &amp; Payment Rails</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              LLM integrations (OpenAI, Anthropic, Sarvam AI), automated voice agents, and one-click Stripe / Razorpay checkouts.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold text-white mb-3">100% Full Source Code Ownership</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              Zero vendor lock-in. Clean, modular, well-documented GitHub repository with complete deployment pipelines.
            </p>
          </div>
        </div>

        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl">
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Ready to Launch Your MVP?
          </h2>
          <p className="text-foreground/70 max-w-md mx-auto mb-6 text-sm md:text-base">
            Get your interactive prototype preview engineered and delivered in 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-brand-blue/90 transition-all"
            >
              Get Your 24-Hour Preview &rarr;
            </Link>
            <a
              href="https://wa.me/918102308736?text=Hi%20Tousif%2C%20I%20have%20a%20startup%20MVP%20I%20want%20to%20build%20with%20MakerlyAI."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
