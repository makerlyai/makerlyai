"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type Variants,
} from "framer-motion";

/* ─────────────────────── Animation Variants ─────────────────────── */

const fadeBlur: Variants = {
  hidden: { opacity: 0, filter: "blur(12px)", y: 32 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const scaleReveal: Variants = {
  hidden: { opacity: 0, scale: 0.92, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
  },
};

const slideUp: Variants = {
  hidden: { opacity: 0, y: 48 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 1, 0.5, 1] },
  },
};

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

function MagneticSocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) {
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

/* ─────────────────────── Expertise Tag ─────────────────────── */

function ExpertiseTag({ label, delay }: { label: string; delay: number }) {
  return (
    <motion.span
      variants={slideUp}
      custom={delay}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 backdrop-blur-sm transition-all duration-300 hover:border-brand-blue/40 hover:bg-brand-blue/10 hover:text-white"
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand-blue" />
      {label}
    </motion.span>
  );
}

/* ─────────────────────── Mosaic Image ─────────────────────── */

function MosaicImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <motion.div
      variants={scaleReveal}
      className={`group relative overflow-hidden rounded-2xl shadow-2xl ${className ?? ""}`}
    >
      {/* Dark overlay that lifts on hover */}
      <div className="absolute inset-0 z-10 bg-black/25 transition-all duration-700 group-hover:bg-black/0" />

      {/* Image with hover zoom */}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-110"
      />

      {/* Inner border */}
      <div className="pointer-events-none absolute inset-0 z-20 rounded-2xl border border-white/10 mix-blend-overlay" />

      {/* Bottom gradient */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-1/3 bg-gradient-to-t from-black/40 to-transparent" />
    </motion.div>
  );
}

/* ═══════════════════════ MAIN COMPONENT ═══════════════════════ */

export default function AboutCoFounder() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();



  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax values
  const silhouetteY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const portraitY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const sectionOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.85, 1],
    [0, 1, 1, 0]
  );

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

  return (
    <section
      id="cofounder"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-background"
    >
      {/* ── Ambient Background Layer ── */}
      <motion.div
        style={{ y: prefersReduced ? 0 : silhouetteY }}
        className="pointer-events-none absolute inset-0 z-0"
      >
        <img
          src="/cofounder/silhouette.jpg"
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover opacity-[0.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
      </motion.div>

      {/* ── Floating Gradient Orbs ── */}
      <motion.div
        style={{ y: prefersReduced ? 0 : orbY }}
        className="pointer-events-none absolute right-[-10%] top-[20%] z-0 h-[500px] w-[500px] rounded-full bg-brand-blue/10 blur-[120px] md:h-[700px] md:w-[700px]"
      />
      <div className="pointer-events-none absolute bottom-[10%] left-[-5%] z-0 h-[400px] w-[400px] rounded-full bg-purple-500/8 blur-[100px]" />

      {/* ════════════════ SECTION 1: Editorial Header ════════════════ */}
      <motion.div
        style={{ opacity: prefersReduced ? 1 : sectionOpacity }}
        className="relative z-10"
      >
        <div className="mx-auto max-w-7xl px-4 pt-32 md:px-12 md:pt-48">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="mb-20 max-w-3xl md:mb-32"
          >
            {/* Badge */}
            <motion.div
              variants={fadeBlur}
              className="mb-6 inline-flex items-center gap-3"
            >
              <div className="h-px w-8 bg-brand-blue/50" />
              <span className="text-sm font-bold uppercase tracking-[0.3em] text-brand-blue">
                Soha Shaikh
              </span>
              <div className="h-px w-8 bg-brand-blue/50" />
            </motion.div>

            {/* Heading */}
            <motion.h2
              variants={fadeBlur}
              className="mb-6 text-4xl font-black tracking-tight md:text-6xl lg:text-7xl"
            >
              Meet the{" "}
              <span className="text-gradient">Co-Founder</span>
            </motion.h2>

            {/* Intro paragraph */}
            <motion.p
              variants={fadeBlur}
              className="text-lg leading-relaxed text-foreground/70 md:text-xl"
            >
              The strategic mind behind MakerlyAI&apos;s growth. Where vision
              meets execution, Soha transforms ideas into scalable
              businesses—turning blueprints into empires.
            </motion.p>
          </motion.div>
        </div>

        {/* ════════════════ SECTION 2: Portrait + Story ════════════════ */}
        <div className="mx-auto max-w-7xl px-4 pb-24 md:px-12 md:pb-32">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:gap-20">
            {/* ── Left: Hero Portrait ── */}
            <motion.div
              variants={scaleReveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="relative w-full lg:w-5/12"
            >
              {/* Glow ring behind image */}
              <div className="absolute -inset-4 z-0 rounded-3xl bg-gradient-to-br from-brand-blue/20 via-purple-500/10 to-transparent blur-2xl" />

              <motion.div
                style={{ y: prefersReduced ? 0 : portraitY }}
                className="group relative z-10 overflow-hidden rounded-3xl shadow-2xl"
              >
                <img
                  src="/cofounder/portrait-main.jpg"
                  alt="Soha Shaikh — Co-Founder of MakerlyAI"
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/4] w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
                />

                {/* Bottom gradient overlay */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/5 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                {/* Hover glow */}
                <div className="pointer-events-none absolute inset-0 z-20 rounded-3xl border border-white/10 transition-all duration-500 group-hover:border-brand-blue/30 group-hover:shadow-[inset_0_0_40px_rgba(26,75,156,0.15)]" />

                {/* Name overlay at bottom */}
                <div className="absolute bottom-0 left-0 z-20 p-6 md:p-8">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
                    Co-Founder
                  </p>
                  <h3 className="mt-1 text-2xl font-black text-white md:text-3xl">
                    Soha Shaikh
                  </h3>
                </div>
              </motion.div>
            </motion.div>

            {/* ── Right: Story Content ── */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              className="w-full lg:w-7/12"
            >
              {/* Role */}
              <motion.div variants={fadeBlur} className="mb-8">
                <h3 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                  Business Architect
                  <br />
                  <span className="text-foreground/50">&amp; Growth Strategist</span>
                </h3>
              </motion.div>

              {/* Mission */}
              <motion.div
                variants={fadeBlur}
                className="mb-8 space-y-4 text-lg leading-relaxed text-foreground/75 md:text-xl"
              >
                <p>
                  Soha brings the razor-sharp business acumen that
                  turns raw technology into market-ready products. Her expertise spans
                  idea validation, go-to-market strategy, and scaling
                  operations from zero to traction.
                </p>
                <p>
                  While Tousif builds the engine,{" "}
                  <strong className="font-bold text-foreground">
                    Soha decides where it drives.
                  </strong>{" "}
                  Together, they form the complete founder stack—vision
                  paired with execution.
                </p>
              </motion.div>

              {/* Pull Quote — Glassmorphic Card */}
              <motion.blockquote
                variants={scaleReveal}
                className="glass-quote relative mb-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xl md:p-8"
              >
                {/* Quotation mark */}
                <span className="absolute -top-3 left-6 text-5xl font-black leading-none text-brand-blue/30">
                  &ldquo;
                </span>
                <p className="relative z-10 text-lg italic leading-relaxed text-foreground/90 md:text-xl">
                  Great products aren&apos;t just built—they&apos;re{" "}
                  <span className="font-semibold text-brand-blue">positioned</span>.
                  Every feature should solve a real problem, every launch
                  should tell a story, and every decision should compound
                  toward growth.
                </p>
                <footer className="mt-4 text-sm font-semibold text-foreground/50">
                  — Soha Shaikh
                </footer>
              </motion.blockquote>

              {/* Expertise Tags */}
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="mb-10 flex flex-wrap gap-3"
              >
                {[
                  "Business Strategy",
                  "Idea Validation",
                  "Scaling & Growth",
                  "Go-to-Market",
                  "Product Vision",
                  "Partnerships",
                ].map((tag, i) => (
                  <ExpertiseTag key={tag} label={tag} delay={i * 0.05} />
                ))}
              </motion.div>

              {/* Social Links */}
              <motion.div
                variants={fadeBlur}
                className="flex items-center gap-4"
              >
                <span className="mr-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40">
                  Connect
                </span>
                <MagneticSocialLink
                  href="https://www.linkedin.com/in/soha-shaikh-412948307/"
                  label="Soha Shaikh on LinkedIn"
                  icon={linkedinIcon}
                />
                <MagneticSocialLink
                  href="https://instagram.com/art_.enthusiasm"
                  label="Soha Shaikh on Instagram"
                  icon={instagramIcon}
                />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ════════════════ SECTION 3: Image Mosaic ════════════════ */}
        <div className="mx-auto max-w-7xl px-4 pb-24 md:px-12 md:pb-32">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="grid auto-rows-[220px] grid-cols-2 gap-4 md:auto-rows-[280px] md:grid-cols-3 md:gap-6"
          >
            {/* Speaking — wide, spans 2 cols */}
            <MosaicImage
              src="/cofounder/speaking.jpg"
              alt="Soha presenting at a conference"
              className="col-span-2 row-span-1"
            />

            {/* Close portrait — tall, spans 2 rows */}
            <MosaicImage
              src="/cofounder/portrait-close.jpg"
              alt="Soha Shaikh portrait"
              className="col-span-1 row-span-2"
            />

            {/* Award */}
            <MosaicImage
              src="/cofounder/award.jpg"
              alt="Soha receiving an award"
              className="col-span-1 row-span-1"
            />

            {/* Lifestyle */}
            <MosaicImage
              src="/cofounder/lifestyle.jpg"
              alt="Soha Shaikh lifestyle"
              className="col-span-1 row-span-1"
            />
          </motion.div>
        </div>

        {/* ════════════════ SECTION 4: Vision Strip ════════════════ */}
        <div className="relative w-full overflow-hidden border-y border-white/10 bg-black/40 py-16 md:py-24">
          {/* Background gradient */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-blue/5 via-transparent to-purple-500/5" />

          <div className="relative z-10 mx-auto max-w-5xl px-4 text-center md:px-12">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-6 text-xs font-semibold uppercase tracking-[0.3em] text-brand-blue"
            >
              Our Vision
            </motion.p>
            <motion.h3
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-2xl font-black leading-tight tracking-tight text-white md:text-4xl lg:text-5xl"
            >
              Two founders.{" "}
              <span className="text-gradient">One complete stack.</span>
              <br className="hidden md:block" />
              Business meets technology — no gaps, no compromises.
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/60"
            >
              Soha drives the strategy. Tousif engineers the product.
              Together, MakerlyAI delivers end-to-end—from first idea
              to global scale.
            </motion.p>
          </div>

          {/* Scrolling keyword strip */}
          <div className="relative mt-12 flex overflow-hidden">
            <motion.div
              className="flex whitespace-nowrap items-center gap-8 px-8"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
              style={{ willChange: "transform" }}
            >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex items-center gap-8 pl-8">
                  {[
                    "Strategy",
                    "Execution",
                    "Scale",
                    "Design",
                    "Engineering",
                    "Growth",
                    "AI",
                    "SaaS",
                    "Innovation",
                  ].map((word) => (
                    <span
                      key={`${i}-${word}`}
                      className="text-2xl font-black uppercase tracking-wider text-white/10 md:text-4xl"
                    >
                      {word}
                    </span>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Bottom spacing */}
        <div className="h-16 md:h-24" />
      </motion.div>
    </section>
  );
}
