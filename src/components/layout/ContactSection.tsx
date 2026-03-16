"use client";

import { motion } from "framer-motion";
import React from "react";
import ContactForm from "@/components/ContactForm";
import GlassCard from "@/components/ui/GlassCard";

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="relative z-20 w-full bg-[#1a1a2e] px-4 py-24 md:px-12 md:py-32"
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

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full"
        >
          <GlassCard className="w-full cursor-default border border-white/10 bg-white/6 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.25)] hover:shadow-[0_24px_80px_rgba(0,0,0,0.25)] md:p-12">
            <div className="mb-8 flex flex-col gap-3">
              <p className="text-sm uppercase tracking-[0.26em] text-[#EDE8DF]/55">
                Project Intake
              </p>
              <p className="max-w-2xl text-sm leading-7 text-[#EDE8DF]/70 md:text-base">
                Every submission is added to our CRM and triggers an internal
                alert plus an automatic confirmation email, so your request is
                captured immediately.
              </p>
            </div>
            <ContactForm />
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
