"use client";

import { motion } from "framer-motion";
import { Globe, Smartphone, Brain, BarChart3 } from "lucide-react";

const showcaseItems = [
  {
    icon: Brain,
    title: "AI Agents & Automation",
    description:
      "Deploy intelligent virtual employees that handle support, scheduling, and sales 24/7.",
    gradient: "from-purple-500/20 to-brand-blue/20",
  },
  {
    icon: Globe,
    title: "Immersive Web Experiences",
    description:
      "Blazing fast marketing sites that feel like native apps — fluid, interactive, and conversion-optimized.",
    gradient: "from-brand-blue/20 to-cyan-400/20",
  },
  {
    icon: Smartphone,
    title: "Cross-Platform Apps",
    description:
      "Native-quality mobile and desktop apps built with modern frameworks. One codebase, every device.",
    gradient: "from-cyan-400/20 to-emerald-400/20",
  },
  {
    icon: BarChart3,
    title: "SaaS & Revenue Engines",
    description:
      "Scalable multi-tenant platforms with billing, analytics, and growth tools built in from day one.",
    gradient: "from-emerald-400/20 to-purple-500/20",
  },
];

export function ShowcaseSection() {
  return (
    <section className="relative w-full py-24 md:py-32 px-4 md:px-12 z-20 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-blue/10 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16 md:mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-4"
          >
            What We <span className="text-gradient">Build</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-lg md:text-xl text-foreground/60 max-w-2xl mx-auto"
          >
            We build the same immersive, high-conversion digital products that
            the world&apos;s best companies use — but for your business.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {showcaseItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl border border-white/10 bg-black/40 p-8 md:p-10 overflow-hidden transition-colors duration-300 hover:border-white/20"
            >
              {/* Gradient hover effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
              />

              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center mb-6">
                  <item.icon className="w-5 h-5 text-brand-blue" />
                </div>

                <h3 className="text-xl md:text-2xl font-bold mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-foreground/60 leading-relaxed text-sm md:text-base">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
