import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Top Software & AI Startup Serving Patna & Bihar | MakerlyAI",
  description:
    "Looking for high-impact software development and AI startups in Patna or Bihar? MakerlyAI engineers custom SaaS, AI agents, mobile apps, and enterprise web systems with a 24-hour working preview.",
  keywords: [
    "startups in patna",
    "software company in bihar",
    "software startups patna",
    "app developers gaya",
    "web development company patna",
    "IT companies in bihar",
    "AI startup patna",
    "custom software bihar",
    "Tousif Raza Bihar",
    "Makerly AI Patna",
  ],
  alternates: { canonical: "/locations/bihar" },
  openGraph: {
    title: "Top Software & AI Startup Serving Patna & Bihar | MakerlyAI",
    description:
      "Engineering world-class SaaS, AI agents, and mobile applications for startups and enterprises across Patna, Gaya, and Bihar.",
    url: "https://makerlyai.in/locations/bihar",
  },
};

export default function BiharLocationPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12 selection:bg-brand-blue/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Software & AI Development Services for Patna and Bihar",
            provider: {
              "@type": "Organization",
              name: "Makerly AI",
              url: "https://makerlyai.in",
            },
            areaServed: [
              { "@type": "City", name: "Patna" },
              { "@type": "City", name: "Gaya" },
              { "@type": "City", name: "Muzaffarpur" },
              { "@type": "City", name: "Bhagalpur" },
              { "@type": "AdministrativeArea", name: "Bihar" },
            ],
            serviceType: "SaaS Development & AI Automation",
          }),
        }}
      />

      <div className="max-w-5xl mx-auto">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 mb-6">
          <Link href="/" className="hover:text-brand-blue transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-brand-blue font-semibold">Bihar &amp; Patna Hub</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          Accelerating Digital Innovation in Patna, Gaya &amp; Across Bihar
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Software &amp; AI Startup Development for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-blue-500">
            Patna &amp; Bihar
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          Bihar is experiencing an unprecedented surge of entrepreneurial talent. MakerlyAI provides
          founders in <strong className="text-foreground">Patna, Gaya, Muzaffarpur, and Bhagalpur</strong> with
          top-tier engineering: from AI-powered apps to scalable SaaS platforms with a{" "}
          <span className="text-brand-blue font-semibold">24-hour working preview</span>.
        </p>

        {/* Cities in Bihar */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              city: "Patna (State Capital)",
              desc: "Building EdTech platforms, FinTech aggregators, government portal integrations, and B2B SaaS for Patna startups.",
              services: "SaaS • AI Chatbots • Web Apps",
            },
            {
              city: "Gaya (Spiritual & Heritage Hub)",
              desc: "Hospitality booking engines, tourism platforms, local commerce automation, and logistics tracking systems.",
              services: "Booking Engines • Mobile Apps • CRM",
            },
            {
              city: "Muzaffarpur (Commercial Hub of North Bihar)",
              desc: "Agri-tech supply chain solutions, inventory management software, wholesale distribution portals.",
              services: "Supply Chain ERP • Custom Portals",
            },
            {
              city: "Bhagalpur (Silk City & Eastern Gateway)",
              desc: "Textile e-commerce platforms, export management software, regional marketplace applications.",
              services: "E-Commerce • B2B Marketplace",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-blue/40 transition-all duration-300"
            >
              <div className="text-xs text-brand-blue font-bold tracking-widest uppercase mb-1">
                {item.services}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.city}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Launch Your Bihar Startup with MakerlyAI
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg">
            No expensive retainers, no months of waiting. Get a working interactive preview in 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-blue/90 transition-all"
            >
              Claim Your 24-Hour Preview &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
