import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const lemonMilk = localFont({
  src: [
    {
      path: "./fonts/LemonMilkbold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/LemonMilk.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/LemonMilklight.otf",
      weight: "300",
      style: "normal",
    },
  ],
  variable: "--font-lemon-milk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Makerly AI | AI App, SaaS, and Automation Development Agency",
  description:
    "Makerly AI is an elite AI & software development startup founded by Tousif Raza. Based in Jamshedpur, Jharkhand, we build enterprise SaaS, AI agents, web apps, and mobile apps for founders across Jharkhand, Bihar, West Bengal, India, and worldwide.",
  keywords: [
    "Makerly AI",
    "Makerly AI agency",
    "Tousif Raza",
    "Tousif Raza founder",
    "thebokaroguy",
    "startups in jamshedpur",
    "software startup in jamshedpur",
    "software company in jamshedpur",
    "IT companies in jamshedpur",
    "startups in jharkhand",
    "software startup anywhere in jharkhand",
    "software startups in ranchi",
    "top IT startups dhanbad",
    "software development bokaro",
    "startups in patna",
    "software company in bihar",
    "app developers gaya",
    "software startups in kolkata",
    "tech startups west bengal",
    "custom software development agency",
    "build SaaS for me",
    "AI app development service",
    "build MVP in 24 hours",
    "AI agent development",
    "SaaS development company",
    "web app development",
    "mobile app development",
  ],
  metadataBase: new URL("https://makerlyai.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://makerlyai.in",
    siteName: "Makerly AI",
    title: "Makerly AI | AI App, SaaS, and Automation Development Agency",
    description:
      "Makerly AI builds SaaS platforms, AI agents, web apps, and mobile apps for fast-moving founders in Jamshedpur, Jharkhand, and worldwide.",
    images: [
      {
        url: "/initialletterlogosquare.png",
        width: 512,
        height: 512,
        alt: "Makerly AI Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@MakerlyAI",
    creator: "@thebokaroguy",
    title: "Makerly AI | AI App, SaaS, and Automation Development Agency",
    description:
      "Makerly AI builds SaaS platforms, AI agents, web apps, and mobile apps for founders and businesses.",
    images: ["/initialletterlogosquare.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logoMupdated.svg",
    shortcut: "/logoMupdated.svg",
    apple: "/logoMupdated.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Schema: Organization & Knowledge Graph Entity */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://makerlyai.in/#organization",
              name: "Makerly AI",
              alternateName: [
                "MakerlyAI",
                "Makerly AI Studio",
                "Makerly AI Technologies",
              ],
              url: "https://makerlyai.in",
              logo: "https://makerlyai.in/initialletterlogosquare.png",
              image: "https://makerlyai.in/initialletterlogosquare.png",
              description:
                "Makerly AI is an AI and SaaS development agency headquartered in Jamshedpur, Jharkhand, building high-conversion software, AI agents, and web applications for startups across Eastern India and globally.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Jamshedpur",
                addressRegion: "Jharkhand",
                postalCode: "831005",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 22.8046,
                longitude: 86.2029,
              },
              founder: {
                "@type": "Person",
                "@id": "https://makerlyai.in/#tousif-raza",
                name: "Tousif Raza",
                jobTitle: "Founder & Chief Architect",
                alternateName: ["thebokaroguy", "Tousif Raza MakerlyAI"],
                url: "https://makerlyai.in/founder/tousif-raza",
                sameAs: [
                  "https://linkedin.com/in/tousifraza",
                  "https://x.com/thebokaroguy",
                  "https://instagram.com/thebokaroguy",
                  "https://github.com/makerlyai",
                ],
              },
              coFounder: {
                "@type": "Person",
                name: "Soha Shaikh",
                jobTitle: "Co-Founder & Business Architect",
              },
              contactPoint: {
                "@type": "ContactPoint",
                email: "getmakerlyai@gmail.com",
                contactType: "sales",
                availableLanguage: ["English", "Hindi"],
              },
              areaServed: [
                { "@type": "City", name: "Jamshedpur" },
                { "@type": "City", name: "Ranchi" },
                { "@type": "City", name: "Dhanbad" },
                { "@type": "City", name: "Bokaro Steel City" },
                { "@type": "AdministrativeArea", name: "Jharkhand" },
                { "@type": "City", name: "Patna" },
                { "@type": "City", name: "Gaya" },
                { "@type": "AdministrativeArea", name: "Bihar" },
                { "@type": "City", name: "Kolkata" },
                { "@type": "AdministrativeArea", name: "West Bengal" },
                { "@type": "Country", name: "India" },
                { "@type": "Place", name: "Worldwide" },
              ],
              sameAs: [
                "https://instagram.com/makerlyai",
                "https://x.com/makerlyai",
                "https://linkedin.com/company/makerlyai",
                "https://github.com/makerlyai",
                "https://youtube.com/@makerlyai",
              ],
            }),
          }}
        />

        {/* Schema: Canonical Person Entity Disambiguation for Tousif Raza */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "@id": "https://makerlyai.in/#tousif-raza",
              name: "Tousif Raza",
              givenName: "Tousif",
              familyName: "Raza",
              alternateName: [
                "thebokaroguy",
                "Tousif Raza Architect",
                "Tousif Raza Makerly AI",
              ],
              jobTitle: "Founder & Chief Software Architect",
              worksFor: {
                "@type": "Organization",
                "@id": "https://makerlyai.in/#organization",
                name: "Makerly AI",
                url: "https://makerlyai.in",
              },
              homeLocation: {
                "@type": "Place",
                name: "Jamshedpur, Jharkhand, India",
              },
              knowsAbout: [
                "Artificial Intelligence",
                "SaaS Engineering",
                "Full-Stack Web Development",
                "Next.js Architecture",
                "AI Agent Workflows",
                "Cloud Systems",
                "Startup Incubation",
              ],
              url: "https://makerlyai.in/founder/tousif-raza",
              image: "https://makerlyai.in/founder/tousif-main.jpeg",
              sameAs: [
                "https://linkedin.com/in/tousifraza",
                "https://x.com/thebokaroguy",
                "https://instagram.com/thebokaroguy",
                "https://github.com/makerlyai",
              ],
            }),
          }}
        />

        {/* Schema: LocalBusiness for Local 3-Pack and Map Relevance */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "@id": "https://makerlyai.in/#localbusiness",
              name: "Makerly AI - Software Development & AI Agency",
              image: "https://makerlyai.in/initialletterlogosquare.png",
              url: "https://makerlyai.in",
              telephone: "+91-9876543210",
              priceRange: "₹₹₹",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Kadma / Bistupur Commercial Area",
                addressLocality: "Jamshedpur",
                addressRegion: "Jharkhand",
                postalCode: "831005",
                addressCountry: "IN",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 22.8046,
                longitude: 86.2029,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                ],
                opens: "09:00",
                closes: "20:00",
              },
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Software & AI Development Solutions",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "SaaS MVP Development in 24 Hours",
                      url: "https://makerlyai.in/build-saas-india",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "AI Receptionists & Multilingual Voice Phone Agents",
                      url: "https://makerlyai.in/services/ai-receptionist-voice-agents",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Autonomous AI Agents & WhatsApp Bot Systems",
                      url: "https://makerlyai.in/services/ai-agents-automation",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Food Delivery & Restaurant App Development",
                      url: "https://makerlyai.in/services/food-delivery-restaurant-apps",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Travel Agency Mobile Apps & Tour Booking Software",
                      url: "https://makerlyai.in/services/travel-tourism-booking-apps",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Custom Web & Mobile Application Development (iOS & Android)",
                      url: "https://makerlyai.in/services/custom-web-and-mobile-apps",
                    },
                  },
                ],
              },
            }),
          }}
        />

        {/* Schema: WebSite */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Makerly AI",
              url: "https://makerlyai.in",
              potentialAction: {
                "@type": "SearchAction",
                target: "https://makerlyai.in/?q={search_term_string}",
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} ${lemonMilk.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
