import { NextResponse } from "next/server";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limit";
import {
  sendCareersAutoReply,
  sendCareersApplicantNotification,
} from "@/lib/crm/mail-dispatcher";
import { supabase } from "@/lib/crm/supabase";

export const runtime = "nodejs";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitizeInput(str: unknown): string {
  if (typeof str !== "string") return "";
  return str.replace(/[<>]/g, "").trim();
}

export async function POST(request: Request) {
  try {
    // 1. Rate limiting (max 5 submissions per 10 minutes per IP)
    const ip = getClientIp(request);
    const rateCheck = checkRateLimit(`careers_apply_${ip}`, {
      limit: 5,
      windowSeconds: 600,
    });

    if (!rateCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Too many submissions. Please wait a few minutes before submitting another application.",
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              rateCheck.reset - Math.floor(Date.now() / 1000)
            ),
          },
        }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, message: "Invalid payload." },
        { status: 400 }
      );
    }

    const fullName = sanitizeInput(body.fullName);
    const email = sanitizeInput(body.email).toLowerCase();
    const phone = sanitizeInput(body.phone);
    const roleTitle = sanitizeInput(body.roleTitle) || "Engineering Pod";
    const experienceYears = sanitizeInput(body.experienceYears);
    const primaryTechStack = sanitizeInput(body.primaryTechStack);
    const githubUrl = sanitizeInput(body.githubUrl);
    const liveProjectUrl = sanitizeInput(body.liveProjectUrl);
    const portfolioUrl = sanitizeInput(body.portfolioUrl);
    const resumeUrl = sanitizeInput(body.resumeUrl);
    const hardestProblem = sanitizeInput(body.hardestProblem);
    const availability = sanitizeInput(body.availability);
    const expectedSalary = sanitizeInput(body.expectedSalary);

    // 2. Validate required candidate fields
    if (
      !fullName ||
      !email ||
      !phone ||
      !experienceYears ||
      !primaryTechStack ||
      !githubUrl ||
      !liveProjectUrl ||
      !resumeUrl ||
      !hardestProblem ||
      !availability ||
      !expectedSalary
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please fill in all required questions including Proof of Work links, Tech Stack, and Technical Problem solved.",
        },
        { status: 400 }
      );
    }

    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // 3. Save candidate data into Supabase CRM Leads
    try {
      const notes = [
        `ROLE APPLIED: ${roleTitle}`,
        `EXPERIENCE: ${experienceYears}`,
        `AVAILABILITY: ${availability}`,
        `EXPECTED COMPENSATION: ${expectedSalary}`,
        `GITHUB: ${githubUrl}`,
        `LIVE PROJECT: ${liveProjectUrl}`,
        portfolioUrl ? `PORTFOLIO / LINKEDIN: ${portfolioUrl}` : null,
        `RESUME LINK: ${resumeUrl}`,
        `PRIMARY TECH STACK: ${primaryTechStack}`,
        `HARDEST PROBLEM SOLVED:\n${hardestProblem}`,
        `SUBMITTED AT: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST`,
      ]
        .filter(Boolean)
        .join("\n");

      await supabase.from("crm_leads").insert({
        client_name: fullName,
        phone,
        email,
        business_name: `Candidate: ${roleTitle}`,
        requirement: `[JOB APPLICATION] ${roleTitle} (${experienceYears}) | GitHub: ${githubUrl} | Live Demo: ${liveProjectUrl}`,
        notes,
        status: "new",
        source: "Careers Portal",
        created_at: new Date().toISOString(),
      });
    } catch (dbErr) {
      console.warn("[Careers Apply] Non-fatal Supabase lead insert warning:", dbErr);
    }

    // 4. Send dual transactional notifications
    // A) Immediate automated acknowledgment to applicant from careers@makerlyai.in
    const autoReplyPromise = sendCareersAutoReply({
      applicantName: fullName,
      applicantEmail: email,
      roleTitle,
    });

    // B) Direct candidate alert email to Tousif Raza with full proof-of-work dossier
    const notificationPromise = sendCareersApplicantNotification({
      fullName,
      email,
      phone,
      roleTitle,
      experienceYears,
      primaryTechStack,
      githubUrl,
      liveProjectUrl,
      portfolioUrl,
      resumeUrl,
      hardestProblem,
      availability,
      expectedSalary,
    });

    await Promise.allSettled([autoReplyPromise, notificationPromise]);

    return NextResponse.json(
      {
        success: true,
        message:
          "Your application and proof of work have been successfully received. Founder Tousif Raza reviews all submissions within 48 hours.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("[Careers Apply] Unexpected submission error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "We encountered an issue submitting your application. Please email your details directly to careers@makerlyai.in.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
