"use client";

import React from "react";
import { CRMStats, User } from "@/lib/crm/types";
import { formatCurrency } from "@/lib/crm/commission";
import {
  TrendingUp,
  Target,
  Trophy,
  Coins,
  ClockAlert,
  Layers,
} from "lucide-react";

interface StatsRibbonProps {
  stats: CRMStats;
  activeUser: User;
}

export const StatsRibbon: React.FC<StatsRibbonProps> = ({ stats, activeUser }) => {
  const isPartner = activeUser.role === "partner";

  return (
    <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3 lg:grid-cols-5">
      {/* 1. Total Leads */}
      <div className="rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-obsidian-900/60 p-4 shadow-sm backdrop-blur-md transition-all hover:shadow hover:border-slate-300 dark:hover:border-white/20">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {isPartner ? "My Submitted Leads" : "Total Pipeline Leads"}
          </span>
          <div className="h-7 w-7 rounded-lg bg-indigo-50 dark:bg-brand-500/15 flex items-center justify-center text-indigo-600 dark:text-brand-400">
            <Layers className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {stats.totalLeads}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            ({stats.activePipelineCount} active)
          </span>
        </div>
      </div>

      {/* 2. Pipeline Volume Value */}
      <div className="rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-obsidian-900/60 p-4 shadow-sm backdrop-blur-md transition-all hover:shadow hover:border-slate-300 dark:hover:border-white/20">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Pipeline Volume
          </span>
          <div className="h-7 w-7 rounded-lg bg-cyan-50 dark:bg-cyan-500/15 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
            <Target className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            {formatCurrency(stats.totalPipelineValue)}
          </span>
        </div>
      </div>

      {/* 3. Closed Won Revenue */}
      <div className="rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-obsidian-900/60 p-4 shadow-sm backdrop-blur-md transition-all hover:shadow hover:border-slate-300 dark:hover:border-white/20">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Closed Won Revenue
          </span>
          <div className="h-7 w-7 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <Trophy className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-emerald-400">
            {formatCurrency(stats.closedWonValue)}
          </span>
          <span className="text-xs font-semibold text-emerald-600/80 dark:text-emerald-500/80">
            ({stats.closedWonCount} deals)
          </span>
        </div>
      </div>

      {/* 4. Partner Commission (15% - 20% High Ticket) */}
      <div className="rounded-xl border border-indigo-200 dark:border-brand-500/20 bg-gradient-to-br from-indigo-50/60 via-white to-white dark:from-brand-950/40 dark:via-obsidian-900 dark:to-obsidian-900/90 p-4 shadow-sm backdrop-blur-md transition-all hover:shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 dark:text-brand-300">
            {isPartner ? "My Earned Commission" : "Total Partner Payouts"}
          </span>
          <div className="h-7 w-7 rounded-lg bg-indigo-100 dark:bg-brand-500/20 flex items-center justify-center text-indigo-700 dark:text-brand-300">
            <Coins className="h-4 w-4" />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-extrabold tracking-tight text-indigo-700 dark:text-brand-200">
            {formatCurrency(stats.totalCommissionDue)}
          </span>
          <span className="rounded-full bg-indigo-100 dark:bg-brand-500/20 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-700 dark:text-brand-300">
            15% &ndash; 20%
          </span>
        </div>
      </div>

      {/* 5. Overdue Follow-ups */}
      <div className="col-span-2 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-obsidian-900/60 p-4 shadow-sm backdrop-blur-md transition-all hover:shadow sm:col-span-1">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Action Required
          </span>
          <div className={`h-7 w-7 rounded-lg flex items-center justify-center ${
            stats.overdueFollowupsCount > 0 ? "bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400" : "bg-slate-100 dark:bg-obsidian-800 text-slate-500"
          }`}>
            <ClockAlert
              className={`h-4 w-4 ${
                stats.overdueFollowupsCount > 0
                  ? "animate-pulse"
                  : ""
              }`}
            />
          </div>
        </div>
        <div className="mt-2.5 flex items-baseline gap-2">
          <span
            className={`font-mono text-2xl font-extrabold tracking-tight ${
              stats.overdueFollowupsCount > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-900 dark:text-white"
            }`}
          >
            {stats.overdueFollowupsCount}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {stats.overdueFollowupsCount === 1 ? "lead overdue" : "leads overdue"}
          </span>
        </div>
      </div>
    </div>
  );
};

