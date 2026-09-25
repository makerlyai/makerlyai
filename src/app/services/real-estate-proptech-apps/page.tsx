import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Building2, CheckCircle2, ShieldCheck, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Real Estate & PropTech App Development Company | MakerlyAI",
  description:
    "Build custom real estate listing portals, broker CRM apps, virtual tour platforms, and tenant management software. High-performance PropTech solutions by MakerlyAI.",
  keywords: [
    "real estate app maker",
    "real estate app development company",
    "PropTech software development",
    "broker CRM app development",
    "custom property listing portal",
    "real estate software builders",
    "Makerly AI real estate",
  ],
  alternates: { canonical: "/services/real-estate-proptech-apps" },
};

export default function RealEstatePropTechPage() {
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
          <span className="text-brand-blue font-semibold">Real Estate &amp; PropTech</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <Building2 className="w-4 h-4 text-cyan-400" />
          <span>Interactive Property Portals • Agent CRMs • Verified Leads</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Custom Real Estate &amp; <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-emerald-400">
            PropTech App Development
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          Scale your real estate brokerage, construction venture, or property portfolio with bespoke software: interactive map searches, AI property valuation, WhatsApp lead distribution, and digital agreement workflows.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold text-white mb-3">Interactive Listing Search</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              Sub-second map-based property filters by price, BHK, amenities, and RERA approval status with high-res photo and video walkthroughs.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold text-white mb-3">Automated Broker &amp; Agent CRM</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              Lead capture from portals, instant WhatsApp lead assignment to sales reps, and scheduled property visit reminders.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold text-white mb-3">Tenant &amp; Maintenance Portal</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              Online rent collection, automated GST receipt issuance, and maintenance ticket dispatch.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold text-white mb-3">24-Hour Architecture Preview</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              See your working property portal prototype in 24 hours before signing milestone contracts.
            </p>
          </div>
        </div>

        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl">
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Build Your PropTech Venture with MakerlyAI
          </h2>
          <p className="text-foreground/70 max-w-md mx-auto mb-6 text-sm md:text-base">
            Get an interactive real estate portal preview delivered in 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-brand-blue/90 transition-all"
            >
              Request Real Estate Preview &rarr;
            </Link>
            <a
              href="https://wa.me/918102308736?text=Hi%20Tousif%2C%20I%20want%20to%20build%20a%20real%20estate%20app%20with%20MakerlyAI."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              Chat with Tousif on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
