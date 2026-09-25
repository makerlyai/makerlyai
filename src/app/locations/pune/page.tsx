import type { Metadata } from "next";
import CityLandingTemplate from "@/components/locations/CityLandingTemplate";

export const metadata: Metadata = {
  title: "Top Software & AI Agency in Pune | Hinjawadi & Kharadi | MakerlyAI",
  description:
    "Leading custom software and AI development company in Pune. Serving Hinjawadi, Baner, Kharadi, and Viman Nagar with SaaS, mobile apps, and AI agents with a 24-hr preview.",
  keywords: [
    "software company in pune",
    "software development agency pune",
    "IT company hinjawadi pune",
    "app developers pune baner",
    "startups in pune",
    "Makerly AI Pune",
  ],
  alternates: { canonical: "/locations/pune" },
};

export default function PuneLocationPage() {
  return (
    <CityLandingTemplate
      cityName="Pune"
      stateOrRegion="Maharashtra"
      badge="Oxford of the East & Tech Hub · Pune"
      h1="Top Software & AI Development Agency in Pune"
      subheadline="Engineering rapid web applications, custom SaaS platforms, and intelligent AI bots for Pune innovators across Hinjawadi Phase 1-3, Baner, Kharadi, and Magarpatta."
      canonicalSlug="/locations/pune"
      metaDescription="Top software development and AI company serving Pune. 24-hr working preview."
      localAreas={[
        "Hinjawadi Rajiv Gandhi Infotech Park",
        "Baner",
        "Kharadi EON Free Zone",
        "Viman Nagar",
        "Aundh",
        "Kothrud",
        "Magarpatta City",
        "Senapati Bapat Road",
      ]}
      keyIndustries={[
        {
          title: "Automotive & Supply Chain Softwares",
          desc: "Vendor management, procurement tracking, and logistics platforms for Pune's auto and industrial ecosystem.",
        },
        {
          title: "SaaS Platforms & Next.js Web Apps",
          desc: "Modern multi-tenant SaaS architectures built with sub-second performance and enterprise security.",
        },
        {
          title: "Autonomous AI Voice Bots & Receptionists",
          desc: "24/7 automated telephone call handlers and appointment booking bots.",
        },
      ]}
      faqs={[
        {
          q: "Why do Pune startups choose MakerlyAI?",
          a: "MakerlyAI eliminates the months-long agency wait times. We deliver an interactive, functional preview in 24 hours with founder-led architecture by Tousif Raza.",
        },
      ]}
    />
  );
}
