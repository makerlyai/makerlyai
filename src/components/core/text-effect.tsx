"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

export type TextEffectPreset = "fade" | "fade-in-blur" | "slide-up" | "scale";
export type TextEffectPer = "word" | "char" | "line";

export interface TextEffectProps {
  children: string;
  preset?: TextEffectPreset;
  per?: TextEffectPer;
  speedReveal?: number;
  speedSegment?: number;
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  onAnimationComplete?: () => void;
}

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: i * 0.1,
    },
  }),
};

export function TextEffect({
  children,
  preset = "fade-in-blur",
  per = "word",
  speedReveal = 1.1,
  speedSegment = 0.3,
  delay = 0,
  className = "",
  as: Component = "span",
  onAnimationComplete,
}: TextEffectProps) {
  const getVariants = (): Variants => {
    switch (preset) {
      case "fade-in-blur":
        return {
          hidden: { opacity: 0, filter: "blur(12px)", y: 8 },
          visible: {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            transition: {
              duration: speedSegment,
              ease: [0.25, 0.1, 0.25, 1],
            },
          },
        };
      case "slide-up":
        return {
          hidden: { opacity: 0, y: 16 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration: speedSegment,
              ease: [0.25, 0.1, 0.25, 1],
            },
          },
        };
      case "scale":
        return {
          hidden: { opacity: 0, scale: 0.8 },
          visible: {
            opacity: 1,
            scale: 1,
            transition: {
              duration: speedSegment,
              ease: [0.25, 0.1, 0.25, 1],
            },
          },
        };
      case "fade":
      default:
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration: speedSegment,
            },
          },
        };
    }
  };

  const segments = React.useMemo(() => {
    if (per === "char") {
      return Array.from(children);
    }
    if (per === "line") {
      return children.split("\n");
    }
    return children.split(" ");
  }, [children, per]);

  const stagger = (0.05 / speedReveal);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const childVariants = getVariants();

  return (
    <motion.span
      className={`inline-block ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onAnimationComplete={onAnimationComplete}
    >
      {segments.map((segment, index) => (
        <motion.span
          key={index}
          variants={childVariants}
          className="inline-block"
        >
          {segment}
          {per === "word" && index < segments.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
