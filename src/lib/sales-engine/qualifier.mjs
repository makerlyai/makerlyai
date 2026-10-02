// ─────────────────────────────────────────────────────────────────
//  MakerlyAI Autonomous Sales Engine - Lead Qualifier (BANT + MEDDIC)
//  Synthesizes xeneta/LeadQualifier & zubair-trabzada/ai-sales-team-claude
// ─────────────────────────────────────────────────────────────────

import { SALES_ENGINE_CONFIG } from './config.mjs';

const PRIMARY_MODEL  = SALES_ENGINE_CONFIG.ai.primaryModel;
const FALLBACK_MODEL = SALES_ENGINE_CONFIG.ai.fallbackModel;
const GROQ_URL       = SALES_ENGINE_CONFIG.ai.groqUrl;
const GROQ_API_KEY   = SALES_ENGINE_CONFIG.ai.apiKey;

/**
 * Robust Groq LLM caller with exponential backoff on 429 and fallback model
 */
async function callGroq(systemPrompt, userPrompt, retries = 3) {
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
          temperature: 0.3, // Lower temperature for consistent qualification scoring
          max_tokens: 1500,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' }
        }),
      });

      if (res.status === 429) {
        console.log(`   ⏳ Groq 429 rate limit on ${model}. Pausing 4s before retry (${attempt}/${retries})...`);
        await new Promise(r => setTimeout(r, 4000));
        model = FALLBACK_MODEL;
        continue;
      }

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Groq HTTP ${res.status}: ${errText.slice(0, 150)}`);
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
 * Qualifies a lead using BANT + MEDDIC and assigns an overall score (0-100)
 */
export async function qualifyLead(leadData) {
  const {
    businessName,
    clientName = 'Decision Maker',
    title = 'Founder / Executive',
    websiteUrl = '',
    niche = 'd2c',
    techStack = [],
    emails = [],
    phones = [],
    painPointsIdentified = [],
    metaDescription = '',
    h1s = [],
  } = leadData;

  const nicheConfig = SALES_ENGINE_CONFIG.niches[niche] || SALES_ENGINE_CONFIG.niches.d2c;

  const systemPrompt = `You are the Chief Commercial Officer & Lead Qualification Engine for MakerlyAI (makerlyai.in), an elite product development & AI automation studio founded by Tousif Raza.

MakerlyAI delivers:
1. High-converting custom web apps & D2C store architecture (Next.js, modern headless, sub-second load times)
2. Autonomous AI agents, customer support bots, and internal workflow automation
3. Fixed-price, lightning-speed 2-4 week sprint delivery (Pricing: ₹99,000 for MVPs to ₹3,50,000 for full custom suites)

You must rigorously evaluate prospective leads using two rigorous enterprise frameworks:
1. BANT (Budget, Authority, Need, Timeline)
2. MEDDIC (Metrics, Economic Buyer, Decision Criteria, Decision Process, Identify Pain, Champion)

Return ONLY valid JSON matching this schema:
{
  "qualificationScore": <number 0-100>,
  "tier": <"Tier 1 (High Ticket)" | "Tier 2 (Mid Market)" | "Tier 3 (Unqualified)">,
  "isHighTicket": <boolean>,
  "estimatedDealValue": <number in INR, between 99000 and 350000>,
  "bant": {
    "budget": { "score": <0-25>, "reasoning": "<string>" },
    "authority": { "score": <0-25>, "reasoning": "<string>" },
    "need": { "score": <0-25>, "reasoning": "<string>" },
    "timeline": { "score": <0-25>, "reasoning": "<string>" }
  },
  "meddic": {
    "metrics": "<ROI metric, e.g. estimated +35% conversion lift or 20 hours saved weekly>",
    "economicBuyer": "<Role/Title of buyer>",
    "decisionCriteria": "<Key technical or business criteria>",
    "decisionProcess": "<Fast founder approval vs committee>",
    "identifiedPain": "<Core pain point affecting their business growth>",
    "champion": "<Likely internal sponsor>"
  },
  "personalizedHook": "<2-sentence hyper-specific observation about their website/brand that proves Tousif Raza personally analyzed their business, avoiding generic cold sales fluff>",
  "recommendedOffer": "<Specific MakerlyAI solution tailored for them>",
  "outreachRecommended": <boolean>
}`;

  const userPrompt = `Evaluate this prospect for MakerlyAI:
- Business Name: ${businessName}
- Contact Person: ${clientName} (${title})
- Website: ${websiteUrl}
- Target Niche: ${nicheConfig.name}
- Tech Stack Detected: ${techStack.join(', ') || 'Standard Web'}
- Public Emails: ${emails.join(', ') || 'None found'}
- Phone / Contact: ${phones.join(', ') || 'None found'}
- Website Meta / Scope: ${metaDescription || 'N/A'}
- Primary Headings: ${h1s.join(' | ') || 'N/A'}
- Potential Gaps Spotted: ${painPointsIdentified.join('; ') || 'General market need'}`;

  try {
    const analysis = await callGroq(systemPrompt, userPrompt);

    // Ensure safe defaults
    const score = Number(analysis.qualificationScore) || 50;
    const isHighTicket = score >= 75 || analysis.estimatedDealValue >= 100000;

    return {
      success: true,
      leadId: leadData.id || `lead-${Date.now().toString(36)}`,
      businessName,
      clientName,
      email: emails[0] || leadData.email || '',
      phone: phones[0] || leadData.phone || '',
      websiteUrl,
      niche,
      qualificationScore: score,
      tier: analysis.tier || (score >= 80 ? 'Tier 1 (High Ticket)' : score >= 60 ? 'Tier 2 (Mid Market)' : 'Tier 3 (Unqualified)'),
      isHighTicket,
      dealValue: Number(analysis.estimatedDealValue) || (isHighTicket ? 150000 : 99000),
      bant: analysis.bant,
      meddic: analysis.meddic,
      personalizedHook: analysis.personalizedHook || `Noticed ${businessName}'s current digital setup and identified key areas where conversion and automated workflows can be significantly elevated.`,
      recommendedOffer: analysis.recommendedOffer || nicheConfig.makerlyValueProp,
      outreachRecommended: analysis.outreachRecommended !== false && score >= 55,
      evaluatedAt: new Date().toISOString(),
    };
  } catch (err) {
    console.error(`[Qualifier Error] Failed for ${businessName}:`, err.message);
    // Fallback heuristic scoring
    const fallbackScore = emails.length > 0 ? 65 : 45;
    return {
      success: false,
      error: err.message,
      businessName,
      clientName,
      email: emails[0] || '',
      websiteUrl,
      niche,
      qualificationScore: fallbackScore,
      tier: fallbackScore >= 60 ? 'Tier 2 (Mid Market)' : 'Tier 3 (Unqualified)',
      isHighTicket: false,
      dealValue: 99000,
      personalizedHook: `Noticed ${businessName}'s digital presence and identified opportunities to accelerate conversion and automated customer workflows.`,
      recommendedOffer: nicheConfig.makerlyValueProp,
      outreachRecommended: fallbackScore >= 55,
      evaluatedAt: new Date().toISOString(),
    };
  }
}
