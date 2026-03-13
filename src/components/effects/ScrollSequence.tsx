"use client";

import { useEffect, useRef, useState } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

interface ScrollSequenceProps {
  frameCount: number;
  imagePathPrefix: string;
  imageExtension?: string;
  children?: React.ReactNode;
}

export default function ScrollSequence({ 
  frameCount, 
  imagePathPrefix,
  imageExtension = "jpg",
  children
}: ScrollSequenceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [imagesLoaded, setImagesLoaded] = useState(0);

  // We track scroll progress over this container
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Map progress to frame index
  const frameIndex = useTransform(scrollYProgress, [0, 1], [0, frameCount - 1]);

  useEffect(() => {
    // Preload images
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      // ezgif extracts frames starting from 1 usually, e.g. ezgif-frame-001.jpg
      const frameNumber = i + 1;
      const paddedIndex = frameNumber.toString().padStart(3, '0');
      
      // Try the exact ezgif format first
      img.src = `${imagePathPrefix}${paddedIndex}.${imageExtension}`;
      
      img.onload = () => {
        loadedCount++;
        setImagesLoaded(loadedCount);
        if (i === 0 && canvasRef.current) {
          drawFrame(img);
        }
      };
      
      // Fallback
      img.onerror = () => {
          img.src = `${imagePathPrefix}${i}.${imageExtension}`;
      }
      
      loadedImages.push(img);
    }
    
    setImages(loadedImages);
  }, [frameCount, imagePathPrefix, imageExtension]);

  const drawFrame = (img: HTMLImageElement) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Maintain aspect ratio while covering
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerShift_x = (canvas.width - img.width * ratio) / 2;
    const centerShift_y = (canvas.height - img.height * ratio) / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  };

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        // Redraw current frame
        const currentIndex = Math.min(
          frameCount - 1,
          Math.max(0, Math.floor(frameIndex.get()))
        );
        if (images[currentIndex]?.complete) {
          drawFrame(images[currentIndex]);
        }
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [images, frameIndex, frameCount]);

  useEffect(() => {
    // Listen to framer-motion value changes and draw on canvas
    const unsubscribe = frameIndex.on("change", (latest) => {
      const index = Math.min(frameCount - 1, Math.max(0, Math.floor(latest)));
      if (images[index] && images[index].complete) {
        requestAnimationFrame(() => drawFrame(images[index]));
      }
    });

    return () => unsubscribe();
  }, [frameIndex, images, frameCount]);

  return (
    <div ref={containerRef} className="relative w-full h-[300vh] bg-transparent">
      <div className="sticky top-0 w-full h-screen overflow-hidden">
        
        {/* Loading overlay if assets are huge */}
        {imagesLoaded < frameCount && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm text-white font-mono text-sm">
            Buffering sequence... {Math.round((imagesLoaded / frameCount) * 100)}%
          </div>
        )}

        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay Content - Now supports custom injected children */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          {children}
        </div>
        
      </div>
    </div>
  );
}
