import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, MapPin, Mail, Phone, Clock, ShieldCheck, Sparkles, MessageCircle } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact & Project Inquiry | MakerlyAI — Architecture Preview in 24 Hours",
  description:
    "Submit your software or AI project brief to MakerlyAI. Consult directly with lead architect Tousif Raza. Jamshedpur HQ with worldwide delivery across India, USA, UK, and UAE.",
  alternates: {
    canonical: "https://makerlyai.in/contact",
  },
  openGraph: {
    title: "Contact & Inquiry | MakerlyAI",
    description: "Start your custom software or AI agent build. Response within 24 hours.",
    url: "https://makerlyai.in/contact",
  },
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "MakerlyAI Official Contact & Project Inquiry",
    description: "Submit project briefs for AI apps, SaaS platforms, AI receptionists, and custom software.",
    url: "https://makerlyai.in/contact",
    mainEntity: {
      "@type": "Organization",
      name: "MakerlyAI",
      founder: {
        "@type": "Person",
        name: "Tousif Raza",
      },
      telephone: "+918102308736",
      email: "tousifraza369@gmail.com",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Jamshedpur",
        addressRegion: "Jharkhand",
        postalCode: "831005",
        addressCountry: "IN",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <main className="relative min-h-screen bg-[#0d0f17] text-white selection:bg-brand-blue/30 py-16 px-4 md:px-8">
        {/* Ambient background glow */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Breadcrumb / Back button */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Homepage</span>
            </Link>
          </div>

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-blue/40 bg-brand-blue/10 text-brand-blue text-xs font-bold uppercase tracking-wider mb-4">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Fast-Track Engineering Intake</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-4">
              Tell Us What You Want To{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
                Build
              </span>
            </h1>
            <p className="text-slate-300 text-base md:text-lg">
              Whether you need an Autonomous AI Agent, a Food/Travel Application, or full-scale SaaS, founder{" "}
              <strong className="text-white">Tousif Raza</strong> and the MakerlyAI team will structure your prototype within 24 hours.
            </p>
          </div>

          {/* Grid: Direct Contact Info + Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Direct Info & Trust Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl">
                <h2 className="text-xl font-bold mb-4 text-white">Direct Communication Channels</h2>
                
                <div className="space-y-4">
                  <a
                    href="https://wa.me/918102308736?text=Hi%20Tousif%2C%20I%20want%20to%20discuss%20a%20new%20software%20project%20with%20MakerlyAI."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 p-3.5 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/30 text-white hover:bg-[#25D366]/20 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#25D366] flex items-center justify-center shrink-0">
                      <MessageCircle className="w-5 h-5 fill-black text-black" />
                    </div>
                    <div>
                      <div className="text-xs text-emerald-400 font-semibold uppercase tracking-wider">Instant Chat</div>
                      <div className="text-sm font-bold text-white group-hover:text-emerald-300">WhatsApp Founder (+91 81023 08736)</div>
                    </div>
                  </a>

                  <a
                    href="mailto:tousifraza369@gmail.com"
                    className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white hover:bg-white/[0.08] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-brand-blue/20 border border-brand-blue/40 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Email Briefs</div>
                      <div className="text-sm font-bold text-white group-hover:text-cyan-300">tousifraza369@gmail.com</div>
                    </div>
                  </a>

                  <a
                    href="tel:+918102308736"
                    className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-white hover:bg-white/[0.08] transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5 text-purple-300" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Direct Call</div>
                      <div className="text-sm font-bold text-white group-hover:text-purple-300">+91 81023 08736</div>
                    </div>
                  </a>

                  <div className="flex items-start gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-slate-300">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Headquarters</div>
                      <div className="text-sm font-bold text-white">MakerlyAI Engineering Studio</div>
                      <div className="text-xs text-slate-400 mt-0.5">Jamshedpur (Kadma / Bistupur), Jharkhand 831005, India</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Guarantees */}
              <div className="rounded-3xl border border-emerald-500/20 bg-emerald-950/10 p-6 space-y-3">
                <div className="flex items-center gap-3 text-emerald-400">
                  <Clock className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-bold">2-Hour Initial Review</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every inquiry receives an architectural review from Tousif Raza personally within 2 hours of submission.
                </p>

                <div className="flex items-center gap-3 text-cyan-400 pt-2 border-t border-white/10">
                  <ShieldCheck className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-bold">24-Hour Working Preview</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  We generate interactive prototypes before you commit to long-term milestone agreements.
                </p>
              </div>
            </div>

            {/* Right Column: Contact Form */}
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-black text-white">Project Inquiry Form</h2>
                  <p className="text-xs md:text-sm text-slate-400 mt-1">
                    Fill in your details below and our team will get straight to work.
                  </p>
                </div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
