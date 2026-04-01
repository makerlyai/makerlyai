import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Build SaaS in the US | MakerlyAI — AI-Powered Software Development",
  description:
    "Looking to build a SaaS platform in the United States? MakerlyAI delivers working previews in 24 hours. Custom software, AI agents, web & mobile apps for US startups and enterprises.",
  alternates: { canonical: "/build-saas-us" },
  openGraph: {
    title: "Build SaaS in the US | MakerlyAI",
    description:
      "Working preview in 24 hours. Pay $0 if not satisfied. Premium SaaS development for US businesses.",
    url: "https://makerlyai.in/build-saas-us",
  },
};

export default function BuildSaaSUS() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <p className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-semibold tracking-widest text-brand-blue mb-6 uppercase">
          United States
        </p>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
          Build Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-300">
            SaaS Platform
          </span>{" "}
          in the US
        </h1>

        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-12 max-w-3xl">
          MakerlyAI helps US-based startups, founders, and enterprises launch
          production-grade SaaS products at unprecedented speed. We deliver a
          working, deployable preview within 24 hours — and you only pay if
          you&apos;re satisfied.
        </p>

        <section className="space-y-10 mb-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Why US Founders Choose MakerlyAI
            </h2>
            <ul className="space-y-3 text-foreground/70 list-disc list-inside text-base md:text-lg">
              <li>24-hour turnaround — faster than any agency in Silicon Valley</li>
              <li>Zero-risk model: pay only if the preview meets your standards</li>
              <li>Full-stack expertise: Next.js, React, Node.js, Python, AI/ML</li>
              <li>US timezone-friendly communication and support</li>
              <li>Enterprise-grade security and scalable architecture from day one</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              What We Build for US Businesses
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "B2B SaaS Platforms",
                "AI Agents & Chatbots",
                "Marketplace Applications",
                "Internal Business Tools",
                "Customer-Facing Web Apps",
                "Mobile Applications (iOS & Android)",
                "Process Automation Systems",
                "Analytics & Dashboard Tools",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm md:text-base font-medium"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Our Process
            </h2>
            <ol className="space-y-3 text-foreground/70 list-decimal list-inside text-base md:text-lg">
              <li>
                <strong className="text-foreground">Tell us your idea</strong> — Share
                your vision, requirements, and timeline
              </li>
              <li>
                <strong className="text-foreground">We build in 24 hours</strong> — Our
                engineers deliver a real, working preview
              </li>
              <li>
                <strong className="text-foreground">Review & approve</strong> — If it
                doesn&apos;t meet your standards, pay nothing
              </li>
              <li>
                <strong className="text-foreground">Launch & scale</strong> — We iterate
                and deploy to production
              </li>
            </ol>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "How does the 24-hour preview work?",
                  a: "You share your project requirements, and our team builds a functional preview within 24 hours. This isn't a mockup — it's real, deployable code you can interact with.",
                },
                {
                  q: "What if I don't like the preview?",
                  a: "You pay nothing. Our zero-risk model means you only pay if the preview meets your expectations. No hidden fees, no obligations.",
                },
                {
                  q: "Do you work with US-based startups?",
                  a: "Absolutely. We work with startups, scale-ups, and enterprises across the United States, with timezone-friendly communication.",
                },
                {
                  q: "What technologies do you use?",
                  a: "We use modern, battle-tested technologies: Next.js, React, TypeScript, Node.js, Python, PostgreSQL, and leading AI/ML frameworks.",
                },
                {
                  q: "How much does it cost?",
                  a: "Pricing depends on the scope and complexity of your project. After reviewing your preview, we provide a transparent quote with no surprises.",
                },
              ].map((faq) => (
                <div key={faq.q}>
                  <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                  <p className="text-foreground/70 text-base">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/#contact"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-brand-blue text-white font-bold text-base hover:bg-brand-blue/90 transition-colors"
          >
            Start Your Project
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/20 bg-white/5 font-bold text-base hover:bg-white/10 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
