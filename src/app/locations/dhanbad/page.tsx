import type { Metadata } from "next";
import CityLandingTemplate from "@/components/locations/CityLandingTemplate";

export const metadata: Metadata = {
  title: "Top Software & AI Company in Dhanbad Jharkhand | MakerlyAI",
  description:
    "Custom software development, industrial ERP, and AI systems in Dhanbad, Jharkhand. Serving mining, logistics, commercial, and tech enterprises with 24-hr previews.",
  keywords: [
    "software company in dhanbad",
    "software development dhanbad",
    "IT company in dhanbad",
    "app developers dhanbad",
    "mining software company dhanbad",
    "web development dhanbad jharkhand",
    "Tousif Raza Dhanbad",
    "Makerly AI Dhanbad",
  ],
  alternates: { canonical: "/locations/dhanbad" },
};

export default function DhanbadLocationPage() {
  return (
    <CityLandingTemplate
      cityName="Dhanbad"
      stateOrRegion="Jharkhand"
      badge="Industrial & Mining Tech Hub · Dhanbad"
      h1="Leading Software & AI Development in Dhanbad"
      subheadline="Powering Dhanbad's commercial leaders, logistics networks, manufacturing plants, and tech startups with resilient software architecture and intelligent automation."
      canonicalSlug="/locations/dhanbad"
      metaDescription="Leading software company in Dhanbad Jharkhand specializing in enterprise systems and AI."
      localAreas={[
        "Bank More",
        "Hirapur",
        "Govindpur Industrial Belt",
        "Saraidhela",
        "Jharia",
        "Katras",
        "Kusunda",
        "Sindri",
        "Wrasse",
      ]}
      keyIndustries={[
        {
          title: "Logistics & Fleet GPS Management",
          desc: "Real-time dispatch, route optimization, driver monitoring, and fuel management portals for transport companies across Dhanbad.",
        },
        {
          title: "Industrial & Plant ERP Systems",
          desc: "Automated inventory management, maintenance dispatch, and shift scheduling software tailored for heavy industry operations.",
        },
        {
          title: "Retail & Multi-Outlet Billing Softwares",
          desc: "Cloud-synchronized point of sale (POS) and inventory tracking platforms built with offline-first capabilities.",
        },
        {
          title: "AI Voice Assistants & Chat Intake",
          desc: "Automated customer support agents answering incoming commercial phone calls and qualifying leads 24/7.",
        },
      ]}
      faqs={[
        {
          q: "Why choose MakerlyAI for software development in Dhanbad?",
          a: "Unlike distant agencies that don't understand regional industries, MakerlyAI is headquartered right here in Jharkhand. We provide founder-level architectural oversight by Tousif Raza and 24-hour working prototypes.",
        },
        {
          q: "Do you develop custom ERPs for manufacturing and logistics firms?",
          a: "Yes. We build custom ERP and logistics platforms that integrate seamlessly with GPS hardware, accounting software, and SMS/WhatsApp alert channels.",
        },
      ]}
    />
  );
}
