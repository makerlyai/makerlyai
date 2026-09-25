import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI & SaaS Software Engineering for US Founders | MakerlyAI Silicon Valley Hub",
  description:
    "MakerlyAI builds high-velocity SaaS MVPs, autonomous AI agents, and custom web applications for founders in Silicon Valley, San Francisco, New York, Austin, and Miami. 24-hour working preview. Pay $0 if not satisfied.",
  keywords: [
    "hire AI developers USA",
    "SaaS development company US",
    "Silicon Valley MVP development",
    "NYC startup agency",
    "Austin AI app developers",
    "YC MVP development 24 hours",
    "custom software development USA",
    "Tousif Raza US clients",
    "Makerly AI USA",
  ],
  alternates: { canonical: "/locations/usa-silicon-valley" },
  openGraph: {
    title: "AI & SaaS Software Engineering for US Founders | MakerlyAI",
    description:
      "24-Hour working preview. Silicon-Valley tier Next.js, AI agents, and full-stack engineering for US startups.",
    url: "https://makerlyai.in/locations/usa-silicon-valley",
  },
};

export default function USASiliconValleyPage() {
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
          <span className="text-brand-blue font-semibold">United States</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          PST &amp; EST Aligned • 24-Hour Functional MVP Guarantee
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Elite Software &amp; AI Engineering for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-blue-500">
            US Tech Founders
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          Stop burning $50,000+ on sluggish domestic agencies or untested freelancers.
          MakerlyAI partners with US founders across <strong className="text-foreground">San Francisco, New York, Austin, and Miami</strong>{" "}
          to build and deploy high-converting SaaS MVPs within 24 hours. If it doesn&apos;t match your vision, you pay <span className="text-brand-blue font-semibold">$0</span>.
        </p>

        {/* US Hubs */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              city: "Silicon Valley & San Francisco (Bay Area)",
              desc: "Building rapid prototypes for Y-Combinator, Techstars, and venture-backed founders who need to demonstrate working traction immediately.",
              badge: "Venture & YC MVPs",
            },
            {
              city: "New York City (Silicon Alley)",
              desc: "FinTech compliance, enterprise B2B SaaS, and automated legal/financial workflows with Stripe billing and enterprise SSO.",
              badge: "FinTech & Enterprise",
            },
            {
              city: "Austin & Miami (Emerging Tech Capitals)",
              desc: "Consumer applications, Web3 integrations, creator economy SaaS, and high-conversion mobile apps.",
              badge: "Consumer & Creator Tech",
            },
            {
              city: "Timezone Friendly & Transparent USD Contracts",
              desc: "Direct daily async Loom updates, Slack connect channels, and complete intellectual property assignment.",
              badge: "Full IP Transfer",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-blue/40 transition-all duration-300"
            >
              <div className="text-xs text-brand-blue font-bold tracking-widest uppercase mb-1">
                {item.badge}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.city}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Launch Your US Startup in 24 Hours
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Review real working code and an interactive prototype before making any financial commitment.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-blue/90 transition-all"
            >
              Get Your 24-Hour Preview ($0 Risk) &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
