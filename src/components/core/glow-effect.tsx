"use client";

import React from "react";
import { motion } from "framer-motion";

export interface GlowEffectProps {
  colors?: string[];
  mode?: "rotate" | "pulse" | "colorShift" | "static";
  blur?: "soft" | "medium" | "strong";
  duration?: number;
  scale?: number;
  className?: string;
}

export function GlowEffect({
  colors = ["#2952cc", "#00d2ff", "#a855f7", "#2952cc"],
  mode = "colorShift",
  blur = "soft",
  duration = 4,
  scale = 0.95,
  className = "",
}: GlowEffectProps) {
  const blurClass = {
    soft: "blur-xl",
    medium: "blur-2xl",
    strong: "blur-3xl",
  }[blur];

  const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;

  return (
    <div
      className={`pointer-events-none absolute inset-0 -z-10 flex items-center justify-center overflow-visible ${className}`}
      style={{ transform: `scale(${scale})` }}
    >
      <motion.div
        className={`h-full w-full rounded-[inherit] opacity-70 ${blurClass}`}
        style={{
          background: gradient,
          backgroundSize: "300% 300%",
        }}
        animate={
          mode === "colorShift"
            ? {
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }
            : mode === "rotate"
            ? {
                rotate: [0, 360],
              }
            : mode === "pulse"
            ? {
                scale: [0.95, 1.05, 0.95],
                opacity: [0.5, 0.85, 0.5],
              }
            : {}
        }
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
}
