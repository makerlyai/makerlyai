// ─────────────────────────────────────────────────────────────────
//  MakerlyAI Autonomous Sales Engine - 4-Touch Sequence Generator
//  Synthesizes zubair-trabzada/ai-sales-team-claude & BillionMail
// ─────────────────────────────────────────────────────────────────

import { SALES_ENGINE_CONFIG } from './config.mjs';

const PRIMARY_MODEL  = SALES_ENGINE_CONFIG.ai.primaryModel;
const FALLBACK_MODEL = SALES_ENGINE_CONFIG.ai.fallbackModel;
const GROQ_URL       = SALES_ENGINE_CONFIG.ai.groqUrl;
const GROQ_API_KEY   = SALES_ENGINE_CONFIG.ai.apiKey;

/**
 * Generates an automated 4-touch outreach sequence tailored to the lead
 */
export async function generateSequence(qualifiedLead) {
  const {
    businessName,
    clientName = 'there',
    websiteUrl,
    niche = 'd2c',
    personalizedHook = '',
    recommendedOffer = '',
    bant,
    meddic,
  } = qualifiedLead;

  const nicheConfig = SALES_ENGINE_CONFIG.niches[niche] || SALES_ENGINE_CONFIG.niches.d2c;

  const systemPrompt = `You are the Lead Sales Copywriter & Conversion Strategist for MakerlyAI (makerlyai.in), writing direct B2B outreach on behalf of Founder Tousif Raza.

Your writing style:
- Concise, high-status, peer-to-peer (founder to founder)
- Zero generic buzzwords, fake compliments, or aggressive pitches
- Respectful of their time (under 120 words per email)
- Focuses on concrete ROI: faster development velocity, conversion rate lift, or custom AI agent automation

Generate a 4-touch cold outreach sequence for this qualified prospect.
Return ONLY valid JSON matching this schema:
{
  "touch1": {
    "dayOffset": 0,
    "subject": "<Compelling, lowercase or natural subject line under 6 words>",
    "hook": "<Tailored observation about their business>",
    "bodyPlain": "<2 short paragraphs>",
    "bodyHtml": "<HTML formatted paragraphs with <p> tags and clean styling>",
    "ctaText": "Book a 15-Min Strategy Call"
  },
  "touch2": {
    "dayOffset": 3,
    "subject": "Re: <repeat touch1 subject>",
    "hook": "<Follow-up context>",
    "bodyPlain": "<Case study / concrete ROI proof>",
    "bodyHtml": "<HTML formatted paragraphs with case study bullet points>",
    "ctaText": "See How We Do This"
  },
  "touch3": {
    "dayOffset": 7,
    "subject": "quick teardown for <businessName>",
    "hook": "<Audit offer>",
    "bodyPlain": "<Offer to send a 2-minute video breakdown or audit>",
    "bodyHtml": "<HTML formatted offer for custom audit>",
    "ctaText": "Send Me The Teardown"
  },
  "touch4": {
    "dayOffset": 12,
    "subject": "permission to close your file?",
    "hook": "<Graceful breakup>",
    "bodyPlain": "<Low-pressure respectful sign-off>",
    "bodyHtml": "<HTML formatted breakup email>",
    "ctaText": "Let's Revisit Later"
  }
}`;

  const userPrompt = `Prospect Information:
- Company: ${businessName}
- Decision Maker: ${clientName}
- Website: ${websiteUrl}
- Niche: ${nicheConfig.name}
- Specific Observation: ${personalizedHook}
- Core Pain: ${meddic?.identifiedPain || 'Conversion bottlenecks or slow development velocity'}
- Proposed Solution: ${recommendedOffer}`;

  try {
    let model = PRIMARY_MODEL;
    let res = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        temperature: 0.6,
        max_tokens: 1800,
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
      res = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model,
          temperature: 0.6,
          max_tokens: 1800,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt },
          ],
          response_format: { type: 'json_object' }
        }),
      });
    }

    if (res.ok) {
      const data = await res.json();
      const content = JSON.parse(data.choices?.[0]?.message?.content || '{}');
      if (content.touch1 && content.touch2 && content.touch3 && content.touch4) {
        return content;
      }
    }
  } catch (err) {
    console.warn(`[Sequence Generator] Groq notice for ${businessName}: ${err.message}. Using standard proven template sequence.`);
  }

  // Fallback high-performing battle-tested template sequence
  return getFallbackSequence(businessName, clientName, personalizedHook, niche);
}

/**
 * Battle-tested fallback 4-touch template
 */
function getFallbackSequence(businessName, clientName, hook, niche) {
  const firstName = clientName && clientName !== 'Decision Maker' ? clientName.split(' ')[0] : 'there';
  const customHook = hook || `I was reviewing ${businessName}'s digital experience and noticed substantial room to boost conversion and automate inbound lead workflows.`;

  return {
    touch1: {
      dayOffset: 0,
      subject: `quick idea for ${businessName}`,
      hook: customHook,
      bodyPlain: `At MakerlyAI, we build custom high-converting web apps, AI shopping assistants, and autonomous workflow engines for scaling brands.\n\nMost teams we work with are able to cut development delivery times in half while increasing store or inquiry conversions by 25-40%.\n\nWould you be open to a quick 10-minute chat this week to share a couple of specific ideas we had for ${businessName}?`,
      bodyHtml: `<p>At MakerlyAI, we build custom high-converting web architecture, intelligent AI assistants, and autonomous workflow engines for ambitious brands.</p>
<p>Most teams we partner with cut engineering turnaround time by 60% while increasing checkout or inquiry conversions by <strong>25% to 40%</strong>.</p>
<p>Would you be open to a brief 10-minute chat this week to run through 2 specific ideas we mapped out for <strong>${businessName}</strong>?</p>`,
      ctaText: 'Book a 10-Min Chat'
    },
    touch2: {
      dayOffset: 3,
      subject: `Re: quick idea for ${businessName}`,
      hook: `Following up on our digital audit for ${businessName}`,
      bodyPlain: `Wanted to quickly share how we approached a similar challenge for another brand in your space.\n\nBy replacing sluggish legacy templates with a sub-second modern web app and integrating real-time AI lead qualification, they saw an immediate 34% lift in qualified inquiries within 3 weeks of launch.\n\nI'd love to share the exact teardown and blueprint if you have 10 minutes.`,
      bodyHtml: `<p>Following up on my previous note — wanted to share how we solved this for a brand facing a similar bottleneck.</p>
<p>By upgrading their digital architecture to a sub-second modern stack and embedding an autonomous AI qualification workflow, they unlocked:</p>
<ul style="padding-left: 20px; color: #38bdf8; margin: 12px 0;">
  <li><strong style="color: #f8fafc;">+34% lift</strong> in completed transactions / qualified inquiries</li>
  <li><strong style="color: #f8fafc;">2-week sprint</strong> delivery with zero disruption to daily sales</li>
  <li>Instant 24/7 client response without adding headcount</li>
</ul>
<p>Happy to share the exact blueprint if this aligns with your priorities right now.</p>`,
      ctaText: 'See The Blueprint'
    },
    touch3: {
      dayOffset: 7,
      subject: `2-min teardown video for ${businessName}?`,
      hook: `Custom video assessment prepared for ${businessName}`,
      bodyPlain: `I recorded a 2-minute video breakdown of ${businessName}'s current website experience, showing 3 specific micro-friction points where potential customers are dropping off.\n\nNo pitch or obligation — would you mind if I send the link over?`,
      bodyHtml: `<p>I put together a quick 2-minute video breakdown highlighting 3 specific friction points on <strong>${businessName}</strong> where potential high-ticket clients or shoppers are currently dropping off.</p>
<p>No pitch, no strings attached — would you mind if I send the link over to you?</p>`,
      ctaText: 'Send Over The Teardown'
    },
    touch4: {
      dayOffset: 12,
      subject: `permission to close your file?`,
      hook: `Final check-in for ${businessName}`,
      bodyPlain: `I haven't heard back, so I assume scaling ${businessName}'s web conversions and AI automation isn't a priority right now.\n\nTotally understand. I'll close out your file so I don't clutter your inbox.\n\nIf you ever want to build or revamp your digital platform down the road, you can always reach me directly at tousif@makerlyai.in.`,
      bodyHtml: `<p>I haven't heard back, so I assume optimizing <strong>${businessName}</strong>'s digital architecture or AI automation isn't on your radar right now.</p>
<p>Totally understand — I'll close out your file so I don't clutter your inbox.</p>
<p>If you ever decide to rebuild or supercharge your digital platform in the future, feel free to reach out anytime.</p>`,
      ctaText: 'Keep in Touch'
    }
  };
}
