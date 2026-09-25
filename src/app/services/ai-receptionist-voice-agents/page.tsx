import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AI Receptionist & Voice Agent Development | MakerlyAI Voice AI Studio",
  description:
    "MakerlyAI builds custom AI receptionists, multilingual voice bots, and automated phone agents for clinics, hotels, real estate, restaurants, and businesses worldwide. 24/7 call answering and booking.",
  keywords: [
    "AI receptionist",
    "AI phone agent",
    "voice AI bot development",
    "AI receptionist for clinics",
    "AI receptionist for hotels",
    "automated appointment booking bot",
    "multilingual voice AI India USA",
    "custom AI calling agents",
    "voice agent development company",
    "Makerly AI voice bot",
  ],
  alternates: { canonical: "/services/ai-receptionist-voice-agents" },
  openGraph: {
    title: "AI Receptionist & Voice Agent Development | MakerlyAI",
    description:
      "Never miss a call or booking again. Custom AI receptionists and voice agents engineered by MakerlyAI with working preview in 24 hours.",
    url: "https://makerlyai.in/services/ai-receptionist-voice-agents",
  },
};

export default function AIReceptionistPage() {
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
          <span className="text-brand-blue font-semibold">AI Receptionists &amp; Voice Agents</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          24/7 Autonomous Call Handling • Multilingual • Zero Missed Leads
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          AI Receptionists &amp;{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-blue-500">
            Voice AI Agents
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          Replace busy phone lines and missed opportunities with ultra-realistic, low-latency AI receptionists.
          MakerlyAI designs voice agents that answer incoming phone calls, qualify patient or customer inquiries,
          book appointments in your Google Calendar/CRM, and send WhatsApp confirmations instantly.
        </p>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "Sub-Second Latency (<800ms)",
              desc: "Powered by modern LLMs and streaming speech-to-speech pipelines for natural, human-like interruption and flow.",
            },
            {
              title: "Multilingual Support",
              desc: "Flawless communication in English, Hindi, Hinglish, Spanish, Arabic, and regional dialects tailored to your market.",
            },
            {
              title: "Live CRM & Calendar Sync",
              desc: "Direct integration with Calendly, Google Calendar, HubSpot, Salesforce, Zoho, or MakerlyAI's built-in partner CRM.",
            },
            {
              title: "Telephony Integration",
              desc: "Works with your existing business numbers via Twilio, Vonage, Exotel, or SIP trunks without replacing your phone system.",
            },
            {
              title: "Smart Escalation to Humans",
              desc: "Automatically transfers complex VIP calls or emergencies directly to your live staff with full call transcript summaries.",
            },
            {
              title: "Cost Reduction of 80%+",
              desc: "Handle 10,000+ simultaneous inbound calls without hiring call centers, night-shift staff, or receptionist agencies.",
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

        {/* Industry Use Cases */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Who Needs an AI Receptionist?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                industry: "Doctors, Dental & Aesthetic Clinics",
                details: "Answers patient questions, books consultations, reschedules visits, and sends SMS/WhatsApp reminders 24/7.",
              },
              {
                industry: "Hotels, Resorts & Travel Agencies",
                details: "Handles room booking inquiries, check-in instructions, custom tour packages, and airport pickup requests.",
              },
              {
                industry: "Real Estate Agencies & Builders",
                details: "Qualifies buyers, captures budget requirements, checks property availability, and schedules site visits.",
              },
              {
                industry: "Restaurants & Cloud Kitchens",
                details: "Takes table reservations, answers catering questions, confirms opening hours, and routes online orders.",
              },
            ].map((uc, i) => (
              <div key={i} className="border-l-2 border-brand-blue pl-4 py-1">
                <h3 className="text-lg font-bold text-white">{uc.industry}</h3>
                <p className="text-foreground/70 text-sm mt-1">{uc.details}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Hear Your Custom Voice Receptionist in 24 Hours
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg">
            We will build a custom interactive demonstration answering your actual business scenarios. Pay ₹0 / $0 if not satisfied.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-blue/90 transition-all"
            >
              Order Voice AI Prototype &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
