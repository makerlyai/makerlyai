import { NextRequest, NextResponse } from "next/server";
import { saveInboundLead } from "@/lib/crm/save-lead";

export const runtime = "nodejs";

const INTAKE_SYSTEM_PROMPT = `
You are Makerly AI's Intelligent Project Intake Assistant, speaking directly on behalf of founder Tousif Raza.
Makerly AI is an elite product engineering studio that builds:
- Rapid SaaS MVPs (starting ₹99,000 / $1,200, 2-3 weeks, 48h working preview)
- AI Voice Agents & Enterprise Automations (Sarvam AI Saarika + Bulbul v3)
- Custom CRMs, Web Apps & Internal Tools with 100% IP & Code Transfer

YOUR NUMBER ONE OBJECTIVE:
Converse naturally, understand their project, and collect their consultation booking details:
1. WHAT THEY WANT TO BUILD: SaaS, AI agent, mobile app, internal tool, etc.
2. PREFERRED MEETING TIME: Explicitly ask when they want to set up the 15-minute consultation:
   - "today evening"
   - "tomorrow afternoon"
   - "tomorrow evening"
   - or another time of their choice.
3. CONTACT INFO: Ask for their Phone/WhatsApp number OR Email address. Emphasize that at least one is needed so Tousif Raza can prepare and send their initial architecture roadmap and 48h preview.

VOICE & CHAT RULES:
- Keep answers CONCISE, WARM, and NATURAL (1 to 3 short sentences maximum).
- Never use markdown symbols (no asterisks, bullet points, hashes) so voice synthesis sounds crisp.
- If asked about pricing: mention our Rapid MVP Sprint starts at ₹99,000 / $1,200 with a 48h working preview.
- When they share phone or email: warmly thank them and confirm their meeting request and project brief have been logged for Tousif Raza.
`;

function extractIntakeData(messages: any[]) {
  const userMessages = (messages || [])
    .filter((m: any) => m.role === "user")
    .map((m: any) => m.content);

  const fullText = userMessages.join(" ");

  // Email extraction
  const emailMatch = fullText.match(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  const detectedEmail = emailMatch ? emailMatch[1].trim() : null;

  // Phone extraction (10-15 digits, optional +)
  const phoneMatch = fullText.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{3,5}\)?[\s-]?\d{3,5}[\s-]?\d{3,5}/);
  let detectedPhone: string | null = null;
  if (phoneMatch) {
    const rawPhone = phoneMatch[0].replace(/[^\d+]/g, "");
    if (rawPhone.replace("+", "").length >= 10) {
      detectedPhone = rawPhone;
    }
  }

  // Time slot extraction
  const lower = fullText.toLowerCase();
  let detectedTime: string | null = null;
  if (lower.includes("tomorrow afternoon")) detectedTime = "Tomorrow Afternoon";
  else if (lower.includes("tomorrow evening")) detectedTime = "Tomorrow Evening";
  else if (lower.includes("tomorrow morning")) detectedTime = "Tomorrow Morning";
  else if (lower.includes("today evening") || lower.includes("this evening")) detectedTime = "Today Evening";
  else if (lower.includes("today afternoon") || lower.includes("this afternoon")) detectedTime = "Today Afternoon";
  else if (lower.includes("tomorrow")) detectedTime = "Tomorrow (Flexible)";
  else if (lower.includes("tonight")) detectedTime = "Tonight";
  else if (lower.includes("afternoon")) detectedTime = "Afternoon Slot";
  else if (lower.includes("evening")) detectedTime = "Evening Slot";

  // Name extraction
  let detectedName: string | null = null;
  const nameMatch = fullText.match(/(?:my name is|i am|this is|i'm|name:?)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
  if (nameMatch && nameMatch[1]) {
    const n = nameMatch[1].trim();
    if (!["interested", "looking", "ready", "trying", "building", "developer", "founder"].includes(n.toLowerCase())) {
      detectedName = n;
    }
  }

  return {
    detectedEmail,
    detectedPhone,
    detectedTime,
    detectedName,
    fullText,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const {
      detectedEmail,
      detectedPhone,
      detectedTime,
      detectedName,
      fullText,
    } = extractIntakeData(messages);

    const hasContact = Boolean(detectedEmail || detectedPhone);
    let leadLogged = false;

    // As soon as at least ONE contact method (phone or email) is provided,
    // record the lead in Supabase crm_leads and send instant email alerts!
    if (hasContact) {
      try {
        const leadResult = await saveInboundLead({
          name: detectedName || "Inbound Client",
          phone: detectedPhone || "Not provided",
          email: detectedEmail || "",
          timeSlot: detectedTime || "Tomorrow Afternoon",
          projectDetails: fullText.slice(0, 1500),
          source: "AI Voice/Chat Assistant",
        });
        leadLogged = leadResult.success;
      } catch (logErr) {
        console.warn("[Sarvam Chat] Lead capture notice:", logErr);
      }
    }

    // Try Sarvam AI Chat completion if API key is present
    const sarvamKey = process.env.SARVAM_API_KEY;
    if (sarvamKey) {
      try {
        const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": sarvamKey,
          },
          body: JSON.stringify({
            model: "sarvam-m",
            messages: [
              { role: "system", content: INTAKE_SYSTEM_PROMPT },
              ...(messages || []).slice(-8),
            ],
            temperature: 0.3,
            max_tokens: 180,
          }),
        });

        if (sarvamRes.ok) {
          const data = await sarvamRes.json();
          let reply = data.choices?.[0]?.message?.content;
          if (reply) {
            reply = reply.replace(/[*#_~`]/g, "").trim();
            return NextResponse.json({
              success: true,
              reply,
              leadCaptured: hasContact,
              timeSlot: detectedTime,
            });
          }
        }
      } catch (e) {
        console.warn("[Sarvam Chat] Sarvam API error, trying Groq fallback:", e);
      }
    }

    // Try Groq LLM if configured
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey) {
      try {
        const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${groqKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
            messages: [
              { role: "system", content: INTAKE_SYSTEM_PROMPT },
              ...(messages || []).slice(-8),
            ],
            temperature: 0.4,
            max_tokens: 160,
          }),
        });

        if (groqRes.ok) {
          const gData = await groqRes.json();
          let reply = gData.choices?.[0]?.message?.content;
          if (reply) {
            reply = reply.replace(/[*#_~`]/g, "").trim();
            return NextResponse.json({
              success: true,
              reply,
              leadCaptured: hasContact,
              timeSlot: detectedTime,
            });
          }
        }
      } catch (e) {
        console.warn("[Groq Chat] Groq fallback notice:", e);
      }
    }

    // Conversational Fallback Rule Engine
    const lastUserMsg = messages?.[messages.length - 1]?.content?.toLowerCase() || "";
    let reply = "Hello! I am Makerly AI's voice assistant. Tell me what kind of SaaS, AI agent, or custom web platform you want to build.";

    if (hasContact) {
      const timeMention = detectedTime ? `for ${detectedTime}` : "for tomorrow afternoon";
      reply = `Thank you! I have confirmed your consultation request ${timeMention} and forwarded your project brief directly to Tousif Raza. Our engineering team will reach out via WhatsApp or email with your roadmap within 24 hours.`;
    } else if (detectedTime && !hasContact) {
      reply = `Got it, ${detectedTime} works great! What is your phone or WhatsApp number, or your email address so Tousif Raza can send over the meeting invite and roadmap?`;
    } else if (lastUserMsg.includes("build") || lastUserMsg.includes("app") || lastUserMsg.includes("saas") || lastUserMsg.includes("agent") || lastUserMsg.includes("platform") || lastUserMsg.includes("website") || lastUserMsg.includes("crm")) {
      reply = "That sounds like a high-impact build! When would you like to set up a quick 15-minute consultation with Tousif: today evening, tomorrow afternoon, or tomorrow evening? And what is your WhatsApp number or email?";
    } else if (lastUserMsg.includes("price") || lastUserMsg.includes("cost") || lastUserMsg.includes("how much") || lastUserMsg.includes("quote")) {
      reply = "Our Rapid MVP Sprints start at 99,000 rupees or 1,200 dollars with a working preview in 48 hours. What is your phone number or email, and when can we talk: today evening or tomorrow afternoon?";
    } else if (lastUserMsg.includes("time") || lastUserMsg.includes("when") || lastUserMsg.includes("meeting") || lastUserMsg.includes("call") || lastUserMsg.includes("schedule")) {
      reply = "We can schedule your call for today evening, tomorrow afternoon, or tomorrow evening. Which time works best for you, and what is your phone number or email?";
    } else {
      reply = "I would love to help bring your project to life. When would you prefer a quick consultation: today evening or tomorrow afternoon? And what is your phone number or email?";
    }

    return NextResponse.json({
      success: true,
      reply,
      leadCaptured: hasContact,
      timeSlot: detectedTime,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process chat." },
      { status: 500 }
    );
  }
}
