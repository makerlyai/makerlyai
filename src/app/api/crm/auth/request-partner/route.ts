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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = body?.name?.toString().trim().slice(0, 80);
    const email = body?.email?.toString().trim().toLowerCase().slice(0, 100);
    const organization = body?.organization ? body.organization.toString().trim().slice(0, 100) : null;
    const note = body?.note ? body.note.toString().trim().slice(0, 500) : null;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, message: "Full name and email are required." },
        { status: 400 }
      );
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const { data: existing } = await supabase
      .from("crm_authorized_users")
      .select("*")
      .eq("email", email)
      .single();

    if (existing) {
      if (existing.status === "approved") {
        return NextResponse.json({
          success: true,
          status: "approved",
          message: "Your email is already approved! Please sign in using the Email Code tab.",
        });
      }
      return NextResponse.json({
        success: true,
        status: existing.status,
        message: `Your request is currently ${existing.status.toUpperCase()}. Tousif Raza has been notified.`,
      });
    }

    // Insert new pending partner
    const { error: insertError } = await supabase.from("crm_authorized_users").insert({
      email,
      name,
      role: "partner",
      status: "pending",
      organization,
      note,
    });

    if (insertError) {
      console.error("[CRM Partner Request] Insert error:", insertError);
      return NextResponse.json(
        { success: false, message: "Failed to submit request. Please try again." },
        { status: 500 }
      );
    }

    // Notify Tousif Raza via email
    try {
      const { user: mailSender, transporter } = getMailTransporter();
      await transporter.sendMail({
        from: `"MakerlyAI CRM" <${mailSender}>`,
        to: ["iamtousifraza@gmail.com", "getmakerlyai@gmail.com"],
        subject: `[MakerlyAI CRM] New Partner Access Request: ${name} (${email})`,
        text: `New CRM Partner Request:\n\nName: ${name}\nEmail: ${email}\nOrganization: ${organization || "N/A"}\nNote: ${note || "N/A"}\n\nLog in to https://makerlyai.in/crm to approve or reject this request.`,
        html: `
<div style="font-family: sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 500px;">
  <h2 style="color: #0f172a; margin-top: 0;">New Partner Access Request</h2>
  <p><strong>Name:</strong> ${name}</p>
  <p><strong>Email:</strong> ${email}</p>
  <p><strong>Organization:</strong> ${organization || "N/A"}</p>
  <p><strong>Note:</strong> ${note || "N/A"}</p>
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
  <p style="font-size: 13px; color: #64748b;">
    Log in to <a href="https://makerlyai.in/crm" style="color: #2563eb; font-weight: bold;">makerlyai.in/crm</a> under Authorizations to approve or reject.
  </p>
</div>
`,
      });
    } catch (mailErr) {
      console.warn("[CRM Partner Request] Notification email warning:", mailErr);
    }

    return NextResponse.json({
      success: true,
      status: "pending",
      message: "Your partner access request has been dispatched to Tousif Raza for approval.",
    });
  } catch (error: any) {
    console.error("[CRM Partner Request] Server error:", error);
    return NextResponse.json(
      { success: false, message: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
