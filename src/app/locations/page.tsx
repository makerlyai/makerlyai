import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Global & Regional Locations Hub | MakerlyAI — Worldwide Software Engineering",
  description:
    "Explore MakerlyAI's software development locations across Jamshedpur HQ, Jharkhand, Bihar, Kolkata, Bangalore, Mumbai, Delhi, USA, UK, and Dubai. 24-hour working preview delivered worldwide.",
  keywords: [
    "Makerly AI locations",
    "software startups jamshedpur",
    "software company ranchi jharkhand",
    "tech startup patna bihar",
    "software development kolkata",
    "AI startup bangalore",
    "SaaS development company mumbai delhi",
    "hire AI developers USA UK Dubai",
    "Tousif Raza locations",
  ],
  alternates: { canonical: "/locations" },
  openGraph: {
    title: "Global & Regional Locations Hub | MakerlyAI",
    description:
      "Engineering software and AI startups worldwide. From Jamshedpur HQ across India, the US, UK, and UAE.",
    url: "https://makerlyai.in/locations",
  },
};

const locationGroups = [
  {
    region: "Eastern India (Headquarters & Regional Powerhouses)",
    badge: "HQ & Regional Hub",
    locations: [
      {
        name: "Jamshedpur HQ (Jharkhand)",
        slug: "/locations/jamshedpur",
        focus: "Headquarters & Core Engineering Studio. Full-stack SaaS, industrial AI, local business digitalization.",
        tag: "Global HQ",
      },
      {
        name: "Jharkhand (Ranchi, Dhanbad, Bokaro)",
        slug: "/locations/jharkhand",
        focus: "Statewide digital infrastructure serving capital Ranchi, industrial Dhanbad, and founder roots in Bokaro.",
        tag: "Statewide Hub",
      },
      {
        name: "Patna & Bihar (Gaya, Muzaffarpur)",
        slug: "/locations/bihar",
        focus: "Rapidly expanding entrepreneurial hub. EdTech, FinTech, and B2B SaaS for Bihar founders.",
        tag: "High Growth",
      },
      {
        name: "Kolkata & West Bengal (Salt Lake, Asansol)",
        slug: "/locations/west-bengal",
        focus: "Serving Salt Lake Sector V, New Town, Howrah, and Asansol with Silicon-tier software development.",
        tag: "Metro Hub",
      },
    ],
  },
  {
    region: "Pan-India Tech Capitals",
    badge: "National Tier-1 Corridors",
    locations: [
      {
        name: "Bangalore (Silicon Valley of India)",
        slug: "/locations/bangalore",
        focus: "High-velocity MVP engineering for seed and Series A startups, YC applicants, and venture studios.",
        tag: "Startup Capital",
      },
      {
        name: "Mumbai & Delhi NCR (Gurgaon / Noida / Pune)",
        slug: "/locations/delhi-mumbai",
        focus: "Enterprise automation, FinTech compliance, D2C e-commerce systems, and high-conversion SaaS.",
        tag: "Financial Corridors",
      },
      {
        name: "India-Wide SaaS & App Delivery",
        slug: "/build-saas-india",
        focus: "Full-scale custom software development for any state across India. UPI & GST compliant.",
        tag: "All-India",
      },
    ],
  },
  {
    region: "International & Worldwide Reach",
    badge: "Global Client Base",
    locations: [
      {
        name: "United States (Silicon Valley, NYC, Austin)",
        slug: "/locations/usa-silicon-valley",
        focus: "High-speed MVP building for US founders. 24-hour delivery, PST/EST timezone alignment.",
        tag: "US Flagship",
      },
      {
        name: "United Kingdom (London & Europe)",
        slug: "/build-saas-uk",
        focus: "FinTech, AI agent workflows, and GDPR-compliant cloud applications for UK & European enterprises.",
        tag: "UK Hub",
      },
      {
        name: "Dubai & Middle East (GCC Hub)",
        slug: "/locations/dubai-uae",
        focus: "PropTech, luxury commerce, autonomous AI customer agents for UAE and Gulf enterprises.",
        tag: "Middle East",
      },
      {
        name: "Worldwide AI Development Services",
        slug: "/ai-development-services-global",
        focus: "Serving founders and enterprises across all continents with 24-hour turnaround guarantees.",
        tag: "Global Delivery",
      },
    ],
  },
];

export default function LocationsHubPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12 selection:bg-brand-blue/30">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 mb-6">
          <Link href="/" className="hover:text-brand-blue transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-brand-blue font-semibold">Worldwide Locations</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          Operating Globally • Headquartered in Jamshedpur, Jharkhand
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Engineered in Jamshedpur. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-blue-500">
            Deployed Worldwide.
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-16 max-w-3xl font-light">
          MakerlyAI breaks down geographic boundaries. Led by architect{" "}
          <strong className="text-foreground font-semibold">Tousif Raza</strong>, we provide high-velocity
          software and AI engineering to ambitious founders whether they are in{" "}
          <span className="text-brand-blue font-semibold">Jamshedpur, Bangalore, London, or San Francisco</span>.
        </p>

        {/* Location Clusters */}
        <div className="space-y-16 mb-20">
          {locationGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h2 className="text-2xl md:text-3xl font-bold text-white">{group.region}</h2>
                <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 bg-white/5 text-foreground/60 font-mono">
                  {group.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {group.locations.map((loc, lIdx) => (
                  <Link
                    key={lIdx}
                    href={loc.slug}
                    className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-blue/50 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand-blue">
                          {loc.tag}
                        </span>
                        <span className="text-xs text-foreground/40 group-hover:text-white transition-colors">
                          View &rarr;
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-brand-blue transition-colors">
                        {loc.name}
                      </h3>
                      <p className="text-foreground/70 text-sm leading-relaxed mb-4">{loc.focus}</p>
                    </div>

                    <div className="text-xs font-semibold text-brand-blue flex items-center gap-1">
                      <span>Explore Regional Infrastructure</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Hub CTA */}
        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Build Your Software Venture With Us Anywhere On Earth
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg">
            24-hour turnaround for working prototypes. Direct communication with senior engineering leadership.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-blue/90 transition-all"
            >
              Start Your Project &rarr;
            </Link>
            <Link
              href="/founder/tousif-raza"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
            >
              Meet Founder Tousif Raza
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
