"use client";

import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

import ButtonWithIconDemo from "@/components/ui/button-with-icon";

export default function Header() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Hide header when scrolling down, show when scrolling up
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 150) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setScrolled(latest > 50);
  });

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-[100] transition-[background-color,padding] duration-500 ${
        scrolled 
          ? "bg-background/95 md:bg-background/80 md:backdrop-blur-2xl py-4" 
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* Brand Logo - Encased in a perfectly crafted premium 'Glass Pill' container to frame the logo intentionally */}
        <div 
          className="relative flex items-center justify-center cursor-pointer group bg-white/95 md:backdrop-blur-3xl h-12 md:h-16 px-6 rounded-full border border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:scale-105 hover:bg-white overflow-hidden"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          {/* Subtle reflection overlay */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-20 pointer-events-none" />
          
          <img 
            src="/initialletterlogolandscape.png" 
            alt="MakerlyAI Master Brand" 
            className="h-8 md:h-12 w-auto object-contain relative z-10 mix-blend-multiply scale-[1.25] group-hover:scale-[1.3] transition-transform duration-500" 
          />
        </div>

        {/* Quick Action */}
        <div className="hidden md:block">
          <ButtonWithIconDemo 
            text="Get in touch" 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} 
          />
        </div>
      </div>
    </motion.header>
  );
}
