"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

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

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isMobileMenuOpen]);

  // Handle smooth scroll to section
  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false);
    // Slight delay to allow menu animation to start closing
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <>
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
          className="relative flex items-center justify-center cursor-pointer group bg-white/95 md:backdrop-blur-3xl h-10 md:h-14 px-8 rounded-full border border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:scale-105 hover:bg-white overflow-hidden"
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

        {/* Desktop Quick Action */}
        <div className="hidden md:block">
          <ButtonWithIconDemo 
            text="Get in touch" 
            onClick={() => scrollToSection('contact')} 
          />
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <button 
          className="md:hidden relative z-[110] p-2 text-white bg-white/10 backdrop-blur-md rounded-full border border-white/20"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </motion.header>

    {/* Mobile Fullscreen Overlay Menu */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%", transition: { delay: 0.2, duration: 0.3 } }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center"
        >
          <div className="flex flex-col gap-8 text-center w-full px-8">
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-white/50 tracking-[0.3em] text-xs uppercase mb-4"
            >
              Navigation
            </motion.p>
            
            {[
              { label: "Home", id: "home" },
              { label: "Capabilities", id: "capabilities" },
              { label: "Architecture", id: "robot" },
              { label: "Founder", id: "founder" }
            ].map((link, idx) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + (idx * 0.05) }}
                onClick={() => {
                  if (link.id === 'home') window.scrollTo({ top: 0, behavior: 'smooth' });
                  else if (link.id === 'founder') scrollToSection('founder');
                  else if (link.id === 'robot') scrollToSection('robot');
                  else scrollToSection(link.id);
                  setIsMobileMenuOpen(false);
                }}
                className="text-4xl font-black text-white hover:text-brand-blue transition-colors duration-300"
              >
                {link.label}
              </motion.button>
            ))}

            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.4 }}
               className="mt-8 pt-8 border-t border-white/10 flex justify-center w-full"
            >
              <ButtonWithIconDemo 
                text="Start Project / Contact" 
                onClick={() => scrollToSection('contact')}
                className="!bg-brand-blue !text-white w-full py-6 text-xl"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
