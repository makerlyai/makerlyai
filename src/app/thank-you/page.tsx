import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, MessageCircle, ArrowLeft, Clock, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Inquiry Confirmed | MakerlyAI — 24-Hour Preview In Progress",
  description:
    "Thank you for contacting MakerlyAI. Your project brief has been received by founder Tousif Raza. Our engineering team will deliver your 24-hour preview timeline shortly.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYouPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-24 selection:bg-brand-blue/30">
      <div className="max-w-xl w-full mx-auto text-center rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 backdrop-blur-2xl shadow-2xl">
        {/* Animated Green Checkmark */}
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 animate-pulse" />
        </div>

        <span className="inline-block px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
          Inquiry Successfully Confirmed
        </span>

        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white mb-4">
          You&apos;re On the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-400">
            Fast Track
          </span>
        </h1>

        <p className="text-foreground/75 text-base md:text-lg leading-relaxed mb-8 font-light">
          Your project specifications have been delivered directly to architect{" "}
          <strong className="text-white font-semibold">Tousif Raza</strong> and the MakerlyAI engineering team.
          We are already structuring your architecture.
        </p>

        {/* 3 Step Timeline Box */}
        <div className="space-y-3 text-left mb-8 bg-white/[0.02] border border-white/10 rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-brand-blue shrink-0" />
            <p className="text-xs md:text-sm text-foreground/80">
              <strong className="text-white">Within 2 Hours:</strong> Confirmation &amp; brief clarification via WhatsApp/Email.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <p className="text-xs md:text-sm text-foreground/80">
              <strong className="text-white">Within 24 Hours:</strong> Interactive working prototype preview ready for your review.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://wa.me/918102308736?text=Hi%2C%20I%20just%20submitted%20an%20inquiry%20on%20MakerlyAI%20and%20want%20to%20fast-track%20my%20preview."
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 text-sm font-bold text-black shadow-lg hover:bg-[#25D366]/90 transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-black" />
            <span>Fast-Track on WhatsApp</span>
          </a>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-sm font-medium text-white hover:bg-white/10 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Homepage</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
