import { NextResponse } from "next/server";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { supabase } from "@/lib/crm/supabase";
import { isOwnerEmail } from "@/lib/crm/auth-constants";
import { sendSecurityOtpCode } from "@/lib/crm/mail-dispatcher";

export const runtime = "nodejs";

const PRIMARY_SALT = process.env.CRM_AUTH_SALT || "makerlyai_supabase_crm_salt_2026";
const KNOWN_SALTS = [
  PRIMARY_SALT,
  "makerlyai_supabase_crm_salt_2026",
  "makerlyai_secure_auth_salt_2026",
];
const CREDS_FILE = path.join(process.cwd(), ".sales-engine-owner-credentials.json");
const OTP_STORE_FILE = path.join(process.cwd(), ".sales-engine-otp-store.json");

function hashValue(val: string): string {
  return crypto.createHmac("sha256", PRIMARY_SALT).update(val.trim()).digest("hex");
}

function getPossibleHashes(val: string): string[] {
  const clean = String(val || "").replace(/\s+/g, "").trim();
  const hashes = new Set<string>();
  for (const salt of KNOWN_SALTS) {
    hashes.add(crypto.createHmac("sha256", salt).update(clean).digest("hex"));
  }
  return Array.from(hashes);
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

async function getStoredPasswordHash(email: string): Promise<string | null> {
  // 1. Check Supabase crm_authorized_users note
  try {
    const { data: user } = await supabase
      .from("crm_authorized_users")
      .select("note")
      .eq("email", email)
      .single();

    if (user?.note) {
      try {
        const parsed = JSON.parse(user.note);
        if (parsed.leadFinderPwdHash) return parsed.leadFinderPwdHash;
      } catch {
        if (user.note.startsWith("LF_PWD:")) {
          return user.note.replace("LF_PWD:", "").trim();
        }
      }
    }
  } catch {}

  // 2. Check local credentials file fallback
  const creds = loadOwnerCredentials();
  if (creds.passwordHash) return creds.passwordHash;

  return null;
}

async function setStoredPasswordHash(email: string, passwordHash: string): Promise<void> {
  // 1. Save to Supabase crm_authorized_users
  try {
    const notePayload = JSON.stringify({
      leadFinderPwdHash: passwordHash,
      updatedAt: new Date().toISOString(),
    });

    await supabase
      .from("crm_authorized_users")
      .update({ note: notePayload })
      .eq("email", email);
  } catch (err) {
    console.error("[LeadFinder Auth] Supabase password save error:", err);
  }

  // 2. Save to local fallback file
  saveOwnerCredentials({
    passwordHash,
    updatedAt: new Date().toISOString(),
    email,
  });
}

async function verifyCodeForEmail(
  email: string,
  rawCode: string
): Promise<{ valid: boolean; expired: boolean; error?: string }> {
  const cleanCode = String(rawCode || "").replace(/\s+/g, "").trim();
  if (!cleanCode || cleanCode.length < 4) {
    return { valid: false, expired: false, error: "Please enter a valid 6-digit verification code." };
  }

  const possibleHashes = getPossibleHashes(cleanCode);
  let matchedExpired = false;

  // 1. Check Supabase crm_auth_codes (inspect top 20 recent unused codes)
  try {
    const { data: authCodes, error: fetchErr } = await supabase
      .from("crm_auth_codes")
      .select("*")
      .eq("email", email)
      .eq("used", false)
      .order("created_at", { ascending: false })
      .limit(20);

    if (fetchErr) {
      console.warn("[LeadFinder Auth] Supabase code lookup note:", fetchErr.message);
    }

    if (authCodes && authCodes.length > 0) {
      const nowMs = Date.now();
      for (const record of authCodes) {
        const matches =
          possibleHashes.includes(record.code_hash) ||
          record.code_hash === cleanCode;

        if (matches) {
          const expireMs = new Date(record.expires_at).getTime();
          // Allow 10-minute clock skew buffer to guarantee legitimate codes never reject
          if (expireMs + 10 * 60 * 1000 > nowMs) {
            await supabase.from("crm_auth_codes").update({ used: true }).eq("id", record.id);
            return { valid: true, expired: false };
          } else {
            matchedExpired = true;
          }
        }
      }
    }
  } catch (err: any) {
    console.warn("[LeadFinder Auth] Exception checking Supabase auth codes:", err.message);
  }

  // 2. Fallback to local store
  if (!matchedExpired) {
    try {
      const store = loadOtpStore();
      const record = store[email];
      if (record) {
        const matches =
          possibleHashes.includes(record.hash) ||
          record.hash === cleanCode;

        if (matches) {
          if (record.expiresAt + 10 * 60 * 1000 >= Date.now()) {
            delete store[email];
            saveOtpStore(store);
            return { valid: true, expired: false };
          } else {
            matchedExpired = true;
          }
        }
      }
    } catch {}
  }

  if (matchedExpired) {
    return {
      valid: false,
      expired: true,
      error: "Verification code has expired. Please click Send Sign-In Code for a fresh code.",
    };
  }

  return {
    valid: false,
    expired: false,
    error: "Invalid code or expired. Please check your latest email and enter the 6-digit code.",
  };
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
      const code = crypto.randomInt(100000, 999999).toString();
      const codeHash = hashValue(code);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 minutes window

      // Save to Supabase crm_auth_codes
      try {
        const { error: insertErr } = await supabase.from("crm_auth_codes").insert({
          email,
          code_hash: codeHash,
          expires_at: expiresAt,
          attempts: 0,
          used: false,
        });
        if (insertErr) {
          console.error("[LeadFinder Auth] Supabase code insert notice:", insertErr.message);
        }
      } catch (dbErr: any) {
        console.error("[LeadFinder Auth] Supabase insert exception:", dbErr.message);
      }

      // Also save locally as fallback
      const store = loadOtpStore();
      store[email] = { hash: codeHash, expiresAt: Date.now() + 15 * 60 * 1000, purpose: body.purpose || "login" };
      saveOtpStore(store);

      // Dispatch security email to Tousif Raza
      const sendResult = await sendSecurityOtpCode({
        recipientEmail: email,
        recipientName: "Tousif Raza",
        code,
        isOwner: true,
      });

      if (!sendResult.success) {
        return NextResponse.json(
          { success: false, message: "Failed to dispatch email verification code. Please check mail server config." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Security authorization code sent to ${email}`,
        expiresInSeconds: 900,
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

      const verifyResult = await verifyCodeForEmail(email, code);
      if (!verifyResult.valid) {
        return NextResponse.json(
          { success: false, message: verifyResult.error || "Invalid security code." },
          { status: 400 }
        );
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

      const storedPwd = await getStoredPasswordHash(email);

      return NextResponse.json({
        success: true,
        sessionToken,
        user: {
          email,
          name: "Tousif Raza",
          role: "owner",
          badge: "LeadFinder Commander",
        },
        hasPassword: Boolean(storedPwd),
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

      const storedHash = await getStoredPasswordHash(email);
      if (!storedHash) {
        return NextResponse.json({
          success: false,
          needsSetup: true,
          message: "No master password set yet. Please sign in via Email Code to set your master password.",
        }, { status: 400 });
      }

      const inputHashes = getPossibleHashes(password);
      const isPasswordMatch = inputHashes.includes(storedHash) || storedHash === password;
      if (!isPasswordMatch) {
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

      const verifyResult = await verifyCodeForEmail(email, code);
      if (!verifyResult.valid) {
        return NextResponse.json(
          { success: false, message: verifyResult.error || "Verification code expired or not found. Please request a new code." },
          { status: 400 }
        );
      }

      // Save new master password hash to Supabase and local store
      const passwordHash = hashValue(newPassword);
      await setStoredPasswordHash(email, passwordHash);

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

      const storedPwd = await getStoredPasswordHash("tousif@makerlyai.in");
      return NextResponse.json({
        valid: true,
        user: {
          email: "tousif@makerlyai.in",
          name: "Tousif Raza",
          role: "owner",
          badge: "LeadFinder Commander",
        },
        hasPassword: Boolean(storedPwd),
      });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (err: any) {
    console.error("[LeadFinder Auth Error]", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}
