import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { supabase } from "@/lib/crm/supabase";

export const runtime = "nodejs";

const SALT = process.env.CRM_AUTH_SALT || "makerlyai_supabase_crm_salt_2026";

function hashCode(code: string): string {
  return crypto.createHmac("sha256", SALT).update(code.trim()).digest("hex");
}

function getMailTransporter() {
  const user = process.env.GMAIL_USER?.trim() || "getmakerlyai@gmail.com";
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();

  if (!pass) {
    throw new Error("GMAIL_APP_PASSWORD is not configured on the server.");
  }

  return {
    user,
    transporter: nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
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

    // STRICT OUTSIDER PROTECTION:
    // Check if user is in Supabase authorized users and approved.
    const { data: user, error: userError } = await supabase
      .from("crm_authorized_users")
      .select("*")
      .eq("email", email)
      .single();

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

    // Dispatch email via Gmail SMTP
    const { user: mailSender, transporter } = getMailTransporter();
    const isOwner = user.role === "owner";

    const subject = isOwner
      ? `MakerlyAI CRM • Owner Authorization Code: ${code}`
      : `MakerlyAI CRM • Partner Authorization Code: ${code}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
          <tr>
            <td style="padding: 28px 32px 20px; text-align: center; border-bottom: 1px solid #f1f5f9; background-color: #ffffff;">
              <div style="display: inline-block; padding: 10px 14px; background-color: #efe7d1; border-radius: 12px; margin-bottom: 12px;">
                <span style="font-size: 18px; font-weight: 800; color: #1a4b9c; letter-spacing: -0.5px;">MakerlyAI</span>
              </div>
              <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #0f172a; letter-spacing: -0.02em;">
                ${isOwner ? "Owner CRM Security Verification" : "Partner CRM Access Code"}
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #64748b;">
                Authorized Lead Management System • makerlyai.in/crm
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #334155;">
                Hello <strong>${user.name}</strong>,
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #334155;">
                A secure sign-in request was initiated for your authorized account (<span style="font-family: monospace; color: #1e293b; font-weight: 600;">${email}</span>).
              </p>
              <div style="background-color: #f1f5f9; border: 1.5px dashed #94a3b8; border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 24px;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; color: #64748b; font-weight: 700; margin-bottom: 8px;">
                  Your 6-Digit Authorization Code
                </div>
                <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 0.3em; color: #1a4b9c;">
                  ${code}
                </div>
                <div style="margin-top: 8px; font-size: 11px; color: #94a3b8;">
                  Valid for 10 minutes • Single-use only • Do not share
                </div>
              </div>
              <p style="margin: 0 0 8px; font-size: 13px; line-height: 1.5; color: #64748b;">
                Please enter this code on the CRM sign-in screen to complete email verification.
              </p>
              <p style="margin: 0; font-size: 12px; line-height: 1.5; color: #94a3b8;">
                If you did not request this authorization code, you can safely ignore this email. No access will be granted without this code.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 20px 32px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="margin: 0; font-size: 11px; color: #94a3b8;">
                © 2026 Makerly AI • Big Tech for small business • <a href="https://makerlyai.in" style="color: #1a4b9c; text-decoration: none;">makerlyai.in</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

    await transporter.sendMail({
      from: `"MakerlyAI Security" <${mailSender}>`,
      to: email,
      subject,
      text: `Hello ${user.name},\n\nYour MakerlyAI CRM 6-digit authorization code is: ${code}\n\nValid for 10 minutes.\n\nMakerly AI Team`,
      html,
    });

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
