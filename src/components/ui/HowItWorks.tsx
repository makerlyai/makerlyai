"use client";

import { motion } from "framer-motion";
import { MessageSquare, Rocket, CreditCard } from "lucide-react";

const steps = [
  {
    icon: MessageSquare,
    number: "01",
    title: "Tell Us Your Idea",
    description:
      "Share your vision — app, SaaS, AI agent, website. We listen, ask sharp questions, and map your requirements.",
  },
  {
    icon: Rocket,
    number: "02",
    title: "We Build in 24 Hours",
    description:
      "Our elite engineers deliver a working preview within 24 hours. Real code. Real product. Not a mockup.",
  },
  {
    icon: CreditCard,
    number: "03",
    title: "Pay Only If You Like It",
    description:
      "Review the preview. If it doesn't meet your standards, you pay nothing. Zero risk, maximum reward.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative w-full py-24 md:py-32 px-4 md:px-12 z-20"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-semibold tracking-widest text-brand-blue mb-6 uppercase"
          >
            How It Works
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
          >
            From Idea to{" "}
            <span className="text-gradient">Product</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto"
          >
            No bureaucracy. No wasted weeks. Just results.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="group relative rounded-2xl border border-white/10 bg-black/40 p-8 md:p-10 transition-colors duration-300 hover:border-brand-blue/30 hover:bg-black/60"
            >
              {/* Step Number */}
              <span className="absolute top-6 right-6 text-6xl font-black text-white/[0.04] select-none pointer-events-none leading-none">
                {step.number}
              </span>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center mb-6 transition-colors duration-300 group-hover:border-brand-blue/30 group-hover:bg-brand-blue/10">
                <step.icon className="w-5 h-5 text-brand-blue" />
              </div>

              {/* Content */}
              <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight">
                {step.title}
              </h3>
              <p className="text-foreground/60 leading-relaxed text-sm md:text-base">
                {step.description}
              </p>

              {/* Connecting line (hidden on last item) */}
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 md:-right-4 w-8 h-px bg-gradient-to-r from-white/20 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
