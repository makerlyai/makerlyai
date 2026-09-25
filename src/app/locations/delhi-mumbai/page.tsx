import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI & Custom Software Development for Mumbai, Delhi NCR & Hyderabad | MakerlyAI",
  description:
    "MakerlyAI builds enterprise SaaS, FinTech architectures, AI agents, and web applications for founders and corporate enterprises in Mumbai, Delhi, Gurgaon, Noida, Pune, and Hyderabad.",
  keywords: [
    "software company mumbai",
    "software development agency delhi ncr",
    "AI startup gurgaon",
    "SaaS developers noida",
    "IT companies pune",
    "tech startups hyderabad",
    "FinTech app development mumbai",
    "Tousif Raza Mumbai Delhi",
    "Makerly AI India",
  ],
  alternates: { canonical: "/locations/delhi-mumbai" },
  openGraph: {
    title: "AI & Custom Software Development for Mumbai, Delhi NCR & Hyderabad | MakerlyAI",
    description:
      "Enterprise SaaS and AI engineering for India's leading financial and industrial metros. 24-hour working preview.",
    url: "https://makerlyai.in/locations/delhi-mumbai",
  },
};

export default function DelhiMumbaiLocationPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12 selection:bg-brand-blue/30">
      <div className="max-w-5xl mx-auto">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 mb-6">
          <Link href="/" className="hover:text-brand-blue transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/locations" className="hover:text-brand-blue transition-colors">
            Locations
          </Link>
          <span>/</span>
          <span className="text-brand-blue font-semibold">Tier-1 Metros (Mumbai &amp; Delhi NCR)</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          Enterprise Grade Engineering • Mumbai • Delhi NCR • Hyderabad • Pune
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          SaaS &amp; AI Enterprise Engineering for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-blue-500">
            India&apos;s Mega Metros
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          From the financial institutions of <strong className="text-foreground">Bandra Kurla Complex (BKC) Mumbai</strong> to
          the high-growth venture corridors of <strong className="text-foreground">Cyber City Gurgaon and Noida</strong>,
          MakerlyAI architects mission-critical digital systems with an unmatched 24-hour working preview.
        </p>

        {/* Metros Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              metro: "Mumbai & Pune",
              desc: "FinTech dashboards, payment gateway aggregators, wealthtech portals, media streaming platforms, and manufacturing ERPs.",
              tags: "FinTech • High Security • Media Tech",
            },
            {
              metro: "Delhi NCR (Gurgaon & Noida)",
              desc: "Consumer tech marketplaces, D2C e-commerce stores, logistics tracking systems, and automated customer qualification agents.",
              tags: "D2C • Logistics • AI Agents",
            },
            {
              metro: "Hyderabad (Cyberabad & HITEC City)",
              desc: "Healthtech compliance platforms, biotechnology data visualization, cloud ERPs, and multi-tenant SaaS architectures.",
              tags: "HealthTech • Cloud SaaS • Enterprise",
            },
            {
              metro: "National Cross-Metro Delivery",
              desc: "Full intellectual property transfer, transparent INR pricing, GST invoicing, and ongoing 24/7 technical maintenance.",
              tags: "IP Transfer • GST Compliant • 24/7 SLA",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-blue/40 transition-all duration-300"
            >
              <div className="text-xs text-brand-blue font-bold tracking-widest uppercase mb-1">
                {item.tags}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.metro}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Scale Your Metro Venture With MakerlyAI
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Engineering excellence without corporate agency bloat. Delivered by founder Tousif Raza.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-blue/90 transition-all"
            >
              Request 24-Hour Preview &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
