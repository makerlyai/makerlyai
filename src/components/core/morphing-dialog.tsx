"use client";

import React, { useState, createContext, useContext, useId } from "react";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { X } from "lucide-react";

interface MorphingDialogContextType {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  uniqueId: string;
  transition?: Transition;
}

const MorphingDialogContext = createContext<MorphingDialogContextType | null>(null);

function useMorphingDialog() {
  const context = useContext(MorphingDialogContext);
  if (!context) {
    throw new Error("useMorphingDialog must be used within a MorphingDialog");
  }
  return context;
}

export interface MorphingDialogProps {
  children: React.ReactNode;
  transition?: Transition;
}

export function MorphingDialog({
  children,
  transition = { type: "spring", stiffness: 200, damping: 24 },
}: MorphingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const uniqueId = useId();

  return (
    <MorphingDialogContext.Provider
      value={{ isOpen, setIsOpen, uniqueId, transition }}
    >
      {children}
    </MorphingDialogContext.Provider>
  );
}

export interface MorphingDialogTriggerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function MorphingDialogTrigger({
  children,
  className = "",
  style,
}: MorphingDialogTriggerProps) {
  const { setIsOpen, uniqueId } = useMorphingDialog();

  return (
    <motion.div
      layoutId={`dialog-container-${uniqueId}`}
      onClick={() => setIsOpen(true)}
      className={`cursor-pointer ${className}`}
      style={style}
    >
      {children}
    </motion.div>
  );
}

export interface MorphingDialogContainerProps {
  children: React.ReactNode;
}

export function MorphingDialogContainer({ children }: MorphingDialogContainerProps) {
  const { isOpen, setIsOpen } = useMorphingDialog();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
          />
          {children}
        </div>
      )}
    </AnimatePresence>
  );
}

export interface MorphingDialogContentProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function MorphingDialogContent({
  children,
  className = "",
  style,
}: MorphingDialogContentProps) {
  const { uniqueId, transition } = useMorphingDialog();

  return (
    <motion.div
      layoutId={`dialog-container-${uniqueId}`}
      transition={transition}
      className={`relative z-50 overflow-hidden shadow-2xl ${className}`}
      style={style}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </motion.div>
  );
}

export interface MorphingDialogImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

export function MorphingDialogImage({
  src,
  alt,
  className = "",
  style,
}: MorphingDialogImageProps) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.img
      layoutId={`dialog-img-${uniqueId}`}
      src={src}
      alt={alt}
      className={className}
      style={style}
    />
  );
}

export function MorphingDialogTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.h3 layoutId={`dialog-title-${uniqueId}`} className={className}>
      {children}
    </motion.h3>
  );
}

export function MorphingDialogSubtitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { uniqueId } = useMorphingDialog();

  return (
    <motion.p layoutId={`dialog-subtitle-${uniqueId}`} className={className}>
      {children}
    </motion.p>
  );
}

export function MorphingDialogClose({ className = "" }: { className?: string }) {
  const { setIsOpen } = useMorphingDialog();

  return (
    <button
      type="button"
      onClick={() => setIsOpen(false)}
      className={`absolute top-4 right-4 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors ${className}`}
      aria-label="Close dialog"
    >
      <X className="h-4 w-4" />
    </button>
  );
}
