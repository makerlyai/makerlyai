"use client";

import { FormEvent, ChangeEvent, useState } from "react";

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
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
      setErrorMessage("Please enter a valid email address.");
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
      setSuccessMessage(
        data.message || "Thanks for reaching out. We will get back to you soon.",
      );
    } catch (error) {
      console.error("Failed to submit contact form.", error);
      setErrorMessage("A network error occurred. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="pl-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#EDE8DF]/70"
          >
            Full Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            autoComplete="name"
            placeholder="Jane Smith"
            className="w-full rounded-2xl border border-white/10 bg-[#EDE8DF] px-4 py-3 text-sm text-[#1a1a2e] outline-none transition focus:border-[#2952CC] focus:ring-2 focus:ring-[#2952CC]/30 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="pl-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#EDE8DF]/70"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            disabled={isSubmitting}
            autoComplete="email"
            placeholder="jane@company.com"
            className="w-full rounded-2xl border border-white/10 bg-[#EDE8DF] px-4 py-3 text-sm text-[#1a1a2e] outline-none transition focus:border-[#2952CC] focus:ring-2 focus:ring-[#2952CC]/30 disabled:cursor-not-allowed disabled:opacity-70"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="phone"
          className="pl-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#EDE8DF]/70"
        >
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          autoComplete="tel"
          placeholder="+1 (555) 123-4567"
          className="w-full rounded-2xl border border-white/10 bg-[#EDE8DF] px-4 py-3 text-sm text-[#1a1a2e] outline-none transition focus:border-[#2952CC] focus:ring-2 focus:ring-[#2952CC]/30 disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="projectDetails"
          className="pl-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#EDE8DF]/70"
        >
          Project Details
        </label>
        <textarea
          id="projectDetails"
          name="projectDetails"
          value={formData.projectDetails}
          onChange={handleChange}
          required
          disabled={isSubmitting}
          rows={6}
          placeholder="Tell us about the product, goals, timeline, and anything else we should know."
          className="w-full resize-none rounded-3xl border border-white/10 bg-[#EDE8DF] px-4 py-3 text-sm text-[#1a1a2e] outline-none transition focus:border-[#2952CC] focus:ring-2 focus:ring-[#2952CC]/30 disabled:cursor-not-allowed disabled:opacity-70"
        />
      </div>

      {(successMessage || errorMessage) && (
        <div
          className={`rounded-2xl border px-4 py-3 text-sm ${
            successMessage
              ? "border-[#2952CC]/40 bg-[#2952CC]/15 text-[#EDE8DF]"
              : "border-red-400/40 bg-red-500/10 text-red-100"
          }`}
          role={successMessage ? "status" : "alert"}
        >
          {successMessage || errorMessage}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#2952CC] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#2144ab] focus:outline-none focus:ring-2 focus:ring-[#2952CC]/40 focus:ring-offset-2 focus:ring-offset-[#1a1a2e] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Sending Request..." : "Start Your Project"}
      </button>
    </form>
  );
}
