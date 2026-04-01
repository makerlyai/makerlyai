import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Build SaaS in India | MakerlyAI — AI-Powered Software Development",
  description:
    "Build your SaaS platform in India with MakerlyAI. Working preview in 24 hours. Custom software, AI agents, web & mobile apps for Indian startups, founders, and enterprises.",
  alternates: { canonical: "/build-saas-india" },
  openGraph: {
    title: "Build SaaS in India | MakerlyAI",
    description:
      "Working preview in 24 hours. Pay ₹0 if not satisfied. Premium SaaS development for Indian businesses.",
    url: "https://makerlyai.in/build-saas-india",
  },
};

export default function BuildSaaSIndia() {
  return (
    <main className="relative min-h-screen bg-background text-foreground pt-32 pb-24 px-4 md:px-12">
      <div className="max-w-4xl mx-auto">
        <p className="inline-block px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-semibold tracking-widest text-brand-blue mb-6 uppercase">
          India
        </p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-8">
          Build Your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-cyan-300">
            SaaS Platform
          </span>{" "}
          in India
        </h1>
        <p className="text-lg md:text-xl text-foreground/70 leading-relaxed mb-12 max-w-3xl">
          MakerlyAI empowers Indian startups, founders, and enterprises to launch world-class SaaS products
          with blazing speed. Get a real working preview within 24 hours — pay ₹0 if it doesn&apos;t meet your vision.
        </p>

        <section className="space-y-10 mb-16">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Why Indian Founders Choose MakerlyAI</h2>
            <ul className="space-y-3 text-foreground/70 list-disc list-inside text-base md:text-lg">
              <li>24-hour preview delivery — no Indian agency matches this speed</li>
              <li>Zero-risk: pay only when satisfied with the result</li>
              <li>IST-aligned working hours and instant communication</li>
              <li>Full-stack: Next.js, React, Node.js, Python, AI/ML, UPI payment integrations</li>
              <li>Optimized for Indian infrastructure (low-bandwidth, mobile-first)</li>
              <li>Competitive pricing in INR with no hidden costs</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">What We Build for Indian Businesses</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["B2B/B2C SaaS Platforms","AI Agents & Chatbots","EdTech & LMS Platforms","FinTech & UPI-Integrated Apps","D2C E-Commerce Solutions","Healthcare & Telemedicine","Logistics & Delivery Apps","Government & Enterprise Tools"].map((item) => (
                <div key={item} className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-sm md:text-base font-medium">{item}</div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: "Can you integrate UPI and Indian payment gateways?", a: "Yes. We integrate Razorpay, Paytm, PhonePe, and all major UPI gateways seamlessly." },
                { q: "Do you build mobile-first for Indian users?", a: "Absolutely. Every product we build is optimized for mobile-first usage, low-bandwidth networks, and works flawlessly on budget Android devices." },
                { q: "What's the pricing like?", a: "We provide transparent INR pricing after your 24-hour preview. Our rates are highly competitive for the quality delivered." },
                { q: "Can you build for Aadhaar/DigiLocker integration?", a: "Yes. We have experience integrating government APIs including Aadhaar verification, DigiLocker, and GSTIN validation." },
              ].map((faq) => (
                <div key={faq.q}>
                  <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                  <p className="text-foreground/70 text-base">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/#contact" className="inline-flex items-center justify-center px-8 py-4 rounded-xl bg-brand-blue text-white font-bold text-base hover:bg-brand-blue/90 transition-colors">Start Your Project</Link>
          <Link href="/" className="inline-flex items-center justify-center px-8 py-4 rounded-xl border border-white/20 bg-white/5 font-bold text-base hover:bg-white/10 transition-colors">Back to Home</Link>
        </div>
      </div>
    </main>
  );
}
