import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Autonomous AI Agents & Enterprise Workflow Automation | MakerlyAI",
  description:
    "MakerlyAI builds custom autonomous AI agents, WhatsApp marketing bots, CRM automation, and intelligent LLM workflows for businesses worldwide. 24-hour working preview.",
  keywords: [
    "AI agent development company",
    "autonomous AI agents for business",
    "WhatsApp AI bot development",
    "custom LLM workflow automation",
    "AI sales agent",
    "customer support AI agent",
    "hire AI agent developers",
    "Tousif Raza AI agents",
    "Makerly AI automation",
  ],
  alternates: { canonical: "/services/ai-agents-automation" },
  openGraph: {
    title: "Autonomous AI Agents & Enterprise Workflow Automation | MakerlyAI",
    description:
      "Automate 80% of repetitive operational tasks with intelligent, autonomous AI agents engineered by MakerlyAI.",
    url: "https://makerlyai.in/services/ai-agents-automation",
  },
};

export default function AIAgentsServicePage() {
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
          <span className="text-brand-blue font-semibold">AI Agents &amp; Automation</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          Autonomous LLM Workflows • WhatsApp API • Zero Latency Execution
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Autonomous AI Agents &amp; <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-blue-500">
            Enterprise Automation
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          Move beyond basic ChatGPT wrappers. MakerlyAI engineers multi-agent autonomous systems that execute
          actions in the real world: qualifying leads, reading inbound emails, orchestrating CRM updates,
          and closing sales around the clock.
        </p>

        {/* Agent Capabilities */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "Autonomous Sales Agents",
              desc: "Engages website visitors, answers deep technical questions, handles objections, and pushes qualified leads into your pipeline.",
            },
            {
              title: "WhatsApp & Telegram Bots",
              desc: "Instant customer support, order updates, document parsing, and dynamic payment links right inside conversational apps.",
            },
            {
              title: "Internal Operational Copilots",
              desc: "Custom AI assistants trained on your proprietary PDFs, databases, and standard operating procedures (SOPs).",
            },
            {
              title: "Document & Invoice OCR Parsing",
              desc: "Automatically extracts line items from receipts, bills, contracts, and updates your accounting database with 99.8% accuracy.",
            },
            {
              title: "Lead Scrapers & Enrichment",
              desc: "Identifies prospects, enriches verified emails and phone numbers, and initiates personalized outreach automatically.",
            },
            {
              title: "Multi-Agent Coordination",
              desc: "Specialized sub-agents collaborating (Researcher, Writer, Reviewer, Poster) to automate complete complex business processes.",
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
            Test Your Custom AI Agent in 24 Hours
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Experience an interactive demonstration trained on your actual company data. Pay $0 / ₹0 if not satisfied.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-blue/90 transition-all"
            >
              Request Custom AI Agent &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
