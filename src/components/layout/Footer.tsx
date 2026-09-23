"use client";

import React, { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import ButtonWithIconDemo from "@/components/ui/button-with-icon";
import { SocialFoldCard } from "@/components/ui/social-fold-card";
import { Mail, ShieldCheck, Sparkles, MessageCircle, Bot } from "lucide-react";

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"],
  });

  // Parallax sliding motion between upward section and footer
  const yReveal = useTransform(scrollYProgress, [0, 1], ["-35%", "0%"]);
  // 3D Depth parallax on massive watermark typography
  const textY = useTransform(scrollYProgress, [0, 1], ["20%", "0%"]);

  const platformLinks = [
    { name: "Instagram", url: "https://instagram.com/makerlyai" },
    { name: "X", url: "https://x.com/makerlyai" },
    { name: "LinkedIn", url: "https://linkedin.com/company/makerlyai" },
    { name: "GitHub", url: "https://github.com/makerlyai" },
    { name: "YouTube", url: "https://youtube.com/@makerlyai" },
    { name: "Reddit", url: "https://reddit.com/u/makerlyai" },
    { name: "Telegram", url: "https://t.me/makerlyai" },
    { name: "Gmail", url: "mailto:getmakerlyai@gmail.com" },
    { name: "Partner CRM", url: "/crm" },
  ];

  return (
    <footer
      ref={containerRef}
      className="relative z-10 w-full min-h-[700px] md:min-h-[85vh] bg-[#f5f5f0] text-[#121212] overflow-hidden flex flex-col justify-between pt-16 md:pt-24 pb-12 sm:pb-16 md:pb-20"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      <motion.div
        style={{ y: yReveal }}
        className="w-full h-full flex flex-col justify-between max-w-7xl mx-auto px-6 md:px-12 relative z-10"
      >
        {/* Top 2-Card Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 w-full items-start">
          
          {/* Card 1 (Left): Headline, Action CTA & Current Fast-Track Reachout */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <h3 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#121212] tracking-tight leading-[1.08] max-w-xl">
              Ready to construct your <br />
              <span className="font-semibold text-[#1450B4]">digital empire?</span>
            </h3>

            {/* Primary Action Button */}
            <div className="pt-2">
              <ButtonWithIconDemo
                text="Start the conversation"
                variant="dark"
                onClick={() =>
                  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
                }
                className="scale-110 md:scale-125 origin-left shadow-2xl cursor-pointer"
              />
            </div>

            {/* Fast-Track Direct Inquiries (Current Feature) */}
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/918102308736?text=Hi%2C%20I%20want%20to%20build%20a%20project%20with%20Makerly%20AI."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#25D366]/20 border border-[#25D366]/60 text-xs font-bold text-[#0c6b30] hover:bg-[#25D366]/30 transition-all shadow-sm"
              >
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                <MessageCircle className="w-3.5 h-3.5 fill-current" />
                <span>One-Tap WhatsApp (+91 81023 08736)</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(
                    new CustomEvent("open-makerly-chat", { detail: { mode: "lead_intake" } })
                  );
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/30 text-xs font-bold text-[#1450B4] hover:bg-brand-blue/20 transition-all cursor-pointer"
              >
                <Bot className="w-3.5 h-3.5 text-brand-blue" />
                <span>Talk with AI Assistant</span>
              </button>

              <a
                href="mailto:getmakerlyai@gmail.com"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-black/15 bg-black/5 text-xs font-mono text-neutral-700 hover:text-black hover:border-black/30 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-neutral-600" />
                <span>getmakerlyai@gmail.com</span>
              </a>
            </div>

            {/* Studio Info Note */}
            <div className="pt-4 text-xs text-neutral-500 space-y-1 font-mono border-t border-black/10 max-w-md">
              <p><span className="font-logo font-bold">Makerly AI</span> • Digital Product &amp; AI Engineering Studio</p>
              <p>Operating since 2024 • Serving global founders across India, US, and UK</p>
              <p className="text-neutral-600 font-semibold">100% Intellectual Property &amp; Code Ownership Transfer.</p>
            </div>
          </div>

          {/* Card 2 (Right): Interactive Origami Fold Card & Platform Grid */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-neutral-500 font-mono font-semibold mb-4">
                Connect // Platform
              </p>

              {/* Origami Fold Card + Quick Social Links */}
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
                <SocialFoldCard
                  label="Socials"
                  instagramUrl="https://instagram.com/makerlyai"
                  twitterUrl="https://x.com/makerlyai"
                  discordUrl="https://github.com/makerlyai"
                  className="shrink-0 scale-90 origin-top-left"
                />

                {/* Platform Pills */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {platformLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.url}
                      target={link.url.startsWith("/") ? "_self" : "_blank"}
                      rel="noreferrer"
                      className="group relative overflow-hidden px-3.5 py-1.5 border border-black/15 bg-black/[0.03] rounded-full text-xs font-medium text-neutral-800 transition-all hover:border-brand-blue hover:text-[#1450B4] hover:bg-black/5"
                    >
                      <span className="relative z-10 transition-colors">{link.name}</span>
                      <div className="absolute inset-0 bg-[#1450B4]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Legal & Governance Navigation */}
            <div className="pt-4 border-t border-black/10">
              <p className="text-[10px] uppercase tracking-widest mb-2 text-neutral-400 font-mono font-bold">
                Legal &amp; Governance
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs font-mono text-neutral-600">
                <a
                  href="/privacy-policy"
                  className="hover:text-black transition-colors underline decoration-black/20 hover:decoration-black"
                >
                  Privacy Policy
                </a>
                <a
                  href="/terms-of-service"
                  className="hover:text-black transition-colors underline decoration-black/20 hover:decoration-black"
                >
                  Terms of Service
                </a>
                <a
                  href="/refund-policy"
                  className="hover:text-black transition-colors underline decoration-black/20 hover:decoration-black"
                >
                  Refund &amp; Guarantee
                </a>
                <a
                  href="/crm"
                  className="hover:text-brand-blue transition-colors font-bold flex items-center gap-1"
                >
                  <ShieldCheck className="w-3 h-3 text-[#1450B4]" />
                  <span>Partner Portal</span>
                </a>
              </div>
              <p className="text-[11px] text-neutral-500 mt-3 font-mono">
                &copy; 2026 <span className="font-logo font-bold">Makerly AI</span>. All rights reserved. Built for visionary founders.
              </p>
            </div>
          </div>
        </div>

        {/* Massive Parallax Typography Watermark */}
        <div className="w-full overflow-hidden mt-12 md:mt-16 pb-4 sm:pb-8 pointer-events-none select-none text-center flex items-center justify-center">
          <motion.h1
            style={{ y: textY }}
            className="text-[7.8vw] sm:text-[8.2vw] md:text-[8.8vw] lg:text-[9.2vw] leading-none font-black tracking-tight text-[#121212]/[0.08] inline-block font-logo whitespace-nowrap px-4"
          >
            MAKERLYAI
          </motion.h1>
        </div>
      </motion.div>
    </footer>
  );
}
