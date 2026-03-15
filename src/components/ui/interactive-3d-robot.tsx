"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export function RobotSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);

  return (
    <div id="robot" ref={containerRef} className="relative w-full min-h-[100dvh] md:h-screen overflow-hidden bg-black border-y border-white/10 z-20 flex flex-col items-center justify-center">
      
      {/* Abstract Background Particles */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-900/30 rounded-full blur-[100px] mix-blend-screen animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* The Neural Core (Glass Orb) */}
      <motion.div 
        style={{ y: y1, opacity }}
        className="relative z-10 w-[280px] h-[280px] md:w-[400px] md:h-[400px] mt-24 md:mt-0 flex items-center justify-center perspective-[1000px]"
      >
        {/* Outer Halo */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-blue/40 to-cyan-400/10 blur-xl animate-[spin_10s_linear_infinite]" />
        
        {/* Main Glass Sphere */}
        <div className="absolute inset-4 rounded-full bg-black/40 backdrop-blur-2xl border border-white/20 shadow-[inset_0_0_60px_rgba(255,255,255,0.1),0_0_100px_rgba(26,75,156,0.3)] overflow-hidden flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
          
          {/* Inner Light Core */}
          <div className="relative w-1/2 h-1/2 rounded-full bg-brand-blue/30 blur-2xl animate-[pulse_4s_ease-in-out_infinite]" />
          
          {/* Neural Rings (CSS pseudo logic) */}
          <div className="absolute w-full h-full rounded-full border border-white/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" />
          <div className="absolute w-3/4 h-3/4 rounded-full border border-brand-blue/30 animate-[spin_8s_linear_infinite]" style={{ borderStyle: 'dashed' }} />
          <div className="absolute w-1/2 h-1/2 rounded-full border border-cyan-400/20 animate-[spin_12s_linear_infinite_reverse]" style={{ borderStyle: 'dotted', borderWidth: '2px' }} />

          {/* Glass Specular Reflection Highlight */}
          <div className="absolute top-[10%] left-[20%] w-1/3 h-1/4 bg-white/30 rounded-[100%] blur-md rotate-[-45deg]" />
        </div>

        {/* Orbiting Data Node */}
        <div className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full shadow-[0_0_20px_#fff] animate-[orbit_8s_linear_infinite] origin-[-130px_130px] md:origin-[-190px_190px]" />
      </motion.div>

      {/* Typography Overlay */}
      <motion.div 
        style={{ y: y2 }}
        className="absolute inset-0 z-20 pt-16 md:pt-12 lg:pt-16 px-4 md:px-8 pointer-events-none flex flex-col justify-start"
      >
        <div className="text-center text-white drop-shadow-lg w-full max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] flex flex-col gap-2">
            <span>The</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-brand-blue to-cyan-300">Neural Core</span>
          </h2>
          <p className="mt-6 md:mt-8 text-lg md:text-xl opacity-80 uppercase tracking-widest px-4">
            Bespoke Architecture. Zero Bloat. Infinite Scale.
          </p>
        </div>
      </motion.div>

      {/* Global Injection of Scoped Keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-20px) scale(1.02); }
        }
        @keyframes orbit {
          0% { transform: rotate(0deg) translateX(140px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(140px) rotate(-360deg); }
        }
        @media (min-width: 768px) {
          @keyframes orbit {
            0% { transform: rotate(0deg) translateX(200px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(200px) rotate(-360deg); }
          }
        }
      `}} />
    </div>
  );
}
