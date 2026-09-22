"use client";

import React from "react";

interface BanterLoaderProps {
  text?: string;
  subtext?: string;
  fullScreen?: boolean;
  className?: string;
}

/**
 * Banter Loader from Uiverse.io by Nawsome.
 * A synchronized 9-box sliding puzzle animation for long operations and loading transitions.
 */
export function BanterLoader({
  text,
  subtext,
  fullScreen = false,
  className = "",
}: BanterLoaderProps) {
  const content = (
    <div className={`banter-loader-wrapper ${className}`}>
      <div className="banter-loader" aria-label="Loading animation">
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
        <div className="banter-loader__box" />
      </div>

      {(text || subtext) && (
        <div className="text-center space-y-1">
          {text && (
            <p className="text-sm font-semibold tracking-wide text-white">
              {text}
            </p>
          )}
          {subtext && (
            <p className="text-xs font-mono text-slate-400">
              {subtext}
            </p>
          )}
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-all duration-300">
        <div className="p-8 rounded-3xl bg-[#0b101e]/90 border border-white/10 shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return content;
}

export default BanterLoader;
