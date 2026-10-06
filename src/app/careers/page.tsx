import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Sparkles, Code2, Palette, Rocket, ShieldCheck, Mail, CheckCircle2, ArrowRight, Laptop, Zap, Users } from "lucide-react";
import CareersApplicationForm from "@/components/careers/CareersApplicationForm";

export const metadata: Metadata = {
  title: "Careers & Talent Roster | Makerly AI — Build With Us",
  description:
    "All job openings at Makerly AI are currently closed. However, you can still submit the form to join our talent roster — we will contact you directly as soon as new requirements open up.",
  alternates: {
    canonical: "https://makerlyai.in/careers",
  },
  openGraph: {
    title: "Careers & Talent Roster at Makerly AI",
    description: "Active job openings are currently closed. Submit your proof of work to join our future talent roster.",
    url: "https://makerlyai.in/careers",
  },
};

const OPEN_ROLES = [
  {
    id: "fullstack-ai-engineer",
    title: "Full-Stack AI Engineer",
    department: "Engineering Pod",
    type: "Full-Time / Contract",
    statusText: "Closed for Now · Roster Open",
    location: "Remote (India / Global)",
    experience: "1 - 4 Years",
    tagline: "Ship autonomous LLM agents, realtime voice pipelines, and high-performance Next.js architectures.",
    techStack: ["Next.js 16", "TypeScript", "Python / FastAPI", "PostgreSQL / Supabase", "Groq / OpenAI", "Tailwind CSS"],
    responsibilities: [
      "Architect and deploy full-stack web and mobile apps with 48-hour prototype delivery cadence.",
      "Integrate state-of-the-art multilingual voice models (Sarvam AI, Deepgram, ElevenLabs) into client platforms.",
      "Write clean, resilient server actions, API routes, and database schemas with zero technical debt.",
      "Directly communicate with startup founders during sprint planning and go-live deployment.",
    ],
    requirements: [
      "Proficient in modern TypeScript, React Server Components, and Node.js/Python microservices.",
      "Demonstrated experience building or deploying LLM workflows, RAG, or autonomous agent tools.",
      "A public GitHub profile, live project URLs, or production code samples you can walk us through.",
    ],
  },
  {
    id: "product-designer",
    title: "Founding UI/UX Product Designer",
    department: "Design & Interaction",
    type: "Full-Time / Contract",
    statusText: "Closed for Now · Roster Open",
    location: "Remote",
    experience: "1 - 3 Years",
    tagline: "Define the visual identity, micro-interactions, and design systems for global venture-backed startups.",
    techStack: ["Figma", "Framer", "Design Systems", "Tailwind Tokens", "Micro-Interactions"],
    responsibilities: [
      "Craft sleek, high-conversion landing pages, dashboards, and mobile app interfaces with luxury aesthetics.",
      "Produce comprehensive design systems, component tokens, and interactive motion prototypes.",
      "Collaborate in lockstep with engineers to ensure 100% pixel-perfect implementation in production.",
    ],
    requirements: [
      "A portfolio demonstrating modern dark-mode interfaces, refined typography, and purposeful motion.",
      "Understanding of frontend CSS constraints (flexbox, grid, responsive viewports).",
      "Obsession with micro-copy, UX psychology, and high-converting visual hierarchy.",
    ],
  },
  {
    id: "technical-growth-architect",
    title: "Technical Growth & Operations Architect",
    department: "Growth & Client Delivery",
    type: "Full-Time",
    statusText: "Closed for Now · Roster Open",
    location: "Remote / Hybrid (India)",
    experience: "1 - 3 Years",
    tagline: "Drive inbound project qualification, architectural proposal synthesis, and CRM execution.",
    techStack: ["Technical Scoping", "CRM Automation", "Inbound Marketing", "Client Delivery"],
    responsibilities: [
      "Analyze inbound client requirements and draft technical blueprints alongside founder Tousif Raza.",
      "Manage sprint intake, client communication milestones, and milestone acceptance handoffs.",
      "Drive product marketing and outbound strategic alignment with funded startups globally.",
    ],
    requirements: [
      "Exceptional written English and technical communication skills.",
      "Understanding of modern software development life cycles (MVP, APIs, cloud deployments).",
      "High emotional intelligence, organized execution, and entrepreneurial drive.",
    ],
  },
];

export default function CareersPage() {
  const careersSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Careers at Makerly AI",
    description: "Explore engineering, design, and growth roles at Makerly AI.",
    url: "https://makerlyai.in/careers",
    publisher: {
      "@type": "Organization",
      name: "Makerly AI",
      founder: {
        "@type": "Person",
        name: "Tousif Raza",
      },
      email: "careers@makerlyai.in",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(careersSchema) }}
      />
      <main className="relative min-h-screen bg-[#07090e] text-white selection:bg-brand-blue/30 pt-32 pb-20 px-4 md:px-8">
        {/* Ambient atmospheric glows */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-blue-600/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Back link */}
          <div className="mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all shadow-sm"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Back to Homepage</span>
            </Link>
          </div>

          {/* Hero Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-bold uppercase tracking-wider mb-5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Talent Roster &bull; Open for Future Intake</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.1] mb-6">
              Build Ambitious Products. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
                Ship to Production Daily.
              </span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              At <strong className="text-white">Makerly AI</strong>, we build autonomous AI tools, high-velocity SaaS applications, and intelligent systems for ambitious founders across the world.
            </p>

            {/* Quick stats pills */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-300">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03]">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span>100% Remote-First</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03]">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>High Autonomy</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03]">
                <Users className="w-4 h-4 text-emerald-400" />
                <span>Direct Founder Access</span>
              </div>
            </div>
          </div>

          {/* Prominent Status Notice: Openings Closed For Now */}
          <div className="mb-14 p-6 sm:p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-slate-900/80 to-cyan-950/40 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/40 bg-amber-500/15 text-amber-300 text-xs font-mono font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                  <span>Notice &bull; Active Openings Currently Paused</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  All Current Job Openings Are Closed For Now
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Our core engineering and product teams are currently operating at full capacity. We are not actively onboarding new roles right at this moment. <strong className="text-white">However, you can still submit the form below if you are interested!</strong> We continuously review exceptional craft and will reach out to you directly as soon as new requirements or project expansions arise.
                </p>
              </div>
              <a
                href="#apply-form"
                className="shrink-0 inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 text-black font-bold text-xs uppercase tracking-wider hover:opacity-90 transition-all shadow-lg shadow-amber-500/10"
              >
                <span>Submit to Talent Roster</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Direct Application Banner */}
          <div className="mb-16 p-8 rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-slate-900/60 to-emerald-950/30 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
                Fast-Track Application Channel
              </div>
              <h2 className="text-2xl font-bold text-white">Skip the Resume Black Hole</h2>
              <p className="text-sm text-slate-300 max-w-xl">
                We hire based on shipping velocity and proof of work. Send your GitHub, portfolio, or best project to{" "}
                <strong className="text-cyan-300 font-mono">careers@makerlyai.in</strong>. Founder Tousif Raza reviews every submission personally within 48 hours.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <a
                href="#apply-form"
                className="shrink-0 inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 text-black font-bold text-sm hover:from-blue-400 hover:to-cyan-400 transition-all shadow-lg shadow-cyan-500/20"
              >
                <Sparkles className="w-4 h-4 fill-black" />
                <span>Fill Online Application</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="mailto:careers@makerlyai.in?subject=Fast-Track%20Engineering%20Application%20-%20Makerly%20AI"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full border border-white/15 bg-white/5 text-white font-medium text-sm hover:bg-white/10 transition-all"
              >
                <Mail className="w-4 h-4" />
                <span>Email Directly</span>
              </a>
            </div>
          </div>

          {/* Open Positions List */}
          <div className="space-y-8 mb-20">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <Code2 className="w-6 h-6 text-cyan-400" />
                <span>Engineering &amp; Design Roles</span>
              </h2>
              <span className="text-xs font-mono text-amber-300 bg-amber-500/15 border border-amber-500/30 px-3 py-1 rounded-full">
                Active Openings Closed &bull; Talent Roster Open
              </span>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {OPEN_ROLES.map((role) => (
                <div
                  key={role.id}
                  id={role.id}
                  className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-10 backdrop-blur-xl hover:border-amber-500/30 transition-all shadow-xl"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {role.statusText}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-cyan-300 border border-blue-500/30">
                          {role.department}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-mono text-slate-400 bg-white/5 border border-white/10">
                          {role.type}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                          {role.location}
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight">{role.title}</h3>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
                      <a
                        href="#apply-form"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 text-black font-bold text-xs hover:opacity-90 transition-all shadow-md shadow-amber-500/10 cursor-pointer"
                      >
                        <Sparkles className="w-3.5 h-3.5 fill-black" />
                        <span>Join Talent Roster</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                      <a
                        href={`mailto:careers@makerlyai.in?subject=Talent%20Roster%3A%20${encodeURIComponent(role.title)}%20-%20%5BYour%20Name%5D`}
                        title="Or email directly"
                        className="p-2.5 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  <p className="text-slate-300 text-sm md:text-base mb-6 leading-relaxed">
                    {role.tagline}
                  </p>

                  {/* Tech stack badges */}
                  <div className="flex flex-wrap items-center gap-2 mb-8">
                    <span className="text-xs font-mono font-bold text-slate-400 mr-2">Core Stack:</span>
                    {role.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/[0.04] border border-white/10 text-slate-200"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/[0.08]">
                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-4 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        <span>What You'll Do</span>
                      </h4>
                      <ul className="space-y-2.5 text-xs md:text-sm text-slate-300">
                        {role.responsibilities.map((resp, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="text-cyan-400 font-bold mt-0.5">•</span>
                            <span>{resp}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400" />
                        <span>What We Value</span>
                      </h4>
                      <ul className="space-y-2.5 text-xs md:text-sm text-slate-300">
                        {role.requirements.map((req, i) => (
                          <li key={i} className="flex items-start gap-2.5">
                            <span className="text-emerald-400 font-bold mt-0.5">•</span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Online Application Form */}
          <div className="mb-20">
            <CareersApplicationForm
              roles={OPEN_ROLES.map((r) => ({ id: r.id, title: r.title }))}
            />
          </div>

          {/* How We Work Section */}
          <div className="p-8 md:p-12 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl mb-16">
            <h2 className="text-2xl md:text-3xl font-black text-white text-center mb-8">
              Why Engineers &amp; Designers Choose Makerly AI
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-cyan-400 mx-auto md:mx-0">
                  <Rocket className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Rapid Ship Cycles</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We don’t spend 6 months in meetings. Features go from architecture to production in 48 hours to 2 weeks.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto md:mx-0">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Zero Corporate Bureaucracy</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Work directly with founder Tousif Raza. No middle managers, no endless sprint ceremonies. Just code and product clarity.
                </p>
              </div>

              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mx-auto md:mx-0">
                  <Palette className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white">Cutting-Edge AI Stacks</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  We use the newest AI SDKs, subagent orchestrators, realtime voice pipelines, and modern vector architectures daily.
                </p>
              </div>
            </div>
          </div>

          {/* Final Founder Reachout Footer */}
          <div className="text-center py-8 border-t border-white/10 space-y-3 font-mono text-xs text-slate-400">
            <p>
              Have questions about open roles or want to pitch a custom collaboration?
            </p>
            <p>
              Direct Email to Founder:{" "}
              <a href="mailto:tousif@makerlyai.in" className="text-cyan-400 underline font-bold hover:text-cyan-300">
                tousif@makerlyai.in
              </a>{" "}
              &bull; Careers Intake:{" "}
              <a href="mailto:careers@makerlyai.in" className="text-emerald-400 underline font-bold hover:text-emerald-300">
                careers@makerlyai.in
              </a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
