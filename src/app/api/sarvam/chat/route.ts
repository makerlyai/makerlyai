import { NextRequest, NextResponse } from "next/server";

const SARVAM_SYSTEM_PROMPT = `
You are Makerly AI's Intelligent Project Intake Assistant, engineered by Tousif Raza.
Makerly AI is an elite software engineering studio specializing in:
- Rapid SaaS MVP development (from ₹99,000 / $1,200, 2-3 weeks, 48h working preview).
- Multilingual Voice Agents & AI Automations (Sarvam AI Saarika + Bulbul v3).
- Custom CRM & internal production engines with 100% client IP transfer.

LEAD INTAKE & DATA COLLECTION GOAL:
Your primary goal is to converse naturally and collect the client's project brief:
1. What they are trying to build (SaaS, AI agent, mobile app, internal portal).
2. What their core requirements and timeline are.
3. At bare minimum, collect their Name, Phone/WhatsApp number, and Email address so founder Tousif Raza can deliver their free architecture plan and 48h preview.

VOICE & CHAT GUIDELINES:
- Keep answers SHORT, WARM, and CONVERSATIONAL: 1 to 3 sentences maximum.
- Never output markdown formatting or bullet points in voice responses.
- Speak naturally and confidently. If asked about pricing, mention our MVP sprint starts at ₹99,000 / $1,200 with a 48h working preview.
- When they describe what they want to build, validate it and ask: "What are your core requirements, and what is your name, email, and WhatsApp number so Tousif can review it?"
- When they provide contact info, thank them warmly and confirm their project brief has been recorded in our engineering queue for Tousif Raza.
`;

export async function POST(req: NextRequest) {
  try {
    const { messages, language = "en-IN" } = await req.json();

    const apiKey = process.env.SARVAM_API_KEY;

    // Detect contact information in user conversation history
    const allUserText = (messages || [])
      .filter((m: any) => m.role === "user")
      .map((m: any) => m.content)
      .join(" ");

    const emailMatch = allUserText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
    const phoneMatch = allUserText.match(/(\+?[0-9\s-]{10,15})/);
    const detectedEmail = emailMatch ? emailMatch[0].trim() : null;
    const detectedPhone = phoneMatch ? phoneMatch[0].replace(/[\s-]/g, "").trim() : null;

    // If both email or phone are detected, attempt auto-logging to /api/contact in the background
    if (detectedEmail || (detectedPhone && detectedPhone.length >= 10)) {
      try {
        const contactUrl = new URL("/api/contact", req.url).toString();
        fetch(contactUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: "Chatbot Lead",
            email: detectedEmail || "not-provided@lead.makerlyai.in",
            phone: detectedPhone || "+910000000000",
            projectDetails: `[Chatbot Lead Intake] Conversation: ${allUserText.slice(0, 1000)}`,
          }),
        }).catch((err) => console.warn("Background lead logging notice:", err));
      } catch (e) {
        // non-blocking
      }
    }

    if (apiKey) {
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
              ...(messages || []).slice(-8), // rolling last 8 turns
            ],
            temperature: 0.3,
            max_tokens: 150,
          }),
        });

        if (sarvamRes.ok) {
          const data = await sarvamRes.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({ 
              success: true, 
              reply: reply.trim(),
              leadCaptured: Boolean(detectedEmail || detectedPhone)
            });
          }
        }
      } catch (e) {
        console.error("Sarvam chat completion error, falling back to conversational engine:", e);
      }
    }

    // High quality intelligent conversational intake fallback engine
    const lastUserMsg = messages?.[messages.length - 1]?.content?.toLowerCase() || "";
    let reply = "I'm ready to help scope your project! What kind of app, SaaS, or AI agent are you looking to build?";

    if (detectedEmail || detectedPhone) {
      reply = `Thank you! I've captured your contact information. Tousif Raza and our engineering team will review your project requirements and reach out within 24 hours.`;
    } else if (lastUserMsg.includes("build") || lastUserMsg.includes("app") || lastUserMsg.includes("saas") || lastUserMsg.includes("agent") || lastUserMsg.includes("platform") || lastUserMsg.includes("website")) {
      reply = "That sounds exciting! What are your key requirements and features? Also, please share your name, email, and WhatsApp number so we can prepare your 48h preview.";
    } else if (lastUserMsg.includes("price") || lastUserMsg.includes("cost") || lastUserMsg.includes("how much") || lastUserMsg.includes("kitna")) {
      reply = "Our Rapid MVP Sprints start at ₹99,000 or $1,200 with a 48h working preview. To get an exact quote for your idea, what's your name, email, and WhatsApp number?";
    } else if (lastUserMsg.includes("time") || lastUserMsg.includes("duration") || lastUserMsg.includes("how long")) {
      reply = "We deploy an interactive Stage 1 preview within 48 to 72 hours, and complete full MVP builds in 2 to 3 weeks.";
    } else if (lastUserMsg.includes("ip") || lastUserMsg.includes("code") || lastUserMsg.includes("own")) {
      reply = "You retain 100% intellectual property and full GitHub repository ownership upon milestone completion. Zero vendor lock-in.";
    } else if (lastUserMsg.includes("tousif") || lastUserMsg.includes("founder") || lastUserMsg.includes("team")) {
      reply = "Tousif Raza leads technical architecture and product engineering at Makerly AI. Share your project requirements and phone/email here, and he'll review it directly.";
    } else if (lastUserMsg.includes("hindi") || lastUserMsg.includes("namaste") || lastUserMsg.includes("kaise ho")) {
      reply = "Namaste! Main Makerly AI ka voice assistant hoon. Aap apne app ya SaaS idea ke baare mein bataiye, aur apna name aur WhatsApp number share kijiye.";
    } else if (lastUserMsg.includes("book") || lastUserMsg.includes("call") || lastUserMsg.includes("contact")) {
      reply = "You can share your name, email, and WhatsApp number right here in this chat, or reach Tousif directly via the One-Tap WhatsApp button above.";
    }

    return NextResponse.json({ 
      success: true, 
      reply,
      leadCaptured: Boolean(detectedEmail || detectedPhone)
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to process chat." },
      { status: 500 }
    );
  }
}
