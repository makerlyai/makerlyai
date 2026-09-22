"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants, Transition, UseInViewOptions } from "framer-motion";

export interface InViewProps {
  children: React.ReactNode;
  variants?: Variants;
  transition?: Transition;
  viewOptions?: UseInViewOptions;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
}

const defaultVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function InView({
  children,
  variants = defaultVariants,
  transition,
  viewOptions = { once: true, margin: "0px 0px -100px 0px" },
  as: Component = "div",
  className = "",
}: InViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewOptions);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
