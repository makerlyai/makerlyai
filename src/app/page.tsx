"use client";

import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import SmoothLoader from "@/components/layout/SmoothLoader";
import AboutFounder from "@/components/layout/AboutFounder";
import ScrollSequence from "@/components/effects/ScrollSequence";
import Footer from "@/components/layout/Footer";
import GlassCard from "@/components/ui/GlassCard";
import ContactSection from "@/components/layout/ContactSection";
import ButtonWithIconDemo from "@/components/ui/button-with-icon";
import { SpecialText } from "@/components/ui/special-text";
import { TextRoll } from "@/components/ui/text-roll";
import { GlowingFeatures } from "@/components/ui/glowing-features";
import { Tweet } from "@/components/ui/tweet";
import { RobotSection } from "@/components/ui/interactive-3d-robot";
import { AntiGravityHero } from "@/components/ui/anti-gravity-hero";
import { TestimonialsWithMarquee } from "@/components/ui/testimonials-with-marquee";
import { RadialOrbitalTimelineDemo } from "@/components/ui/radial-orbital-timeline-demo";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Parallax setup for Hero using Framer Motion
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const yText = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Mobile optimization checker
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);

  return (
    <main className="relative min-h-screen selection:bg-brand-blue/30 bg-background overflow-clip">
      
      {/* Universal Fixed Cinematic Background - Prevents awkward black gaps */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
         <div className="absolute inset-0 bg-background/90 md:bg-background/90 dark:bg-black/90 md:dark:bg-black/85 z-10 md:mix-blend-multiply" />
         <img 
           src="/scene1.jpg" 
           alt="Cinematic Canvas" 
           className="w-full h-full object-cover opacity-15 md:opacity-25 md:mix-blend-luminosity"
         />
      </div>
      {isLoading && <SmoothLoader onLoadingComplete={() => setIsLoading(false)} />}
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative w-full h-screen flex flex-col items-center justify-center p-4 overflow-hidden"
      >
        {/* Hero section now leverages the universal fixed background */}


        {/* Abstract animated background blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-brand-blue/30 blur-[80px] md:blur-[120px] rounded-full mix-blend-screen pointer-events-none z-10" />
        
        <motion.div 
          style={{ y: isMobile ? 0 : yText, opacity: opacityText }}
          className="relative z-20 text-center flex flex-col items-center gap-6 w-full max-w-5xl"
        >
          {/* Subtle upper title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 20 : 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="uppercase tracking-[0.2em] font-medium text-xs md:text-sm opacity-70"
          >
            <SpecialText speed={20} delay={2}>Digital Architecture & AI</SpecialText>
          </motion.div>

          {/* Slogan */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.95 : 1 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9]"
          >
            <TextRoll duration={0.8}>WE BUILD,</TextRoll><br />
            <span className="text-brand-blue drop-shadow-[0_0_15px_rgba(26,75,156,0.5)]">
               <TextRoll duration={0.8} getEnterDelay={(i) => i * 0.1 + 0.4} getExitDelay={(i) => i * 0.1 + 0.6}>YOU GROW.</TextRoll>
            </span>
          </motion.h1>
          
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? 30 : 0 }}
             transition={{ duration: 0.8, delay: 0.6 }}
             className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <ButtonWithIconDemo 
               text="Start Project"
               onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
               className="!bg-brand-blue !text-white font-semibold flex items-center justify-center border-none hover:!bg-brand-blue/90"
            />
            <ButtonWithIconDemo 
               text="Our Capabilities"
               onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
               className="!bg-white/5 !text-white font-semibold flex items-center justify-center border border-white/20 hover:!bg-white/10"
            />
          </motion.div>
        </motion.div>
        

      </section>

      {/* Neon Scroll Stripe - Left to Right Motion */}
      <section id="capabilities" className="relative w-full py-24 md:py-32 overflow-hidden z-20 flex flex-col items-center justify-center bg-black/80 md:bg-black/40 md:backdrop-blur-xl border-y border-white/10">
        <div className="absolute inset-0 bg-brand-blue/5 blur-3xl pointer-events-none" />
        <p className="text-white/50 uppercase tracking-[0.3em] text-xs font-semibold mb-16 relative z-10">What We Do</p>
        
        <div className="relative flex overflow-hidden w-full group">
           {/* Moving from -50% to 0 aligns the duplicate loop for an infinite left-to-right scroll. */}
           <motion.div 
             className="flex whitespace-nowrap gap-12 sm:gap-24 px-6 items-center"
             animate={{ x: ["-50%", "0%"] }}
             transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
           >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-12 sm:gap-24 items-center pl-12 sm:pl-24">
                  <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-300 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                    SaaS Platforms
                  </span>
                  <span className="w-4 h-4 rounded-full bg-white/40 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <span className="text-4xl md:text-6xl lg:text-8xl font-black text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                    AI Agents
                  </span>
                  <span className="w-4 h-4 rounded-full bg-white/40 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-brand-blue drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">
                    Smart Receptionists
                  </span>
                  <span className="w-4 h-4 rounded-full bg-white/40 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <span className="text-4xl md:text-6xl lg:text-8xl font-black text-white hover:text-brand-blue transition-colors duration-500">
                    Web Apps
                  </span>
                  <span className="w-4 h-4 rounded-full bg-white/40 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white drop-shadow-[0_0_15px_rgba(103,232,249,0.5)]">
                    Mobile Apps
                  </span>
                  <span className="w-4 h-4 rounded-full bg-white/40 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <span className="text-4xl md:text-6xl lg:text-8xl font-black text-white/90 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                    Process Automation
                  </span>
                  <span className="w-4 h-4 rounded-full bg-white/40 drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                  <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-purple-400 drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]">
                    Revenue Growth
                  </span>
                </div>
              ))}
           </motion.div>
        </div>
      </section>

      <GlowingFeatures />

      <TestimonialsWithMarquee />

      <RadialOrbitalTimelineDemo />

      <RobotSection />

      <AntiGravityHero />

      {/* Image Sequence Scroll Triggered Effect */}
      {/* Fallback frame naming strategy based on ezgif extraction */}
      <ScrollSequence 
        frameCount={136} 
        imagePathPrefix="/sequence/ezgif-frame-" 
        imageExtension="jpg" 
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10 text-center px-4 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black uppercase text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)] tracking-tighter mix-blend-difference mb-4">
            Interactive <span className="text-brand-blue">Web Magic</span>
          </h2>
          <p className="text-lg md:text-2xl font-light text-white/90 drop-shadow-md">
            We implemented this 15fps cinematic scroll effect natively in the browser. 
            We build these same immersive visual experiences to captivate <span className="font-semibold text-brand-blue">your</span> clients.
          </p>
        </div>
      </ScrollSequence>

      {/* Founder Section */}
      <AboutFounder />

      {/* Social Proof & Updates */}
      <section className="relative w-full py-24 px-4 flex justify-center bg-black/80 md:bg-black/40 md:backdrop-blur-3xl z-20 border-y border-white/10">
         <Tweet className="w-full shadow-2xl scale-[1.02]" id="1630000000000000000" />
      </section>

      {/* Contact Form Section */}
      <ContactSection />

      {/* Footer Parallax */}
      <Footer />
    </main>
  );
}
