"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion, useMotionValue, useSpring } from "framer-motion";

/* ─────────────────────── Magnetic Hover Hook ─────────────────────── */
function useMagnetic(strength = 0.3) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouse = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { springX, springY, handleMouse, handleLeave };
}

/* ─────────────────────── Social Link Component ─────────────────────── */
function MagneticSocialLink({ href, label, icon }: { href: string; label: string; icon: React.ReactNode }) {
  const { springX, springY, handleMouse, handleLeave } = useMagnetic(0.25);
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouse}
      onMouseLeave={handleLeave}
      className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 backdrop-blur-md transition-colors duration-300 hover:border-brand-blue/50 hover:bg-brand-blue/10"
    >
      <span className="absolute inset-0 rounded-full bg-brand-blue/0 transition-all duration-500 group-hover:bg-brand-blue/10 group-hover:shadow-[0_0_20px_rgba(26,75,156,0.3)]" />
      <span className="relative z-10 text-white/60 transition-colors duration-300 group-hover:text-white">
        {icon}
      </span>
    </motion.a>
  );
}

export default function AboutFounder() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [isMobile, setIsMobile] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line
    setIsMobile(window.matchMedia("(max-width: 768px)").matches);
  }, []);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  // Parallax calculations
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);

  /* Social icons (inline SVGs to avoid extra deps) */
  const linkedinIcon = (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );

  const instagramIcon = (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 100-12.324zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405a1.441 1.441 0 11-2.88 0 1.441 1.441 0 012.88 0z" />
    </svg>
  );

  const twitterIcon = (
    <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );

  // Content for the cards
  // Mobile Math: Left image = 400px. Right column = 192px + 192px + 16px (gap-4) = 400px. Perfect alignment.
  const founderImages = [
    { src: "/myphoto1.jpg", y: y1, className: "col-span-1 md:col-span-2 row-span-2 h-[400px] md:h-[60vh]" },
    { src: "/myphoto2.webp", y: y2, className: "col-span-1 h-[192px] md:h-[30vh]" },
    { src: "/myphoto3.jpg", y: y3, className: "col-span-1 h-[192px] md:h-[30vh]" },
    { src: "/myphoto4nature.jpg", y: y1, className: "col-span-2 md:col-span-2 h-[250px] md:h-[30vh]" }
  ];

  return (
    <section id="founder" ref={containerRef} className="relative w-full py-24 md:py-48 px-4 md:px-12 bg-background overflow-hidden">
      <motion.div style={{ opacity }} className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Text Area */}
        <motion.div style={{ scale }} className="w-full lg:w-5/12 z-20">
          <div className="mb-4 inline-flex items-center gap-3">
            <div className="w-8 h-px bg-brand-blue/50" />
            <span className="text-sm font-bold tracking-[0.3em] uppercase text-brand-blue">
              Tousif Raza
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
            Meet the <br/>
            <span className="text-gradient">Architect</span>
          </h2>
          <div className="space-y-6 text-lg md:text-xl text-foreground/80 leading-relaxed font-light">
             <p>
               The hands that turn blueprints into reality. Tousif&apos;s expertise spans <strong className="font-bold text-foreground">full-stack execution, product development, and tech deployments</strong>—from architecture to production, every system is engineered for speed and scale.
             </p>
             <p>
               At MakerlyAI, the philosophy is simple: <strong className="font-bold text-foreground">Build products that feel expensive, run blazingly fast, and force the competition to play catch-up.</strong>
             </p>
          </div>

          {/* Social Links */}
          <div className="mt-8 flex items-center gap-4">
            <span className="mr-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40">
              Connect
            </span>
            <MagneticSocialLink
              href="https://linkedin.com/in/tousifraza"
              label="Tousif Raza on LinkedIn"
              icon={linkedinIcon}
            />
            <MagneticSocialLink
              href="https://instagram.com/thebokaroguy"
              label="Tousif Raza on Instagram"
              icon={instagramIcon}
            />
            <MagneticSocialLink
              href="https://x.com/thebokaroguy"
              label="Tousif Raza on X"
              icon={twitterIcon}
            />
          </div>
        </motion.div>

        {/* Parallax Photo Grid */}
        <div className="w-full lg:w-7/12 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 relative">
          
          {/* Abstract glow behind the images to separate from background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-blue/10 blur-[100px] pointer-events-none rounded-full" />

          {founderImages.map((img, idx) => (
             <motion.div 
               key={idx} 
               style={{ y: isMobile ? 0 : img.y }} 
               className={`relative rounded-3xl overflow-hidden group shadow-2xl ${img.className}`}
             >
               {/* Using an img tag directly instead of next/image temporarily since assets need to be moved to /public */}
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
               <img 
                 src={img.src} 
                 alt="Founder Activity" 
                 decoding="async"
                 className="object-cover w-full h-full scale-100 group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)]"
               />
               <div className="absolute inset-0 border border-white/20 rounded-3xl z-20 pointer-events-none mix-blend-overlay" />
             </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
