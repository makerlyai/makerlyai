import type { Metadata } from "next";
import CityLandingTemplate from "@/components/locations/CityLandingTemplate";

export const metadata: Metadata = {
  title: "Top Software & AI Agency in Hyderabad | HITEC City Tech Hub | MakerlyAI",
  description:
    "Leading custom software and AI development company serving Hyderabad, HITEC City, Gachibowli, and Madhapur. Full-stack SaaS and AI agents with a 24-hr preview guarantee.",
  keywords: [
    "software company in hyderabad",
    "software development agency hyderabad",
    "IT company hitec city hyderabad",
    "AI startup hyderabad",
    "app developers hyderabad gachibowli",
    "Makerly AI Hyderabad",
  ],
  alternates: { canonical: "/locations/hyderabad" },
};

export default function HyderabadLocationPage() {
  return (
    <CityLandingTemplate
      cityName="Hyderabad"
      stateOrRegion="Telangana"
      badge="HITEC City Tech Hub · Hyderabad"
      h1="Top Software & AI Development in Hyderabad"
      subheadline="Partnering with Hyderabad startups, healthtech giants, and global enterprises across HITEC City and Gachibowli to build ultra-fast SaaS platforms and autonomous AI systems."
      canonicalSlug="/locations/hyderabad"
      metaDescription="Top software development and AI agency serving Hyderabad & HITEC City. 24-hr working preview."
      localAreas={[
        "HITEC City",
        "Gachibowli",
        "Madhapur",
        "Jubilee Hills",
        "Banjara Hills",
        "Kondapur",
        "Financial District Nanakramguda",
        "Begumpet",
      ]}
      keyIndustries={[
        {
          title: "Autonomous AI Agents & Enterprise LLMs",
          desc: "Custom agentic workflows, voice receptionists, and secure internal knowledge retrieval engines.",
        },
        {
          title: "HealthTech & Clinical Workflow Softwares",
          desc: "HIPAA-compliant telemedicine platforms, lab record sync, and real-time patient queue management.",
        },
        {
          title: "Scalable B2B SaaS & Cloud Architecture",
          desc: "High-throughput Next.js and cloud PostgreSQL applications engineered for extreme scalability.",
        },
        {
          title: "Startup MVPs in 24 Hours",
          desc: "Interactive working preview shipped within 24 hours with complete code transparency.",
        },
      ]}
      faqs={[
        {
          q: "How does MakerlyAI serve Hyderabad businesses?",
          a: "We work directly with founders and CTOs in Hyderabad, offering rapid 24-hour prototypes, transparent milestones, and silicon-valley caliber architecture.",
        },
      ]}
    />
  );
}
