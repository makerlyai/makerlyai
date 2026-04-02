import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Makerly AI | AI App, SaaS, and Automation Development Agency",
  description:
    "Makerly AI is a software development agency that builds SaaS platforms, AI agents, web apps, and mobile apps for founders and businesses worldwide.",
  keywords: [
    "Makerly AI",
    "Makerly AI agency",
    "Makerly AI software development",
    "build SaaS for me",
    "AI app development service",
    "custom software development agency",
    "build MVP in 24 hours",
    "no cost prototype development",
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
      "Makerly AI builds SaaS platforms, AI agents, web apps, and mobile apps for fast-moving founders and businesses.",
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
    creator: "@MakerlyAI",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Makerly AI",
              url: "https://makerlyai.in",
              logo: "https://makerlyai.in/initialletterlogosquare.png",
              description:
                "Makerly AI is a software development agency focused on SaaS platforms, AI agents, web apps, mobile apps, and automation systems.",
              contactPoint: {
                "@type": "ContactPoint",
                email: "getmakerlyai@gmail.com",
                contactType: "sales",
              },
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Service",
              serviceType: "Software Development",
              provider: {
                "@type": "Organization",
                name: "Makerly AI",
              },
              areaServed: "Worldwide",
              hasOfferCatalog: {
                "@type": "OfferCatalog",
                name: "Development Services",
                itemListElement: [
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "SaaS Platform Development",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "AI Agent Development",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Web Application Development",
                    },
                  },
                  {
                    "@type": "Offer",
                    itemOffered: {
                      "@type": "Service",
                      name: "Mobile Application Development",
                    },
                  },
                ],
              },
            }),
          }}
        />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
