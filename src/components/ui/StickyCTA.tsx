"use client";

import { useState, useEffect } from "react";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past the hero (roughly 100vh)
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[80] md:hidden p-4 bg-gradient-to-t from-black via-black/95 to-transparent pointer-events-none">
      <button
        onClick={() =>
          document
            .getElementById("contact")
            ?.scrollIntoView({ behavior: "smooth" })
        }
        className="pointer-events-auto w-full py-4 rounded-2xl bg-brand-blue text-white font-bold text-base tracking-wide shadow-[0_0_30px_rgba(26,75,156,0.4)] active:scale-[0.98] transition-transform duration-150"
      >
        Book a Session — Free Preview
      </button>
    </div>
  );
}
