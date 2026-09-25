import Link from "next/link";
import { ArrowLeft, CheckCircle2, ShieldCheck, Clock, MapPin, Sparkles, MessageCircle } from "lucide-react";

export interface CityLandingProps {
  cityName: string;
  stateOrRegion: string;
  badge: string;
  h1: string;
  subheadline: string;
  canonicalSlug: string;
  metaDescription: string;
  localAreas: string[];
  keyIndustries: { title: string; desc: string }[];
  faqs: { q: string; a: string }[];
}

export default function CityLandingTemplate(props: CityLandingProps) {
  const {
    cityName,
    stateOrRegion,
    badge,
    h1,
    subheadline,
    canonicalSlug,
    localAreas,
    keyIndustries,
    faqs,
  } = props;

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Makerly AI - ${cityName} Software & AI Studio`,
    image: "https://makerlyai.in/initialletterlogosquare.png",
    url: `https://makerlyai.in${canonicalSlug}`,
    telephone: "+918102308736",
    priceRange: "₹₹ - ₹₹₹₹",
    founder: {
      "@type": "Person",
      name: "Tousif Raza",
      alternateName: "thebokaroguy",
      url: "https://makerlyai.in/founder/tousif-raza",
    },
    areaServed: [cityName, stateOrRegion, "India", "Global"],
    description: `MakerlyAI provides custom software development, SaaS engineering, mobile apps, and autonomous AI agents in ${cityName}, ${stateOrRegion}. Working preview delivered in 24 hours.`,
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12 selection:bg-brand-blue/30">
        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 mb-8">
            <Link href="/" className="hover:text-brand-blue transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/locations" className="hover:text-brand-blue transition-colors">
              Locations
            </Link>
            <span>/</span>
            <span className="text-brand-blue font-semibold">{cityName}</span>
          </nav>

          {/* Hero Section */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-xs font-semibold tracking-wider text-brand-blue uppercase mb-6">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{badge}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-6 leading-tight">
              {h1}
            </h1>

            <p className="text-foreground/80 text-base md:text-xl font-light leading-relaxed mb-8">
              {subheadline}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-blue/90 transition-all hover:scale-[1.02]"
              >
                <span>Request 24-Hr {cityName} Preview</span>
                <span className="text-cyan-300">&rarr;</span>
              </Link>
              <a
                href={`https://wa.me/918102308736?text=Hi%20Tousif%2C%20I%20am%20looking%20for%20software%20development%20in%20${encodeURIComponent(cityName)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-4 text-sm font-semibold text-white hover:bg-white/10 transition-all"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Localized Presence & Coverage */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 mb-16 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="w-6 h-6 text-brand-blue" />
              <h2 className="text-2xl font-bold text-white">
                Serving Businesses Across {cityName} &amp; {stateOrRegion}
              </h2>
            </div>
            <p className="text-foreground/70 text-sm md:text-base leading-relaxed mb-6 font-light">
              MakerlyAI partners with early-stage founders, SMEs, industrial leaders, and established enterprises throughout {cityName}. Whether you are in need of a full-scale SaaS platform, custom mobile apps, or 24/7 AI customer voice bots, our engineering studio provides top-tier speed with direct founder access.
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {localAreas.map((area, idx) => (
                <span
                  key={idx}
                  className="px-3.5 py-1.5 rounded-xl border border-white/10 bg-white/[0.03] text-xs text-foreground/80 font-mono"
                >
                  📍 {area}
                </span>
              ))}
            </div>
          </section>

          {/* Industry Solutions for City */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-8">
              What We Build for {cityName} Founders &amp; Enterprises
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {keyIndustries.map((ind, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-blue/40 transition-all"
                >
                  <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-brand-blue shrink-0" />
                    <span>{ind.title}</span>
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed font-light">
                    {ind.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Guarantees Box */}
          <section className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-950/20 via-background to-background p-8 md:p-10 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
              <div className="flex items-start gap-4">
                <Clock className="w-8 h-8 text-cyan-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-base font-bold text-white">24-Hour Preview</h4>
                  <p className="text-xs text-foreground/70 mt-1">See your functional prototype in 24 hours, not 3 months.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <ShieldCheck className="w-8 h-8 text-emerald-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-base font-bold text-white">Zero-Risk Guarantee</h4>
                  <p className="text-xs text-foreground/70 mt-1">Review your architecture roadmap before committing long-term.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Sparkles className="w-8 h-8 text-purple-400 shrink-0 mt-1" />
                <div>
                  <h4 className="text-base font-bold text-white">Founder-Led Engineering</h4>
                  <p className="text-xs text-foreground/70 mt-1">Direct architectural oversight by Tousif Raza (@thebokaroguy).</p>
                </div>
              </div>
            </div>
          </section>

          {/* Local FAQ */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-8">
              Frequently Asked Questions — {cityName}
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-left"
                >
                  <h3 className="text-base md:text-lg font-bold text-white mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-sm text-foreground/70 leading-relaxed font-light">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom CTA */}
          <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 backdrop-blur-xl">
            <h2 className="text-2xl md:text-4xl font-black mb-4 text-white">
              Ready to Launch Your Software in {cityName}?
            </h2>
            <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-sm md:text-base">
              Get an interactive prototype preview engineered and delivered in 24 hours.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="rounded-xl bg-brand-blue px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-brand-blue/90 transition-all"
              >
                Start Your Project &rarr;
              </Link>
              <Link
                href="/locations"
                className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
              >
                View All Global Hubs
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
