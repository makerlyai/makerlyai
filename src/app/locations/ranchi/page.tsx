import type { Metadata } from "next";
import CityLandingTemplate from "@/components/locations/CityLandingTemplate";

export const metadata: Metadata = {
  title: "Top Software & AI Company in Ranchi Jharkhand | MakerlyAI",
  description:
    "Leading software development company and AI startup in Ranchi, Jharkhand. We build custom SaaS platforms, mobile apps, and autonomous AI agents with a 24-hour preview guarantee.",
  keywords: [
    "software company in ranchi",
    "software development ranchi",
    "IT company in ranchi",
    "startups in ranchi",
    "app development company ranchi",
    "website development in ranchi",
    "AI startup ranchi jharkhand",
    "Tousif Raza Ranchi",
    "Makerly AI Ranchi",
  ],
  alternates: { canonical: "/locations/ranchi" },
};

export default function RanchiLocationPage() {
  return (
    <CityLandingTemplate
      cityName="Ranchi"
      stateOrRegion="Jharkhand"
      badge="Capital Tech Hub · Jharkhand"
      h1="Top Software & AI Development Company in Ranchi"
      subheadline="Engineering next-generation web applications, SaaS platforms, and intelligent AI agents for Ranchi startups, healthcare networks, edtech ventures, and government enterprises."
      canonicalSlug="/locations/ranchi"
      metaDescription="Leading software company in Ranchi Jharkhand building custom apps and AI with 24-hr previews."
      localAreas={[
        "Lalpur",
        "Doranda",
        "Kanke Road",
        "Harmu Housing Colony",
        "Hinoo",
        "Namkum",
        "Bariatu",
        "Tupudana Industrial Area",
        "Morabadi",
        "Ashok Nagar",
      ]}
      keyIndustries={[
        {
          title: "Healthcare & Clinic ERP Software",
          desc: "Automated OPD appointment booking, electronic health records (EHR), and patient follow-up bots for Ranchi hospitals and medical centers.",
        },
        {
          title: "EdTech & Coaching Institute Platforms",
          desc: "Custom LMS, student progress tracking, live test series, and automated fee intake systems tailored for Ranchi coaching hubs.",
        },
        {
          title: "Autonomous AI Receptionists & Bots",
          desc: "24/7 AI voice bots and WhatsApp support automation to qualify incoming client inquiries across Jharkhand.",
        },
        {
          title: "Custom B2B SaaS & Startup MVPs",
          desc: "Full-stack cloud applications built on Next.js, Node.js, and PostgreSQL delivered with a 24-hour working preview.",
        },
      ]}
      faqs={[
        {
          q: "What makes MakerlyAI the top software development company for Ranchi businesses?",
          a: "MakerlyAI combines world-class full-stack architecture with direct regional presence. Spearheaded by founder Tousif Raza, we deliver high-performance prototypes in 24 hours, eliminating agency delays and bloated overhead.",
        },
        {
          q: "Can MakerlyAI develop custom mobile apps for Ranchi organizations?",
          a: "Yes. We engineer iOS and Android applications using React Native and Flutter, complete with payment gateway integration, real-time push notifications, and administrative dashboards.",
        },
        {
          q: "How fast can my Ranchi startup get a working software preview?",
          a: "Within 24 hours of receiving your initial project brief, our team delivers an interactive, working preview of your core architecture.",
        },
      ]}
    />
  );
}
