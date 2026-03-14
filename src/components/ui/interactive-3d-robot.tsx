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
    <div ref={containerRef} className="relative w-screen h-screen overflow-hidden bg-black border-y border-white/10 z-20">
      {/* Strictly prevent WebGL from loading on smartphones per performance rule */}
      {isInView && !isMobile && (
        <InteractiveRobotSpline
          scene={ROBOT_SCENE_URL}
          className="absolute inset-0 z-0"
        />
      )}
      
      {/* Explicit mask to hide the Spline watermark which sits at the bottom right */}
      <div className="absolute bottom-0 right-0 w-48 h-16 bg-black z-10 pointer-events-none" />

      <div className="absolute inset-0 z-10 pt-8 md:pt-12 lg:pt-16 px-4 md:px-8 pointer-events-none flex flex-col justify-start">
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
