// ─────────────────────────────────────────────────────────────────
//  MakerlyAI Autonomous Sales & Growth Engine - Configuration
// ─────────────────────────────────────────────────────────────────

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

export const SALES_ENGINE_CONFIG = {
  // Sending Mailboxes & Rotation
  mailboxes: [
    {
      id: 'founder',
      email: process.env.GMAIL_USER?.trim() || 'tousif@makerlyai.in',
      name: 'Tousif Raza',
      title: 'Founder & Tech Lead, MakerlyAI',
      password: process.env.GMAIL_APP_PASSWORD?.trim() || '',
      dailyLimit: 20, // Strict cap: 20 emails / day to maintain 100% deliverability
    },
    {
      id: 'growth',
      email: process.env.HELLO_MAIL_USER?.trim() || 'hello@makerlyai.in',
      name: 'MakerlyAI Team',
      title: 'Growth & Client Partnerships, MakerlyAI',
      password: process.env.HELLO_APP_PASSWORD?.trim() || process.env.GMAIL_APP_PASSWORD?.trim() || '',
      dailyLimit: 20, // Strict cap: 20 emails / day
    }
  ],

  // Deliverability and Safety Guardrails
  deliverability: {
    minDelayMs: 45000,   // 45 seconds minimum pause between emails
    maxDelayMs: 180000,  // 180 seconds maximum pause (human randomized distribution)
    maxEmailsPerDayPerAccount: 20,
    checkMxRecords: true,
    respectUnsubscribe: true,
  },

  // Groq LLM Intelligence Engine
  ai: {
    primaryModel: 'openai/gpt-oss-120b',
    fallbackModel: 'openai/gpt-oss-20b',
    groqUrl: 'https://api.groq.com/openai/v1/chat/completions',
    apiKey: process.env.GROQ_API_KEY?.trim() || '',
  },

  // Supabase CRM Integration
  crm: {
    supabaseUrl: process.env.SUPABASE_URL || '',
    supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '',
    leadsTable: 'crm_leads',
    activitiesTable: 'crm_activities',
    localCacheFile: '.sales-engine-leads.json',
    dailyTrackerFile: '.sales-engine-daily-tracker.json',
    experimentsFile: '.sales-engine-experiments.json',
    unsubscribesFile: '.sales-engine-unsubscribes.json',
  },

  // Niche Presets with Target Pain Points & Value Offers
  niches: {
    d2c: {
      name: 'D2C & E-Commerce Brands',
      tag: 'd2c',
      targetRoles: ['Founder', 'Co-Founder', 'CEO', 'Head of E-Commerce', 'Marketing Director'],
      searchKeywords: [
        'D2C brand founder Bangalore OR Mumbai OR Delhi',
        'Shopify store founder India clothing OR apparel OR skincare OR wellness',
        'Direct to consumer founder LinkedIn',
        'Indian D2C beauty skincare brand website',
        'sustainable fashion brand India online store'
      ],
      corePainPoints: [
        'High customer acquisition costs (CAC) with low mobile store conversion rates',
        'Cart abandonment on checkout and lack of instant automated WhatsApp/web AI assistance',
        'Slow mobile page loading speeds hurting Google Ads & Meta Ads ROAS'
      ],
      makerlyValueProp: 'High-converting custom store architecture & AI sales assistants that boost checkout conversion by 25-40% without hiring extra staff.',
      dealValueRange: { min: 99000, max: 250000, default: 150000 }
    },

    saas: {
      name: 'B2B SaaS & Tech Startups',
      tag: 'saas',
      targetRoles: ['Founder', 'Co-Founder', 'CEO', 'CTO', 'VP Engineering', 'Head of Product'],
      searchKeywords: [
        'SaaS startup founder India OR Singapore OR Remote',
        'B2B tech founder Bangalore startup',
        'Early stage SaaS CEO YC OR Antler OR bootstrapped',
        'AI agent startup founder'
      ],
      corePainPoints: [
        'Engineering backlog delaying core AI features or automated agent workflows',
        'High burn rate hiring full-time senior AI engineers when MVPs take 4-6 months',
        'Complex user onboarding resulting in free-to-paid churn'
      ],
      makerlyValueProp: 'Rapid production-ready AI agents, LLM integrations, and modern full-stack web MVPs shipped in 2 to 4 weeks at fixed transparent sprint cost.',
      dealValueRange: { min: 150000, max: 350000, default: 220000 }
    },

    'high-ticket': {
      name: 'High-Ticket Local & Regional B2B',
      tag: 'high-ticket',
      targetRoles: ['Managing Director', 'Owner', 'Founder', 'Director of Operations'],
      searchKeywords: [
        'uniform manufacturer Bangalore OR Tirupur OR Mumbai',
        'corporate gifting company owner India',
        'industrial equipment distributor Maharashtra OR Gujarat',
        'private clinic hospital director diagnostic Bangalore'
      ],
      corePainPoints: [
        'Relying on manual WhatsApp chats and Excel sheets losing track of high-value quotes',
        'Outdated static website that fails to position them as market leaders to enterprise buyers',
        'Zero automated client follow-up losing 30%+ of qualified inbound inquiries'
      ],
      makerlyValueProp: 'Custom client portal & automated B2B lead capture engine that turns enterprise inquiries into booked consultations and trackable pipeline.',
      dealValueRange: { min: 99000, max: 300000, default: 180000 }
    },

    b2b: {
      name: 'B2B Enterprise & Corporate Services',
      tag: 'b2b',
      targetRoles: ['Managing Director', 'CEO', 'Founder', 'VP Sales', 'Head of Business Development', 'Partner'],
      searchKeywords: [
        'B2B consulting firm Bangalore OR Mumbai corporate website contact',
        'logistics supply chain enterprise software solutions India contact',
        'commercial equipment distributor supplier India corporate office',
        'corporate B2B service provider India decision maker website',
        'B2B industrial procurement platform India contact'
      ],
      corePainPoints: [
        'Manual quotation and RFP response processes delaying deal velocity by 2-3 weeks',
        'Outdated static corporate website failing enterprise client procurement security & capability checks',
        'Lack of automated client onboarding portals and self-serve quote calculators losing high-ticket accounts'
      ],
      makerlyValueProp: 'Custom enterprise B2B portals, automated quotation engines, and autonomous AI workflow agents that shorten deal cycles from 30 days to 48 hours.',
      dealValueRange: { min: 150000, max: 350000, default: 220000 }
    }
  },

  // Company Brand Metadata
  branding: {
    companyName: 'MakerlyAI',
    domain: 'makerlyai.in',
    websiteUrl: 'https://makerlyai.in',
    logoUrl: 'https://makerlyai.in/fullnamelogo.jpeg',
    calendlyUrl: 'https://makerlyai.in#contact',
    founderWhatsApp: '+919955523171',
    address: 'Bengaluru, Karnataka, India'
  }
};
