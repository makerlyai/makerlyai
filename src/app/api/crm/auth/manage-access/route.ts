import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/crm/supabase";

export const runtime = "nodejs";

function getMailTransporter() {
  const user = process.env.GMAIL_USER?.trim() || "getmakerlyai@gmail.com";
  const pass = process.env.GMAIL_APP_PASSWORD?.trim() || "zatxduufyirwtnpg";

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

// GET all access requests
export async function GET() {
  try {
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

// POST: Approve or Reject a partner
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = body?.email?.trim().toLowerCase();
    const action = body?.action; // 'approve' | 'reject' | 'revoke'

    if (!email || !action) {
      return NextResponse.json(
        { success: false, message: "Email and action are required." },
        { status: 400 }
      );
    }

    const newStatus = action === "approve" ? "approved" : action === "reject" ? "rejected" : "revoked";

    const { data: updatedUser, error } = await supabase
      .from("crm_authorized_users")
      .update({
        status: newStatus,
        approved_at: newStatus === "approved" ? new Date().toISOString() : null,
        approved_by: "Tousif Raza",
      })
      .eq("email", email)
      .select()
      .single();

    if (error || !updatedUser) {
      return NextResponse.json({ success: false, message: error?.message || "User not found." }, { status: 500 });
    }

    // If approved, send welcome email with sign-in instructions
    if (newStatus === "approved") {
      try {
        const { user: mailSender, transporter } = getMailTransporter();
        await transporter.sendMail({
          from: `"MakerlyAI CRM" <${mailSender}>`,
          to: email,
          subject: `MakerlyAI CRM • Partner Access Approved by Tousif Raza`,
          text: `Hello ${updatedUser.name},\n\nYour partner access request has been APPROVED by Tousif Raza.\n\nYou can now sign in to the MakerlyAI CRM at https://makerlyai.in/crm by requesting a 6-digit confirmation code.\n\nMakerly AI Team`,
          html: `
<div style="font-family: sans-serif; padding: 24px; border: 1px solid #e2e8f0; border-radius: 14px; max-width: 520px;">
  <h2 style="color: #0f172a; margin-top: 0;">Partner Access Approved 🎉</h2>
  <p>Hello <strong>${updatedUser.name}</strong>,</p>
  <p>Your request to access the <strong>MakerlyAI CRM</strong> has been approved by Tousif Raza.</p>
  <p>You can now sign in at any time with verified email confirmation:</p>
  <div style="text-align: center; margin: 24px 0;">
    <a href="https://makerlyai.in/crm" style="background-color: #1a4b9c; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
      Open MakerlyAI CRM ➔
    </a>
  </div>
  <p style="font-size: 12px; color: #64748b;">
    Sign-in URL: <a href="https://makerlyai.in/crm" style="color: #1a4b9c;">https://makerlyai.in/crm</a>
  </p>
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
      message: `Partner status updated to ${newStatus.toUpperCase()}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
