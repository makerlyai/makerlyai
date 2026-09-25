import type { Metadata } from "next";
import CityLandingTemplate from "@/components/locations/CityLandingTemplate";

export const metadata: Metadata = {
  title: "Top Software & AI Development Company in Kolkata | MakerlyAI",
  description:
    "Top-tier software development and AI engineering agency in Kolkata & Salt Lake Sector V. We build custom SaaS, web apps, mobile apps, and AI agents with a 24-hr preview guarantee.",
  keywords: [
    "software company in kolkata",
    "software development company kolkata",
    "IT company salt lake sector 5",
    "startups in kolkata",
    "app development company kolkata",
    "AI company kolkata",
    "web development company kolkata west bengal",
    "Makerly AI Kolkata",
  ],
  alternates: { canonical: "/locations/kolkata" },
};

export default function KolkataLocationPage() {
  return (
    <CityLandingTemplate
      cityName="Kolkata"
      stateOrRegion="West Bengal"
      badge="IT Capital of Eastern India · Kolkata"
      h1="Top Software & AI Development Company in Kolkata"
      subheadline="Engineering enterprise SaaS systems, intelligent AI receptionists, and high-conversion mobile apps for businesses across Salt Lake Sector V, New Town, and Greater Kolkata."
      canonicalSlug="/locations/kolkata"
      metaDescription="Leading software development and AI agency in Kolkata and Salt Lake Sector V. 24-hour working preview."
      localAreas={[
        "Salt Lake Sector V",
        "New Town Rajarhat",
        "Park Street",
        "Ballygunge",
        "Camac Street",
        "Rajarhat Expressway",
        "Alipore",
        "Gariahat",
        "Howrah",
      ]}
      keyIndustries={[
        {
          title: "Enterprise SaaS & B2B Portals",
          desc: "Multi-tenant platforms engineered with Next.js, Node.js, and cloud data backends for Kolkata IT leaders and global export businesses.",
        },
        {
          title: "Autonomous AI Agents & Voice Bots",
          desc: "Automated voice assistants and multilingual AI chat agents handling 24/7 client booking and inbound qualification.",
        },
        {
          title: "Custom E-Commerce & D2C Marketplaces",
          desc: "Ultra-fast headless commerce architectures with sub-second page loads and seamless UPI and international payment integrations.",
        },
        {
          title: "Travel & Hospitality Booking Engines",
          desc: "Custom booking engines, itinerary planners, and agent management software built for Eastern India travel agencies.",
        },
      ]}
      faqs={[
        {
          q: "How does MakerlyAI compare to IT companies in Salt Lake Sector V?",
          a: "Traditional IT firms in Sector V involve bureaucratic layers, long contracts, and slow turnaround. MakerlyAI provides agile, direct architect-level engineering led by Tousif Raza, shipping functional previews in 24 hours.",
        },
        {
          q: "Do you build custom mobile apps for Kolkata startups?",
          a: "Yes. We build responsive cross-platform apps using React Native and Flutter with real-time sync, geolocation, and payment gateways.",
        },
      ]}
    />
  );
}
