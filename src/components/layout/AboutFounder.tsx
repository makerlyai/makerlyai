"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import GlassCard from "@/components/ui/GlassCard";
import Image from "next/image";

export default function AboutFounder() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax calculations
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  // Content for the cards
  // Mobile Math: Left image = 400px. Right column = 192px + 192px + 16px (gap-4) = 400px. Perfect alignment.
  const founderImages = [
    { src: "/myphoto1.jpg", y: y1, className: "col-span-1 md:col-span-2 row-span-2 h-[400px] md:h-[60vh]" },
    { src: "/myphoto2.webp", y: y2, className: "col-span-1 h-[192px] md:h-[30vh]" },
    { src: "/myphoto3.jpg", y: y3, className: "col-span-1 h-[192px] md:h-[30vh]" },
    { src: "/myphoto4nature.jpg", y: y1, className: "col-span-2 md:col-span-2 h-[250px] md:h-[30vh]" }
  ];

  return (
    <section id="founder" ref={containerRef} className="relative w-full py-24 md:py-48 px-4 md:px-12 bg-background overflow-hidden">
      <motion.div style={{ opacity }} className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Text Area */}
        <motion.div style={{ scale }} className="w-full lg:w-5/12 z-20">
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Meet the <br/>
            <span className="text-gradient">Architect</span>
          </h2>
          <div className="space-y-6 text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
             <p>
               With years of award-winning experience, we don't just write code—we engineer digital empires. Every pixel is placed with intent. Every animation is mathematically smooth.
             </p>
             <p>
               At MakerlyAI, the philosophy is simple: <strong className="font-bold text-foreground">Build products that feel expensive, run blazingly fast, and force the competition to play catch-up.</strong>
             </p>
          </div>
        </motion.div>

        {/* Parallax Photo Grid */}
        <div className="w-full lg:w-7/12 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 relative">
          
          {/* Abstract glow behind the images to separate from background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-blue/10 blur-[100px] pointer-events-none rounded-full" />

          {founderImages.map((img, idx) => (
             <motion.div 
               key={idx} 
               style={{ y: isMobile ? 0 : img.y }} 
               className={`relative rounded-3xl overflow-hidden group shadow-2xl ${img.className}`}
             >
               {/* Using an img tag directly instead of next/image temporarily since assets need to be moved to /public */}
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
               <img 
                 src={img.src} 
                 alt="Founder Activity" 
                 decoding="async"
                 className="object-cover w-full h-full scale-100 group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
               />
               <div className="absolute inset-0 border border-white/20 rounded-3xl z-20 pointer-events-none mix-blend-overlay" />
             </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
