"use client";

import React from "react";
import { motion, Transition } from "framer-motion";

export interface BorderTrailProps {
  className?: string;
  size?: number;
  transition?: Transition;
  style?: React.CSSProperties;
  onAnimationComplete?: () => void;
}

export function BorderTrail({
  className = "",
  size = 80,
  transition = {
    duration: 6,
    repeat: Infinity,
    ease: "linear",
  },
  style,
  onAnimationComplete,
}: BorderTrailProps) {
  return (
    <div className="pointer-events-none absolute inset-0 rounded-[inherit] overflow-hidden">
      <motion.div
        className={`absolute aspect-square bg-gradient-to-r from-transparent via-brand-blue to-cyan-400 rounded-full ${className}`}
        style={{
          width: size,
          offsetPath: `rect(0 auto auto 0 round inherit)`,
          ...style,
        }}
        animate={{
          offsetDistance: ["0%", "100%"],
        }}
        transition={transition}
        onAnimationComplete={onAnimationComplete}
      />
    </div>
  );
}
