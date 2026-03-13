"use client";

import { ReactLenis } from "lenis/react";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { FiArrowRight, FiMapPin } from "react-icons/fi";
import { useRef } from "react";

export const SmoothScrollHero = () => {
  return (
    <div className="bg-zinc-950">
      <ReactLenis root>
        <Hero />
        <Schedule />
      </ReactLenis>
    </div>
  );
};


const SECTION_HEIGHT = 1500;

const Hero = () => {
  return (
    <div
      style={{ height: `calc(${SECTION_HEIGHT}px + 100vh)` }}
      className="relative w-full"
    >
      <CenterImage />

      <ParallaxImages />

      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-b from-zinc-950/0 to-zinc-950" />
    </div>
  );
};

const CenterImage = () => {
  const { scrollY } = useScroll();

  const clip1 = useTransform(scrollY, [0, 1500], [25, 0]);
  const clip2 = useTransform(scrollY, [0, 1500], [75, 100]);

  const clipPath = useMotionTemplate`polygon(${clip1}% ${clip1}%, ${clip2}% ${clip1}%, ${clip2}% ${clip2}%, ${clip1}% ${clip2}%)`;

  const backgroundSize = useTransform(
    scrollY,
    [0, SECTION_HEIGHT + 500],
    ["170%", "100%"]
  );
  const opacity = useTransform(
    scrollY,
    [SECTION_HEIGHT, SECTION_HEIGHT + 500],
    [1, 0]
  );

  return (
    <motion.div
      className="sticky top-0 h-screen w-full"
      style={{
        clipPath,
        backgroundSize,
        opacity,
        backgroundImage:
          "url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop)",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    />
  );
};

const ParallaxImages = () => {
  return (
    <div className="mx-auto max-w-5xl px-4 pt-[200px]">
      <ParallaxImg
        src="https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2670&auto=format&fit=crop"
        alt="Server Infrastructure"
        start={-200}
        end={200}
        className="w-1/3 rounded-xl object-cover"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2670&auto=format&fit=crop"
        alt="Digital abstract UI"
        start={200}
        end={-250}
        className="mx-auto w-2/3 rounded-xl object-cover"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1620121692029-d088224ddc74?q=80&w=2832&auto=format&fit=crop"
        alt="AI Neural Net visualization"
        start={-200}
        end={200}
        className="ml-auto w-1/3 rounded-xl object-cover"
      />
      <ParallaxImg
        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop"
        alt="Modern tech workspace"
        start={0}
        end={-500}
        className="ml-24 w-5/12 rounded-xl object-cover"
      />
    </div>
  );
};

const ParallaxImg = ({ className, alt, src, start, end }: any) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: [`${start}px end`, `end ${end * -1}px`],
  });

  const opacity = useTransform(scrollYProgress, [0.75, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0.75, 1], [1, 0.85]);

  const y = useTransform(scrollYProgress, [0, 1], [start, end]);
  const transform = useMotionTemplate`translateY(${y}px) scale(${scale})`;

  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      ref={ref}
      style={{ transform, opacity }}
    />
  );
};

const Schedule = () => {
  return (
    <section
      id="launch-schedule"
      className="mx-auto max-w-5xl px-4 py-48 text-white"
    >
      <motion.h1
        initial={{ y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ ease: "easeInOut", duration: 0.75 }}
        className="mb-20 text-4xl font-black uppercase text-zinc-50"
      >
        Our Next Moves
      </motion.h1>
      <ScheduleItem title="Enterprise Engine V4" date="Q4 2026" location="Global Deployment" />
      <ScheduleItem title="Autonomous AI Assistants" date="Q1 2027" location="Beta Access" />
      <ScheduleItem title="Next-Gen Architecture" date="Q2 2027" location="Open Source" />
      <ScheduleItem title="Neural UX Patterns" date="Q3 2027" location="Design System Review" />
    </section>
  );
};

const ScheduleItem = ({ title, date, location }: any) => {
  return (
    <motion.div
      initial={{ y: 48, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      transition={{ ease: "easeInOut", duration: 0.75 }}
      className="mb-9 flex items-center justify-between border-b border-zinc-800 px-3 pb-9"
    >
      <div>
        <p className="mb-1.5 text-xl font-medium text-zinc-50">{title}</p>
        <p className="text-sm uppercase text-zinc-500 font-mono tracking-widest">{date}</p>
      </div>
      <div className="flex items-center gap-1.5 text-end text-sm uppercase text-zinc-500 font-mono tracking-widest">
        <p>{location}</p>
        <FiMapPin />
      </div>
    </motion.div>
  );
};
