"use client";

import React, { useState, useRef, useCallback, createContext, useContext } from "react";

interface ImageComparisonContextValue {
  sliderPosition: number;
  setSliderPosition: (pos: number) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

const ImageComparisonContext = createContext<ImageComparisonContextValue | null>(null);

export function useImageComparison() {
  const ctx = useContext(ImageComparisonContext);
  if (!ctx) {
    throw new Error("useImageComparison must be used within an ImageComparison provider");
  }
  return ctx;
}

export interface ImageComparisonProps {
  children: React.ReactNode;
  className?: string;
  initialPosition?: number;
}

export function ImageComparison({
  children,
  className = "",
  initialPosition = 50,
}: ImageComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percent = (x / rect.width) * 100;
      setSliderPosition(percent);
    },
    [isDragging]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <ImageComparisonContext.Provider
      value={{
        sliderPosition,
        setSliderPosition,
        isDragging,
        setIsDragging,
        containerRef,
      }}
    >
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className={`relative select-none overflow-hidden touch-none cursor-ew-resize ${className}`}
      >
        {children}
      </div>
    </ImageComparisonContext.Provider>
  );
}

export interface ImageComparisonImageProps {
  src: string;
  alt?: string;
  position: "left" | "right";
  className?: string;
}

export function ImageComparisonImage({
  src,
  alt = "",
  position,
  className = "",
}: ImageComparisonImageProps) {
  const { sliderPosition } = useImageComparison();

  if (position === "left") {
    return (
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
        }}
      >
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover pointer-events-none ${className}`}
        />
      </div>
    );
  }

  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
      }}
    >
      <img
        src={src}
        alt={alt}
        className={`h-full w-full object-cover pointer-events-none ${className}`}
      />
    </div>
  );
}

export interface ImageComparisonSliderProps {
  className?: string;
}

export function ImageComparisonSlider({ className = "" }: ImageComparisonSliderProps) {
  const { sliderPosition, setIsDragging } = useImageComparison();

  return (
    <div
      onPointerDown={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      style={{ left: `${sliderPosition}%` }}
      className="absolute top-0 bottom-0 z-20 w-0.5 -translate-x-1/2 bg-white cursor-ew-resize shadow-[0_0_12px_rgba(0,0,0,0.5)]"
    >
      <div
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/90 text-black shadow-lg backdrop-blur-md ${className}`}
      >
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 9l-3 3m0 0l3 3m-3-3h14m-3-3l3 3m0 0l-3 3" />
        </svg>
      </div>
    </div>
  );
}
