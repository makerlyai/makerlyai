"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

interface SkeuoButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function SkeuoButton({ children, className = "", ...props }: SkeuoButtonProps) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      {...props}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={`relative overflow-hidden skeuo-btn px-8 py-4 text-lg font-bold tracking-wide transition-all duration-200 
        ${isPressed ? 'skeuo-pressed scale-[0.98]' : 'hover:-translate-y-[2px] hover:scale-[1.02]'} 
        ${className}`}
    >
      {/* Shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Inner text with subtle shadow for debossed feel */}
      <span className="relative z-10 opacity-90 transition-opacity duration-200" style={{ textShadow: "0 1px 1px rgba(255,255,255,0.4)" }}>
        {children}
      </span>
    </motion.button>
  );
}
