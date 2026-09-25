import type { Metadata } from "next";
import CityLandingTemplate from "@/components/locations/CityLandingTemplate";

export const metadata: Metadata = {
  title: "Top Software & AI Agency in Ahmedabad & Gujarat | MakerlyAI",
  description:
    "Leading software development and AI agency serving Ahmedabad, Vadodara, Surat, and Gujarat. High-performance SaaS, mobile apps, and autonomous AI agents with a 24-hr preview.",
  keywords: [
    "software company in ahmedabad",
    "software development agency ahmedabad",
    "IT company in vadodara",
    "software company in vadodara",
    "startups in ahmedabad gujarat",
    "app development surat",
    "AI startup ahmedabad",
    "Makerly AI Ahmedabad Gujarat",
  ],
  alternates: { canonical: "/locations/ahmedabad" },
};

export default function AhmedabadLocationPage() {
  return (
    <CityLandingTemplate
      cityName="Ahmedabad & Gujarat"
      stateOrRegion="Gujarat"
      badge="Commercial & Tech Powerhouse · Gujarat"
      h1="Top Software & AI Development in Ahmedabad & Gujarat"
      subheadline="Engineering rapid SaaS platforms, manufacturing ERPs, e-commerce applications, and AI voice receptionists for enterprises in Ahmedabad, Vadodara, Surat, and Rajkot."
      canonicalSlug="/locations/ahmedabad"
      metaDescription="Top software development company serving Ahmedabad, Vadodara, and Gujarat. 24-hr working preview."
      localAreas={[
        "SG Highway Ahmedabad",
        "Prahlad Nagar",
        "Bodakdev",
        "Alkapuri Vadodara",
        "Manjalpur Vadodara",
        "Ring Road Surat",
        "GIFT City Gandhinagar",
        "Makarpura Industrial Estate",
      ]}
      keyIndustries={[
        {
          title: "Manufacturing & Industrial ERP Systems",
          desc: "Complete production scheduling, supply chain visibility, bill of materials (BOM), and multi-warehouse software.",
        },
        {
          title: "Chemical & Textile Trade B2B Portals",
          desc: "Wholesale ordering, quotation workflows, client credit management, and GST-compliant invoicing.",
        },
        {
          title: "Autonomous AI Agents & Sales Bots",
          desc: "Multilingual AI chatbots and voice agents handling 24/7 client booking, order inquiries, and CRM qualification.",
        },
        {
          title: "Custom FinTech & GIFT City Platforms",
          desc: "High-security financial dashboards, ledger systems, and automated payment reconciliation.",
        },
      ]}
      faqs={[
        {
          q: "Does MakerlyAI serve businesses in Ahmedabad, Vadodara, and Surat?",
          a: "Yes! We work with forward-thinking businesses and startups across Gujarat. We deliver working software previews within 24 hours, giving companies in Ahmedabad and Vadodara unmatched agility.",
        },
        {
          q: "How does MakerlyAI's zero-risk preview work for Gujarat enterprises?",
          a: "You share your specifications. We build and deploy an interactive prototype within 24 hours. You only proceed if you love the architecture and user experience.",
        },
      ]}
    />
  );
}
