"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot, User, Sparkles, Mic, Keyboard } from "lucide-react";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! I'm MakerlyAI's digital architect. Looking for an instant build estimate? Tell me what kind of app or SaaS you want to build."
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Clean up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
    };
  }, []);

  const speakText = (text: string) => {
    if (mode !== "voice" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop current speech
    const cleanText = text.replace(/\[SHOW_TIME_SLOTS\]/g, "").trim();
    if (!cleanText) return;
    
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  };

  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => setIsListening(true);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript.trim()) {
        sendMessage(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
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

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim()
    };

    const currentHistory = [...messages];
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.content, history: currentHistory }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.reply || "API failed");
      }
      
      // Auto-submit the form if the LLM invoked the book_session tool
      if (data.toolCall) {
        const confirmMsg = data.reply || "Got it. I'm securing that slot for you right now...";
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: confirmMsg
        }]);
        speakText(confirmMsg);
        
        const contactRes = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: data.toolCall.name,
            email: data.toolCall.email,
            phone: data.toolCall.phone,
            projectDetails: `Chatbot AI Lead.\nPreferred Time Slot: ${data.toolCall.timeSlot}`,
          })
        });

        if (!contactRes.ok) throw new Error("Failed to book session on server.");

        const finalMsg = "Your session is officially booked! 🚀 Our team has been notified and you will receive a confirmation email shortly. Talk to you soon!";
        setMessages(prev => [...prev, {
          id: (Date.now() + 2).toString(),
          role: "assistant",
          content: finalMsg
        }]);
        speakText(finalMsg);
        
        setIsLoading(false);
        return;
      }
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.reply
      }]);
      speakText(data.reply);
    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: error.message || "Sorry, my neural connection dropped. Could you share your request via the contact form?"
      }]);
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
            onClick={() => setIsOpen(true)}
            className="fixed bottom-28 right-4 md:bottom-8 md:right-8 z-50 w-14 h-14 rounded-full bg-brand-blue text-white shadow-[0_0_20px_rgba(26,75,156,0.4)] flex items-center justify-center border border-white/20"
          >
            <MessageSquare size={24} />
            {/* Notification dot */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-cyan-400 border-2 border-brand-blue rounded-full animate-pulse" />
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
            transition={{ duration: 0.2 }}
            className="fixed bottom-28 right-4 md:bottom-8 md:right-8 z-50 w-[calc(100vw-2rem)] sm:w-[380px] h-[500px] max-h-[calc(100vh-8rem)] bg-zinc-950/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center">
                  <Sparkles size={16} className="text-brand-blue" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide text-white">Project Architect</h3>
                  <p className="text-xs text-white/50 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-black/50 rounded-full p-1 border border-white/10">
                  <button
                    onClick={() => {
                      setMode("text");
                      if (window.speechSynthesis) window.speechSynthesis.cancel();
                    }}
                    className={`p-1.5 rounded-full transition-colors ${mode === "text" ? "bg-white/20 text-white" : "text-white/40 hover:text-white/70"}`}
                  >
                    <Keyboard size={14} />
                  </button>
                  <button
                    onClick={() => {
                      setMode("voice");
                      // Optionally speak welcome message if enabling voice for the first time
                    }}
                    className={`p-1.5 rounded-full transition-colors ${mode === "voice" ? "bg-brand-blue text-white" : "text-white/40 hover:text-white/70"}`}
                  >
                    <Mic size={14} />
                  </button>
                </div>
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    if (window.speechSynthesis) window.speechSynthesis.cancel();
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-white/50 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
                >
                  <div className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-1 ${
                    msg.role === "user" ? "bg-white/10" : "bg-brand-blue/20"
                  }`}>
                    {msg.role === "user" ? <User size={14} className="text-white/70" /> : <Bot size={14} className="text-brand-blue" />}
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className={`p-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-brand-blue text-white rounded-tr-sm" 
                        : "bg-white/5 text-white/90 rounded-tl-sm border border-white/5"
                    }`}>
                      {msg.content.replace("[SHOW_TIME_SLOTS]", "").trim()}
                    </div>
                    
                    {/* Render Quick Reply Time Slots */}
                    {msg.content.includes("[SHOW_TIME_SLOTS]") && msg.role === "assistant" && (
                      <div className="flex flex-wrap gap-2 mt-1">
                        {["Morning", "Afternoon", "Evening", "Tomorrow"].map((slot) => (
                          <button
                            key={slot}
                            onClick={() => sendMessage(slot)}
                            className="px-3 py-1.5 bg-brand-blue/20 hover:bg-brand-blue/40 border border-brand-blue/30 text-brand-blue rounded-full text-xs font-medium transition-colors"
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 max-w-[85%]">
                  <div className="shrink-0 w-7 h-7 rounded-full bg-brand-blue/20 flex items-center justify-center mt-1">
                    <Bot size={14} className="text-brand-blue" />
                  </div>
                  <div className="p-4 rounded-2xl bg-white/5 rounded-tl-sm border border-white/5 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }} />
                    <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form / Voice Control */}
            <div className="p-3 border-t border-white/10 bg-white/5">
              {mode === "text" ? (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="E.g. I need a food delivery app..."
                    className="flex-1 bg-black/50 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-blue/50 transition-colors"
                  />
                  <button 
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="w-10 h-10 shrink-0 bg-brand-blue text-white rounded-xl flex items-center justify-center hover:bg-brand-blue/90 disabled:opacity-50 disabled:hover:bg-brand-blue transition-colors"
                  >
                    <Send size={16} className="ml-0.5" />
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center justify-center py-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleListening}
                    disabled={isLoading}
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-colors disabled:opacity-50 ${
                      isListening ? "bg-red-500 text-white" : "bg-brand-blue text-white hover:bg-brand-blue/90"
                    }`}
                  >
                    {isListening && (
                      <span className="absolute inset-0 rounded-full border-2 border-red-500 animate-[ping_1.5s_ease-out_infinite]" />
                    )}
                    <Mic size={24} />
                  </motion.button>
                  <p className="text-xs text-white/50 mt-3 font-medium">
                    {isLoading ? "Thinking..." : isListening ? "Listening... Tap to stop" : "Tap to speak"}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
