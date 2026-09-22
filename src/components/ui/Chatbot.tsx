"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Sparkles, Mic, Keyboard, VolumeX } from "lucide-react";
import { VoiceAssistantOrb } from "./voice-assistant-orb";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"voice" | "text">("voice");
  const [isListening, setIsListening] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm Makerly AI's Voice Assistant. Tell me what kind of SaaS, AI agent, or custom web platform you want to build.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef<string>("");

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

  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      stopAudio();
    };
  }, []);

  // Voice playback with Sarvam TTS or browser synthesis
  const speakText = async (text: string) => {
    if (mode !== "voice") return;
    stopAudio();

    const cleanText = text.replace(/\[SHOW_TIME_SLOTS\]/g, "").trim();
    if (!cleanText) return;

    try {
      setIsPlayingAudio(true);
      // Try Sarvam TTS API
      const res = await fetch("/api/sarvam/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: cleanText,
          target_language_code: "en-IN",
          speaker: "meera",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.audio) {
        const audio = new Audio(data.audio);
        audioRef.current = audio;
        audio.onended = () => setIsPlayingAudio(false);
        audio.onerror = () => {
          setIsPlayingAudio(false);
          fallbackSpeech(cleanText);
        };
        await audio.play();
        return;
      }
    } catch (e) {
      console.warn("Sarvam TTS fetch failed, using browser fallback", e);
    }

    fallbackSpeech(cleanText);
  };

  const fallbackSpeech = (cleanText: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      setIsPlayingAudio(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);
    window.speechSynthesis.speak(utterance);
  };

  // Toggle listening with barge-in
  const toggleListening = () => {
    // Interruption handling: stop audio if currently playing
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
      recognition.lang = "en-IN"; // Supports English and Indian accents natively

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
        console.error("Speech recognition error:", event.error);
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

    // Barge in
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
      const reply = data.reply || "I can help scope your build. Would you like to submit a quick project brief?";

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: reply,
        },
      ]);

      speakText(reply);
    } catch (error: any) {
      const fallbackMsg =
        "Our team delivers working previews in 48 hours. Fill out the brief form below to connect directly with Tousif Raza.";
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
            className="fixed bottom-24 right-4 md:bottom-8 md:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[540px] max-h-[calc(100vh-7rem)] bg-zinc-950/95 backdrop-blur-2xl border border-white/15 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/[0.04]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-brand-blue/30 text-brand-300 border border-brand-blue/40 flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-white">
                    Makerly AI Voice Assistant
                  </h3>
                  <p className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Sarvam AI Saarika &amp; Bulbul v3
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
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
                    <span>Voice</span>
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
                    <span>Chat</span>
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

                <button
                  onClick={() => {
                    stopAudio();
                    setIsOpen(false);
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-slate-400 hover:text-white cursor-pointer"
                  aria-label="Close"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Voice Orb Area (When in Voice Mode) */}
            {mode === "voice" && (
              <div className="py-6 px-4 bg-gradient-to-b from-brand-blue/10 via-transparent to-transparent border-b border-white/10 flex flex-col items-center justify-center">
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
                  className={`flex gap-2.5 max-w-[85%] ${
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
                  <div
                    className={`p-3 rounded-2xl leading-relaxed ${
                      msg.role === "user"
                        ? "bg-brand-blue text-white rounded-tr-xs"
                        : "bg-white/[0.06] text-slate-200 rounded-tl-xs border border-white/10"
                    }`}
                  >
                    {msg.content}
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

            {/* Text Input Form */}
            <div className="p-3 border-t border-white/10 bg-white/[0.03]">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === "voice" ? "Or type your inquiry..." : "Ask about MVP sprints, pricing, or tech stack..."}
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
