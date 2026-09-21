"use client";

import React from "react";
import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showTagline?: boolean;
}

/**
 * Official MakerlyAI Vector "M" Mark Icon
 * Normalized to tight viewBox (0.467 0.784 0.423 0.399) so it fits containers perfectly
 */
export const MakerlyLogoIcon: React.FC<{
  className?: string;
  color?: string;
  size?: number;
}> = ({ className = "h-5 w-5", color = "#2952cc", size }) => {
  return (
    <svg
      viewBox="0.467 0.784 0.423 0.399"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MakerlyAI Logo"
    >
      <path
        d="M 0.46747378,1.1825193 V 0.78484869 L 0.67876213,0.98419795 0.89004647,0.78558137 V 1.182572 H 0.79440457 V 0.99632287 L 0.67920886,1.1198915 0.56369793,0.99650736 V 1.1827302 Z"
        fill={color}
      />
    </svg>
  );
};

/**
 * Official MakerlyAI Brand Badge
 * Features the signature "M" emblem + "MakerlyAI.in" + "Big Tech for small business."
 */
export const MakerlyBrand: React.FC<LogoProps> = ({
  size = "md",
  className = "",
  showTagline = true,
}) => {
  const iconSizes = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
    xl: "h-12 w-12",
  };

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-xl",
  };

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Official Symbol Box */}
      <div className={`flex items-center justify-center rounded-xl bg-[#efe7d1] border border-[#2952cc]/20 p-1.5 shadow-xs transition-transform hover:scale-105 ${iconSizes[size]}`}>
        <MakerlyLogoIcon className="w-full h-full" color="#2952cc" />
      </div>

      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white font-sans ${textSizes[size]}`}>
            Maker<span className="text-[#2952cc] dark:text-[#4d73ff]">lyAI</span>
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">.in</span>
          </span>
        </div>
        {showTagline && (
          <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-tight mt-0.5">
            Big Tech for small business.
          </p>
        )}
      </div>
    </div>
  );
};

/**
 * Full Official SVG Card Badge (as provided in full.svg)
 */
export const MakerlyFullSvgBadge: React.FC<{
  className?: string;
  height?: number;
}> = ({ className = "h-8 w-auto", height = 32 }) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/full-logo.svg"
      alt="MakerlyAI.in - Big Tech for small business"
      className={`rounded-lg object-contain shadow-xs ${className}`}
      style={{ height }}
    />
  );
};

