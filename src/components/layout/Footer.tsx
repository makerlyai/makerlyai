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
      className="relative w-full h-[80vh] bg-foreground text-background overflow-hidden flex flex-col justify-between pt-20"
      style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
    >
      <motion.div 
        style={{ y: yReveal }}
        className="w-full h-full flex flex-col justify-between absolute inset-0 pt-20 pb-4 px-4 md:px-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-7xl mx-auto z-10 relative">
          
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-3xl md:text-5xl font-light mb-8 max-w-xl">
              Ready to construct your digital empire?
            </h3>
            <ButtonWithIconDemo 
              text="Start the conversation" 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="!bg-background !text-foreground !hover:bg-white/90 scale-125 origin-left"
            />
          </div>

          <div className="col-span-1">
            <p className="text-sm uppercase tracking-widest mb-6 opacity-50 font-mono">Connect // Platform</p>
            <div className="flex flex-wrap gap-3">
              {[
                { name: 'Instagram', url: 'https://instagram.com/makerlyai' },
                { name: 'X', url: 'https://x.com/makerlyai' },
                { name: 'LinkedIn', url: 'https://linkedin.com/company/makerlyai' },
                { name: 'GitHub', url: 'https://github.com/makerlyai' },
                { name: 'YouTube', url: 'https://youtube.com/@makerlyai' },
                { name: 'Reddit', url: 'https://reddit.com/u/makerlyai' },
                { name: 'Telegram', url: 'https://t.me/makerlyai' },
                { name: 'Gmail', url: 'mailto:getmakerlyai@gmail.com' }
              ].map((link) => (
                <a 
                  key={link.name} 
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative overflow-hidden px-4 py-2 border border-white/10 rounded-full text-sm font-medium transition-colors hover:border-brand-blue/50"
                >
                  <span className="relative z-10 transition-colors group-hover:text-white">{link.name}</span>
                  <div className="absolute inset-0 bg-brand-blue/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                </a>
              ))}
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
