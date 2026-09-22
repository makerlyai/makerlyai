"use client";

import React, { useState } from "react";
import { motion, useAnimationControls } from "framer-motion";

export interface InfiniteSliderProps {
  children: React.ReactNode;
  gap?: number;
  reverse?: boolean;
  duration?: number;
  speedOnHover?: number;
  className?: string;
}

export function InfiniteSlider({
  children,
  gap = 24,
  reverse = false,
  duration = 25,
  speedOnHover,
  className = "",
}: InfiniteSliderProps) {
  const [isHovered, setIsHovered] = useState(false);

  const effectiveDuration = isHovered && speedOnHover ? speedOnHover : duration;

  return (
    <div
      className={`relative flex w-full overflow-hidden ${className}`}
      onMouseEnter={() => speedOnHover && setIsHovered(true)}
      onMouseLeave={() => speedOnHover && setIsHovered(false)}
    >
      <motion.div
        className="flex shrink-0 items-center"
        style={{ gap: `${gap}px` }}
        animate={{
          x: reverse ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: effectiveDuration,
        }}
      >
        <div className="flex shrink-0 items-center" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        <div className="flex shrink-0 items-center" style={{ gap: `${gap}px` }}>
          {children}
        </div>
        <div className="flex shrink-0 items-center" style={{ gap: `${gap}px` }}>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
