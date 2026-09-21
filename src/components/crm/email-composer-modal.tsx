"use client";

import React, { useState, useEffect } from "react";
import { Lead, EmailTemplate, User } from "@/lib/crm/types";
import { EMAIL_TEMPLATES, renderEmailTemplate } from "@/lib/crm/email-templates";
import {
  Mail,
  Send,
  Sparkles,
  CheckCircle2,
  FileText,
  Clock,
  ArrowRight,
} from "lucide-react";

interface EmailComposerModalProps {
  lead: Lead;
  activeUser: User;
  isOpen: boolean;
  onClose: () => void;
  onSendEmail: (payload: {
    leadId: string;
    to: string;
    subject: string;
    body: string;
    templateId: string;
  }) => void;
}

export const EmailComposerModal: React.FC<EmailComposerModalProps> = ({
  lead,
  activeUser,
  isOpen,
  onClose,
  onSendEmail,
}) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("intro");
  const [toEmail, setToEmail] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (lead) {
      setToEmail(lead.email);
      const template =
        EMAIL_TEMPLATES.find((t) => t.id === selectedTemplateId) ||
        EMAIL_TEMPLATES[0];
      const rendered = renderEmailTemplate(template, lead);
      setSubject(rendered.subject);
      setBody(rendered.body);
      setSentSuccess(false);
    }
  }, [lead, selectedTemplateId]);

  if (!isOpen || !lead) return null;

  const handleTemplateSelect = (tmpl: EmailTemplate) => {
    setSelectedTemplateId(tmpl.id);
    const rendered = renderEmailTemplate(tmpl, lead);
    setSubject(rendered.subject);
    setBody(rendered.body);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      onSendEmail({
        leadId: lead.id,
        to: toEmail,
        subject,
        body,
        templateId: selectedTemplateId,
      });
      setIsSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1200);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-obsidian-900 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] bg-obsidian-950 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/20 text-brand-400">
              <Mail className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Send Outreach Email &mdash; {lead.businessName}
              </h3>
              <p className="text-[11px] text-slate-400">
                To: {lead.clientName} ({lead.email})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-white/10 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Template Selector Tabs */}
        <div className="flex border-b border-white/[0.08] bg-obsidian-950/50 px-6 py-2.5">
          <div className="flex gap-2">
            {EMAIL_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => handleTemplateSelect(tmpl)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                  selectedTemplateId === tmpl.id
                    ? "border border-brand-500/40 bg-brand-500/20 text-brand-200"
                    : "border border-transparent text-slate-400 hover:bg-obsidian-850 hover:text-slate-200"
                }`}
              >
                {tmpl.id === "intro" && <Sparkles className="h-3 w-3" />}
                {tmpl.id === "followup" && <Clock className="h-3 w-3" />}
                {tmpl.id === "proposal" && <FileText className="h-3 w-3" />}
                <span>{tmpl.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Composer Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {sentSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <h4 className="mt-3 text-base font-bold text-white">
                Email Sent &amp; Logged!
              </h4>
              <p className="mt-1 text-xs text-slate-400">
                Activity has been recorded in the lead&apos;s chronological timeline.
              </p>
            </div>
          ) : (
            <>
              {/* To field */}
              <div className="grid grid-cols-6 items-center gap-3">
                <label className="text-right text-xs font-medium text-slate-400">
                  To:
                </label>
                <input
                  type="email"
                  value={toEmail}
                  onChange={(e) => setToEmail(e.target.value)}
                  required
                  className="col-span-5 h-8.5 rounded-md border border-white/[0.08] bg-obsidian-950 px-3 text-xs text-slate-200 focus:border-brand-500/50 focus:outline-none"
                />
              </div>

              {/* Subject field */}
              <div className="grid grid-cols-6 items-center gap-3">
                <label className="text-right text-xs font-medium text-slate-400">
                  Subject:
                </label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="col-span-5 h-8.5 rounded-md border border-white/[0.08] bg-obsidian-950 px-3 text-xs text-slate-200 focus:border-brand-500/50 focus:outline-none font-medium"
                />
              </div>

              {/* Body textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Message Body (Editable)</span>
                  <span className="text-[11px] text-slate-500">
                    Auto-interpolates client &amp; requirement variables
                  </span>
                </div>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={9}
                  required
                  className="w-full rounded-lg border border-white/[0.08] bg-obsidian-950 p-3.5 font-mono text-xs text-slate-200 leading-relaxed focus:border-brand-500/50 focus:outline-none resize-none"
                />
              </div>

              {/* Footer CTA */}
              <div className="flex items-center justify-between border-t border-white/[0.08] pt-4">
                <div className="text-[11px] text-slate-500">
                  Sent as: <strong className="text-slate-300">{activeUser.name}</strong> (getmakerlyai@gmail.com)
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md border border-white/[0.08] px-3.5 py-1.5 text-xs text-slate-400 hover:bg-white/5 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="flex items-center gap-1.5 rounded-md bg-brand-600 px-4 py-1.5 text-xs font-semibold text-white transition-all hover:bg-brand-500 active:scale-95 disabled:opacity-50"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{isSending ? "Dispatching..." : "Send Email Now"}</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

