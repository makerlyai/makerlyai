import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Top AI & SaaS Engineering Agency for Bangalore Startups | MakerlyAI",
  description:
    "MakerlyAI builds ultra-fast SaaS MVPs, autonomous AI agents, and web applications for Bangalore tech startups, YC founders, and venture studios. 24-hour working preview delivery.",
  keywords: [
    "AI startup bangalore",
    "software development agency bangalore",
    "SaaS developers bangalore",
    "MVP development agency bangalore",
    "hire AI engineers bangalore",
    "Koramangala tech agency",
    "HSR layout software startup",
    "Indiranagar startup agency",
    "Tousif Raza Bangalore",
    "Makerly AI Bangalore",
  ],
  alternates: { canonical: "/locations/bangalore" },
  openGraph: {
    title: "Top AI & SaaS Engineering Agency for Bangalore Startups | MakerlyAI",
    description:
      "Rapid MVP engineering in 24 hours. Full-stack Next.js, AI agents, and cloud systems for Bangalore founders.",
    url: "https://makerlyai.in/locations/bangalore",
  },
};

export default function BangaloreLocationPage() {
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
          <span className="text-brand-blue font-semibold">Bangalore Tech Capital</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          Silicon Valley of India • 24-Hour Working MVP Delivery
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          AI &amp; SaaS Startup Engineering for{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-blue-500">
            Bangalore Founders
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          In Bangalore&apos;s hyper-competitive startup landscape, speed is the only moats that matter.
          MakerlyAI helps founders across <strong className="text-foreground">Koramangala, HSR Layout, Indiranagar, and Whitefield</strong>{" "}
          ship production-ready MVPs within 24 hours instead of burning months with traditional slow agencies.
        </p>

        {/* Startup Clusters */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "HSR Layout & Koramangala",
              desc: "Building seed-stage prototypes, investor demonstration MVPs, and rapid validation apps for early-stage founders.",
            },
            {
              title: "Indiranagar & CBD",
              desc: "Engineering custom AI autonomous agents, LLM copilot workflows, and high-conversion B2B SaaS portals.",
            },
            {
              title: "Whitefield & Outer Ring Road",
              desc: "Enterprise microservices, high-throughput cloud infrastructure, and custom internal automation platforms.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-blue/40 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Build Your Bangalore Startup with MakerlyAI
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Pay ₹0 if your 24-hour working preview doesn&apos;t meet your standards.
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
