import type { Metadata } from "next";
import CityLandingTemplate from "@/components/locations/CityLandingTemplate";

export const metadata: Metadata = {
  title: "Top Software & AI Agency in Mumbai | BKC & Andheri Tech Hub | MakerlyAI",
  description:
    "Leading software and AI engineering studio in Mumbai. Serving BKC, Andheri, Lower Parel, and Powai with custom FinTech, SaaS, e-commerce, and AI agents with a 24-hr preview.",
  keywords: [
    "software company in mumbai",
    "software development agency mumbai",
    "IT company bkc mumbai",
    "app development company mumbai",
    "startups in mumbai",
    "Makerly AI Mumbai",
  ],
  alternates: { canonical: "/locations/mumbai" },
};

export default function MumbaiLocationPage() {
  return (
    <CityLandingTemplate
      cityName="Mumbai"
      stateOrRegion="Maharashtra"
      badge="Financial Capital Tech Hub · Mumbai"
      h1="Top Software & AI Development Agency in Mumbai"
      subheadline="Engineering institutional FinTech platforms, scalable SaaS architectures, and autonomous AI agents for Mumbai's leading enterprises, D2C brands, and venture-backed startups."
      canonicalSlug="/locations/mumbai"
      metaDescription="Top software development and AI agency serving Mumbai BKC, Powai, and Lower Parel. 24-hr working preview."
      localAreas={[
        "Bandra Kurla Complex (BKC)",
        "Powai Hiranandani",
        "Andheri East MIDC",
        "Lower Parel",
        "Nariman Point",
        "Goregaon West",
        "Worli",
        "Thane",
        "Navi Mumbai",
      ]}
      keyIndustries={[
        {
          title: "FinTech & Financial Ledger Systems",
          desc: "High-security transaction platforms, lending MVPs, and automated payment gateways.",
        },
        {
          title: "D2C & Luxury Commerce Headless Apps",
          desc: "Sub-second e-commerce web and mobile platforms with automated inventory and UPI/Stripe integration.",
        },
        {
          title: "Autonomous AI Receptionists & Sales Bots",
          desc: "24/7 client intake, phone support, and appointment scheduling bots tailored for Mumbai professionals.",
        },
      ]}
      faqs={[
        {
          q: "How does MakerlyAI serve Mumbai enterprises?",
          a: "We work directly with founders and product teams in Mumbai, delivering working prototypes in 24 hours with complete code transparency.",
        },
      ]}
    />
  );
}
