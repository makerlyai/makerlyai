import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { supabase } from "@/lib/crm/supabase";
import { isOwnerEmail } from "@/lib/crm/auth-constants";
import { sendSecurityOtpCode } from "@/lib/crm/mail-dispatcher";

export const runtime = "nodejs";

const SALT = process.env.CRM_AUTH_SALT || "makerlyai_supabase_crm_salt_2026";

function hashCode(code: string): string {
  return crypto.createHmac("sha256", SALT).update(code.trim()).digest("hex");
}

function getMailTransporter() {
  const user = process.env.GMAIL_USER?.trim() || process.env.SMTP_USER?.trim() || process.env.EMAIL_TOUSIF_USER?.trim() || "tousif@makerlyai.in";
  const pass = process.env.GMAIL_APP_PASSWORD?.trim() || process.env.SMTP_PASSWORD?.trim() || process.env.EMAIL_TOUSIF_APP_PASSWORD?.trim();

  if (!pass) {
    throw new Error("GMAIL_APP_PASSWORD or SMTP_PASSWORD is not configured on the server.");
  }

  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT?.trim()) || 465;

  return {
    user,
    transporter: nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    }),
  };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email address is required." },
        { status: 400 }
      );
    }

    // STRICT OUTSIDER PROTECTION & OWNER GUARANTEE:
    // Check if user is in Supabase authorized users
    let { data: user, error: userError } = await supabase
      .from("crm_authorized_users")
      .select("*")
      .eq("email", email)
      .single();

    // If email is an authorized owner, auto-provision and ensure approved status
    if (isOwnerEmail(email)) {
      if (!user || user.status !== "approved" || user.role !== "owner") {
        const { data: upserted } = await supabase
          .from("crm_authorized_users")
          .upsert(
            {
              email,
              name: "Tousif Raza",
              role: "owner",
              status: "approved",
              approved_by: "system_owner",
            },
            { onConflict: "email" }
          )
          .select("*")
          .single();

        user = upserted || {
          email,
          name: "Tousif Raza",
          role: "owner",
          status: "approved",
        };
      }
    } else {
      if (userError || !user) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Access Denied: This email is not registered for CRM access. Please contact Tousif Raza or submit a Partner Access Request.",
          },
          { status: 403 }
        );
      }

      if (user.status !== "approved") {
        return NextResponse.json(
          {
            success: false,
            message: `Your access request is currently ${user.status.toUpperCase()}. Tousif Raza must approve your email before you can log in.`,
          },
          { status: 403 }
        );
      }
    }

    // Rate limit check: prevent rapid code spamming (minimum 45s between requests)
    const fortyFiveSecondsAgo = new Date(Date.now() - 45 * 1000).toISOString();
    const { data: recentCodes } = await supabase
      .from("crm_auth_codes")
      .select("created_at")
      .eq("email", email)
      .gt("created_at", fortyFiveSecondsAgo)
      .limit(1);

    if (recentCodes && recentCodes.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "A verification code was dispatched recently. Please wait 45 seconds before requesting another.",
        },
        { status: 429 }
      );
    }

    // Generate random 6-digit confirmation code
    const code = crypto.randomInt(100000, 999999).toString();
    const codeHash = hashCode(code);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Store in Supabase crm_auth_codes
    const { error: codeError } = await supabase.from("crm_auth_codes").insert({
      email,
      code_hash: codeHash,
      expires_at: expiresAt,
      attempts: 0,
      used: false,
    });

    if (codeError) {
      console.error("[CRM Supabase Auth] Failed to save code:", codeError);
      return NextResponse.json(
        { success: false, message: "Failed to initialize verification. Please try again." },
        { status: 500 }
      );
    }

    // Dispatch security verification email from security@makerlyai.in
    const isOwner = user.role === "owner" || isOwnerEmail(email);
    const sendResult = await sendSecurityOtpCode({
      recipientEmail: email,
      recipientName: user.name || "Tousif Raza",
      code,
      isOwner,
    });

    if (!sendResult.success) {
      console.warn("[CRM Auth] Security OTP send warning:", sendResult.error);
    }

    return NextResponse.json({
      success: true,
      message: `A 6-digit confirmation code has been dispatched to ${email}.`,
    });
  } catch (error: any) {
    console.error("[CRM Auth] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to dispatch verification email.",
      },
      { status: 500 }
    );
  }
}
