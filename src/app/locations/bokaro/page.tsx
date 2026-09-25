import type { Metadata } from "next";
import CityLandingTemplate from "@/components/locations/CityLandingTemplate";

export const metadata: Metadata = {
  title: "Top Software & AI Agency in Bokaro Steel City | MakerlyAI",
  description:
    "Official Bokaro tech hub for MakerlyAI, founded by Tousif Raza (@thebokaroguy). Engineering custom SaaS, modern web applications, mobile apps, and AI systems with 24-hr previews.",
  keywords: [
    "software company in bokaro",
    "software development bokaro steel city",
    "IT company in bokaro",
    "thebokaroguy",
    "Tousif Raza Bokaro",
    "tech startup in bokaro",
    "app development bokaro",
    "Makerly AI Bokaro",
  ],
  alternates: { canonical: "/locations/bokaro" },
};

export default function BokaroLocationPage() {
  return (
    <CityLandingTemplate
      cityName="Bokaro Steel City"
      stateOrRegion="Jharkhand"
      badge="Founder Roots · Tousif Raza (@thebokaroguy)"
      h1="Top Software & AI Development in Bokaro Steel City"
      subheadline="Born from the industrial discipline of Bokaro, MakerlyAI delivers world-tier software engineering, AI assistants, and scalable SaaS platforms for businesses and startups."
      canonicalSlug="/locations/bokaro"
      metaDescription="Official Bokaro tech hub of MakerlyAI & founder Tousif Raza (@thebokaroguy). 24-hour preview guarantee."
      localAreas={[
        "Sector 4 Commercial Hub",
        "Sector 1",
        "Sector 3",
        "Sector 9",
        "Chas Commercial Market",
        "Bokaro Industrial Area Development Authority (BIADA)",
        "Co-operative Colony",
        "Sector 12",
        "Kurmidih",
      ]}
      keyIndustries={[
        {
          title: "SaaS Platforms & Web Applications",
          desc: "Cloud platforms built with Next.js, TypeScript, and modern relational databases that scale to millions of users.",
        },
        {
          title: "Autonomous AI Receptionists & WhatsApp Bots",
          desc: "Never miss a customer call or booking again. 24/7 AI conversational agents customized to your exact service offerings.",
        },
        {
          title: "Commercial & Retail Management Systems",
          desc: "Complete point of sale, inventory synchronization, and digital payment integration tailored for retail and wholesale operators.",
        },
        {
          title: "Startup MVP Prototyping in 24 Hours",
          desc: "See a working, functional prototype of your app in 24 hours before spending months on development.",
        },
      ]}
      faqs={[
        {
          q: "What is MakerlyAI's connection to Bokaro Steel City?",
          a: "MakerlyAI's founder, Tousif Raza, is widely known online as @thebokaroguy. Having grown up in Bokaro, Tousif is deeply committed to empowering local businesses and tech talent across Jharkhand with world-class engineering standards.",
        },
        {
          q: "Can businesses in Bokaro meet with the team directly?",
          a: "Yes. Our team frequently travels between our Jamshedpur HQ and Bokaro/Chas. You can schedule a virtual consultation or an in-person session with Tousif Raza.",
        },
      ]}
    />
  );
}
