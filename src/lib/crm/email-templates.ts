import { EmailTemplate, Lead } from "./types";

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "intro",
    name: "Intro & Discovery Call",
    description: "First touchpoint introducing MakerlyAI's capabilities for their specific requirement.",
    subject: "Accelerating {{business_name}}'s {{requirement}} with MakerlyAI",
    body: `Hi {{client_name}},

I'm reaching out from MakerlyAI. Our partner mentioned that {{business_name}} is currently looking to build or optimize your {{requirement}}.

At MakerlyAI, we specialize in shipping high-velocity, revenue-generating digital products &mdash; from AI agents to full-stack platforms &mdash; typically moving from architecture to live production in under 4 weeks.

We recently reviewed your space and put together a few initial architectural concepts that could immediately unlock efficiency and conversion for {{business_name}}.

Are you open to a brief 15-minute discovery call this Thursday or Friday to walk through the blueprint?

Best regards,
MakerlyAI Growth & Engineering Team
makerlyai.in | getmakerlyai@gmail.com`,
  },
  {
    id: "followup",
    name: "Strategic Follow-Up",
    description: "Polite, high-value reminder highlighting ROI and timeline availability.",
    subject: "Quick follow-up regarding {{requirement}} for {{business_name}}",
    body: `Hi {{client_name}},

Following up on my previous note regarding {{business_name}}'s roadmap for {{requirement}}.

Our engineering pod currently has an opening in next month's sprint cycle. We'd love to dedicate this sprint to engineering your platform with enterprise-grade uptime and automated workflows.

If you'd like, I can share a quick 2-page architectural teardown showing how similar startups scaled their {{requirement}} with us.

Would you be available for a quick sync later this week?

Best regards,
MakerlyAI Partnerships
makerlyai.in | getmakerlyai@gmail.com`,
  },
  {
    id: "proposal",
    name: "Proposal & Scope Presentation",
    description: "Formal handover of commercial proposal, sprint milestones, and SLA.",
    subject: "MakerlyAI Scope & Implementation Roadmap &mdash; {{business_name}}",
    body: `Hi {{client_name}},

Following our strategic alignment, we've finalized the implementation roadmap and scope of work for {{business_name}}'s {{requirement}}.

Key Milestones Included:
1. Architecture & Interactive Prototypes (Week 1)
2. Core Engine & API Integration (Weeks 2-3)
3. Automated Testing, QA & Staging Deployment (Week 4)
4. Go-Live, Analytics Instrumentation & 30-Day Hypercare

You can review the full milestone timeline and commercial schedule here. Let's schedule a call to finalize kickoff dates and assign your engineering lead.

Best regards,
MakerlyAI Executive Team
makerlyai.in | getmakerlyai@gmail.com`,
  },
];

/**
 * Interpolates variables in template subject and body
 */
export function renderEmailTemplate(
  template: EmailTemplate,
  lead: Lead
): { subject: string; body: string } {
  const replaceVars = (text: string) => {
    return text
      .replace(/{{client_name}}/g, lead.clientName || "there")
      .replace(/{{business_name}}/g, lead.businessName || "your business")
      .replace(/{{requirement}}/g, lead.requirement || "digital product")
      .replace(/{{phone}}/g, lead.phone || "")
      .replace(/{{deal_value}}/g, lead.dealValue ? `₹${lead.dealValue.toLocaleString("en-IN")}` : "TBD");
  };

  return {
    subject: replaceVars(template.subject),
    body: replaceVars(template.body),
  };
}

/**
 * AI Message Synthesizer: Generates a tailored, punchy WhatsApp or Email pitch
 */
export function generateAIMessage(lead: Lead, tone: "concise" | "persuasive" | "technical" = "persuasive"): string {
  if (tone === "concise") {
    return `Hi ${lead.clientName}! Reaching out from MakerlyAI regarding your ${lead.requirement} for ${lead.businessName}. We engineer custom AI & web systems that compound revenue in under 4 weeks. Let's do a 10-min intro call this week?`;
  }

  if (tone === "technical") {
    return `Hello ${lead.clientName}, MakerlyAI here. We specialize in robust, event-driven architectures for ${lead.requirement}. For ${lead.businessName}, we can implement full-stack APIs, 99.9% uptime infra, and CI/CD pipelines. Let's schedule an architecture review session.`;
  }

  return `Hey ${lead.clientName}, saw that ${lead.businessName} is gearing up for ${lead.requirement}! At MakerlyAI, we build digital products engineered specifically to drive conversion and automate ops. We'd love to share an initial prototype blueprint tailored to your stack. Are you free for a quick chat?`;
}

