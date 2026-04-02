"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AboutFounder from "@/components/layout/AboutFounder";
import Footer from "@/components/layout/Footer";
import ContactSection from "@/components/layout/ContactSection";
import ButtonWithIconDemo from "@/components/ui/button-with-icon";
import { SpecialText } from "@/components/ui/special-text";
import { GlowingFeatures } from "@/components/ui/glowing-features";
import { Tweet } from "@/components/ui/tweet";
import { AntiGravityHero } from "@/components/ui/anti-gravity-hero";
import { TestimonialsWithMarquee } from "@/components/ui/testimonials-with-marquee";
import { RadialOrbitalTimelineDemo } from "@/components/ui/radial-orbital-timeline-demo";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { ShowcaseSection } from "@/components/ui/ShowcaseSection";
import { TrustSignals } from "@/components/ui/TrustSignals";
import { StickyCTA } from "@/components/ui/StickyCTA";
import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("@/components/ui/Chatbot"), {
  ssr: false,
});

const faqItems = [
  {
    question: "What is Makerly AI?",
    answer:
      "Makerly AI is a software development agency that builds SaaS products, AI agents, web apps, mobile apps, and automation systems for founders and businesses.",
  },
  {
    question: "What services does Makerly AI offer?",
    answer:
      "Makerly AI offers SaaS development, AI agent development, custom web app development, mobile app development, and product strategy for startups and growing companies.",
  },
  {
    question: "Is Makerly AI a real brand and company?",
    answer:
      "Yes. Makerly AI is the official brand behind makerlyai.in, with a public website, social profiles, and a direct inquiry channel for projects and partnerships.",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  
  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <main className="relative min-h-screen selection:bg-brand-blue/30 bg-background overflow-clip">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqItems.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.answer,
              },
            })),
          }),
        }}
      />
      
      {/* Lightweight Fixed Background */}
      <div className="fixed inset-0 z-0 w-full h-full pointer-events-none">
         <div className="absolute inset-0 bg-background/60 md:bg-background/70 dark:bg-black/70 md:dark:bg-black/60 z-10 md:mix-blend-multiply" />
         <img 
           src="/scene1.jpg" 
           alt="Cinematic Canvas" 
           decoding="async"
           fetchPriority="high"
           className="w-full h-full object-cover opacity-15 md:opacity-25 md:mix-blend-luminosity"
         />
      </div>

      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative w-full min-h-[100dvh] md:h-screen flex flex-col items-center justify-center p-4 overflow-hidden"
      >
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-brand-blue/20 blur-[80px] md:blur-[100px] rounded-full pointer-events-none z-10" />
        
        <motion.div 
          style={{ opacity: opacityText }}
          className="relative z-20 text-center flex flex-col items-center gap-6 w-full max-w-5xl"
        >
          {/* Upper title */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="uppercase tracking-[0.2em] font-medium text-xs md:text-sm opacity-70"
          >
            <SpecialText speed={20} delay={0.5}>Digital Architecture & AI</SpecialText>
          </motion.div>

          {/* Main heading */}
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black tracking-tighter leading-[0.9]"
          >
            <span className="block text-white">Makerly AI</span>
            <span className="text-brand-blue drop-shadow-[0_0_15px_rgba(26,75,156,0.5)]">
              builds what you grow.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="max-w-3xl text-balance text-base leading-7 text-white/75 md:text-lg"
          >
            Makerly AI is a software development agency for founders and
            businesses that need SaaS products, AI agents, web apps, mobile
            apps, and automation systems built with speed and clarity.
          </motion.p>
          
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.4 }}
             className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <ButtonWithIconDemo 
               text="Start Project"
               onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
               className="!bg-brand-blue !text-white font-semibold flex items-center justify-center border-none hover:!bg-brand-blue/90"
            />
            <ButtonWithIconDemo 
               text="Our Capabilities"
               onClick={() => document.getElementById('capabilities')?.scrollIntoView({ behavior: 'smooth' })}
               className="!bg-white/5 !text-white font-semibold flex items-center justify-center border border-white/20 hover:!bg-white/10"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Signals Strip */}
      <TrustSignals />

      {/* Neon Scroll Stripe */}
      <section id="capabilities" className="relative w-full py-24 md:py-32 overflow-hidden z-20 flex flex-col items-center justify-center bg-black/80 md:bg-black/40 border-y border-white/10">
        <div className="absolute inset-0 bg-brand-blue/5 blur-3xl pointer-events-none" />
        <p className="text-white/50 uppercase tracking-[0.3em] text-xs font-semibold mb-16 relative z-10">What We Do</p>
        
        <div className="relative flex overflow-hidden w-full group">
           <motion.div 
             className="flex whitespace-nowrap gap-12 sm:gap-24 px-6 items-center"
             animate={{ x: ["-50%", "0%"] }}
             transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
             style={{ willChange: "transform" }}
           >
              {[...Array(2)].map((_, i) => (
                <div key={i} className="flex gap-12 sm:gap-24 items-center pl-12 sm:pl-24">
                  <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-300">
                    SaaS Platforms
                  </span>
                  <span className="w-4 h-4 rounded-full bg-white/40" />
                  <span className="text-4xl md:text-6xl lg:text-8xl font-black text-white">
                    AI Agents
                  </span>
                  <span className="w-4 h-4 rounded-full bg-white/40" />
                  <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-brand-blue">
                    Smart Receptionists
                  </span>
                  <span className="w-4 h-4 rounded-full bg-white/40" />
                  <span className="text-4xl md:text-6xl lg:text-8xl font-black text-white">
                    Web Apps
                  </span>
                  <span className="w-4 h-4 rounded-full bg-white/40" />
                  <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-white">
                    Mobile Apps
                  </span>
                  <span className="w-4 h-4 rounded-full bg-white/40" />
                  <span className="text-4xl md:text-6xl lg:text-8xl font-black text-white/90">
                    Process Automation
                  </span>
                  <span className="w-4 h-4 rounded-full bg-white/40" />
                  <span className="text-4xl md:text-6xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-purple-400">
                    Revenue Growth
                  </span>
                </div>
              ))}
           </motion.div>
        </div>
      </section>

      <GlowingFeatures />

      <TestimonialsWithMarquee />

      {/* How It Works — replaces Neural Core */}
      <HowItWorks />

      <RadialOrbitalTimelineDemo />

      <AntiGravityHero />

      {/* Showcase — replaces ScrollSequence */}
      <ShowcaseSection />

      <section className="relative z-20 mx-auto w-full max-w-5xl px-4 py-20 md:px-8">
        <div className="glass-card border border-white/10 p-8 md:p-12">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-blue">
              Makerly AI FAQ
            </p>
            <h2 className="text-3xl font-black text-white md:text-5xl">
              Clear signals for people and search engines
            </h2>
            <p className="mt-4 text-base leading-7 text-white/70">
              These answers make it explicit that Makerly AI is a distinct brand
              and a real software development business, not a typo or a generic
              search phrase.
            </p>
          </div>

          <div className="grid gap-4">
            {faqItems.map((item) => (
              <article
                key={item.question}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <h3 className="text-lg font-semibold text-white">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-7 text-white/70 md:text-base">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <AboutFounder />

      {/* Social Proof */}
      <section className="relative w-full py-24 px-4 flex justify-center bg-black/80 md:bg-black/40 z-20 border-y border-white/10">
         <Tweet className="w-full shadow-2xl scale-[1.02]" id="1630000000000000000" />
      </section>

      {/* Contact Form Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile CTA */}
      <StickyCTA />

      {/* AI Chatbot */}
      <Chatbot />
    </main>
  );
}
