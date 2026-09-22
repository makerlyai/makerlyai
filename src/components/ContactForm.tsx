"use client";

import { FormEvent, ChangeEvent, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, Send, ShieldCheck, Lock } from "lucide-react";

type ContactFormState = {
  name: string;
  email: string;
  phone: string;
  projectDetails: string;
};

type ContactApiResponse = {
  success: boolean;
  message: string;
  results?: {
    notion: boolean;
    adminEmail: boolean;
    clientEmail: boolean;
  };
};

const INITIAL_FORM_STATE: ContactFormState = {
  name: "",
  email: "",
  phone: "",
  projectDetails: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormState>(INITIAL_FORM_STATE);
  const [touched, setTouched] = useState<Record<keyof ContactFormState, boolean>>({
    name: false,
    email: false,
    phone: false,
    projectDetails: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
    if (errorMessage) setErrorMessage("");
  };

  const handleBlur = (field: keyof ContactFormState) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const isEmailValid = EMAIL_PATTERN.test(formData.email.trim());
  const isNameValid = formData.name.trim().length >= 2;
  const isPhoneValid = formData.phone.trim().length >= 7;
  const isDetailsValid = formData.projectDetails.trim().length >= 10;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setTouched({
      name: true,
      email: true,
      phone: true,
      projectDetails: true,
    });

    const trimmedFormData: ContactFormState = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      projectDetails: formData.projectDetails.trim(),
    };

    if (
      !trimmedFormData.name ||
      !trimmedFormData.email ||
      !trimmedFormData.phone ||
      !trimmedFormData.projectDetails
    ) {
      setSuccessMessage("");
      setErrorMessage("Please complete every field before submitting.");
      return;
    }

    if (!EMAIL_PATTERN.test(trimmedFormData.email)) {
      setSuccessMessage("");
      setErrorMessage("Please enter a valid work email address.");
      return;
    }

    setIsSubmitting(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(trimmedFormData),
      });

      const data = (await response.json()) as ContactApiResponse;

      if (!response.ok || !data.success) {
        setErrorMessage(
          data.message || "We could not submit your request. Please try again.",
        );
        return;
      }

      setFormData(INITIAL_FORM_STATE);
      setTouched({
        name: false,
        email: false,
        phone: false,
        projectDetails: false,
      });
      setSuccessMessage(
        data.message || "Thank you! Your project brief has been received. Tousif Raza will review and respond within 24 hours.",
      );
    } catch (error) {
      console.error("Failed to submit contact form.", error);
      setErrorMessage("A network error occurred. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successMessage) {
    return (
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-8 sm:p-10 text-center backdrop-blur-md">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2">Project Brief Received</h3>
        <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed mb-6">
          {successMessage}
        </p>
        <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-300 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 mb-8">
          <ShieldCheck className="w-4 h-4" />
          <span>Stage 1 Preview Review Guaranteed</span>
        </div>
        <div>
          <button
            type="button"
            onClick={() => setSuccessMessage("")}
            className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all"
          >
            Send Another Inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Full Name Field */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between pl-1">
            <label
              htmlFor="name"
              className="text-xs font-semibold uppercase tracking-[0.24em] text-[#EDE8DF]/70"
            >
              Full Name *
            </label>
            {touched.name && (
              <span className={`text-[10px] font-mono ${isNameValid ? "text-emerald-400" : "text-rose-400"}`}>
                {isNameValid ? "✓ Valid" : "Name required"}
              </span>
            )}
          </div>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            onBlur={() => handleBlur("name")}
            required
            disabled={isSubmitting}
            autoComplete="name"
            placeholder="Jane Smith"
            className={`w-full rounded-2xl border bg-[#EDE8DF] px-4 py-3 text-sm text-[#1a1a2e] outline-none transition disabled:cursor-not-allowed disabled:opacity-70 ${
              touched.name && !isNameValid
                ? "border-rose-400 ring-2 ring-rose-400/20"
                : "border-white/10 focus:border-[#2952CC] focus:ring-2 focus:ring-[#2952CC]/30"
            }`}
          />
        </div>

        {/* Email Field */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between pl-1">
            <label
              htmlFor="email"
              className="text-xs font-semibold uppercase tracking-[0.24em] text-[#EDE8DF]/70"
            >
              Work Email *
            </label>
            {touched.email && (
              <span className={`text-[10px] font-mono ${isEmailValid ? "text-emerald-400" : "text-rose-400"}`}>
                {isEmailValid ? "✓ Valid" : "Valid email required"}
              </span>
            )}
          </div>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={() => handleBlur("email")}
            required
            disabled={isSubmitting}
            autoComplete="email"
            placeholder="jane@company.com"
            className={`w-full rounded-2xl border bg-[#EDE8DF] px-4 py-3 text-sm text-[#1a1a2e] outline-none transition disabled:cursor-not-allowed disabled:opacity-70 ${
              touched.email && !isEmailValid
                ? "border-rose-400 ring-2 ring-rose-400/20"
                : "border-white/10 focus:border-[#2952CC] focus:ring-2 focus:ring-[#2952CC]/30"
            }`}
          />
        </div>
      </div>

      {/* Phone Field */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between pl-1">
          <label
            htmlFor="phone"
            className="text-xs font-semibold uppercase tracking-[0.24em] text-[#EDE8DF]/70"
          >
            Phone / WhatsApp *
          </label>
          {touched.phone && (
            <span className={`text-[10px] font-mono ${isPhoneValid ? "text-emerald-400" : "text-rose-400"}`}>
              {isPhoneValid ? "✓ Valid" : "Valid phone required"}
            </span>
          )}
        </div>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          onBlur={() => handleBlur("phone")}
          required
          disabled={isSubmitting}
          autoComplete="tel"
          placeholder="+1 (555) 123-4567 or +91 98765 43210"
          className={`w-full rounded-2xl border bg-[#EDE8DF] px-4 py-3 text-sm text-[#1a1a2e] outline-none transition disabled:cursor-not-allowed disabled:opacity-70 ${
            touched.phone && !isPhoneValid
              ? "border-rose-400 ring-2 ring-rose-400/20"
              : "border-white/10 focus:border-[#2952CC] focus:ring-2 focus:ring-[#2952CC]/30"
          }`}
        />
      </div>

      {/* Project Details Field */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between pl-1">
          <label
            htmlFor="projectDetails"
            className="text-xs font-semibold uppercase tracking-[0.24em] text-[#EDE8DF]/70"
          >
            Project Details &amp; Scope *
          </label>
          {touched.projectDetails && (
            <span className={`text-[10px] font-mono ${isDetailsValid ? "text-emerald-400" : "text-rose-400"}`}>
              {isDetailsValid ? "✓ Good details" : "Please share brief scope"}
            </span>
          )}
        </div>
        <textarea
          id="projectDetails"
          name="projectDetails"
          value={formData.projectDetails}
          onChange={handleChange}
          onBlur={() => handleBlur("projectDetails")}
          required
          disabled={isSubmitting}
          rows={5}
          placeholder="Tell us about the SaaS, AI agent, or app you want to build. What are your key milestones and target launch date?"
          className={`w-full resize-none rounded-3xl border bg-[#EDE8DF] px-4 py-3 text-sm text-[#1a1a2e] outline-none transition disabled:cursor-not-allowed disabled:opacity-70 ${
            touched.projectDetails && !isDetailsValid
              ? "border-rose-400 ring-2 ring-rose-400/20"
              : "border-white/10 focus:border-[#2952CC] focus:ring-2 focus:ring-[#2952CC]/30"
          }`}
        />
      </div>

      {errorMessage && (
        <div
          className="rounded-2xl border border-rose-400/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-200 flex items-center gap-2"
          role="alert"
        >
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Submit Button & Privacy Trust Note */}
      <div className="space-y-3 pt-2">
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#2952CC] hover:bg-[#2144ab] px-7 py-3.5 text-sm font-bold text-white transition focus:outline-none focus:ring-2 focus:ring-[#2952CC]/40 focus:ring-offset-2 focus:ring-offset-[#1a1a2e] disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer shadow-lg shadow-brand-blue/30"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Transmitting Project Brief...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Start Your Project</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 text-center">
          <Lock className="w-3 h-3 text-slate-500" />
          <span>
            We respect your privacy — see our{" "}
            <Link href="/privacy-policy" className="underline hover:text-white transition-colors">
              Privacy Policy
            </Link>
            . Protected by mutual NDA upon request.
          </span>
        </div>
      </div>
    </form>
  );
}
