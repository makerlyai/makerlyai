"use client";

import React from "react";
import { InfiniteSlider } from "@/components/core/infinite-slider";

const TECHNOLOGIES = [
  { name: "Next.js 16", tag: "Full-Stack" },
  { name: "Sarvam AI", tag: "Voice & Speech" },
  { name: "Supabase", tag: "PostgreSQL & Auth" },
  { name: "OpenAI", tag: "LLMs & Embeddings" },
  { name: "Tailwind CSS", tag: "Design Systems" },
  { name: "Stripe", tag: "Global Payments" },
  { name: "TypeScript", tag: "Type-Safe Architecture" },
  { name: "Python", tag: "FastAPI & Microservices" },
  { name: "Vercel Edge", tag: "Sub-100ms CDN" },
  { name: "Docker", tag: "Containerized Workflows" },
];

export function CapabilitiesTicker() {
  return (
    <div className="relative w-full py-8 overflow-hidden bg-black/40 border-y border-white/10 z-20">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-black to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-black to-transparent" />

      <InfiniteSlider speedOnHover={45} duration={25} gap={20}>
        {TECHNOLOGIES.map((tech) => (
          <div
            key={tech.name}
            className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300 hover:text-white hover:border-brand-blue/50 hover:bg-brand-blue/10 transition-all cursor-default"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-blue animate-pulse" />
            <span className="font-bold text-white">{tech.name}</span>
            <span className="text-[10px] text-slate-500">[{tech.tag}]</span>
          </div>
        ))}
      </InfiniteSlider>
    </div>
  );
}
