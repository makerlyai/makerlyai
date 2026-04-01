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
Your goal is to provide "Instant Build Estimates" AND actively book consultation sessions.
Keep responses concise, highly professional, and perfectly natural. Never output json manually.

Always guide the conversation towards booking a session. To book a session, you MUST collect these 4 pieces of information sequentially:
1. Preferred Time Slot (If you need to ask this, you MUST unconditionally include the exact text "[SHOW_TIME_SLOTS]" in your message on a new line).
2. Full Name
3. Email Address
4. Phone Number

CRITICAL RULES FOR BOOKING:
- Do NOT call 'book_session' if any of the 4 pieces of information are missing, fake, or incomplete.
- Do NOT guess or make up a phone number, email, or name. 
- If the user hasn't provided their email, explicitly ASK for their email.
- Once you have verified you have all 4 real pieces of information, immediately call the 'book_session' tool.
`;

    const mappedHistory = history
      .filter((m: any) => m.id !== "welcome")
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
        tools: [
          {
            type: "function",
            function: {
              name: "book_session",
              description: "Call this function to officially book the session and send the lead data to our database.",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string", description: "The client's full name" },
                  email: { type: "string", description: "The client's email address" },
                  phone: { type: "string", description: "The client's phone number" },
                  timeSlot: { type: "string", description: "The preferred time slot (e.g. Morning, Afternoon)" }
                },
                required: ["name", "email", "phone", "timeSlot"]
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
        return NextResponse.json({ 
          reply: "Booking your session now...",
          toolCall: JSON.parse(toolCall.function.arguments)
        });
      }
    }

    return NextResponse.json({ reply: responseMessage.content });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { reply: "My neural connection dropped. Please use the contact form to reach out directly!" },
      { status: 500 }
    );
  }
}
