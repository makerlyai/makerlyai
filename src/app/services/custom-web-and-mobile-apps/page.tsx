import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Custom Web & Mobile App Development Company | MakerlyAI",
  description:
    "MakerlyAI architects high-performance web applications (Next.js, React) and cross-platform mobile apps (iOS & Android). Modern design, sub-second speeds, and 24h preview.",
  keywords: [
    "custom web app development",
    "mobile app development company",
    "React Native app developers",
    "iOS and Android app development",
    "Next.js web development agency",
    "full stack software development",
    "custom software development company",
    "Tousif Raza app developer",
    "Makerly AI apps",
  ],
  alternates: { canonical: "/services/custom-web-and-mobile-apps" },
  openGraph: {
    title: "Custom Web & Mobile App Development Company | MakerlyAI",
    description:
      "Award-winning UI/UX design paired with military-grade full-stack code. Working preview in 24 hours.",
    url: "https://makerlyai.in/services/custom-web-and-mobile-apps",
  },
};

export default function WebAndMobileAppsPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12 selection:bg-brand-blue/30">
      <div className="max-w-5xl mx-auto">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 mb-6">
          <Link href="/" className="hover:text-brand-blue transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-brand-blue transition-colors">
            Services
          </Link>
          <span>/</span>
          <span className="text-brand-blue font-semibold">Web &amp; Mobile Apps</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          Next.js 16 • React Native • 60 FPS Mobile Polish • 100% IP Ownership
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Custom Web &amp; Mobile <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-blue-500">
            Application Development
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          Your product shouldn&apos;t look like another generic template. MakerlyAI crafts bespoke,
          blazingly fast web applications and native-feel mobile apps with fluid animations, intuitive UX,
          and robust database architecture engineered to scale to millions of users.
        </p>

        {/* Core Stack Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {[
            {
              title: "Modern Web Applications (Next.js & React)",
              desc: "Server-side rendering, sub-second page loads, SEO-first structure, edge computing, and real-time WebSockets. Built for high conversion.",
              stack: "Next.js • TypeScript • Tailwind CSS • Vercel",
            },
            {
              title: "Cross-Platform Mobile Apps (iOS & Android)",
              desc: "Single codebase, native device performance. Push notifications, camera/GPS access, biometric authentication, and offline data sync.",
              stack: "React Native • Expo • Swift • Kotlin",
            },
            {
              title: "Backend & Database Engineering",
              desc: "Scalable REST & GraphQL APIs, microservices, secure authentication (Clerk/NextAuth), and cloud databases engineered for 99.99% uptime.",
              stack: "Node.js • Python • PostgreSQL • Supabase • Redis",
            },
            {
              title: "Enterprise Portals & Admin Dashboards",
              desc: "High-density data tables, granular role-based permissions, automated CSV/Excel reporting, and team collaboration workflows.",
              stack: "Custom CRM • RBAC • Analytics • Webhooks",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-blue/40 transition-all duration-300"
            >
              <div className="text-xs text-brand-blue font-bold tracking-widest uppercase mb-1">
                {item.stack}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            See Your App Live in 24 Hours
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Review a functional interactive preview before spending a single rupee or dollar.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-blue/90 transition-all"
            >
              Start Your 24-Hour Build &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
