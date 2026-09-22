"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import AboutFounder from "@/components/layout/AboutFounder";
import AboutCoFounder from "@/components/layout/AboutCoFounder";
import Footer from "@/components/layout/Footer";
import ContactSection from "@/components/layout/ContactSection";
import ButtonWithIconDemo from "@/components/ui/button-with-icon";
import { SpecialText } from "@/components/ui/special-text";
import { GlowingFeatures } from "@/components/ui/glowing-features";
import { HowItWorks } from "@/components/ui/HowItWorks";
import { ShowcaseSection } from "@/components/ui/ShowcaseSection";
import { TrustSignals } from "@/components/ui/TrustSignals";
import { StickyCTA } from "@/components/ui/StickyCTA";
import { RealBuildsShowcase } from "@/components/ui/real-builds-showcase";
import { PricingSection } from "@/components/ui/pricing-section";
import { CapabilitiesTicker } from "@/components/ui/capabilities-ticker";
import { TextEffect } from "@/components/core/text-effect";
import dynamic from "next/dynamic";

const Chatbot = dynamic(() => import("@/components/ui/Chatbot"), {
  ssr: false,
});

const faqItems = [
  {
    question: "What is Makerly AI and who are the founders?",
    answer:
      "Makerly AI is a full-stack digital product and AI engineering studio founded by Tousif Raza (Chief Architect) and Soha Shaikh (Strategy & Product). We engineer custom SaaS applications, autonomous AI workflows, and voice receptionists for founders across India, the US, and the UK.",
  },
  {
    question: "How fast do you deliver an initial working build?",
    answer:
      "Within 48 to 72 hours of kick-off, we deploy an interactive Stage 1 preview link on a live staging URL so you can test user flows, interface architecture, and interactions before full production rollout.",
  },
  {
    question: "Who owns the code, intellectual property, and database?",
    answer:
      "You own 100% of all custom code, user interfaces, database schemas, and documentation created for your project. Upon final milestone acceptance, the full GitHub repository and keys are transferred to your organization with zero vendor lock-in.",
  },
  {
    question: "Do you execute Non-Disclosure Agreements (NDAs)?",
    answer:
      "Yes. We execute mutual NDAs before reviewing proprietary algorithms, confidential business models, or commercial trade secrets.",
  },
  {
    question: "What is your satisfaction guarantee and refund policy?",
    answer:
      "To protect founders, our initial sprint includes a formal Stage 1 Preview review. If the preview architecture does not meet the technical specification agreed upon, you may cancel with zero retained fees under our formal Refund Policy.",
  },
];

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacityText = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

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
          {/* Upper badge title with TextEffect */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-brand-300">
            <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
            <TextEffect preset="fade-in-blur" speedReveal={1.2}>
              Digital Product Studio &amp; Autonomous AI Systems
            </TextEffect>
          </div>

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
            className="max-w-3xl text-balance text-base leading-7 text-white/80 md:text-lg"
          >
            Software engineering studio for founders who move fast. We build custom SaaS products, Sarvam multilingual voice agents, web applications, and automated workflow engines with working previews in 48 hours.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 md:mt-8 flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <ButtonWithIconDemo
              text="Start Your Project"
              onClick={() => scrollToSection("contact")}
              className="!bg-brand-blue !text-white font-bold flex items-center justify-center border-none hover:!bg-brand-blue/90 shadow-lg shadow-brand-blue/30 cursor-pointer"
            />
            <ButtonWithIconDemo
              text="Explore Capabilities"
              onClick={() => scrollToSection("capabilities")}
              className="!bg-white/5 !text-white font-semibold flex items-center justify-center border border-white/20 hover:!bg-white/10 cursor-pointer"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Trust Signals Strip */}
      <TrustSignals />

      {/* Capabilities & Tech Stack Ticker using InfiniteSlider */}
      <CapabilitiesTicker />

      {/* Canonical Capabilities Section */}
      <section id="capabilities" className="relative z-20">
        <GlowingFeatures />
      </section>

      {/* Process & How It Works */}
      <HowItWorks />

      {/* Real Builds & Case Studies (Replaces fake testimonials and synthetic tweet) */}
      <RealBuildsShowcase />

      {/* Pricing & Scope Guidance Section */}
      <PricingSection />

      {/* Visual Showcase Section */}
      <ShowcaseSection />

      {/* FAQ Section */}
      <section id="faq" className="relative z-20 mx-auto w-full max-w-5xl px-4 py-20 md:px-8">
        <div className="glass-card border border-white/10 p-8 md:p-12 rounded-3xl bg-black/40 backdrop-blur-xl">
          <div className="mb-10 max-w-3xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-brand-blue font-mono">
              Due Diligence &amp; FAQ
            </p>
            <h2 className="text-3xl font-black text-white md:text-5xl tracking-tight">
              Technical Clarity for Founders
            </h2>
            <p className="mt-4 text-base leading-relaxed text-white/70">
              Clear answers regarding intellectual property, sprint timelines, prototype reviews, and satisfaction guarantees.
            </p>
          </div>

          <div className="grid gap-4">
            {faqItems.map((item) => (
              <article
                key={item.question}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 transition-all"
              >
                <h3 className="text-lg font-bold text-white">
                  {item.question}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-300 md:text-base">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <AboutFounder />

      {/* Co-Founder Section */}
      <AboutCoFounder />

      {/* Contact Form Section */}
      <ContactSection />

      {/* Footer */}
      <Footer />

      {/* Sticky Mobile CTA */}
      <StickyCTA />

      {/* AI Voice & Text Chatbot */}
      <Chatbot />
    </main>
  );
}
