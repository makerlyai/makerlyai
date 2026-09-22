"use client";

import React from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";

export interface VoiceAssistantOrbProps {
  isListening: boolean;
  isPlayingAudio: boolean;
  onClick: () => void;
  className?: string;
}

export function VoiceAssistantOrb({
  isListening,
  isPlayingAudio,
  onClick,
  className = "",
}: VoiceAssistantOrbProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        onClick={onClick}
        className={`orb-container ${isListening || isPlayingAudio ? "is-active scale-105" : ""}`}
        title={isListening ? "Listening... click to pause" : "Click to speak with Makerly Voice Assistant"}
      >
        <div className="orb">
          <div className="orb-inner" />
          <div className="orb-inner" />
        </div>

        {/* Center Mic / Audio icon */}
        <div className="relative z-30 flex h-10 w-10 items-center justify-center rounded-full bg-black/80 text-white backdrop-blur-md -rotate-90 shadow-lg border border-white/20">
          {isPlayingAudio ? (
            <Volume2 className="h-5 w-5 text-cyan-300 animate-pulse" />
          ) : isListening ? (
            <Mic className="h-5 w-5 text-rose-400 animate-bounce" />
          ) : (
            <Mic className="h-5 w-5 text-brand-300" />
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs font-mono">
        <span
          className={`h-2 w-2 rounded-full ${
            isPlayingAudio
              ? "bg-cyan-400 animate-ping"
              : isListening
              ? "bg-rose-500 animate-pulse"
              : "bg-brand-500"
          }`}
        />
        <span className="text-slate-300 font-semibold">
          {isPlayingAudio
            ? "Sarvam AI Speaking (tap to interrupt)"
            : isListening
            ? "Listening (English / Hindi)..."
            : "Tap Orb to Talk"}
        </span>
      </div>
    </div>
  );
}
