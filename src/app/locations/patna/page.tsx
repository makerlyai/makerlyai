import type { Metadata } from "next";
import CityLandingTemplate from "@/components/locations/CityLandingTemplate";

export const metadata: Metadata = {
  title: "Top Software & AI Company in Patna Bihar | MakerlyAI",
  description:
    "Leading software development company in Patna, Bihar. We build high-performance web apps, SaaS, mobile applications, and AI voice agents with a 24-hour preview guarantee.",
  keywords: [
    "software company in patna",
    "software development company in patna",
    "IT company in patna bihar",
    "startups in patna",
    "app developers in patna",
    "website development patna",
    "AI startup patna",
    "Makerly AI Patna",
  ],
  alternates: { canonical: "/locations/patna" },
};

export default function PatnaLocationPage() {
  return (
    <CityLandingTemplate
      cityName="Patna"
      stateOrRegion="Bihar"
      badge="Bihar Tech & Startup Hub · Patna"
      h1="Leading Software & AI Development Company in Patna"
      subheadline="Empowering Patna's ambitious startups, coaching giants, healthcare networks, and retailers with silicon-valley caliber software engineering and AI automation."
      canonicalSlug="/locations/patna"
      metaDescription="Top software development and AI company in Patna, Bihar. Interactive preview delivered in 24 hours."
      localAreas={[
        "Boring Road",
        "Kankarbagh",
        "Bailey Road",
        "Patliputra Colony",
        "Frazer Road",
        "Rajendra Nagar",
        "Danapur",
        "Ashiana Nagar",
        "Exhibition Road",
      ]}
      keyIndustries={[
        {
          title: "Coaching & EdTech Learning Platforms",
          desc: "Large-scale exam preparation portals, question banks, student analytics, and anti-piracy video streaming engines for Patna educators.",
        },
        {
          title: "Clinical Hospital Management Softwares",
          desc: "Appointment scheduling, patient records, billing, and automated SMS/WhatsApp lab reports for clinics across Patna.",
        },
        {
          title: "Food Delivery & Restaurant Apps",
          desc: "0% commission direct online ordering apps, table QR ordering, and rider tracking systems for local food brands.",
        },
        {
          title: "Full-Stack Custom SaaS Engineering",
          desc: "Scalable web applications built on Next.js, Node.js, and cloud PostgreSQL with enterprise security.",
        },
      ]}
      faqs={[
        {
          q: "Why should Patna startups choose MakerlyAI over traditional agencies?",
          a: "Most local agencies deliver generic, slow WordPress templates. MakerlyAI engineers custom modern web and mobile architectures (Next.js, TypeScript) with an interactive preview in 24 hours and a zero-risk guarantee.",
        },
        {
          q: "Does MakerlyAI develop native mobile apps for businesses in Patna?",
          a: "Yes! We build high-speed iOS and Android applications with offline capabilities, push notifications, and Razorpay/UPI payment gateways.",
        },
      ]}
    />
  );
}
