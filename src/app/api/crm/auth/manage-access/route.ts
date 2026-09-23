import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/crm/supabase";

export const runtime = "nodejs";

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

async function verifyOwnerSession(request: Request): Promise<{ authorized: boolean; email?: string; error?: string }> {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authorized: false, error: "Unauthorized: Missing authentication credentials." };
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return { authorized: false, error: "Unauthorized: Empty authentication token." };
  }

  const now = new Date().toISOString();
  const { data: session, error } = await supabase
    .from("crm_sessions")
    .select("*")
    .eq("session_token", token)
    .gt("expires_at", now)
    .single();

  if (error || !session) {
    return { authorized: false, error: "Unauthorized: Invalid or expired session." };
  }

  if (session.role !== "owner") {
    return { authorized: false, error: "Forbidden: Owner permissions required to manage access." };
  }

  return { authorized: true, email: session.email };
}

// GET: Fetch all authorized users & access requests from Supabase (Owner only)
export async function GET(request: Request) {
  try {
    const auth = await verifyOwnerSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.error }, { status: 401 });
    }

    const { data: users, error } = await supabase
      .from("crm_authorized_users")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// POST: Add, Approve, Revoke, or Delete authorized emails (Owner only)
export async function POST(request: Request) {
  try {
    const auth = await verifyOwnerSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, message: auth.error }, { status: 401 });
    }

    const body = await request.json();
    const email = body?.email?.trim().toLowerCase();
    const action = body?.action; // 'add' | 'approve' | 'reject' | 'revoke' | 'delete'
    const name = body?.name?.trim() || (email ? email.split("@")[0] : "User");
    const role = body?.role === "owner" ? "owner" : "partner";
    const organization = body?.organization?.trim() || null;
    const note = body?.note?.trim() || null;

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email address is required." },
        { status: 400 }
      );
    }

    const { user: mailSender, transporter } = getMailTransporter();

    // ACTION: ADD DIRECTLY TO WHITELIST
    if (action === "add") {
      const { data: newUser, error: addError } = await supabase
        .from("crm_authorized_users")
        .upsert(
          {
            email,
            name,
            role,
            status: "approved",
            organization,
            note: note || "Pre-approved by Tousif Raza",
            approved_at: new Date().toISOString(),
            approved_by: "Tousif Raza",
          },
          { onConflict: "email" }
        )
        .select()
        .single();

      if (addError || !newUser) {
        console.error("[Manage Access Add Error]:", addError);
        return NextResponse.json(
          { success: false, message: addError?.message || "Failed to authorize email." },
          { status: 500 }
        );
      }

      // Send email invitation to the authorized user
      try {
        await transporter.sendMail({
          from: `"MakerlyAI Security" <${mailSender}>`,
          to: email,
          subject: `MakerlyAI CRM • You have been authorized by Tousif Raza`,
          text: `Hello ${name},\n\nTousif Raza has approved your email (${email}) to access the MakerlyAI Lead Management System (CRM).\n\nYou can now log in by requesting a 6-digit confirmation code at: https://makerlyai.in/crm\n\nMakerly AI Team`,
          html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; max-width: 520px; background-color: #ffffff;">
  <div style="display: inline-block; padding: 8px 12px; background-color: #efe7d1; border-radius: 8px; margin-bottom: 12px;">
    <strong style="color: #1a4b9c;">MakerlyAI</strong>
  </div>
  <h2 style="color: #0f172a; margin-top: 0; font-size: 20px;">CRM Access Approved</h2>
  <p style="color: #334155; font-size: 14px; line-height: 1.6;">
    Hello <strong>${name}</strong>,<br/><br/>
    <strong>Tousif Raza</strong> has added your email (<span style="font-family: monospace; font-weight: 600;">${email}</span>) to the <strong>MakerlyAI CRM Authorization Whitelist</strong>.
  </p>
  <div style="margin: 24px 0; text-align: center;">
    <a href="https://makerlyai.in/crm" style="background-color: #1a4b9c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block; font-size: 14px;">
      Sign in to MakerlyAI CRM ➔
    </a>
  </div>
  <p style="font-size: 12px; color: #64748b; line-height: 1.5;">
    To sign in, visit <a href="https://makerlyai.in/crm" style="color: #1a4b9c;">makerlyai.in/crm</a>, enter this email, and you will receive a secure 6-digit verification code.
  </p>
</div>
`,
        });
      } catch (err) {
        console.warn("[Manage Access] Notice email warning:", err);
      }

      return NextResponse.json({
        success: true,
        user: newUser,
        message: `${email} has been pre-approved and added to the whitelist.`,
      });
    }

    // ACTION: DELETE FROM WHITELIST
    if (action === "delete" || action === "remove") {
      // Prevent deleting the owner
      if (email === "iamtousifraza@gmail.com" || email === "getmakerlyai@gmail.com") {
        return NextResponse.json(
          { success: false, message: "Primary owner account cannot be deleted." },
          { status: 400 }
        );
      }

      const { error: delError } = await supabase
        .from("crm_authorized_users")
        .delete()
        .eq("email", email);

      // Invalidate active sessions
      await supabase.from("crm_sessions").delete().eq("email", email);

      if (delError) {
        return NextResponse.json(
          { success: false, message: delError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `${email} has been removed from the whitelist.`,
      });
    }

    // ACTION: APPROVE / REJECT / REVOKE
    const newStatus =
      action === "approve"
        ? "approved"
        : action === "reject"
        ? "rejected"
        : "revoked";

    const { data: updatedUser, error: updateError } = await supabase
      .from("crm_authorized_users")
      .update({
        status: newStatus,
        approved_at: newStatus === "approved" ? new Date().toISOString() : null,
        approved_by: "Tousif Raza",
      })
      .eq("email", email)
      .select()
      .single();

    if (updateError || !updatedUser) {
      return NextResponse.json(
        { success: false, message: updateError?.message || "User not found." },
        { status: 500 }
      );
    }

    // If revoked or rejected, terminate any existing session
    if (newStatus !== "approved") {
      await supabase.from("crm_sessions").delete().eq("email", email);
    } else {
      // Send approval confirmation email
      try {
        await transporter.sendMail({
          from: `"MakerlyAI CRM" <${mailSender}>`,
          to: email,
          subject: `MakerlyAI CRM • Partner Access Approved by Tousif Raza`,
          text: `Hello ${updatedUser.name},\n\nYour partner access request has been APPROVED by Tousif Raza.\n\nYou can now sign in at https://makerlyai.in/crm with email confirmation.\n\nMakerly AI Team`,
          html: `
<div style="font-family: sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; max-width: 520px;">
  <h2 style="color: #0f172a; margin-top: 0;">Partner Access Approved 🎉</h2>
  <p>Hello <strong>${updatedUser.name}</strong>,</p>
  <p>Your request to access the <strong>MakerlyAI CRM</strong> has been approved by Tousif Raza.</p>
  <div style="text-align: center; margin: 24px 0;">
    <a href="https://makerlyai.in/crm" style="background-color: #1a4b9c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
      Open MakerlyAI CRM ➔
    </a>
  </div>
</div>
`,
        });
      } catch (mailErr) {
        console.warn("[Manage Access] Approval mail warning:", mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `Status updated to ${newStatus.toUpperCase()}.`,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error?.message || "Server error." },
      { status: 500 }
    );
  }
}
