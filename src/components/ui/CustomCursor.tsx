"use client";

import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);

  // Smooth springing for the cursor
  const cursorX = useSpring(mousePosition.x, { stiffness: 500, damping: 28 });
  const cursorY = useSpring(mousePosition.y, { stiffness: 500, damping: 28 });

  useEffect(() => {
    // Check if the device is a touch device (mobile optimizations priority)
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const updateMousePosition = (e: MouseEvent) => {
      setHasMoved(true);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Any generic clickable element triggers the hover state
      if (
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    if (!isMobile) {
      window.addEventListener('mousemove', updateMousePosition);
      window.addEventListener('mouseover', handleMouseOver);
    }

    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isMobile]);

  // Don't render the custom cursor on mobile touch screens
  if (isMobile) return null;

  return (
    <motion.div
      className="custom-cursor"
      style={{
        translateX: cursorX,
        translateY: cursorY,
      }}
      animate={{
        width: isHovering ? 60 : 20,
        height: isHovering ? 60 : 20,
        backgroundColor: isHovering ? "rgba(255, 255, 255, 0.8)" : "var(--brand-blue)",
        mixBlendMode: isHovering ? "exclusion" : "difference",
        opacity: hasMoved ? 1 : 0
      }}
      transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
    />
  );
}
