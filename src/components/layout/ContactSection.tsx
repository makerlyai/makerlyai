"use client";

import { motion } from "framer-motion";
import React from "react";
import ContactForm from "@/components/ContactForm";
import GlassCard from "@/components/ui/GlassCard";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-20 w-full bg-[#1a1a2e] px-4 py-24 md:px-12 md:py-32 shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(41,82,204,0.24),transparent_55%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/30 to-transparent" />
      </div>
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <span className="mb-4 inline-flex rounded-full border border-[#EDE8DF]/15 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#EDE8DF]/65">
            Contact Makerlyai
          </span>
          <h2 className="mb-4 text-4xl font-black text-[#EDE8DF] md:text-5xl">
            Let&apos;s build your next digital product
          </h2>
          <p className="text-lg text-[#EDE8DF]/72">
            Share your goals, timeline, and what you&apos;re building. We&apos;ll
            review it and respond within 24 hours.
          </p>
        </motion.div>

        <div className="w-full space-y-8">
          {/* High-Conversion Fast Track Direct Reachout Options */}
          <div className="rounded-3xl border border-white/15 bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-6 md:p-8 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 border-b border-white/10 pb-5">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Fast-Track Engineering Intake</span>
                </div>
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Prefer to skip the long form? Reach us in one tap.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                  Connect directly with lead architect Tousif Raza on WhatsApp, or speak with our AI Assistant to scope your project.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: Huge Interactive One-Tap WhatsApp Button */}
              <a
                href="https://wa.me/918102308736?text=Hi%2C%20I%20want%20to%20build%20a%20project%20with%20Makerly%20AI.%20Can%20we%20discuss%20requirements%20and%20pricing%3F"
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: "#25D366", color: "#000000" }}
                className="group relative flex flex-col justify-between p-5 rounded-2xl font-bold shadow-[0_10px_35px_rgba(37,211,102,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_45px_rgba(37,211,102,0.5)] cursor-pointer overflow-hidden border border-[#20ba59]"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-black/10 flex items-center justify-center shrink-0">
                      <svg className="w-6 h-6 fill-current text-black" viewBox="0 0 24 24">
                        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2zm5.79 14.15c-.24.68-1.39 1.3-1.92 1.38-.5.08-1.14.11-3.67-.93-3.23-1.33-5.3-4.63-5.46-4.85-.16-.22-1.3-1.73-1.3-3.3 0-1.57.82-2.34 1.11-2.66.29-.32.63-.4.84-.4.21 0 .42.01.6.02.2.01.46-.07.72.55.26.63.9 2.2.98 2.36.08.16.13.35.03.55-.1.2-.16.32-.31.5-.16.18-.33.4-.47.54-.16.16-.33.33-.14.65.19.32.84 1.38 1.8 2.24 1.24 1.11 2.28 1.45 2.61 1.61.32.16.51.14.7-.08.2-.22.84-.98 1.07-1.32.22-.34.45-.29.75-.17.31.12 1.95.92 2.28 1.09.33.16.55.24.63.38.08.14.08.82-.16 1.5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-base font-black text-black leading-tight">
                        One-Tap WhatsApp
                      </div>
                      <div className="text-xs text-black/80 font-medium">
                        Direct to Tousif Raza (+91 81023 08736)
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-black/15 text-black flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                    &lt; 5m reply
                  </span>
                </div>
                <div className="text-xs text-black/85 flex items-center justify-between pt-1 border-t border-black/10">
                  <span>No form required • Tap to start chat</span>
                  <span className="text-sm font-black group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </a>

              {/* Option 2: Conversational AI Lead Intake Button */}
              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('open-makerly-chat', { detail: { mode: 'lead_intake' } }));
                }}
                className="group relative flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-r from-brand-blue to-indigo-600 hover:from-blue-600 hover:to-indigo-500 text-white font-bold shadow-[0_10px_35px_rgba(41,82,204,0.35)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_15px_45px_rgba(41,82,204,0.5)] border border-white/20 cursor-pointer text-left"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" x2="12" y1="19" y2="22" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-base font-black text-white leading-tight">
                        Talk with AI Assistant
                      </div>
                      <div className="text-xs text-white/80 font-medium">
                        Voice or Text Intake
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/20 text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AI Agent Live
                  </span>
                </div>
                <div className="text-xs text-white/80 flex items-center justify-between pt-1 border-t border-white/10">
                  <span>Tell your idea in 60s • Auto-collects brief</span>
                  <span className="text-sm font-black group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </button>
            </div>
          </div>

          {/* Section Divider */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-x-0 h-px bg-white/10" />
            <span className="relative px-4 py-1 rounded-full bg-[#1a1a2e] border border-white/15 text-[11px] font-mono uppercase tracking-widest text-slate-400">
              Or Submit Detailed Project Brief Below
            </span>
          </div>

          <GlassCard className="w-full cursor-default border border-white/10 bg-white/6 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_80px_rgba(0,0,0,0.25)] md:p-12">
            <div className="mb-8 flex flex-col gap-3">
              <p className="text-sm uppercase tracking-[0.26em] text-[#EDE8DF]/55 font-mono">
                Project Intake Form
              </p>
              <p className="max-w-2xl text-sm leading-7 text-[#EDE8DF]/70 md:text-base">
                Every submission is added to our CRM and triggers an internal
                alert plus an automatic confirmation email, so your request is
                captured immediately.
              </p>
            </div>
            <ContactForm />
          </GlassCard>
        </div>
      </div>
    </section>
  );
}
