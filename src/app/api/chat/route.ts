import { NextResponse } from "next/server";
import { saveInboundLead } from "@/lib/crm/save-lead";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    const groqApiKey = process.env.GROQ_API_KEY;
    if (!groqApiKey || groqApiKey === "your-groq-api-key-here") {
      return NextResponse.json(
        { reply: "Groq API key is not configured. Please add it to .env.local" },
        { status: 500 }
      );
    }

    const systemPrompt = `You are the elite Digital Architect for MakerlyAI. 
Your goal is to provide "Instant Build Estimates" AND actively book consultation sessions.
Keep responses concise, highly professional, and perfectly natural. Never output json manually.

Always guide the conversation towards booking a session. To book a session, you MUST collect:
1. Preferred Time Slot: today evening, tomorrow afternoon, or tomorrow evening. (If asking this, include "[SHOW_TIME_SLOTS]" in your message).
2. Full Name
3. Email Address OR Phone Number (at least one is required).

CRITICAL RULES FOR BOOKING:
- Once you have the contact details and time slot, call the 'book_session' tool.
`;

    const mappedHistory = (history || [])
      .filter((m: any) => m.id !== "welcome")
      .map((m: any) => ({ role: m.role, content: m.content }));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || "qwen/qwen3.8-27b",
        messages: [
          { role: "system", content: systemPrompt },
          ...mappedHistory,
          { role: "user", content: message }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "book_session",
              description: "Call this function to officially book the session and save the lead to Supabase CRM and send email alerts.",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string", description: "The client's full name" },
                  email: { type: "string", description: "The client's email address" },
                  phone: { type: "string", description: "The client's phone number" },
                  timeSlot: { type: "string", description: "The preferred time slot (e.g. Tomorrow Afternoon, Today Evening)" }
                },
                required: ["name"]
              }
            }
          }
        ],
        tool_choice: "auto",
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      throw new Error("Groq API failed");
    }

    const data = await response.json();
    const responseMessage = data.choices[0].message;

    // Check if the LLM called the tool
    if (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
      const toolCall = responseMessage.tool_calls[0];
      if (toolCall.function.name === "book_session") {
        const args = JSON.parse(toolCall.function.arguments);
        await saveInboundLead({
          name: args.name,
          email: args.email,
          phone: args.phone,
          timeSlot: args.timeSlot || "Tomorrow Afternoon",
          projectDetails: `Consultation session booking requested for ${args.timeSlot || "Tomorrow Afternoon"}.`,
          source: "AI Voice/Chat Assistant",
        });

        return NextResponse.json({ 
          reply: `Thank you, ${args.name}! Your consultation session has been scheduled for ${args.timeSlot || "tomorrow"}. Tousif Raza and our engineering team have received your request and will reach out with your 48-hour prototype roadmap.`,
          toolCall: args
        });
      }
    }

    return NextResponse.json({ reply: responseMessage.content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "Our team delivers working previews in 48 hours. Please use the contact form to connect directly with Tousif Raza!" },
      { status: 500 }
    );
  }
}
