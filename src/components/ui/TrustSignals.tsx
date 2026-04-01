"use client";

import { motion } from "framer-motion";
import { Clock, Shield, Globe2, Zap } from "lucide-react";

const signals = [
  { icon: Clock, text: "Working Preview in 24h" },
  { icon: Shield, text: "Pay $0 If Not Satisfied" },
  { icon: Globe2, text: "Trusted by Founders Worldwide" },
  { icon: Zap, text: "Sub-Second Load Times" },
];

export function TrustSignals() {
  return (
    <section className="relative w-full py-12 md:py-16 px-4 z-20 border-y border-white/10 bg-black/40">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {signals.map((signal, i) => (
            <motion.div
              key={signal.text}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex flex-col items-center text-center gap-3"
            >
              <div className="w-10 h-10 rounded-full border border-brand-blue/30 bg-brand-blue/10 flex items-center justify-center">
                <signal.icon className="w-4 h-4 text-brand-blue" />
              </div>
              <p className="text-sm md:text-base font-semibold text-foreground/80 tracking-tight">
                {signal.text}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
