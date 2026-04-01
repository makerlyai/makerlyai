import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Development Services Worldwide | MakerlyAI — Global Software Agency",
  description:
    "MakerlyAI delivers AI-powered software development services globally. SaaS platforms, AI agents, web apps, mobile apps. Working preview in 24 hours, pay $0 if not satisfied.",
  alternates: { canonical: "/ai-development-services-global" },
  openGraph: {
    title: "AI Development Services Worldwide | MakerlyAI",
    description:
      "Global AI software development. Working preview in 24 hours. Pay $0 if not satisfied.",
    url: "https://makerlyai.in/ai-development-services-global",
  },
};

export default function AIDevelopmentGlobal() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <p className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-semibold tracking-widest text-brand-blue mb-6 uppercase">
          Global
        </p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
          AI Development{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-300">
            Services
          </span>{" "}
          — Worldwide
        </h1>
        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-12 max-w-3xl">
          MakerlyAI serves clients across the US, UK, Europe, Middle East, and Asia with
          premium AI-powered software development. From SaaS platforms to intelligent agents — we deliver
          working products in 24 hours, across any timezone.
        </p>

        <section className="space-y-10 mb-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our AI Development Capabilities</h2>
            <ul className="space-y-3 text-foreground/70 list-disc list-inside text-base md:text-lg">
              <li>Custom AI agent development — support, sales, scheduling automation</li>
              <li>LLM integration (GPT, Groq, Claude) into existing products</li>
              <li>Conversational AI and intelligent chatbot systems</li>
              <li>AI-powered analytics and recommendation engines</li>
              <li>Computer vision and image processing applications</li>
              <li>Natural language processing (NLP) for content and search</li>
              <li>AI workflow automation and process optimization</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Industries We Serve</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {["SaaS & Tech","FinTech & Banking","Healthcare & MedTech","Education & EdTech","E-Commerce & Retail","Real Estate & PropTech","Logistics & Supply Chain","Media & Entertainment","Government & Public Sector"].map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm md:text-base font-medium text-center">{item}</div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Global Presence</h2>
            <p className="text-foreground/70 text-base md:text-lg mb-4">
              We work with clients across every major timezone. Our infrastructure runs on Vercel&apos;s global edge 
              network, ensuring sub-second load times regardless of location.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["🇺🇸 United States","🇬🇧 United Kingdom","🇮🇳 India","🇦🇪 UAE","🇩🇪 Germany","🇫🇷 France","🇦🇺 Australia","🇨🇦 Canada"].map((region) => (
                <div key={region} className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-center">{region}</div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Do you work with international clients?", a: "Yes. We serve clients across 15+ countries with timezone-aligned communication and global deployment infrastructure." },
                { q: "What AI models do you integrate?", a: "We work with OpenAI (GPT-4), Groq (ultra-fast inference), Claude, and open-source models like LLaMA and Mistral." },
                { q: "How do you handle different currencies?", a: "We provide quotes in your preferred currency (USD, GBP, EUR, INR, AED) with transparent, competitive pricing." },
                { q: "What's your tech stack?", a: "Next.js, React, TypeScript, Node.js, Python, PostgreSQL, Supabase, Vercel Edge — optimized for global performance." },
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
          <Link href="/#contact" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-brand-blue text-white font-bold text-base hover:bg-brand-blue/90 transition-colors">Start Your Project</Link>
          <Link href="/" className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/20 bg-white/5 font-bold text-base hover:bg-white/10 transition-colors">Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
