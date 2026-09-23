import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const text = body?.text;
    const target_language_code = body?.target_language_code || "en-IN";
    const requestedSpeaker = body?.speaker || "priya";
    const speaker = requestedSpeaker === "meera" ? "priya" : requestedSpeaker;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ success: false, message: "Text is required" }, { status: 400 });
    }

    const apiKey = process.env.SARVAM_API_KEY;

    if (!apiKey) {
      // Return fallback flag indicating client should use browser synthesis
      return NextResponse.json({
        success: false,
        fallback: true,
        message: "No Sarvam API key configured; use client speech synthesis.",
      });
    }

    const sarvamRes = await fetch("https://api.sarvam.ai/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-subscription-key": apiKey,
      },
      body: JSON.stringify({
        inputs: [text.slice(0, 500)],
        target_language_code,
        speaker,
        pitch: 0,
        pace: 1.05,
        loudness: 1.2,
        speech_sample_rate: 22050,
        enable_preprocessing: true,
        model: "bulbul:v3",
      }),
    });

    if (!sarvamRes.ok) {
      const err = await sarvamRes.text();
      console.error("Sarvam TTS API failed:", err);
      return NextResponse.json({
        success: false,
        fallback: true,
        message: "Sarvam TTS upstream error.",
      });
    }

    const data = await sarvamRes.json();
    const audioBase64 = data.audios?.[0];

    if (!audioBase64) {
      return NextResponse.json({ success: false, fallback: true });
    }

    return NextResponse.json({
      success: true,
      audio: `data:audio/wav;base64,${audioBase64}`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, fallback: true, message: error.message },
      { status: 500 }
    );
  }
}
