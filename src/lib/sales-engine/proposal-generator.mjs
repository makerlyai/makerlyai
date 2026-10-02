// ─────────────────────────────────────────────────────────────────
//  MakerlyAI Sales Engine - AI Proposal & Meeting Brief Generator
//  Synthesizes zubair-trabzada/ai-sales-team-claude
// ─────────────────────────────────────────────────────────────────

import { SALES_ENGINE_CONFIG } from './config.mjs';

const PRIMARY_MODEL  = SALES_ENGINE_CONFIG.ai.primaryModel;
const FALLBACK_MODEL = SALES_ENGINE_CONFIG.ai.fallbackModel;
const GROQ_URL       = SALES_ENGINE_CONFIG.ai.groqUrl;
const GROQ_API_KEY   = SALES_ENGINE_CONFIG.ai.apiKey;

async function callGroq(systemPrompt, userPrompt, retries = 2) {
  let model = PRIMARY_MODEL;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.4,
          max_tokens: 2200,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' }
        }),
      });

      if (res.status === 429) {
        await new Promise(r => setTimeout(r, 3000));
        model = FALLBACK_MODEL;
        continue;
      }

      if (!res.ok) {
        throw new Error(`Groq HTTP ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || '{}';
      return JSON.parse(content);
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

/**
 * Generates an executive proposal and meeting briefing sheet for a qualified prospect
 */
export async function generateProposalAndBrief(lead) {
  const {
    businessName,
    clientName = 'Decision Maker',
    websiteUrl = '',
    niche = 'b2b',
    qualificationScore = 75,
    dealValue = 149000,
    techStack = [],
    painPointsIdentified = [],
    personalizedHook = '',
    bant = {},
    meddic = {},
  } = lead;

  const systemPrompt = `You are the Principal Sales Architect & Chief Solutions Consultant at MakerlyAI (makerlyai.in), founded by Tousif Raza.
MakerlyAI delivers world-class custom web applications, AI automation agents, and high-converting modern digital infrastructure in guaranteed 2-4 week sprints.

Generate a comprehensive, executive-ready Proposal and Founder Meeting Brief for the following prospect.
Return ONLY valid JSON matching this schema:
{
  "executiveSummary": "<2-3 sentence high-level value proposition customized for this business>",
  "clientContext": {
    "currentSituation": "<Assessment of their current online presence, tech stack, and visible gaps>",
    "criticalBottlenecks": ["<Bottleneck 1>", "<Bottleneck 2>", "<Bottleneck 3>"],
    "growthOpportunities": ["<Opportunity 1>", "<Opportunity 2>"]
  },
  "recommendedSolution": {
    "architectureTitle": "<e.g. Autonomous AI Workflow & Headless Next.js Experience>",
    "deliverables": [
      { "title": "<Deliverable Name>", "description": "<What we build and why>" },
      { "title": "<Deliverable Name>", "description": "<What we build and why>" },
      { "title": "<Deliverable Name>", "description": "<What we build and why>" }
    ],
    "timelineWeeks": <2, 3, or 4>,
    "proposedInvestmentInr": <number matching or near lead dealValue>,
    "expectedRoiMetric": "<e.g. Estimated 3.2x lead capture efficiency or 25+ hours of manual ops saved weekly>"
  },
  "meetingBrief": {
    "talkingPoints": [
      "<Point 1 for Tousif Raza to emphasize on the call>",
      "<Point 2 for Tousif Raza to emphasize on the call>",
      "<Point 3 for Tousif Raza to emphasize on the call>"
    ],
    "discoveryQuestions": [
      "<Question 1 to ask their decision maker>",
      "<Question 2 to ask their decision maker>",
      "<Question 3 to ask their decision maker>"
    ],
    "objectionHandling": [
      { "objection": "<Possible client objection>", "rebuttal": "<Tousif's crisp response positioning MakerlyAI's speed & quality>" }
    ]
  }
}`;

  const userPrompt = `Prospect Information:
Business Name: ${businessName}
Contact Name: ${clientName}
Website: ${websiteUrl}
Niche: ${niche}
Qualification Score: ${qualificationScore}/100
Deal Valuation: ₹${dealValue.toLocaleString('en-IN')}
Tech Stack Detected: ${techStack.join(', ') || 'Standard web stack'}
Identified Pain Points: ${painPointsIdentified.join('; ') || 'Generic web conversion and manual operational overhead'}
Personalized Hook: ${personalizedHook || 'N/A'}
BANT Data: ${JSON.stringify(bant)}
MEDDIC Data: ${JSON.stringify(meddic)}

Craft an elite, ultra-professional proposal & meeting brief that positions Tousif Raza and MakerlyAI as the undisputed best technical partner to build and deploy their solution.`;

  try {
    const proposal = await callGroq(systemPrompt, userPrompt);
    proposal.generatedAt = new Date().toISOString();
    return proposal;
  } catch (err) {
    console.error('[Proposal Gen] Error generating proposal:', err.message);
    // Graceful fallback proposal if Groq is busy
    return {
      executiveSummary: `Custom engineering and AI automation sprint for ${businessName} to unlock rapid digital scale and automated workflows.`,
      clientContext: {
        currentSituation: `${businessName} operates at ${websiteUrl || 'their digital domain'} with modern commercial potential.`,
        criticalBottlenecks: [
          'Manual customer capture and qualification workflow overhead',
          'Standard conversion funnel lacking real-time interactive AI assistance',
          'Scalability constraints across current web architecture'
        ],
        growthOpportunities: [
          'Deploy bespoke 24/7 AI lead conversion & appointment booking agent',
          'Upgrade to lightning-fast Next.js architecture with instant load times'
        ]
      },
      recommendedSolution: {
        architectureTitle: `MakerlyAI High-Performance Architecture for ${businessName}`,
        deliverables: [
          { title: 'Full Web Application Overhaul', description: 'Next.js 15, sub-second TTFB, mobile-first luxury aesthetics.' },
          { title: 'Autonomous AI Sales & Qualification Agent', description: 'Interactive AI concierge handling customer inquiries and bookings.' },
          { title: 'Automated CRM & Payment Workflows', description: 'Real-time synchronization with payment gateway and lead tracker.' }
        ],
        timelineWeeks: 3,
        proposedInvestmentInr: dealValue || 149000,
        expectedRoiMetric: 'Estimated 2.8x conversion improvement & automated customer triage'
      },
      meetingBrief: {
        talkingPoints: [
          `Highlight MakerlyAI's fixed 2-4 week sprint delivery vs months of traditional agency delays.`,
          `Walk through how custom AI agents reduce operational friction for ${businessName}.`,
          `Present transparent, milestone-based pricing with no hidden maintenance fees.`
        ],
        discoveryQuestions: [
          `What is the #1 operational bottleneck preventing ${businessName} from doubling customer throughput?`,
          `How quickly are customer inquiries currently responded to on your website?`,
          `What does your ideal timeline look like for rolling out this upgrade?`
        ],
        objectionHandling: [
          {
            objection: 'We already have developers or an agency.',
            rebuttal: 'MakerlyAI specializes in rapid AI augmentation sprints. We do not replace your team; we deploy dedicated AI features and high-converting interfaces in 14 days that your current pipeline cannot prioritize.'
          }
        ]
      },
      generatedAt: new Date().toISOString(),
      fallbackUsed: true
    };
  }
}
