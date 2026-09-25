import type { Metadata } from "next";
import Link from "next/link";
import { Stethoscope, CheckCircle2, ShieldCheck, Clock, MessageCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Healthcare & Clinic Management App Development | MakerlyAI",
  description:
    "Custom hospital ERP, clinic appointment software, electronic medical records (EMR), and telemedicine apps engineered by MakerlyAI with a 24-hr working preview.",
  keywords: [
    "clinic management software",
    "healthcare app development company",
    "hospital ERP software developers",
    "doctor appointment app builder",
    "telemedicine software development",
    "Makerly AI healthcare",
  ],
  alternates: { canonical: "/services/healthcare-clinic-management-software" },
};

export default function HealthcareClinicSoftwarePage() {
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
          <span className="text-brand-blue font-semibold">Healthcare &amp; Clinic Software</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-sm font-semibold tracking-wide text-emerald-400 mb-6">
          <Stethoscope className="w-4 h-4 text-emerald-400" />
          <span>Doctor Scheduling • Digital EMR • WhatsApp Lab Sync</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Healthcare &amp; Clinic <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-brand-blue">
            Management Software
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          Streamline patient flow, eliminate waiting room congestion, and automate diagnostic reporting with tailor-made healthcare software built for hospitals, clinics, and medical practitioners.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold text-white mb-3">Live OPD Queue &amp; Booking</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              Patients book doctor slots online and receive real-time queue number updates on WhatsApp, cutting waiting times by 70%.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold text-white mb-3">Electronic Medical Records (EMR)</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              Secure digital prescription writing, medical history timeline, and encrypted cloud storage adhering to health data standards.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold text-white mb-3">Automated Lab Reports via WhatsApp</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              Pathology reports auto-delivered to patient phones the instant tests are signed off by the pathologist.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
            <h3 className="text-xl font-bold text-white mb-3">24-Hour Interactive Preview</h3>
            <p className="text-sm text-foreground/70 leading-relaxed font-light">
              Test your clinic booking interface and doctor dashboard in 24 hours with zero upfront commitment.
            </p>
          </div>
        </div>

        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 backdrop-blur-xl">
          <h2 className="text-2xl md:text-3xl font-black mb-3">
            Modernize Your Clinic or Hospital
          </h2>
          <p className="text-foreground/70 max-w-md mx-auto mb-6 text-sm md:text-base">
            Get an interactive clinic software prototype delivered in 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-xl bg-brand-blue px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-brand-blue/90 transition-all"
            >
              Request Healthcare Preview &rarr;
            </Link>
            <a
              href="https://wa.me/918102308736?text=Hi%20Tousif%2C%20I%20want%20to%20develop%20a%20healthcare%2Fclinic%20app%20with%20MakerlyAI."
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
