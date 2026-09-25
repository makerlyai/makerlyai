import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Top Software & AI Startups in Jharkhand | MakerlyAI Hub",
  description:
    "Looking for the top software startup in Jharkhand? MakerlyAI builds world-class SaaS, AI applications, and mobile apps across Ranchi, Jamshedpur, Dhanbad, and Bokaro with a 24-hour working preview.",
  keywords: [
    "startups in jharkhand",
    "software startup anywhere in jharkhand",
    "software startups in ranchi",
    "top IT startups dhanbad",
    "software development bokaro",
    "IT companies in jharkhand",
    "tech startups ranchi",
    "web development jharkhand",
    "Tousif Raza Jharkhand",
    "Makerly AI Jharkhand",
  ],
  alternates: { canonical: "/locations/jharkhand" },
  openGraph: {
    title: "Top Software & AI Startups in Jharkhand | MakerlyAI Hub",
    description:
      "Jharkhand's premier software & AI agency. Serving Ranchi, Jamshedpur, Dhanbad, and Bokaro.",
    url: "https://makerlyai.in/locations/jharkhand",
  },
};

const districts = [
  {
    name: "Jamshedpur (East Singhbhum)",
    desc: "Headquarters of MakerlyAI. The industrial powerhouse driving manufacturing tech, AI automation, and high-growth SaaS startups.",
    tag: "Headquarters",
    href: "/locations/jamshedpur",
  },
  {
    name: "Ranchi (State Capital)",
    desc: "Capital tech ecosystem. We engineer enterprise software, government portals, edtech platforms, and AI assistants for Ranchi organizations.",
    tag: "Capital Tech Hub",
    href: "/locations/jharkhand",
  },
  {
    name: "Dhanbad (Coal Capital)",
    desc: "Building logistics ERPs, safety monitoring software, mining tech platforms, and modern B2B SaaS for Dhanbad companies.",
    tag: "Mining & Industrial Tech",
    href: "/locations/jharkhand",
  },
  {
    name: "Bokaro Steel City",
    desc: "Home ground of founder Tousif Raza (@thebokaroguy). Engineering high-speed applications, CRM pipelines, and digital infrastructure.",
    tag: "Founder Roots",
    href: "/locations/jharkhand",
  },
  {
    name: "Deoghar & Hazaribagh",
    desc: "Expanding regional digital transformation: hospitality booking engines, healthtech clinics, and local e-commerce infrastructure.",
    tag: "Emerging Tech Hubs",
    href: "/locations/jharkhand",
  },
];

export default function JharkhandLocationPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12 selection:bg-brand-blue/30">
      {/* Schema: Service & AdministrativeArea */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Software & AI Development Across Jharkhand",
            provider: {
              "@type": "Organization",
              name: "Makerly AI",
              url: "https://makerlyai.in",
            },
            areaServed: [
              { "@type": "City", name: "Jamshedpur" },
              { "@type": "City", name: "Ranchi" },
              { "@type": "City", name: "Dhanbad" },
              { "@type": "City", name: "Bokaro Steel City" },
              { "@type": "City", name: "Deoghar" },
              { "@type": "City", name: "Hazaribagh" },
              { "@type": "AdministrativeArea", name: "Jharkhand" },
            ],
            serviceType: "Software Engineering & Startup Incubation",
          }),
        }}
      />

      <div className="max-w-5xl mx-auto">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 mb-6">
          <Link href="/" className="hover:text-brand-blue transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-brand-blue font-semibold">Jharkhand Tech Hub</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          Empowering Founders Across All 24 Districts of Jharkhand
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Software &amp; AI Startup Infrastructure Across{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-blue-500">
            Jharkhand
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          Whether you are in <strong className="text-foreground">Ranchi, Jamshedpur, Dhanbad, or Bokaro</strong>,
          MakerlyAI brings premier engineering firepower directly to your startup. We deliver working
          previews in 24 hours with zero upfront risk.
        </p>

        {/* District Matrix */}
        <section className="mb-20">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Key District Tech Ecosystems We Serve
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {districts.map((d, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-blue/40 transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs uppercase tracking-widest font-bold text-brand-blue">
                    {d.tag}
                  </span>
                  <Link
                    href={d.href}
                    className="text-xs text-foreground/50 hover:text-white transition-colors"
                  >
                    Explore &rarr;
                  </Link>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{d.name}</h3>
                <p className="text-foreground/70 text-sm md:text-base leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Why Jharkhand Founders Choose MakerlyAI */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 mb-20">
          <h2 className="text-3xl font-bold mb-6">
            Why Jharkhand Founders Build with MakerlyAI
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Local Trust & Direct Access",
                desc: "Meet and coordinate directly with founder Tousif Raza in IST hours. No offshore miscommunication or agency bureaucracy.",
              },
              {
                title: "24-Hour Functional MVP",
                desc: "We build fast. You see a real, working prototype before spending money. Prove your idea to investors within 48 hours.",
              },
              {
                title: "Full-Stack Mastery",
                desc: "From Next.js and AI LLM integrations to Indian payment systems (UPI/Razorpay) and scalable PostgreSQL databases.",
              },
            ].map((col, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="text-lg font-bold text-brand-blue">{col.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{col.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center rounded-3xl border border-brand-blue/30 bg-gradient-to-br from-brand-blue/10 via-white/[0.02] to-transparent p-10 md:p-14">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Building a Software Startup Anywhere in Jharkhand?
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Let&apos;s build your product together. Request a working preview in 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-blue/90 transition-all"
            >
              Start Your Build Today &rarr;
            </Link>
            <Link
              href="/locations/jamshedpur"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
            >
              Visit Jamshedpur HQ Page
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
