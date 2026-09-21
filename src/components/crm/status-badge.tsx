"use client";

import React from "react";
import { LeadStatus } from "@/lib/crm/types";

interface StatusBadgeProps {
  status: LeadStatus;
  size?: "sm" | "md";
  interactive?: boolean;
  onClick?: () => void;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "sm",
  interactive = false,
  onClick,
}) => {
  const getStyles = () => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/30";
      case "Contacted":
        return "bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/30";
      case "Interested":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-300 dark:border-purple-500/30";
      case "Proposal Sent":
        return "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-500/10 dark:text-pink-400 dark:border-pink-500/30";
      case "Negotiation":
        return "bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/30";
      case "Closed Won":
        return "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-500/40 font-semibold";
      case "Closed Lost":
        return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/30";
      default:
        return "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/30";
    }
  };

  const getDotColor = () => {
    switch (status) {
      case "New":
        return "bg-blue-500";
      case "Contacted":
        return "bg-cyan-500";
      case "Interested":
        return "bg-purple-500";
      case "Proposal Sent":
        return "bg-pink-500";
      case "Negotiation":
        return "bg-amber-500";
      case "Closed Won":
        return "bg-emerald-500";
      case "Closed Lost":
        return "bg-slate-400";
      default:
        return "bg-slate-400";
    }
  };

  const pad = size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium transition-all ${pad} ${getStyles()} ${
        interactive ? "cursor-pointer hover:brightness-125 hover:shadow-sm" : ""
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${getDotColor()} ${status === "New" ? "animate-pulse" : ""}`} />
      <span>{status}</span>
    </span>
  );
};

