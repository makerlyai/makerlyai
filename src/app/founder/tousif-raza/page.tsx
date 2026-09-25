import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Tousif Raza | Founder & Chief Software Architect at MakerlyAI",
  description:
    "Official profile of Tousif Raza (@thebokaroguy) — Founder & Chief Software Architect at MakerlyAI. Full-stack system engineer, AI practitioner, and tech leader based in Jamshedpur, Jharkhand.",
  keywords: [
    "Tousif Raza",
    "Tousif Raza founder",
    "thebokaroguy",
    "Tousif Raza Makerly AI",
    "Tousif Raza Jamshedpur",
    "Tousif Raza Jharkhand",
    "Tousif Raza software engineer",
    "Tousif Raza architect",
  ],
  alternates: { canonical: "/founder/tousif-raza" },
  openGraph: {
    title: "Tousif Raza | Founder & Chief Software Architect at MakerlyAI",
    description:
      "Full-stack system architect, AI practitioner, and founder of MakerlyAI. Building the future of SaaS and automated systems from Jamshedpur, Jharkhand.",
    url: "https://makerlyai.in/founder/tousif-raza",
    images: [
      {
        url: "/founder/tousif-main.jpeg",
        width: 800,
        height: 1000,
        alt: "Tousif Raza — Founder of MakerlyAI",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@thebokaroguy",
    title: "Tousif Raza | Founder & Chief Software Architect",
    description:
      "Founder of MakerlyAI. Full-stack engineer & AI architect based in Jamshedpur, Jharkhand.",
    images: ["/founder/tousif-main.jpeg"],
  },
};

export default function FounderTousifRazaPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12 selection:bg-brand-blue/30">
      {/* Schema: ProfilePage & Canonical Person Entity */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            mainEntity: {
              "@type": "Person",
              "@id": "https://makerlyai.in/#tousif-raza",
              name: "Tousif Raza",
              givenName: "Tousif",
              familyName: "Raza",
              alternateName: [
                "thebokaroguy",
                "Tousif Raza Makerly AI",
                "Tousif Raza Architect",
              ],
              jobTitle: "Founder & Chief Software Architect",
              description:
                "Tousif Raza is a full-stack system architect and tech entrepreneur. He is the Founder of MakerlyAI, an AI app and SaaS engineering agency headquartered in Jamshedpur, Jharkhand.",
              image: "https://makerlyai.in/founder/tousif-main.jpeg",
              url: "https://makerlyai.in/founder/tousif-raza",
              worksFor: {
                "@type": "Organization",
                "@id": "https://makerlyai.in/#organization",
                name: "Makerly AI",
                url: "https://makerlyai.in",
              },
              homeLocation: {
                "@type": "Place",
                name: "Jamshedpur, Jharkhand, India",
              },
              knowsAbout: [
                "System Architecture",
                "Full-Stack Web Development",
                "Artificial Intelligence",
                "SaaS Engineering",
                "Next.js & React Ecosystem",
                "TypeScript",
                "Cloud Systems & High-Availability Infrastructure",
              ],
              sameAs: [
                "https://linkedin.com/in/tousifraza",
                "https://x.com/thebokaroguy",
                "https://instagram.com/thebokaroguy",
                "https://github.com/makerlyai",
              ],
            },
          }),
        }}
      />

      <div className="max-w-4xl mx-auto">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 mb-6">
          <Link href="/" className="hover:text-brand-blue transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-brand-blue font-semibold">Leadership</span>
          <span>/</span>
          <span className="text-foreground">Tousif Raza</span>
        </nav>

        {/* Bio Header Card */}
        <div className="flex flex-col md:flex-row gap-8 items-center rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 mb-12 backdrop-blur-xl">
          <div className="w-48 h-60 md:w-56 md:h-72 shrink-0 rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
            <img
              src="/founder/tousif-main.jpeg"
              alt="Tousif Raza — Founder & Chief Software Architect at MakerlyAI"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-xs font-semibold tracking-wider text-brand-blue uppercase">
              Founder &amp; Chief Software Architect
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white">
              Tousif Raza
            </h1>
            <p className="text-brand-blue font-mono text-sm">
              @thebokaroguy • Jamshedpur &amp; Bokaro, Jharkhand, India
            </p>
            <p className="text-foreground/80 text-base md:text-lg leading-relaxed font-light">
              Full-stack system architect and entrepreneur. Dedicated to engineering high-performance
              SaaS architectures, intelligent AI agents, and frictionless web systems for founders worldwide.
            </p>

            {/* Social Handles */}
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              <a
                href="https://linkedin.com/in/tousifraza"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs md:text-sm font-medium text-white hover:border-brand-blue/50 hover:bg-brand-blue/10 transition-all"
              >
                LinkedIn: /in/tousifraza
              </a>
              <a
                href="https://x.com/thebokaroguy"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs md:text-sm font-medium text-white hover:border-brand-blue/50 hover:bg-brand-blue/10 transition-all"
              >
                X (Twitter): @thebokaroguy
              </a>
              <a
                href="https://instagram.com/thebokaroguy"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs md:text-sm font-medium text-white hover:border-brand-blue/50 hover:bg-brand-blue/10 transition-all"
              >
                Instagram: @thebokaroguy
              </a>
            </div>
          </div>
        </div>

        {/* Narrative & Philosophy */}
        <section className="space-y-8 mb-16 text-foreground/80 leading-relaxed text-base md:text-lg font-light">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h2 className="text-2xl font-bold text-white mb-4">Engineering Philosophy</h2>
            <p className="mb-4">
              &ldquo;An idea without execution is just an illusion. True engineering means building systems
              that just work, while maintaining the elegance and polish of a premium product.&rdquo;
            </p>
            <p>
              Tousif launched MakerlyAI to bridge the gap between concept and code. Recognizing that most
              founders waste months and millions of rupees dealing with slow, unreliable agencies, he built
              a proprietary Rapid Deployment Pipeline delivering a functional, interactive MVP within 24 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-3">Core Expertise</h3>
              <ul className="space-y-2 text-sm text-foreground/70 list-disc list-inside">
                <li>End-to-End SaaS Architecture &amp; Full-Stack Execution</li>
                <li>Large Language Model (LLM) Integration &amp; AI Agents</li>
                <li>Next.js, React, Node.js, and TypeScript Mastery</li>
                <li>Cloud Infrastructure (AWS, Vercel, Supabase, Neon PostgreSQL)</li>
                <li>Payment Architecture: Stripe &amp; UPI (Razorpay/Paytm)</li>
                <li>Sub-second Latency &amp; Production Performance Tuning</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
              <h3 className="text-lg font-bold text-white mb-3">Ventures &amp; Leadership</h3>
              <ul className="space-y-2 text-sm text-foreground/70 list-disc list-inside">
                <li>
                  <strong className="text-foreground">MakerlyAI:</strong> Founder &amp; Chief Software Architect (2024–Present)
                </li>
                <li>
                  <strong className="text-foreground">MakerlyAI CRM:</strong> Creator of the inbound leads and commission partner portal
                </li>
                <li>
                  <strong className="text-foreground">Eastern India Tech Initiative:</strong> Advocating for Tier-2/3 tech startup infrastructure across Jharkhand and Bihar
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl">
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Want to Build Your Next Venture with Tousif?
          </h2>
          <p className="text-foreground/70 max-w-md mx-auto mb-6 text-sm md:text-base">
            Get your product preview engineered and shipped in 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-brand-blue/90 transition-all"
            >
              Get in Touch with Tousif &rarr;
            </Link>
            <Link
              href="/locations/jamshedpur"
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              MakerlyAI Jamshedpur HQ
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
