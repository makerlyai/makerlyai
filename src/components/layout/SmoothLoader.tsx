"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SmoothLoader({ onLoadingComplete }: { onLoadingComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Artificial smooth loading progression
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsComplete(true);
            setTimeout(onLoadingComplete, 800); // Allow exit animation to play out
          }, 300);
          return 100;
        }
        // Accelerate towards the end for a better feel
        return prev + Math.floor(Math.random() * (100 - prev) * 0.1) + 1;
      });
    }, 40);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          key="loader"
          initial={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background text-foreground"
        >
          {/* Original Logo Implementation - Guaranteed visibility */}
          <motion.div 
            className="relative w-32 h-32 mb-12 flex items-center justify-center bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.2)] overflow-hidden"
            initial={{ scale: 0.9, opacity: 0, filter: "blur(10px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 0.8 }}
          >
             <img 
               src="/initialletterlogosquare.png" 
               alt="MakerlyAI Logo" 
               className="w-full h-full object-contain p-2" 
             />
          </motion.div>

          <div className="flex flex-col items-center gap-4 w-64">
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-brand-blue rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 0.1 }}
              />
            </div>
            {/* Removed AI-generated looking text, keeping it minimalist */}
            <motion.div 
               className="font-medium text-xs opacity-40 uppercase tracking-[0.2em]"
               animate={{ opacity: [0.2, 0.6, 0.2] }}
               transition={{ repeat: Infinity, duration: 2 }}
            >
              {Math.round(progress)}%
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
