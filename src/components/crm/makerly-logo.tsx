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
}> = ({ className = "h-5 w-5", color, size }) => {
  return (
    <svg
      viewBox="0 0 512 512"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="MakerlyAI Logo"
    >
      <g transform="matrix(1.4766346,0,0,1.4766346,-151.4266,-146.64648)">
        <path
          fill="#002166"
          d="m 212.31513,288.16668 -82.30841,76.99587 0.24591,21.28538 0.125,1.71875 0.0469,1.14062 0.96094,2.25 1.07813,1.97657 1.25,1.77343 2.19531,2.03125 3.28125,1.92188 2.53125,1.08594 4.89782,0.20581 3.81588,-0.55664 3.21324,-1.6895 25.70574,-19.25193 23.35431,-17.2967 4.49122,-3.53311 1.4439,-1.70737 1.74103,-2.19126 1.0822,-2.0233 0.7624,-2.56613"
        />
        <path
          fill="#013694"
          d="m 212.31295,288.63147 v -12.91296 l -30.10824,-29.64379 -1.78915,-1.35676 -1.15126,-0.7257 -1.21352,-0.66261 -1.58689,-0.44175 -1.27575,-0.15776 -2.67593,-0.22087 -1.64913,0.0315 -1.43132,0.31553 -1.46243,0.4733 -1.49355,0.50484 -0.90236,0.41018 -0.99569,0.59949 -1.55578,1.13591 -1.30685,1.19901 -1.3691,1.199 -30.32828,29.53235 v 88.58528 z"
        />
        <path
          fill="#0065fb"
          d="m 319.39389,302.91995 12.28736,-11.31951 -7.18275,2.41489 -3.00471,0.48209 -2.05178,0.10823 -3.65641,-0.32436 -2.81542,-0.26256 -2.40401,-0.6868 -1.90559,-1.09751 -139.57563,-126.3127 -6.28126,-5.80947 -3.79654,-2.10388 -2.22544,-0.92766 -2.1051,-0.37704 c -13.21262,-3.52031 -22.8451,8.86968 -24.65602,15.53711 l -0.15406,1.87319 -0.0239,104.49359 32.0491,-30.9763 0.75781,-0.66795 0.32422,-0.29514 0.5625,-0.40776 0.39063,-0.27185 0.49219,-0.33009 0.42187,-0.27572 0.36328,-0.22912 0.41016,-0.23689 0.41406,-0.19417 0.44922,-0.20194 0.50391,-0.17087 1.69078,-0.5503 0.78444,-0.23616 0.66291,-0.17574 0.68608,-0.1407 0.54688,-0.0233 1.17969,-0.0155 1.72265,0.15145 1.32269,0.11594 0.85309,0.11318 0.47266,0.13203 0.85156,0.23302 0.30078,0.0971 0.5,0.26796 0.53125,0.27572 1.17579,0.73008 0.46484,0.3301 1.39062,1.04852 1.8086,1.7592 28.49609,27.88309 50.46614,50.26223 5.65105,5.6282 3.20703,2.52812 1.77734,0.78057 2.0625,0.73009 1.75,0.27961 2.25,0.0931 0.98047,-0.0389 1.64844,-0.38059 1.77734,-0.72619 3.6911,-2.30125"
        />
        <path
          fill="#002166"
          d="m 339.80842,286.6967 81.55555,79.06678 -0.24367,21.84252 -0.12385,1.76472 -0.0464,1.17111 -0.95217,2.31018 -1.06827,2.02942 -1.23855,1.82084 -2.17525,2.08557 -3.25123,1.97328 -2.5081,1.11497 -4.85301,0.21131 -3.78098,-0.57151 -3.18385,-1.73468 -25.47062,-19.76674 -23.14068,-17.75921 -4.45014,-3.62758 -1.43071,-1.75304 -1.7251,-2.24985 -1.0723,-2.0774 -0.75542,-2.63474"
        />
        <path
          fill="#0039a2"
          d="m 421.36714,203.85127 v 161.9375 l -81.57031,-79.08985 -0.0395,-3.6289 z"
        />
        <path
          fill="#049efe"
          d="m 308.90409,292.39382 -4.36719,-3.90625 -29.6211,-26.78125 74.08985,-71.40625 2.28432,-2.16718 3.44715,-2.87262 62.14805,-46.19396 0.57453,-0.30936 0.56347,-0.12153 0.54138,-0.0884 0.97228,0.0884 0.96122,0.27621 0.44194,0.19887 0.2265,0.13811 0.20992,0.14916 0.19887,0.18782 0.11049,0.14916 0.13258,0.21544 0.12706,0.34251 0.0718,0.47509 0.0221,0.50823 0.0608,4.06586 -0.73116,58.83709 -89.47656,87.30469 -0.42348,0.43925 -6.74058,2.2756 -2.03907,0.32812 -0.92187,0.13672 -1.09766,0.0664 -0.48437,0.0351 -0.4375,0.0195 -0.66016,-0.0625 -3.19141,-0.26953 -2.63671,-0.25781 -0.67579,-0.16797 -1.28906,-0.3789 -0.46875,-0.125 -0.47656,-0.27344 -0.20703,-0.12891 -1.14453,-0.66015 -0.16407,-0.10938 -0.35937,-0.33203 -0.48047,-0.43359 -33.07422,-29.94141 z"
        />
      </g>
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

