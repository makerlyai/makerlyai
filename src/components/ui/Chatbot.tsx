"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Sparkles, Mic, Keyboard, VolumeX, Volume2, Calendar, CheckCircle2 } from "lucide-react";
import { VoiceAssistantOrb } from "./voice-assistant-orb";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  leadCaptured?: boolean;
  timeSlot?: string;
};

const MEETING_SLOTS = [
  "⚡ Today Evening",
  "⚡ Tomorrow Afternoon",
  "⚡ Tomorrow Evening",
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm Makerly AI's Voice Assistant. Tell me what kind of SaaS, AI agent, or custom web platform you want to build. We can set up a quick 15-minute call today evening or tomorrow afternoon!",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasLeadCaptured, setHasLeadCaptured] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");
  // Monotonically-increasing generation counter — every new speakText call
  // gets a fresh generation ID; stale in-flight fetches compare and bail out.
  const speakGenRef = useRef<number>(0);

  // Barge-in: immediately cancel audio playback if user interrupts
  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
  };

  // Clean up on unmount and listen for external open events
  useEffect(() => {
    const handleOpenChat = () => {
      setIsOpen(true);
    };

    window.addEventListener("open-makerly-chat", handleOpenChat);

    return () => {
      stopAudio();
      window.removeEventListener("open-makerly-chat", handleOpenChat);
    };
  }, []);

  // Voice playback strictly with Sarvam Bulbul v3 API
  const speakText = async (text: string) => {
    if (mode !== "voice") return;

    // Increment generation — any older in-flight call will see a mismatch and abort
    const myGen = ++speakGenRef.current;
    stopAudio();

    const cleanText = text.replace(/\[SHOW_TIME_SLOTS\]/g, "").replace(/[*#_~`]/g, "").trim();
    if (!cleanText) return;

    try {
      setIsPlayingAudio(true);
      const res = await fetch("/api/sarvam/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanText,
          target_language_code: "en-IN",
          speaker: "priya",
        }),
      });

      // If a newer speakText call has started while we awaited, drop this result
      if (myGen !== speakGenRef.current) return;

      const data = await res.json();
      if (res.ok && data.success && data.audio) {
        // One final check before touching the DOM
        if (myGen !== speakGenRef.current) return;
        const audio = new Audio(data.audio);
        audioRef.current = audio;
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => setIsPlayingAudio(false);
        await audio.play();
        return;
      } else if (data.fallback) {
        if (myGen !== speakGenRef.current) return;
        fallbackSpeech(cleanText);
        return;
      }
    } catch (e) {
      console.warn("Sarvam TTS request notice:", e);
    }

    if (myGen === speakGenRef.current) setIsPlayingAudio(false);
  };

  const fallbackSpeech = (cleanText: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setIsPlayingAudio(false);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } catch {
      setIsPlayingAudio(false);
    }
  };

  // Toggle listening with barge-in
  const toggleListening = () => {
    stopAudio();

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Microphone recognition is not supported in this browser. Please use text mode.");
      setMode("text");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      transcriptRef.current = "";

      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onstart = () => setIsListening(true);

      recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            transcriptRef.current = event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition notice:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        const finalContent = transcriptRef.current.trim();
        if (finalContent) {
          sendMessage(finalContent);
        }
      };

      recognition.start();
    } catch (e) {
      console.error("Failed to start speech recognition:", e);
      setIsListening(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    stopAudio();

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
    };

    const currentHistory = [...messages];
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/sarvam/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...currentHistory, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();
      const reply = data.reply || "I can help scope your build. What's your WhatsApp number or email so Tousif Raza can prepare your 48h preview?";
      const leadCaptured = Boolean(data.leadCaptured);

      if (leadCaptured) {
        setHasLeadCaptured(true);
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: reply,
          leadCaptured,
          timeSlot: data.timeSlot,
        },
      ]);

      speakText(reply);
    } catch (error: any) {
      const fallbackMsg =
        "Our team delivers working previews in 48 hours. What is your WhatsApp number or email so founder Tousif Raza can review your project directly?";
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: fallbackMsg,
        },
      ]);
      speakText(fallbackMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Floating Action Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setIsOpen(true);
              speakText(messages[0].content);
            }}
            className="fixed bottom-28 right-4 md:bottom-8 md:right-8 z-50 w-14 h-14 rounded-full bg-brand-blue text-white shadow-[0_0_25px_rgba(26,75,156,0.6)] flex items-center justify-center border border-white/20 cursor-pointer"
            aria-label="Open AI Voice Assistant"
          >
            <Sparkles size={22} className="text-cyan-300 animate-pulse" />
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-brand-blue rounded-full animate-pulse" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[550px] max-h-[calc(100vh-7rem)] bg-zinc-950/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.04]">
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                <div className="w-9 h-9 shrink-0 rounded-xl bg-brand-blue/30 text-brand-300 border border-brand-blue/40 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white flex items-center gap-1.5 truncate">
                    <span className="font-logo font-bold">Makerly AI</span>
                    <span className="hidden sm:inline">Voice Assistant</span>
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                    Sarvam AI Bulbul v3
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                {/* Voice / Text Mode Switcher */}
                <div className="flex items-center bg-black/60 rounded-full p-0.5 border border-white/15">
                  <button
                    onClick={() => {
                      stopAudio();
                      setMode("voice");
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      mode === "voice"
                        ? "bg-brand-blue text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Mic size={12} />
                    <span className="hidden xs:inline">Voice</span>
                  </button>
                  <button
                    onClick={() => {
                      stopAudio();
                      setMode("text");
                    }}
                    className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                      mode === "text"
                        ? "bg-brand-blue text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Keyboard size={12} />
                    <span className="hidden xs:inline">Chat</span>
                  </button>
                </div>

                {isPlayingAudio && (
                  <button
                    onClick={stopAudio}
                    className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-rose-300 transition-colors"
                    title="Mute Speech"
                  >
                    <VolumeX size={16} />
                  </button>
                )}

                {/* Close button — always visible, large tap target */}
                <button
                  onClick={() => {
                    stopAudio();
                    setIsOpen(false);
                  }}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-rose-500/30 hover:text-rose-300 transition-colors text-slate-300 cursor-pointer border border-white/10 hover:border-rose-400/30"
                  aria-label="Close chatbot"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Voice Orb Area (When in Voice Mode) */}
            {mode === "voice" && (
              <div className="py-5 px-4 bg-gradient-to-b from-brand-blue/15 via-transparent to-transparent border-b border-white/10 flex flex-col items-center justify-center">
                <VoiceAssistantOrb
                  isListening={isListening}
                  isPlayingAudio={isPlayingAudio}
                  onClick={toggleListening}
                />
              </div>
            )}

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 max-w-[88%] ${
                    msg.role === "user" ? "ml-auto flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                      msg.role === "user" ? "bg-white/15" : "bg-brand-blue/30 text-brand-300"
                    }`}
                  >
                    {msg.role === "user" ? <User size={12} /> : <Bot size={12} />}
                  </div>
                  <div className="space-y-1.5">
                    <div
                      className={`p-3 rounded-2xl leading-relaxed ${
                        msg.role === "user"
                          ? "bg-brand-blue text-white rounded-tr-xs"
                          : "bg-white/[0.06] text-slate-200 rounded-tl-xs border border-white/10"
                      }`}
                    >
                      {msg.content}
                    </div>

                    {/* Lead Captured & Scheduled Badge */}
                    {msg.leadCaptured && (
                      <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-md">
                        <CheckCircle2 size={12} />
                        <span>Brief &amp; consultation scheduled with Tousif Raza ✓</span>
                      </div>
                    )}

                    {/* Voice Replay button on assistant messages */}
                    {msg.role === "assistant" && (
                      <div className="flex items-center gap-2 pl-1">
                        <button
                          type="button"
                          onClick={() => speakText(msg.content)}
                          className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-cyan-300 transition-colors"
                          title="Listen with Sarvam Bulbul"
                        >
                          <Volume2 size={11} />
                          <span>Listen (Sarvam Bulbul)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2.5 max-w-[85%]">
                  <div className="shrink-0 w-6 h-6 rounded-full bg-brand-blue/30 text-brand-300 flex items-center justify-center mt-0.5">
                    <Bot size={12} />
                  </div>
                  <div className="p-3 rounded-2xl bg-white/[0.06] border border-white/10 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce" />
                    <span
                      className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.15s" }}
                    />
                    <span
                      className="w-1.5 h-1.5 bg-brand-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.3s" }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Meeting Slot Chips */}
            <div className="px-3 pt-2 pb-1 bg-white/[0.02] border-t border-white/5 flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
              <span className="text-[10px] uppercase font-mono text-slate-500 flex items-center gap-1 shrink-0">
                <Calendar size={10} /> Call Slot:
              </span>
              {MEETING_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => sendMessage(`I would like to schedule my consultation for ${slot.replace("⚡ ", "")}.`)}
                  className="shrink-0 px-2.5 py-1 rounded-full bg-white/[0.05] hover:bg-brand-blue/20 hover:border-brand-blue/40 border border-white/10 text-[11px] font-medium text-slate-300 hover:text-white transition-all cursor-pointer"
                >
                  {slot}
                </button>
              ))}
            </div>

            {/* Text Input Form */}
            <div className="p-3 border-t border-white/10 bg-white/[0.03]">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === "voice" ? "Or type your inquiry..." : "Share your project, phone/email, or preferred time..."}
                  className="flex-1 bg-black/60 border border-white/15 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="w-9 h-9 shrink-0 bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
