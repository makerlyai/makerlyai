import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI & SaaS Software Development Agency for Dubai & UAE Startups | MakerlyAI",
  description:
    "MakerlyAI engineers enterprise SaaS, PropTech, autonomous AI agents, and luxury mobile applications for founders and corporate groups across Dubai, Abu Dhabi, and the GCC region. 24-hour working preview.",
  keywords: [
    "software development agency dubai",
    "AI startup dubai",
    "SaaS developers UAE",
    "PropTech software development dubai",
    "app developers abu dhabi",
    "hire AI developers GCC",
    "Tousif Raza Dubai UAE",
    "Makerly AI Dubai",
  ],
  alternates: { canonical: "/locations/dubai-uae" },
  openGraph: {
    title: "AI & SaaS Software Development Agency for Dubai & UAE Startups | MakerlyAI",
    description:
      "Elite AI and SaaS engineering for UAE and GCC startups. 24-hour preview delivery.",
    url: "https://makerlyai.in/locations/dubai-uae",
  },
};

export default function DubaiUAELocationPage() {
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
          <span className="text-brand-blue font-semibold">Dubai &amp; UAE</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          GCC &amp; Middle East Tech Gateway • 24-Hour Preview Guarantee
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          AI &amp; SaaS Engineering for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-blue-500">
            Dubai &amp; GCC Startups
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          The UAE is setting the global standard for AI adoption and technological innovation.
          MakerlyAI empowers enterprises and venture founders across <strong className="text-foreground">Dubai Internet City, DIFC, and Abu Dhabi</strong>{" "}
          with bespoke SaaS platforms and autonomous agents delivered with our 24-hour functional preview.
        </p>

        {/* GCC Offerings */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              title: "PropTech & Real Estate Portals",
              desc: "High-load property listing engines, 3D interactive floor plans, automated tenant onboarding, and WhatsApp booking agents.",
              tag: "Real Estate Tech",
            },
            {
              title: "Luxury & D2C E-Commerce",
              desc: "Ultra-fast headless Shopify and Next.js commerce architectures with multi-currency (AED, SAR, USD) and local gateway integrations.",
              tag: "Luxury Commerce",
            },
            {
              title: "Autonomous AI Support & Sales Agents",
              desc: "Bilingual (Arabic & English) conversational AI agents handling VIP customer qualification, lead intake, and CRM updates.",
              tag: "Bilingual AI Agents",
            },
            {
              title: "Enterprise Government & Corporate Portals",
              desc: "Role-based access control, SOC2-ready architecture, encrypted cloud data pipelines, and internal ERP dashboards.",
              tag: "Enterprise Compliance",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-blue/40 transition-all duration-300"
            >
              <div className="text-xs text-brand-blue font-bold tracking-widest uppercase mb-1">
                {item.tag}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Build Your UAE Tech Venture With MakerlyAI
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Rapid prototyping in 24 hours. Connect with founder Tousif Raza today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-blue/90 transition-all"
            >
              Schedule a Consultation &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
