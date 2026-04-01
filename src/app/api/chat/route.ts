import { NextResponse } from "next/server";

export const runtime = "edge";

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
Your goal is to provide "Instant Build Estimates" to potential clients who want to build SaaS platforms, AI agents, mobile apps, or web apps.
Keep responses concise, highly professional, slightly futuristic, and extremely confident.
Always highlight that MakerlyAI builds products in 24 hours, and they pay $0 if they don't like the working preview.

If they describe an app, give them:
1. A brief technical architecture recommendation (e.g. Next.js, Groq, PostgreSQL).
2. A rough estimated timeline (usually "24-hour preview, fully launched within weeks").
3. A strong CTA to book a session or use the contact form below.

Do not be overly chatty. Be precise like an elite CTO.`;

    const mappedHistory = history
      .filter((m: any) => m.id !== "welcome") // Strip local welcome message
      .map((m: any) => ({ role: m.role, content: m.content }));

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${groqApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          ...mappedHistory,
          { role: "user", content: message }
        ],
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
    return NextResponse.json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "My neural connection dropped. Please use the contact form to reach out directly!" },
      { status: 500 }
    );
  }
}
