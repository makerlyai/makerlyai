"use client";

import React from "react";
import { User, UserRole } from "@/lib/crm/types";
import { AuthSession } from "@/lib/crm/auth-store";
import {
  Sparkles,
  Plus,
  Search,
  LayoutGrid,
  List,
  ShieldCheck,
  UserCheck,
  Sun,
  Moon,
  FileSpreadsheet,
  Lock,
  Users,
} from "lucide-react";

import { MakerlyLogoIcon } from "./makerly-logo";

interface CRMHeaderProps {
  activeUser: User;
  onUserChange?: (user: User) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: "table" | "kanban";
  onViewModeChange: (mode: "table" | "kanban") => void;
  onOpenSubmitModal: () => void;
  onOpenBulkImportModal: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  authSession?: AuthSession | null;
  pendingRequestsCount?: number;
  onOpenAccessManager?: () => void;
  onLockCRM?: () => void;
}

export const CRMHeader: React.FC<CRMHeaderProps> = ({
  activeUser,
  onUserChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onOpenSubmitModal,
  onOpenBulkImportModal,
  isDarkMode,
  onToggleTheme,
  authSession,
  pendingRequestsCount = 0,
  onOpenAccessManager,
  onLockCRM,
}) => {

  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200/80 dark:border-white/[0.08] bg-white/95 dark:bg-obsidian-950/80 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Official Brand + Environment Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5">
            {/* Official MakerlyAI Symbol Box */}
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#efe7d1] border border-[#2952cc]/30 shadow-xs transition-transform hover:scale-105 p-1.5">
              <MakerlyLogoIcon className="w-full h-full" color="#2952cc" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900 dark:text-white font-sans">
                  Maker<span className="text-[#2952cc] dark:text-[#4d73ff]">lyAI</span>
                  <span className="text-xs font-semibold text-slate-400 dark:text-slate-500">.in</span>
                </span>
                <span className="rounded-full border border-blue-500/30 bg-blue-50 dark:bg-blue-500/10 px-2 py-0.2 font-mono text-[10px] font-semibold text-[#2952cc] dark:text-blue-400">
                  CRM v2.4
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400 tracking-tight">
                Big Tech for small business.
              </p>
            </div>
          </div>
        </div>

        {/* Center: Search + View Mode Switcher */}
        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative hidden w-64 md:block">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search leads, client, biz..."
              className="h-9 w-full rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50/80 dark:bg-obsidian-900/90 pl-9 pr-3 text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 transition-all focus:border-brand-500/50 focus:bg-white dark:focus:bg-obsidian-850 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* View Mode Toggle */}
          <div className="flex h-9 items-center rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-100/80 dark:bg-obsidian-900 p-0.5">
            <button
              onClick={() => onViewModeChange("table")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-white dark:bg-brand-600 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>Table</span>
            </button>
            <button
              onClick={() => onViewModeChange("kanban")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-all ${
                viewMode === "kanban"
                  ? "bg-white dark:bg-brand-600 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Pipeline</span>
            </button>
          </div>
        </div>

        {/* Right: Submit Button + Role Switcher Ticker + Theme Toggle */}
        <div className="flex items-center gap-2.5">
          {/* Import Excel Button */}
          <button
            onClick={onOpenBulkImportModal}
            className="flex h-9 items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-3 text-xs font-semibold text-emerald-700 dark:text-emerald-300 transition-all hover:bg-emerald-100 dark:hover:bg-emerald-500/20 active:scale-95 shadow-sm"
            title="Import leads from Excel spreadsheet or CSV"
          >
            <FileSpreadsheet className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Import Excel</span>
          </button>

          {/* Submit Lead Button */}
          <button
            onClick={onOpenSubmitModal}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 dark:bg-white px-3.5 text-xs font-semibold text-white dark:text-obsidian-950 shadow-sm transition-all hover:bg-slate-800 dark:hover:bg-slate-100 hover:shadow active:scale-95"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Submit Lead</span>
          </button>

          {/* Authenticated Persona Badge (Locked to Verified Session) */}
          <div className="flex h-9 items-center gap-2 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-obsidian-900 px-3 py-1 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
            {activeUser.role === "admin" ? (
              <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            ) : (
              <UserCheck className="h-4 w-4 text-brand-600 dark:text-brand-400 shrink-0" />
            )}
            <div className="text-left leading-tight">
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-900 dark:text-slate-100">{activeUser.name}</span>
                <span
                  className={`rounded px-1.5 py-0.2 font-mono text-[9px] uppercase font-bold ${
                    activeUser.role === "admin"
                      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20"
                      : "bg-brand-500/15 text-brand-700 dark:text-brand-300 border border-brand-500/20"
                  }`}
                >
                  {activeUser.role === "admin" ? "Owner" : "Partner"}
                </span>
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 font-mono hidden sm:block">
                {activeUser.email}
              </div>
            </div>
          </div>

          {/* Owner Access Authorizations Button */}
          {authSession?.role === "owner" && onOpenAccessManager && (
            <button
              onClick={onOpenAccessManager}
              className="relative flex h-9 items-center gap-1.5 rounded-lg border border-brand-200 dark:border-brand-500/30 bg-brand-50/80 dark:bg-brand-500/10 px-2.5 text-xs font-semibold text-brand-700 dark:text-brand-300 transition-all hover:bg-brand-100 dark:hover:bg-brand-500/20 shadow-xs"
              title="Manage Partner Access Authorizations"
            >
              <Users className="h-3.5 w-3.5 text-brand-600" />
              <span className="hidden lg:inline">Authorizations</span>
              {pendingRequestsCount > 0 && (
                <span className="flex h-4 min-w-[16px] items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white px-1">
                  {pendingRequestsCount}
                </span>
              )}
            </button>
          )}

          {/* Lock CRM / Authorization Exit Button */}
          {onLockCRM && (
            <button
              onClick={onLockCRM}
              className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-obsidian-900 px-2.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-850 transition-all shadow-xs"
              title="Lock CRM and return to Personal Authorization Gate"
            >
              <Lock className="h-3.5 w-3.5 text-slate-500" />
              <span className="hidden xl:inline">Lock</span>
            </button>
          )}

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-obsidian-900 text-slate-600 dark:text-slate-400 transition-colors hover:bg-slate-100 dark:hover:bg-obsidian-800 hover:text-slate-900 dark:hover:text-slate-200 shadow-sm"
            title="Toggle theme"
          >
            {isDarkMode ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-slate-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

