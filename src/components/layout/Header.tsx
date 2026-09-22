"use client";

import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

import { usePathname } from "next/navigation";

import ButtonWithIconDemo from "@/components/ui/button-with-icon";

export default function Header() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Suppress marketing navigation header on CRM workspace
  if (pathname?.toLowerCase().startsWith("/crm")) {
    return null;
  }

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
          className="relative flex items-center justify-center cursor-pointer group bg-white md:backdrop-blur-3xl h-12 md:h-16 px-7 rounded-full border border-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-500 hover:scale-105 hover:bg-white overflow-hidden"
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

        {/* Desktop Sticky Anchor Navigation */}
        <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 backdrop-blur-xl shadow-inner">
          {[
            { label: "Capabilities", id: "capabilities" },
            { label: "Process", id: "process" },
            { label: "Real Builds", id: "work" },
            { label: "Pricing", id: "pricing" },
            { label: "Team", id: "founder" },
            { label: "FAQ", id: "faq" },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 cursor-pointer"
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Desktop Quick Action */}
        <div className="hidden md:flex items-center gap-3">
          <ButtonWithIconDemo 
            text="Start Your Project" 
            onClick={() => scrollToSection('contact')} 
            className="!bg-brand-blue !text-white font-bold"
          />
        </div>

        {/* Mobile Hamburger Menu Toggle */}
        <button 
          className="lg:hidden relative z-[110] p-2 text-white bg-white/10 backdrop-blur-md rounded-full border border-white/20 cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </motion.header>

    {/* Mobile Fullscreen Overlay Menu */}
    <AnimatePresence>
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%", transition: { delay: 0.1, duration: 0.3 } }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[90] bg-black/95 backdrop-blur-3xl flex flex-col items-center justify-center"
        >
          <div className="flex flex-col gap-6 text-center w-full max-w-sm px-8">
            <motion.p 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-brand-blue tracking-[0.3em] text-xs font-bold uppercase mb-2"
            >
              Navigation
            </motion.p>
            
            {[
              { label: "Capabilities", id: "capabilities" },
              { label: "Process", id: "process" },
              { label: "Real Builds", id: "work" },
              { label: "Pricing & Sprints", id: "pricing" },
              { label: "Architects & Team", id: "founder" },
              { label: "FAQ", id: "faq" },
              { label: "CRM Workspace", id: "/crm", isRoute: true },
            ].map((link, idx) => (
              <motion.button
                key={link.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + (idx * 0.04) }}
                onClick={() => {
                  if (link.isRoute) {
                    window.location.href = link.id;
                  } else {
                    scrollToSection(link.id);
                  }
                  setIsMobileMenuOpen(false);
                }}
                className="text-2xl font-black text-white hover:text-brand-blue transition-colors duration-200 cursor-pointer"
              >
                {link.label}
              </motion.button>
            ))}

            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.35 }}
               className="mt-6 pt-6 border-t border-white/10 flex justify-center w-full"
            >
              <ButtonWithIconDemo 
                text="Start Your Project" 
                onClick={() => scrollToSection('contact')}
                className="!bg-brand-blue !text-white w-full py-4 text-base font-bold cursor-pointer"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
