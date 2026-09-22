"use client";

import React from "react";

interface CaseStudyMetricCardProps {
  title?: string;
  updatedText?: string;
  revenue?: string;
  revenueGrowth?: string;
  costs?: string;
  costsGrowth?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

/**
 * High-performance dark SaaS Metric & Case Study Card from Uiverse.io by Gidarx.
 * Features an aurora gradient waveform, live telemetry indicators, and high contrast metrics.
 */
export function CaseStudyMetricCard({
  title = "Monthly Balance",
  updatedText = "Updated just now",
  revenue = "$51,274",
  revenueGrowth = "+8.5%",
  costs = "$12,818",
  costsGrowth = "+2.1%",
  buttonText = "View Full Report",
  onButtonClick,
  className = "",
}: CaseStudyMetricCardProps) {
  return (
    <div
      className={`group relative w-full max-w-xs sm:max-w-sm overflow-hidden rounded-2xl bg-neutral-950 p-6 font-sans shadow-2xl border border-neutral-800/80 transition-all duration-500 hover:border-lime-500/40 hover:shadow-lime-500/10 ${className}`}
    >
      <div className="absolute -top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-lime-500/10 blur-3xl transition-all duration-700 group-hover:bg-lime-500/20 pointer-events-none" />

      <div className="relative flex flex-col gap-5">
        <div className="flex items-start justify-between border-b border-neutral-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-lime-400/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-lime-400"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 12m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v6a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                <path d="M9 8m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v10a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                <path d="M15 4m0 1a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v14a1 1 0 0 1 -1 1h-4a1 1 0 0 1 -1 -1z" />
                <path d="M4 20l14 0" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-semibold text-neutral-200 text-sm sm:text-base">
                {title}
              </p>
              <p className="text-xs text-neutral-500 font-mono">{updatedText}</p>
            </div>
          </div>
        </div>

        <div className="flex divide-x divide-neutral-800 text-left">
          <div className="flex-1 pr-6">
            <p className="text-xs font-medium text-neutral-500">Revenue</p>
            <p className="text-xl font-bold tracking-tight text-neutral-100">
              {revenue}
            </p>
            <p className="mt-1 text-xs font-semibold text-lime-400">
              {revenueGrowth}
            </p>
          </div>
          <div className="flex-1 pl-6">
            <p className="text-xs font-medium text-neutral-500">Costs</p>
            <p className="text-xl font-bold tracking-tight text-neutral-100">
              {costs}
            </p>
            <p className="mt-1 text-xs font-semibold text-rose-400">
              {costsGrowth}
            </p>
          </div>
        </div>

        {/* Dynamic Aurora Waveform */}
        <div className="relative h-24 w-full">
          <svg
            className="h-full w-full"
            viewBox="0 0 300 100"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="aurora-gradient-v2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#a3e635" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M0,65 C50,20 80,80 150,70 S250,50 300,85"
              fill="none"
              stroke="#a3e635"
              strokeWidth="2.5"
            />
            <path
              d="M0,100 L0,65 C50,20 80,80 150,70 S250,50 300,85 L300,100 Z"
              fill="url(#aurora-gradient-v2)"
            />
          </svg>
          <div className="absolute right-[-1px] top-[81px]">
            <div className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lime-400 shadow-lg shadow-lime-400/80" />
            <div className="animate-pulse-strong absolute h-full w-full rounded-full bg-lime-400/40" />
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-4">
          <button
            type="button"
            onClick={onButtonClick}
            className="w-full rounded-lg border border-lime-400/50 bg-transparent px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-lime-400 transition-all duration-300 hover:bg-lime-400 hover:text-neutral-950 hover:shadow-lg hover:shadow-lime-400/20 cursor-pointer"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CaseStudyMetricCard;
