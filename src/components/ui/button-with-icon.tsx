"use client";

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface ButtonWithIconProps {
  text?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "dark" | "outline" | "white";
  iconClassName?: string;
  style?: React.CSSProperties;
}

const variantStyles: Record<
  "primary" | "secondary" | "dark" | "outline" | "white",
  { container: string; circle: string }
> = {
  primary: {
    container:
      "bg-[#1450B4] hover:bg-[#165adb] text-white border border-[#1450B4]/60 shadow-[0_4px_20px_rgba(20,80,180,0.35)]",
    circle: "bg-white text-[#1450B4] shadow-sm",
  },
  secondary: {
    container:
      "bg-white/12 hover:bg-white/20 text-white border border-white/30 backdrop-blur-md shadow-[0_4px_16px_rgba(0,0,0,0.25)]",
    circle: "bg-white text-neutral-950 shadow-sm",
  },
  outline: {
    container:
      "bg-transparent hover:bg-white/10 text-white border border-white/30 backdrop-blur-sm",
    circle: "bg-white text-neutral-950 shadow-sm",
  },
  dark: {
    container:
      "bg-[#121212] hover:bg-neutral-900 text-white border border-neutral-700/50 shadow-xl",
    circle: "bg-white text-[#121212] shadow-sm",
  },
  white: {
    container:
      "bg-white hover:bg-neutral-100 text-[#121212] border border-black/10 shadow-lg",
    circle: "bg-[#121212] text-white shadow-sm",
  },
};

const ButtonWithIconDemo: React.FC<ButtonWithIconProps> = ({
  text = "Let's Collaborate",
  onClick,
  className = "",
  disabled = false,
  type = "button",
  variant = "primary",
  iconClassName = "",
  style,
}) => {
  const selected = variantStyles[variant] || variantStyles.primary;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={style}
      className={cn(
        "relative inline-flex items-center justify-center text-sm font-semibold rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-fit overflow-hidden cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-brand-blue/50 disabled:opacity-50 disabled:pointer-events-none",
        selected.container,
        className
      )}
    >
      <span className="relative z-10 transition-all duration-500 whitespace-nowrap">
        {text}
      </span>
      <div
        className={cn(
          "absolute right-1 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45 shrink-0 pointer-events-none",
          selected.circle,
          iconClassName
        )}
      >
        <ArrowUpRight size={17} strokeWidth={2.4} />
      </div>
    </button>
  );
};

export default ButtonWithIconDemo;
