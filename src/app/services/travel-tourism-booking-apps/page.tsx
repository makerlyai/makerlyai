import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Travel Agency App Maker & Booking Software Development | MakerlyAI",
  description:
    "MakerlyAI builds custom travel agency mobile apps, holiday package booking engines, hotel reservation portals, and tour operator CRMs. High-conversion travel software with 24h preview.",
  keywords: [
    "travel agency app maker",
    "travel app development company",
    "holiday package booking engine",
    "tour operator software development",
    "hotel reservation app builder",
    "custom travel CRM software",
    "itinerary builder app for travel agencies",
    "online travel portal development",
    "Tousif Raza travel app",
    "Makerly AI travel software",
  ],
  alternates: { canonical: "/services/travel-tourism-booking-apps" },
  openGraph: {
    title: "Travel Agency App Maker & Booking Software Development | MakerlyAI",
    description:
      "Modernize your travel business. Custom mobile apps, dynamic package booking engines, and tour management systems.",
    url: "https://makerlyai.in/services/travel-tourism-booking-apps",
  },
};

export default function TravelAppMakerPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12 selection:bg-brand-blue/30">
      <div className="max-w-5xl mx-auto">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-foreground/50 mb-6">
          <Link href="/" className="hover:text-brand-blue transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/services" className="hover:text-brand-blue transition-colors">
            Services
          </Link>
          <span>/</span>
          <span className="text-brand-blue font-semibold">Travel Agency App Maker</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          Turnkey Tour &amp; Travel Booking Engines • Custom Itinerary Builder
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Travel Agency App Maker &amp; <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-blue-500">
            Tour Booking Engine Development
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          Upgrade your travel agency with custom digital infrastructure. MakerlyAI develops branded mobile apps,
          automated itinerary builders, online payment gateways, and tour operator back-office systems that convert
          curious travelers into paid bookings.
        </p>

        {/* Feature Modules */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "Dynamic Tour Itinerary Builder",
              desc: "Allow customers to customize day-by-day plans, choose hotel tiers, add activities, and calculate real-time pricing.",
            },
            {
              title: "Flight & Hotel API Integrations",
              desc: "Direct integration with global distribution systems (Amadeus, Sabre) or local travel consolidators via REST APIs.",
            },
            {
              title: "Travel Lead CRM & Invoicing",
              desc: "Capture inquiry forms from Instagram, WhatsApp, and Google Ads into an automated pipeline with PDF quotation generation.",
            },
            {
              title: "Multi-Currency Payments",
              desc: "Accept payments seamlessly in INR, USD, EUR, AED with partial advance deposits and balance payment scheduling.",
            },
            {
              title: "Automated WhatsApp Travel Assistant",
              desc: "Send vouchers, boarding reminders, local weather updates, and emergency guides automatically via WhatsApp API.",
            },
            {
              title: "Custom Branded Customer Portal",
              desc: "Travelers access flight tickets, hotel vouchers, emergency contacts, and invoice histories in their pocket.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-blue/40 transition-all"
            >
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>

        {/* CTA */}
        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Launch Your Travel App in 24 Hours
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Review your working travel agency app prototype within 24 hours. Pay ₹0 / $0 if you are not satisfied.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-blue/90 transition-all"
            >
              Order Travel App Prototype &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
