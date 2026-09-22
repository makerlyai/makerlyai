import { NextRequest, NextResponse } from "next/server";

const SARVAM_SYSTEM_PROMPT = `
You are Makerly AI's Voice Assistant, engineered by Tousif Raza.
Makerly AI is an elite software engineering studio specializing in:
- Rapid SaaS MVP development (from ₹99,000 / $1,200, 2-3 weeks, 48h working preview).
- Multilingual Voice Agents & AI Automations (Sarvam AI Saarika + Bulbul v3).
- Custom CRM & internal production engines with 100% client IP transfer.

VOICE RESPONSE GUIDELINES:
- Keep answers SHORT and CONVERSATIONAL: 1 to 3 sentences maximum.
- Never output markdown formatting, bullet points, or code blocks in voice responses.
- Speak naturally and confidently. If asked about pricing, mention our MVP sprint starts at ₹99,000 / $1,200 with 48h working preview.
- Offer to connect them directly with founder Tousif Raza or guide them to the contact form below.
`;

export async function POST(req: NextRequest) {
  try {
    const { messages, language = "en-IN" } = await req.json();

    const apiKey = process.env.SARVAM_API_KEY;

    if (apiKey) {
      // Call Sarvam AI or configured LLM
      try {
        const sarvamRes = await fetch("https://api.sarvam.ai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "api-subscription-key": apiKey,
          },
          body: JSON.stringify({
            model: "sarvam-m",
            messages: [
              { role: "system", content: SARVAM_SYSTEM_PROMPT },
              ...(messages || []).slice(-6), // rolling last 6 turns
            ],
            temperature: 0.3,
            max_tokens: 150,
          }),
        });

        if (sarvamRes.ok) {
          const data = await sarvamRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ success: true, reply: reply.trim() });
          }
        }
      } catch (e) {
        console.error("Sarvam chat completion error, falling back to local engine:", e);
      }
    }

    // High quality conversational fallback engine
    const lastUserMsg = messages?.[messages.length - 1]?.content?.toLowerCase() || "";
    let reply = "I can help scope your SaaS, AI agent, or custom web platform. What are you looking to build?";

    if (lastUserMsg.includes("price") || lastUserMsg.includes("cost") || lastUserMsg.includes("how much") || lastUserMsg.includes("kitna")) {
      reply = "Our Rapid MVP Sprints start at ₹99,000 or $1,200 for a 2 to 3 week delivery, including a working preview in 48 hours. Custom AI voice agents start at ₹1,99,000.";
    } else if (lastUserMsg.includes("time") || lastUserMsg.includes("duration") || lastUserMsg.includes("how long")) {
      reply = "We deploy an interactive Stage 1 preview within 48 to 72 hours, and complete full MVP builds in 2 to 3 weeks.";
    } else if (lastUserMsg.includes("ip") || lastUserMsg.includes("code") || lastUserMsg.includes("own")) {
      reply = "You retain 100% intellectual property and full GitHub repository ownership upon milestone completion. Zero vendor lock-in.";
    } else if (lastUserMsg.includes("tousif") || lastUserMsg.includes("founder") || lastUserMsg.includes("team")) {
      reply = "Tousif Raza leads technical architecture and product engineering at Makerly AI. You can submit your project brief below for direct review.";
    } else if (lastUserMsg.includes("hindi") || lastUserMsg.includes("namaste") || lastUserMsg.includes("kaise ho")) {
      reply = "Namaste! Main Makerly AI ka voice assistant hoon. Aap apne app ya SaaS idea ke baare mein bataiye, hum 48 hours mein working preview taiyaar karte hain.";
    } else if (lastUserMsg.includes("book") || lastUserMsg.includes("call") || lastUserMsg.includes("contact")) {
      reply = "You can fill out our brief form below or email us at getmakerlyai@gmail.com, and Tousif will schedule a discovery call within 24 hours.";
    }

    return NextResponse.json({ success: true, reply });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process chat." },
      { status: 500 }
    );
  }
}
