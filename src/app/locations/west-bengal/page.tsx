import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Top AI & SaaS Software Agency for Kolkata & West Bengal | MakerlyAI",
  description:
    "MakerlyAI builds high-converting SaaS platforms, autonomous AI agents, and web applications for startups in Kolkata, Howrah, Asansol, Durgapur, and across West Bengal with a 24-hour working preview.",
  keywords: [
    "software startups in kolkata",
    "software company in kolkata",
    "IT companies in west bengal",
    "best tech startups kolkata",
    "app developers kolkata",
    "AI development agency kolkata",
    "software development asansol",
    "tech agency durgapur",
    "Tousif Raza Kolkata",
    "Makerly AI West Bengal",
  ],
  alternates: { canonical: "/locations/west-bengal" },
  openGraph: {
    title: "Top AI & SaaS Software Agency for Kolkata & West Bengal | MakerlyAI",
    description:
      "Engineering world-class SaaS, AI agents, and mobile applications for founders across Kolkata, Salt Lake Sector V, and West Bengal.",
    url: "https://makerlyai.in/locations/west-bengal",
  },
};

export default function WestBengalLocationPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12 selection:bg-brand-blue/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Software & AI Development for Kolkata & West Bengal",
            provider: {
              "@type": "Organization",
              name: "Makerly AI",
              url: "https://makerlyai.in",
            },
            areaServed: [
              { "@type": "City", name: "Kolkata" },
              { "@type": "City", name: "Howrah" },
              { "@type": "City", name: "Asansol" },
              { "@type": "City", name: "Durgapur" },
              { "@type": "City", name: "Siliguri" },
              { "@type": "AdministrativeArea", name: "West Bengal" },
            ],
            serviceType: "SaaS Engineering & Custom Software Agency",
          }),
        }}
      />

      <div className="max-w-5xl mx-auto">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 mb-6">
          <Link href="/" className="hover:text-brand-blue transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-brand-blue font-semibold">West Bengal &amp; Kolkata Hub</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          Silicon-Level Engineering for Kolkata, Salt Lake Sector V &amp; West Bengal
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          SaaS &amp; AI Software Agency Serving{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-blue-500">
            Kolkata &amp; West Bengal
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          From the IT corridors of <strong className="text-foreground">Salt Lake Sector V and New Town</strong> to
          the industrial hubs of <strong className="text-foreground">Asansol and Durgapur</strong>, MakerlyAI partners
          with ambitious founders to engineer scalable software platforms delivered with our signature{" "}
          <span className="text-brand-blue font-semibold">24-hour working preview</span>.
        </p>

        {/* Cities */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              city: "Kolkata (Salt Lake Sector V & New Town)",
              desc: "Building high-performance B2B SaaS, generative AI workflows, automated customer pipelines, and cross-platform apps.",
              tag: "Metro Tech Corridor",
            },
            {
              city: "Asansol & Durgapur",
              desc: "Serving heavy industry, logistics, healthcare, and retail distribution with custom ERP and automation systems.",
              tag: "Industrial Heartland",
            },
            {
              city: "Howrah",
              desc: "Engineering manufacturing automation, trading software, supply chain tracking, and GST/e-invoicing integrations.",
              tag: "Commercial Gateway",
            },
            {
              city: "Siliguri & North Bengal",
              desc: "Hospitality booking platforms, tea export logistics software, e-commerce applications, and regional fintech.",
              tag: "North Bengal Hub",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-blue/40 transition-all duration-300"
            >
              <span className="text-xs text-brand-blue font-bold tracking-widest uppercase mb-1 block">
                {item.tag}
              </span>
              <h3 className="text-xl font-bold text-white mb-2">{item.city}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Partner with MakerlyAI for Your Kolkata Tech Build
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Experience our 24-hour preview process. Review real working code and UI before committing capital.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-blue/90 transition-all"
            >
              Get Your 24-Hour Preview &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
