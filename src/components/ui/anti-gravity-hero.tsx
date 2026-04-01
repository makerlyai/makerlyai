"use client";

import { motion } from "framer-motion";

function CSSFloatingCard() {
  return (
    <div className="relative w-full max-w-sm mx-auto h-[450px] md:h-[550px] flex items-center justify-center" style={{ perspective: "1000px" }}>
      <motion.div
        animate={{
          y: [-12, 12, -12],
          rotateY: [-4, 4, -4],
          rotateX: [2, -2, 2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="w-[260px] h-[400px] md:w-[300px] md:h-[460px] rounded-2xl relative overflow-hidden flex flex-col p-6 shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {/* Specular highlight */}
        <div className="absolute top-0 left-0 w-full h-[150%] bg-gradient-to-tr from-transparent via-white/20 to-transparent -rotate-45 translate-y-[-50%] pointer-events-none" />
        
        <h3 className="text-xl font-black text-white tracking-widest drop-shadow-md">MAKERLY AI</h3>
        <p className="text-sm font-bold text-brand-blue tracking-widest mt-1">MAKER-001</p>
        
        {/* Gold chip */}
        <div className="w-12 h-10 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-600 mt-6 shadow-inner" />
        
        <div className="flex-grow flex items-center justify-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mix-blend-overlay tracking-tighter">ACCESS</h2>
        </div>
        
        {/* Magnetic strip */}
        <div className="absolute bottom-16 left-0 w-full h-8 bg-brand-blue/80" />
      </motion.div>
      
      {/* Shadow */}
      <motion.div 
        animate={{ scale: [0.8, 1, 0.8], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-48 h-12 bg-black/40 blur-xl rounded-[100%]"
        style={{ willChange: "transform, opacity" }}
      />
    </div>
  );
}

export function AntiGravityHero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden z-20">
      
      {/* Background glow */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
        <div className="w-[400px] h-[400px] md:w-[500px] md:h-[500px] bg-brand-blue/15 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Text Content */}
        <div className="flex flex-col gap-6 text-center lg:text-left order-2 lg:order-1 px-4 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-semibold tracking-widest text-brand-blue mb-4 uppercase">
              Secure Architecture
            </p>
            <h2 className="text-5xl sm:text-6xl md:text-7xl font-black text-white leading-tight tracking-tighter drop-shadow-lg mb-6">
              Unlock the <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-300">Future.</span>
            </h2>
            <p className="text-lg md:text-xl text-white/70 max-w-lg mx-auto lg:mx-0 font-light">
              Gain exclusive access to MakerlyAI&apos;s proprietary machine learning models and next-generation UI blueprints.
            </p>
          </motion.div>
        </div>

        {/* Right ID Card */}
        <div className="w-full h-[500px] md:h-[600px] relative order-1 lg:order-2 flex items-center justify-center">
          <CSSFloatingCard />
        </div>
        
      </div>
    </section>
  );
}
