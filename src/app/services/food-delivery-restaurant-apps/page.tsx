import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Food Delivery & Restaurant App Development Company | MakerlyAI",
  description:
    "Build custom food delivery apps, cloud kitchen systems, restaurant POS, and digital QR menu ordering platforms. Zero commissions, full source code ownership, delivered by MakerlyAI.",
  keywords: [
    "food app maker",
    "food delivery app development company",
    "custom restaurant app builder",
    "cloud kitchen software development",
    "restaurant ordering system no commission",
    "Zomato Swiggy alternative app",
    "QR code digital menu ordering system",
    "food startup app developers",
    "Tousif Raza food app",
    "Makerly AI food delivery",
  ],
  alternates: { canonical: "/services/food-delivery-restaurant-apps" },
  openGraph: {
    title: "Food Delivery & Restaurant App Development Company | MakerlyAI",
    description:
      "Stop paying 30% platform commissions. Own your brand, customer data, and direct ordering with a custom food delivery app.",
    url: "https://makerlyai.in/services/food-delivery-restaurant-apps",
  },
};

export default function FoodAppMakerPage() {
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
          <span className="text-brand-blue font-semibold">Food &amp; Restaurant App Maker</span>
        </nav>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/30 bg-brand-blue/10 text-sm font-semibold tracking-wide text-brand-blue mb-6">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-pulse" />
          Own Your Customer Data • 0% Commissions • 3-Sided Food Platform
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
          Custom Food Delivery &amp; <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue via-cyan-400 to-blue-500">
            Restaurant App Development
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-foreground/75 leading-relaxed mb-12 max-w-3xl font-light">
          Break free from 30% aggregator commissions. MakerlyAI architects full-scale, three-sided food ecosystems:
          customer mobile app, kitchen merchant manager, and live GPS rider tracking with instant UPI / Stripe payments.
        </p>

        {/* 3-Sided Ecosystem Breakdown */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {[
            {
              title: "1. Customer Ordering App",
              desc: "Available on iOS, Android, and Web. Visual menu catalog, dish customization, instant search, coupon codes, and live order tracking.",
              badge: "iOS & Android",
            },
            {
              title: "2. Restaurant Kitchen Tablet / POS",
              desc: "Incoming order alarms, prep time timers, menu item toggling (out-of-stock), thermal printer integration, and sales reports.",
              badge: "Merchant Portal",
            },
            {
              title: "3. Delivery Driver App",
              desc: "Turn-by-turn Google Maps navigation, order pickup verification, customer calling masking, and daily driver earnings ledger.",
              badge: "GPS Fleet Management",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 hover:border-brand-blue/40 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-bold text-brand-blue uppercase tracking-widest mb-2 block">
                  {item.badge}
                </span>
                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                <p className="text-foreground/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </section>

        {/* Essential Modules */}
        <section className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 md:p-12 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">Features Built for Maximum Retention</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm md:text-base">
            {[
              "Instant UPI, Credit Card, and Cash On Delivery (COD) processing",
              "Automated WhatsApp order status alerts & receipts",
              "Loyalty points, cashback wallet, and automated reorder push notifications",
              "QR Code contactless dine-in ordering for restaurant tables",
              "Multi-branch and cloud-kitchen franchise management dashboard",
              "100% intellectual property and database ownership — no monthly software lock-in",
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-3 text-foreground/80">
                <span className="text-brand-blue font-bold">✓</span>
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="text-center rounded-3xl border border-white/10 bg-white/[0.03] p-10 md:p-14 backdrop-blur-xl">
          <h2 className="text-3xl md:text-4xl font-black mb-4">
            Build Your Food Startup App in 24 Hours
          </h2>
          <p className="text-foreground/70 max-w-xl mx-auto mb-8 text-base md:text-lg">
            Review your working food app preview within 24 hours. Pay ₹0 / $0 if it doesn&apos;t meet your exact specifications.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/#contact"
              className="rounded-xl bg-brand-blue px-8 py-4 text-base font-bold text-white shadow-xl hover:bg-brand-blue/90 transition-all"
            >
              Order Food App Prototype &rarr;
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
