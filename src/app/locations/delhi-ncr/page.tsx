import type { Metadata } from "next";
import CityLandingTemplate from "@/components/locations/CityLandingTemplate";

export const metadata: Metadata = {
  title: "Top Software & AI Agency in Delhi NCR | Gurgaon & Noida | MakerlyAI",
  description:
    "Leading custom software and AI development company in Delhi NCR, Gurgaon Cyber City, and Noida. Full-stack SaaS, mobile apps, and AI agents with a 24-hr preview guarantee.",
  keywords: [
    "software company in delhi",
    "software company in gurgaon",
    "software company in noida",
    "software development agency delhi ncr",
    "IT company cyber city gurgaon",
    "startups in delhi ncr",
    "Makerly AI Delhi NCR",
  ],
  alternates: { canonical: "/locations/delhi-ncr" },
};

export default function DelhiNcrLocationPage() {
  return (
    <CityLandingTemplate
      cityName="Delhi NCR"
      stateOrRegion="National Capital Region"
      badge="National Capital Tech Hub · Delhi NCR"
      h1="Top Software & AI Development Agency in Delhi NCR"
      subheadline="Engineering rapid enterprise software, high-scale SaaS products, and AI automation for founders and leaders across Gurgaon Cyber City, Noida Sector 62, and South Delhi."
      canonicalSlug="/locations/delhi-ncr"
      metaDescription="Top software development and AI company serving Delhi NCR, Gurgaon, and Noida. 24-hr preview."
      localAreas={[
        "DLF Cyber City Gurgaon",
        "Golf Course Road Gurgaon",
        "Noida Sector 62 & 125",
        "Okhla Phase 1-3",
        "Connaught Place",
        "Aerocity Delhi",
        "Nehru Place",
        "Sohna Road",
      ]}
      keyIndustries={[
        {
          title: "Startup MVPs in 24 Hours",
          desc: "Fast-track interactive prototypes for venture-backed and bootstrapped founders pitching to Delhi/Gurgaon angel networks.",
        },
        {
          title: "High-Traffic E-Commerce & Marketplace Softwares",
          desc: "Full-scale multi-vendor platforms with real-time logistics and payment settlement.",
        },
        {
          title: "AI Voice Receptionists & WhatsApp CRM Automation",
          desc: "Automated customer acquisition pipelines qualifying leads 24 hours a day.",
        },
      ]}
      faqs={[
        {
          q: "How fast can Delhi NCR startups get a working software preview?",
          a: "Within 24 hours of brief intake, MakerlyAI delivers a functional interactive prototype preview.",
        },
      ]}
    />
  );
}
