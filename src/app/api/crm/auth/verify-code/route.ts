import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/crm/supabase";
import type { AuthSession } from "@/lib/crm/auth-store";
import { isOwnerEmail } from "@/lib/crm/auth-constants";

export const runtime = "nodejs";

const SALT = process.env.CRM_AUTH_SALT || "makerlyai_supabase_crm_salt_2026";

function hashCode(code: string): string {
  return crypto.createHmac("sha256", SALT).update(code.trim()).digest("hex");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim().toLowerCase();
    const code = body?.code?.trim();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Email and 6-digit confirmation code are required." },
        { status: 400 }
      );
    }

    if (code.length !== 6 || !/^\d{6}$/.test(code)) {
      return NextResponse.json(
        { success: false, message: "Please enter a valid 6-digit numerical code." },
        { status: 400 }
      );
    }

    // 1. Verify user is in authorized users table and approved
    let { data: user, error: userError } = await supabase
      .from("crm_authorized_users")
      .select("*")
      .eq("email", email)
      .single();

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
      if (userError || !user || user.status !== "approved") {
        return NextResponse.json(
          {
            success: false,
            message: "Access Denied: This account is not authorized for CRM access.",
          },
          { status: 403 }
        );
      }
    }

    // 2. Fetch latest unused, unexpired code for this email
    const now = new Date().toISOString();
    const { data: authCodes, error: codeFetchError } = await supabase
      .from("crm_auth_codes")
      .select("*")
      .eq("email", email)
      .eq("used", false)
      .gt("expires_at", now)
      .order("created_at", { ascending: false })
      .limit(1);

    if (codeFetchError || !authCodes || authCodes.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No active verification code found or code has expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    const record = authCodes[0];

    // Check rate limiting / brute-force attempts
    if (record.attempts >= 4) {
      // Burn code on excess attempts
      await supabase.from("crm_auth_codes").update({ used: true }).eq("id", record.id);
      return NextResponse.json(
        {
          success: false,
          message: "Maximum verification attempts exceeded. Please request a new code.",
        },
        { status: 429 }
      );
    }

    const submittedHash = hashCode(code);

    if (submittedHash !== record.code_hash) {
      // Increment attempt count
      await supabase
        .from("crm_auth_codes")
        .update({ attempts: record.attempts + 1 })
        .eq("id", record.id);

      const remaining = 3 - record.attempts;
      return NextResponse.json(
        {
          success: false,
          message: `Invalid confirmation code. ${remaining > 0 ? `${remaining} attempts remaining.` : "Code locked."}`,
        },
        { status: 400 }
      );
    }

    // 3. Code is VALID: mark as used immediately (single-use enforcement)
    await supabase.from("crm_auth_codes").update({ used: true }).eq("id", record.id);

    // 4. Create cryptographically secure session in Supabase
    const sessionToken = "mkr_" + crypto.randomBytes(32).toString("hex");
    const sessionExpiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(); // 14 days

    const { error: sessionError } = await supabase.from("crm_sessions").insert({
      user_id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      session_token: sessionToken,
      expires_at: sessionExpiresAt,
    });

    if (sessionError) {
      console.error("[CRM Supabase Auth] Session insert error:", sessionError);
    }

    const session: AuthSession = {
      isAuthorized: true,
      email: user.email,
      name: user.name,
      role: user.role as "owner" | "partner",
      token: sessionToken,
      authorizedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      session,
      message: "Identity verified successfully. CRM unlocked.",
    });
  } catch (error: any) {
    console.error("[CRM Auth Verify] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Internal verification error.",
      },
      { status: 500 }
    );
  }
}
