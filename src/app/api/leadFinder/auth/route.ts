import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { supabase } from "@/lib/crm/supabase";
import { isOwnerEmail } from "@/lib/crm/auth-constants";
import { sendSecurityOtpCode } from "@/lib/crm/mail-dispatcher";

export const runtime = "nodejs";

const SALT = process.env.CRM_AUTH_SALT || "makerlyai_leadfinder_security_salt_2026";
const CREDS_FILE = path.join(process.cwd(), ".sales-engine-owner-credentials.json");
const OTP_STORE_FILE = path.join(process.cwd(), ".sales-engine-otp-store.json");

function hashValue(val: string): string {
  return crypto.createHmac("sha256", SALT).update(val.trim()).digest("hex");
}

function loadOtpStore(): Record<string, { hash: string; expiresAt: number; purpose: string }> {
  try {
    if (fs.existsSync(OTP_STORE_FILE)) {
      return JSON.parse(fs.readFileSync(OTP_STORE_FILE, "utf-8"));
    }
  } catch {}
  return {};
}

function saveOtpStore(store: any) {
  try {
    fs.writeFileSync(OTP_STORE_FILE, JSON.stringify(store, null, 2), "utf-8");
  } catch (err: any) {
    console.error("[LeadFinder Auth] Error saving OTP store:", err.message);
  }
}

function loadOwnerCredentials(): { passwordHash?: string; updatedAt?: string } {
  try {
    if (fs.existsSync(CREDS_FILE)) {
      return JSON.parse(fs.readFileSync(CREDS_FILE, "utf-8"));
    }
  } catch {}
  return {};
}

function saveOwnerCredentials(creds: any) {
  try {
    fs.writeFileSync(CREDS_FILE, JSON.stringify(creds, null, 2), "utf-8");
  } catch (err: any) {
    console.error("[LeadFinder Auth] Error saving credentials:", err.message);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const action = body?.action;
    const email = body?.email?.trim().toLowerCase();

    // ─────────────────────────────────────────────────────────────
    // 1. Action: send_otp (For Login or Password Reset)
    // ─────────────────────────────────────────────────────────────
    if (action === "send_otp") {
      if (!email) {
        return NextResponse.json({ success: false, message: "Email is required." }, { status: 400 });
      }

      if (!isOwnerEmail(email)) {
        return NextResponse.json(
          { success: false, message: "Unauthorized. LeadFinder is strictly reserved for Tousif Raza (Owner)." },
          { status: 403 }
        );
      }

      // Generate 6-digit numeric OTP
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const codeHash = hashValue(code);
      const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

      // Save locally
      const store = loadOtpStore();
      store[email] = { hash: codeHash, expiresAt, purpose: body.purpose || "login" };
      saveOtpStore(store);

      // Also persist to Supabase crm_verification_codes if table exists
      try {
        await supabase.from("crm_verification_codes").insert({
          email,
          code_hash: codeHash,
          expires_at: new Date(expiresAt).toISOString(),
        });
      } catch {}

      // Dispatch security email to Tousif Raza
      const sendResult = await sendSecurityOtpCode({
        recipientEmail: email,
        recipientName: "Tousif Raza",
        code,
        isOwner: true,
      });

      if (!sendResult.success) {
        return NextResponse.json(
          { success: false, message: "Failed to dispatch email OTP. Please check mail server config." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Security authorization code sent to ${email}`,
        expiresInSeconds: 600,
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 2. Action: verify_otp (Login via OTP)
    // ─────────────────────────────────────────────────────────────
    if (action === "verify_otp") {
      const code = body?.code?.trim();
      if (!email || !code) {
        return NextResponse.json({ success: false, message: "Email and 6-digit code are required." }, { status: 400 });
      }

      if (!isOwnerEmail(email)) {
        return NextResponse.json({ success: false, message: "Unauthorized owner email." }, { status: 403 });
      }

      const store = loadOtpStore();
      const record = store[email];

      if (!record || record.expiresAt < Date.now()) {
        return NextResponse.json({ success: false, message: "Code expired or not found. Please request a new one." }, { status: 400 });
      }

      const inputHash = hashValue(code);
      if (inputHash !== record.hash) {
        return NextResponse.json({ success: false, message: "Invalid 6-digit code. Please verify and retry." }, { status: 400 });
      }

      // Valid OTP! Remove used OTP
      delete store[email];
      saveOtpStore(store);

      // Generate 30-day session token
      const sessionToken = "lf_sess_" + crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();

      try {
        await supabase.from("crm_sessions").insert({
          session_token: sessionToken,
          email,
          role: "owner",
          expires_at: expiresAt,
        });
      } catch {}

      const hasPassword = Boolean(loadOwnerCredentials().passwordHash);

      return NextResponse.json({
        success: true,
        sessionToken,
        user: {
          email,
          name: "Tousif Raza",
          role: "owner",
          badge: "LeadFinder Commander",
        },
        hasPassword,
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 3. Action: login_password (Login via Master Password)
    // ─────────────────────────────────────────────────────────────
    if (action === "login_password") {
      const password = body?.password?.trim();
      if (!email || !password) {
        return NextResponse.json({ success: false, message: "Email and password are required." }, { status: 400 });
      }

      if (!isOwnerEmail(email)) {
        return NextResponse.json({ success: false, message: "Unauthorized owner email." }, { status: 403 });
      }

      const creds = loadOwnerCredentials();
      if (!creds.passwordHash) {
        return NextResponse.json({
          success: false,
          needsSetup: true,
          message: "No password set yet. Please sign in via Email OTP to set your master password.",
        }, { status: 400 });
      }

      const inputHash = hashValue(password);
      if (inputHash !== creds.passwordHash) {
        return NextResponse.json({ success: false, message: "Incorrect master password." }, { status: 401 });
      }

      // Issue session token
      const sessionToken = "lf_sess_" + crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();

      try {
        await supabase.from("crm_sessions").insert({
          session_token: sessionToken,
          email,
          role: "owner",
          expires_at: expiresAt,
        });
      } catch {}

      return NextResponse.json({
        success: true,
        sessionToken,
        user: {
          email,
          name: "Tousif Raza",
          role: "owner",
          badge: "LeadFinder Commander",
        },
        hasPassword: true,
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 4. Action: set_or_reset_password (Set / Reset Password via OTP)
    // ─────────────────────────────────────────────────────────────
    if (action === "set_or_reset_password") {
      const { code, newPassword } = body;
      if (!email || !code || !newPassword) {
        return NextResponse.json(
          { success: false, message: "Email, 6-digit verification code, and new password are required." },
          { status: 400 }
        );
      }

      if (!isOwnerEmail(email)) {
        return NextResponse.json({ success: false, message: "Unauthorized owner email." }, { status: 403 });
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { success: false, message: "Password must be at least 8 characters for security." },
          { status: 400 }
        );
      }

      // Validate code
      const store = loadOtpStore();
      const record = store[email];

      if (!record || record.expiresAt < Date.now()) {
        return NextResponse.json(
          { success: false, message: "Verification code expired or not found. Please request a new code." },
          { status: 400 }
        );
      }

      const inputHash = hashValue(code);
      if (inputHash !== record.hash) {
        return NextResponse.json(
          { success: false, message: "Invalid verification code. Please check your email." },
          { status: 400 }
        );
      }

      // Save new password
      delete store[email];
      saveOtpStore(store);

      const passwordHash = hashValue(newPassword);
      saveOwnerCredentials({
        passwordHash,
        updatedAt: new Date().toISOString(),
        email,
      });

      // Issue fresh session
      const sessionToken = "lf_sess_" + crypto.randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + 30 * 86400000).toISOString();

      try {
        await supabase.from("crm_sessions").insert({
          session_token: sessionToken,
          email,
          role: "owner",
          expires_at: expiresAt,
        });
      } catch {}

      return NextResponse.json({
        success: true,
        message: "Master password successfully updated! You can now sign in using your password.",
        sessionToken,
        user: {
          email,
          name: "Tousif Raza",
          role: "owner",
          badge: "LeadFinder Commander",
        },
        hasPassword: true,
      });
    }

    // ─────────────────────────────────────────────────────────────
    // 5. Action: verify_session (Check if existing session is valid)
    // ─────────────────────────────────────────────────────────────
    if (action === "verify_session") {
      const sessionToken = body?.sessionToken;
      if (!sessionToken || !sessionToken.startsWith("lf_sess_")) {
        return NextResponse.json({ valid: false }, { status: 401 });
      }

      const creds = loadOwnerCredentials();
      return NextResponse.json({
        valid: true,
        user: {
          email: "tousif@makerlyai.in",
          name: "Tousif Raza",
          role: "owner",
          badge: "LeadFinder Commander",
        },
        hasPassword: Boolean(creds.passwordHash),
      });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    console.error("[LeadFinder Auth Error]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
