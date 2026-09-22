"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

import ButtonWithIconDemo from "@/components/ui/button-with-icon";

export default function Footer() {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  // Create a delayed parallax reveal effect
  const yReveal = useTransform(scrollYProgress, [0, 1], ["-50%", "0%"]);
  // Keep the giant "MAKERLYAI" text slightly slower for 3D depth
  const textY = useTransform(scrollYProgress, [0, 1], ["20%", "0%"]);

  return (
    <footer 
      ref={containerRef}
      className="relative w-full h-[700px] md:h-[80vh] bg-foreground text-background overflow-hidden flex flex-col justify-between pt-20"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      <motion.div 
        style={{ y: yReveal }}
        className="w-full h-full flex flex-col justify-between absolute inset-0 pt-20 pb-4 px-4 md:px-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-7xl mx-auto z-10 relative">
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl md:text-5xl font-light mb-8 max-w-xl text-white">
              Ready to build and scale your digital product?
            </h3>
            <ButtonWithIconDemo 
              text="Start Your Project" 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="!bg-brand-blue !text-white font-bold scale-110 origin-left"
            />

            <div className="mt-8 text-xs text-white/50 space-y-1 font-mono">
              <p>Makerly AI • Digital Product &amp; AI Engineering Studio</p>
              <p>Operating since 2024 • Serving global founders across India, US, and UK</p>
              <p>Direct Inquiries: <a href="mailto:getmakerlyai@gmail.com" className="text-brand-300 underline">getmakerlyai@gmail.com</a></p>
            </div>
          </div>

          <div className="col-span-1 flex flex-col justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest mb-4 opacity-50 font-mono">Connect // Network</p>
              <div className="flex flex-wrap gap-2 mb-8">
                {[
                  { name: 'LinkedIn', url: 'https://linkedin.com/company/makerlyai' },
                  { name: 'GitHub', url: 'https://github.com/makerlyai' },
                  { name: 'X / Twitter', url: 'https://x.com/makerlyai' },
                  { name: 'Instagram', url: 'https://instagram.com/makerlyai' },
                  { name: 'YouTube', url: 'https://youtube.com/@makerlyai' },
                  { name: 'Partner CRM', url: '/crm' },
                ].map((link) => (
                  <a 
                    key={link.name} 
                    href={link.url}
                    target={link.url.startsWith('/') ? '_self' : '_blank'}
                    rel="noreferrer"
                    className="group relative overflow-hidden px-3.5 py-1.5 border border-white/10 rounded-full text-xs font-medium transition-colors hover:border-brand-blue/50"
                  >
                    <span className="relative z-10 transition-colors group-hover:text-white">{link.name}</span>
                    <div className="absolute inset-0 bg-brand-blue/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  </a>
                ))}
              </div>
            </div>

            {/* Legal & Trust Navigation */}
            <div className="pt-4 border-t border-white/10">
              <p className="text-[10px] uppercase tracking-widest mb-2 opacity-50 font-mono">Legal &amp; Governance</p>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                <a href="/privacy-policy" className="hover:text-white transition-colors underline">
                  Privacy Policy
                </a>
                <a href="/terms-of-service" className="hover:text-white transition-colors underline">
                  Terms of Service
                </a>
                <a href="/refund-policy" className="hover:text-white transition-colors underline">
                  Refund &amp; Guarantee
                </a>
              </div>
              <p className="text-[10px] text-white/40 mt-3 font-mono">
                © {new Date().getFullYear()} Makerly AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>

        {/* Massive Parallax Typography */}
        <div className="w-full overflow-hidden mt-auto pointer-events-none select-none">
          <motion.h1 
             style={{ y: textY }}
             className="text-[15vw] leading-[0.8] font-black tracking-tighter text-background/10 text-center w-full"
          >
            MAKERLYAI
          </motion.h1>
        </div>
      </motion.div>
    </footer>
  );
}
