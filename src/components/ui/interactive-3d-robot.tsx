"use client";

import { Suspense, lazy, useRef, useState, useEffect } from "react";
import { useInView } from "framer-motion";
const Spline = lazy(() => import("@splinetool/react-spline"));

interface InteractiveRobotSplineProps {
  scene: string;
  className?: string;
}

export function InteractiveRobotSpline({
  scene,
  className,
}: InteractiveRobotSplineProps) {
  return (
    <Suspense
      fallback={
        <div
          className={`w-full h-full flex items-center justify-center bg-gray-900 text-white ${className}`}
        >
          <svg
            className="animate-spin h-5 w-5 text-white mr-3"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l2-2.647z"
            ></path>
          </svg>
        </div>
      }
    >
      <Spline scene={scene} className={className} />
    </Suspense>
  );
}

// --- CSS-Only Mobile Fallback ---
// A zero-WebGL, pure CSS surrogate to fill the void on smartphones while maintaining 60fps
function MobileRobotFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-0 perspective-[1000px] mt-24">
      {/* Background Ambient Glow */}
      <div className="absolute w-[300px] h-[300px] bg-brand-blue/20 blur-[80px] rounded-full mix-blend-screen" />
      
      {/* CSS Floating Robot Body */}
      <div 
        className="relative w-48 h-64 animate-[float_6s_ease-in-out_infinite] z-10"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Head */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-24 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-[-10px_10px_30px_rgba(0,0,0,0.5),inset_2px_2px_15px_rgba(255,255,255,0.4)] flex flex-col items-center justify-center gap-2 overflow-hidden">
           {/* Eyes */}
           <div className="flex gap-6 mt-2">
             <div className="w-4 h-5 rounded-full bg-brand-blue shadow-[0_0_15px_#1a4b9c] animate-pulse" />
             <div className="w-4 h-5 rounded-full bg-brand-blue shadow-[0_0_15px_#1a4b9c] animate-pulse" />
           </div>
           {/* Mouth/Voice indicator */}
           <div className="w-12 h-1 rounded-full bg-white/30 mt-4" />
           {/* Glass Sheen */}
           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent rotate-45" />
        </div>
        
        {/* Antenna */}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-1 h-6 bg-white/30">
           <div className="absolute -top-2 -left-1.5 w-4 h-4 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-ping" />
        </div>

        {/* Torso */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-40 h-32 bg-black/60 backdrop-blur-sm rounded-3xl border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] flex items-center justify-center">
           {/* Core Reactor */}
           <div className="w-16 h-16 rounded-full border-4 border-brand-blue/30 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-brand-blue/50 shadow-[0_0_30px_#1a4b9c] animate-pulse" />
           </div>
        </div>
        
        {/* Floating shadow below */}
        <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-32 h-4 bg-black/80 blur-xl rounded-[100%] animate-[shadowPulse_6s_ease-in-out_infinite]" />
      </div>
      
      {/* CSS Keyframes injected here for scoping (could also go to globals.css) */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes float {
          0%, 100% { transform: translateY(0) rotateY(-10deg) rotateX(5deg); }
          50% { transform: translateY(-20px) rotateY(10deg) rotateX(-5deg); }
        }
        @keyframes shadowPulse {
          0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.5; }
          50% { transform: translateX(-50%) scale(0.8); opacity: 0.2; }
        }
      `}} />
    </div>
  );
}

export function RobotSection() {
  const ROBOT_SCENE_URL =
    "https://prod.spline.design/PyzDhpQ9E5f1E3MT/scene.splinecode";
    
  const [isMobile, setIsMobile] = useState(true); // Default true for safety SSR
  
  useEffect(() => {
     setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);
    
  // Defer heavy WebGL canvas initialization until user scrolls near
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "800px 0px 800px 0px" });

  return (
    <div id="robot" ref={containerRef} className="relative w-full min-h-[100dvh] md:h-screen overflow-hidden bg-black border-y border-white/10 z-20 flex flex-col items-center justify-center">
      {/* Mobile CSS Surrogate - 0 JS overhead */}
      {isMobile && <MobileRobotFallback />}

      {/* Strictly prevent WebGL from loading on smartphones per performance rule */}
      {isInView && !isMobile && (
        <InteractiveRobotSpline
          scene={ROBOT_SCENE_URL}
          className="absolute inset-0 z-0"
        />
      )}
      
      {/* Explicit mask to hide the Spline watermark which sits at the bottom right */}
      {!isMobile && (
        <div className="absolute bottom-0 right-0 w-48 h-16 bg-black z-10 pointer-events-none" />
      )}

      <div className="absolute inset-0 z-20 pt-16 md:pt-12 lg:pt-16 px-4 md:px-8 pointer-events-none flex flex-col justify-start">
        <div className="text-center text-white drop-shadow-lg w-full max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black uppercase tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
            Meet <span className="text-brand-blue">Whobee</span>
          </h2>
          <p className="mt-4 text-xl opacity-80 uppercase tracking-widest">
            Your Dedicated AI Architecture Assistant
          </p>
        </div>
      </div>
    </div>
  );
}
