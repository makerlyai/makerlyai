import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Top Software & AI Startup in Jamshedpur | MakerlyAI HQ",
  description:
    "MakerlyAI is Jamshedpur's premier AI app, SaaS, and custom software development agency. Founded by Tousif Raza, we build high-performance MVPs in 24 hours for startups in Jamshedpur, Jharkhand, and worldwide.",
  keywords: [
    "startups in jamshedpur",
    "software startup in jamshedpur",
    "software company in jamshedpur",
    "IT companies in jamshedpur",
    "best tech startup jamshedpur",
    "app developers in jamshedpur",
    "web development company jamshedpur",
    "AI development jamshedpur jharkhand",
    "Tousif Raza Jamshedpur",
    "Makerly AI Jamshedpur",
  ],
  alternates: { canonical: "/locations/jamshedpur" },
  openGraph: {
    title: "Top Software & AI Startup in Jamshedpur | MakerlyAI HQ",
    description:
      "Jamshedpur's leading AI & SaaS startup. Working MVP preview in 24 hours. Pay ₹0 if not satisfied.",
    url: "https://makerlyai.in/locations/jamshedpur",
  },
};

const jamshedpurFaqs = [
  {
    q: "Why is MakerlyAI the leading tech startup in Jamshedpur?",
    a: "Founded in Jamshedpur by full-stack architect Tousif Raza, MakerlyAI bridges the gap between global Silicon-Valley tier software engineering and local accessibility. We deliver functional software and SaaS MVPs within 24 hours, giving regional founders an unfair competitive advantage.",
  },
  {
    q: "What software services does MakerlyAI provide in Jamshedpur and Jharkhand?",
    a: "We specialize in custom SaaS platforms, AI automated agents, WhatsApp CRM bots, high-converting web applications, cross-platform mobile apps (iOS/Android), and enterprise workflow automation.",
  },
  {
    q: "Can businesses in Jamshedpur meet the founder directly?",
    a: "Yes! MakerlyAI is headquartered in Jamshedpur, covering Kadma, Bistupur, Sakchi, Adityapur Industrial Area, Sonari, and Telco. Local business founders, industrial leaders, and entrepreneurs can book direct consultations with founder Tousif Raza.",
  },
  {
    q: "How does MakerlyAI's 24-hour preview work?",
    a: "You submit your product requirements. Our studio engineers and delivers a working interactive prototype within 24 hours. You only proceed and pay if you are completely satisfied with the architecture and design.",
  },
];

export default function JamshedpurLocationPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12 selection:bg-brand-blue/30">
      {/* Schema: LocalBusiness & FAQ for Jamshedpur */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Makerly AI - Jamshedpur HQ",
            image: "https://makerlyai.in/initialletterlogosquare.png",
            url: "https://makerlyai.in/locations/jamshedpur",
            telephone: "+91-9876543210",
            priceRange: "₹₹₹",
            address: {
              "@type": "PostalAddress",
              streetAddress: "Kadma / Bistupur Area",
              addressLocality: "Jamshedpur",
              addressRegion: "Jharkhand",
              postalCode: "831005",
              addressCountry: "IN",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 22.8046,
              longitude: 86.2029,
            },
            founder: {
              "@type": "Person",
              name: "Tousif Raza",
              jobTitle: "Founder & Chief Architect",
              url: "https://makerlyai.in/founder/tousif-raza",
              sameAs: [
                "https://linkedin.com/in/tousifraza",
                "https://x.com/thebokaroguy",
                "https://instagram.com/thebokaroguy",
              ],
            },
            areaServed: [
              "Jamshedpur",
              "Bistupur",
              "Kadma",
              "Sakchi",
              "Adityapur",
              "Sonari",
              "Telco",
              "East Singhbhum",
              "Jharkhand",
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: jamshedpurFaqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: f.a,
              },
            })),
          }),
        }}
      />

      <div className="max-w-5xl mx-auto">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 mb-6">
          <Link href="/" className="hover:text-brand-blue transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/locations/jharkhand" className="hover:text-brand-blue transition-colors">
            Jharkhand
          </Link>
          <span>/</span>
          <span className="text-brand-blue font-semibold">Jamshedpur HQ</span>
        </nav>

        {/* Hero Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          Steel City&apos;s Leading AI &amp; Software Startup Studio
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          The Premier Software &amp; AI Startup in{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-blue-500">
            Jamshedpur
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-10 max-w-3xl font-light">
          Engineered in Jamshedpur for high-growth businesses. Founded by architect{" "}
          <strong className="text-foreground font-semibold">Tousif Raza</strong>, MakerlyAI builds
          production-grade SaaS products, autonomous AI agents, and enterprise apps with a{" "}
          <span className="text-brand-blue font-semibold">guaranteed 24-hour working preview</span>.
        </p>

        {/* Key Metrics Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
          {[
            { label: "Preview Delivery", val: "24 Hours" },
            { label: "Headquarters", val: "Jamshedpur, JH" },
            { label: "Founder Execution", val: "Tousif Raza" },
            { label: "Client Satisfaction", val: "Pay ₹0 if not satisfied" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur-md"
            >
              <div className="text-xs uppercase tracking-widest text-foreground/50 mb-1">
                {item.label}
              </div>
              <div className="text-lg md:text-xl font-bold text-foreground">{item.val}</div>
            </div>
          ))}
        </div>

        {/* Core Services Section */}
        <section className="space-y-12 mb-20">
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Building World-Class Digital Infrastructure for Jamshedpur &amp; Eastern India
            </h2>
            <p className="text-foreground/70 text-base md:text-lg leading-relaxed mb-8">
              Whether you are an industrial enterprise in Adityapur, a retail chain in Bistupur, or a
              new-age startup founder in Sakchi, MakerlyAI delivers technology that matches Silicon Valley
              standards right here in East Singhbhum.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Custom SaaS & Web App Development",
                  desc: "Scalable cloud architectures built with Next.js, TypeScript, PostgreSQL, and AWS/Vercel. High-conversion UX engineered to scale to millions of users.",
                },
                {
                  title: "Autonomous AI Agents & Chatbots",
                  desc: "Custom AI agents capable of handling 24/7 lead qualification, customer support, document analysis, and CRM synchronization with zero human delay.",
                },
                {
                  title: "Mobile App Development (iOS & Android)",
                  desc: "High-performance React Native applications with offline synchronization, instant payment gateway integrations (UPI/Razorpay), and smooth 60fps animations.",
                },
                {
                  title: "Enterprise ERP & Automation Systems",
                  desc: "Custom internal portals, CRM automation, inventory tracking, and lead-routing pipelines designed specifically for manufacturing and service companies.",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-brand-blue/40 transition-all duration-300"
                >
                  <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                  <p className="text-foreground/70 text-sm md:text-base leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Founder Section Callout */}
          <div className="rounded-3xl border border-brand-blue/30 bg-gradient-to-br from-brand-blue/10 via-white/[0.02] to-transparent p-8 md:p-12 relative overflow-hidden">
            <div className="max-w-2xl">
              <span className="text-xs uppercase tracking-widest text-brand-blue font-bold">
                Local Leadership
              </span>
              <h3 className="text-2xl md:text-3xl font-black mt-2 mb-4">
                Led by Tousif Raza — Architect of Modern Web Systems
              </h3>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Tousif Raza founded MakerlyAI to prove that world-class software engineering doesn&apos;t
                require moving to Bangalore or Silicon Valley. Based in Jamshedpur, our studio partners
                directly with visionary founders to build, ship, and scale products at breakneck speed.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/founder/tousif-raza"
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand-blue/90 transition-all"
                >
                  Meet Founder Tousif Raza →
                </Link>
                <a
                  href="https://linkedin.com/in/tousifraza"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-medium text-white hover:bg-white/10 transition-all"
                >
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </div>

          {/* Neighborhoods Served in Jamshedpur */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Local Areas Served in Jamshedpur</h2>
            <div className="flex flex-wrap gap-2.5">
              {[
                "Bistupur Commercial District",
                "Kadma",
                "Sakchi Market",
                "Adityapur Industrial Area",
                "Sonari",
                "Telco Colony",
                "Gamharia",
                "Golmuri",
                "Mango",
                "Jugsalai",
                "Baridih",
                "XLRI Campus Zone",
              ].map((locality) => (
                <span
                  key={locality}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs md:text-sm font-medium text-foreground/80"
                >
                  📍 {locality}
                </span>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {jamshedpurFaqs.map((faq) => (
                <div
                  key={faq.q}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all"
                >
                  <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
                  <p className="text-foreground/70 text-sm md:text-base leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Ready to Build Your Software Startup in Jamshedpur?
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Get your working MVP preview delivered in 24 hours. Connect directly with Tousif and the MakerlyAI engineering team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-blue/90 transition-all"
            >
              Start Your 24-Hour Build →
            </Link>
            <Link
              href="/crm"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white hover:bg-white/10 transition-all"
            >
              Access Partner CRM
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
