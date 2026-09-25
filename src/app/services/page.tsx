import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Software & AI Solutions Hub | MakerlyAI — Apps, Agents, SaaS & Custom Systems",
  description:
    "Explore MakerlyAI's full suite of software development services: AI receptionists, autonomous AI agents, food delivery apps, travel booking engines, custom web & mobile apps, and rapid 24h SaaS MVPs.",
  keywords: [
    "Makerly AI services",
    "software development agency",
    "AI receptionist",
    "AI agent development",
    "food app maker",
    "travel agency app maker",
    "custom web app development",
    "mobile app development company",
    "SaaS MVP development",
    "Tousif Raza services",
  ],
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Software & AI Solutions Hub | MakerlyAI",
    description:
      "From autonomous AI receptionists and WhatsApp bots to custom food and travel apps. 24-hour working preview delivered.",
    url: "https://makerlyai.in/services",
  },
};

const serviceOfferings = [
  {
    title: "AI Receptionists & Voice Agents",
    slug: "/services/ai-receptionist-voice-agents",
    badge: "Voice AI & Telephony",
    desc: "24/7 realistic phone receptionists that answer calls, schedule patient/client appointments in your CRM, and handle customer service with zero hold time.",
  },
  {
    title: "Autonomous AI Agents & Automation",
    slug: "/services/ai-agents-automation",
    badge: "LLM Workflows & Bots",
    desc: "Autonomous sales agents, automated WhatsApp intake bots, document OCR parsers, and custom multi-agent copilots for high-growth operations.",
  },
  {
    title: "Food Delivery & Restaurant App Maker",
    slug: "/services/food-delivery-restaurant-apps",
    badge: "3-Sided Food Platform",
    desc: "Custom food delivery applications with 0% commissions. Complete customer ordering app, kitchen merchant POS, and live GPS rider tracking.",
  },
  {
    title: "Travel Agency App Maker & Booking Software",
    slug: "/services/travel-tourism-booking-apps",
    badge: "Tourism & Bookings",
    desc: "Dynamic holiday package builders, hotel and flight booking engines, automated PDF itineraries, and travel lead management CRMs.",
  },
  {
    title: "Custom Web & Mobile App Development",
    slug: "/services/custom-web-and-mobile-apps",
    badge: "Full-Stack & Native Apps",
    desc: "Next.js web platforms and React Native iOS/Android apps built with fluid 60fps animations, sub-second load times, and secure cloud databases.",
  },
  {
    title: "SaaS MVP Development in 24 Hours",
    slug: "/build-saas-india",
    badge: "Rapid Prototyping",
    desc: "From concept to working, interactive preview within 24 hours. Validate demand with investors and real customers with zero financial risk.",
  },
];

export default function ServicesHubPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12 selection:bg-brand-blue/30">
      <div className="max-w-6xl mx-auto">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 mb-6">
          <Link href="/" className="hover:text-brand-blue transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-brand-blue font-semibold">Solutions &amp; Software Hub</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          End-to-End Software Engineering • From AI Agents to Enterprise Platforms
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Full-Stack Software, AI &amp; <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-blue-500">
            Application Development
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-16 max-w-3xl font-light">
          Whether you need an intelligent <strong className="text-foreground">AI receptionist</strong> answering calls,
          a complete <strong className="text-foreground">food delivery marketplace</strong>, a{" "}
          <strong className="text-foreground">travel booking engine</strong>, or a custom SaaS platform, MakerlyAI delivers
          working software in <span className="text-brand-blue font-semibold">24 hours</span>.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {serviceOfferings.map((s, idx) => (
            <Link
              key={idx}
              href={s.slug}
              className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-blue/50 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-3 block">
                  {s.badge}
                </span>
                <h2 className="text-xl font-bold text-white mb-2 group-hover:text-brand-blue transition-colors">
                  {s.title}
                </h2>
                <p className="text-foreground/70 text-sm leading-relaxed mb-6">{s.desc}</p>
              </div>

              <div className="text-xs font-semibold text-brand-blue flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>View Full Specifications &rarr;</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Global Locations Interlink Banner */}
        <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Available Locally &amp; Globally</h3>
            <p className="text-foreground/70 text-sm md:text-base max-w-xl">
              We deploy custom software across Jamshedpur HQ, Ranchi, Patna, Kolkata, Bangalore, Mumbai, Delhi, USA, UK, and Dubai.
            </p>
          </div>
          <Link
            href="/locations"
            className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all shrink-0"
          >
            Explore Worldwide Hubs &rarr;
          </Link>
        </div>

        {/* Bottom CTA */}
        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Have a Specific Software Requirement?
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Tell us what you want to build. We will engineer an interactive 24-hour working preview. Pay $0 / ₹0 if not satisfied.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-blue/90 transition-all"
            >
              Get Your 24-Hour Preview &rarr;
            </Link>
            <Link
              href="/founder/tousif-raza"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
            >
              Meet Architect Tousif Raza
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
