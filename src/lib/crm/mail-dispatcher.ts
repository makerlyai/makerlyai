import nodemailer from "nodemailer";

export type MailChannel = "primary" | "hello" | "support" | "billing" | "careers" | "security";

interface ChannelConfig {
  email: string;
  senderName: string;
  password?: string;
}

/**
 * Resolves the email and app password for a specific operational channel.
 * Gracefully falls back to primary founder credentials if channel-specific
 * credentials have not yet been placed in .env.local.
 */
export function getChannelCredentials(channel: MailChannel): ChannelConfig {
  const masterUser = process.env.GMAIL_USER?.trim() || "tousif@makerlyai.in";
  const masterPass = process.env.GMAIL_APP_PASSWORD?.trim() || "";

  switch (channel) {
    case "security":
      return {
        email: process.env.SECURITY_MAIL_USER?.trim() || "security@makerlyai.in",
        senderName: "Makerly AI Security",
        password: process.env.SECURITY_APP_PASSWORD?.trim() || masterPass,
      };
    case "hello":
      return {
        email: process.env.HELLO_MAIL_USER?.trim() || "hello@makerlyai.in",
        senderName: "Makerly AI",
        password: process.env.HELLO_APP_PASSWORD?.trim() || masterPass,
      };
    case "support":
      return {
        email: process.env.SUPPORT_MAIL_USER?.trim() || "support@makerlyai.in",
        senderName: "Makerly AI Client Support",
        password: process.env.SUPPORT_APP_PASSWORD?.trim() || masterPass,
      };
    case "billing":
      return {
        email: process.env.BILLING_MAIL_USER?.trim() || "billing@makerlyai.in",
        senderName: "Makerly AI Billing & Invoicing",
        password: process.env.BILLING_APP_PASSWORD?.trim() || masterPass,
      };
    case "careers":
      return {
        email: process.env.CAREERS_MAIL_USER?.trim() || "careers@makerlyai.in",
        senderName: "Makerly AI Careers",
        password: process.env.CAREERS_APP_PASSWORD?.trim() || masterPass,
      };
    case "primary":
    default:
      return {
        email: masterUser,
        senderName: "Tousif Raza | Makerly AI",
        password: masterPass,
      };
  }
}

/**
 * Creates an authenticated Nodemailer transporter for a given channel.
 */
export function getTransporterForChannel(channel: MailChannel) {
  const config = getChannelCredentials(channel);
  const host = process.env.SMTP_HOST?.trim() || "smtp.gmail.com";
  const port = Number(process.env.SMTP_PORT?.trim()) || 465;

  if (!config.password) {
    console.warn(`[Mail Dispatcher] No app password configured for channel '${channel}' or primary GMAIL_USER.`);
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user: config.email,
      pass: (config.password || "").replace(/\s+/g, ""),
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  return { transporter, config };
}

/**
 * Channel: hello@makerlyai.in
 * Sends an immediate executive acknowledgment when a prospect submits a brief or chat inquiry.
 */
export async function sendHelloLeadAutoReply(data: {
  clientName: string;
  clientEmail: string;
  timeSlot?: string;
  projectSummary?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { transporter, config } = getTransporterForChannel("hello");

    const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:32px 16px;background-color:#090d16;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;color:#f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#0d1527;border-radius:20px;border:1px solid rgba(56,189,248,0.25);overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.6);">
          <tr>
            <td style="height:3px;background:linear-gradient(90deg, #38bdf8, #2563eb);"></td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <div style="font-size:12px;font-weight:800;color:#38bdf8;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">
                MAKERLY AI &bull; FAST-TRACK INTAKE
              </div>
              <h2 style="margin:0 0 16px;font-size:22px;color:#ffffff;letter-spacing:-0.02em;">
                We received your project brief!
              </h2>
              <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0 0 16px;">
                Hello <strong>${data.clientName || "there"}</strong>,<br/><br/>
                Thank you for reaching out to <strong>Makerly AI</strong>. Founder <strong>Tousif Raza</strong> and our engineering pod have logged your project in our development queue.
              </p>
              ${data.timeSlot ? `
              <div style="background:rgba(37,99,235,0.15);border:1px solid rgba(56,189,248,0.3);border-radius:10px;padding:14px 18px;margin-bottom:18px;">
                <div style="font-size:11px;font-weight:700;color:#38bdf8;text-transform:uppercase;margin-bottom:4px;">Requested Consultation Slot</div>
                <div style="font-size:14px;font-weight:700;color:#ffffff;">⏱️ ${data.timeSlot}</div>
              </div>` : ""}
              <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0 0 20px;">
                We are reviewing your architecture requirements and will reach out with your initial technical roadmap and 48-hour working preview schedule.
              </p>
              <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;margin-top:20px;">
                <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#ffffff;">Tousif Raza</p>
                <p style="margin:0;font-size:12px;color:#94a3b8;">Founder &amp; Technical Architect, Makerly AI</p>
                <p style="margin:6px 0 0;font-size:12px;"><a href="https://makerlyai.in" style="color:#38bdf8;text-decoration:none;">makerlyai.in</a> &bull; <a href="mailto:tousif@makerlyai.in" style="color:#38bdf8;text-decoration:none;">tousif@makerlyai.in</a> &bull; <a href="https://wa.me/918102308736" style="color:#22c55e;text-decoration:none;">WhatsApp: +91 81023 08736</a></p>
              </div>
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
      from: `"${config.senderName}" <${config.email}>`,
      to: data.clientEmail,
      replyTo: "tousif@makerlyai.in",
      subject: "We received your project brief — Makerly AI",
      text: `Hello ${data.clientName},\n\nThank you for reaching out to Makerly AI. Tousif Raza and our engineering team have received your project details.\n\nWe will review your requirements and reach out within 24 hours with your consultation roadmap.\n\nBest regards,\nTousif Raza\nFounder & Technical Architect, Makerly AI\nhttps://makerlyai.in`,
      html,
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Hello AutoReply] Error dispatching email:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Channel: careers@makerlyai.in
 * Sends an automated acknowledgment to job applicants.
 */
export async function sendCareersAutoReply(data: {
  applicantName: string;
  applicantEmail: string;
  roleTitle?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { transporter, config } = getTransporterForChannel("careers");

    const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:32px 16px;background-color:#07090e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;color:#f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#0d1527;border-radius:20px;border:1px solid rgba(16,185,129,0.3);overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.6);">
          <tr>
            <td style="height:3px;background:linear-gradient(90deg, #10b981, #38bdf8);"></td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <div style="font-size:12px;font-weight:800;color:#10b981;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">
                MAKERLY AI &bull; TALENT ROSTER INTAKE
              </div>
              <h2 style="margin:0 0 16px;font-size:22px;color:#ffffff;letter-spacing:-0.02em;">
                Profile Saved to Talent Roster ${data.roleTitle ? `— ${data.roleTitle}` : ""}
              </h2>
              <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0 0 16px;">
                Hello <strong>${data.applicantName || "there"}</strong>,<br/><br/>
                Thank you for sharing your portfolio and proof of work with <strong>Makerly AI</strong>.
              </p>
              <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0 0 16px;">
                Please note that all immediate job openings are currently closed as our core engineering pod is operating at full capacity. However, we have recorded your details, projects, and repositories in our <strong>Priority Talent Roster</strong>.
              </p>
              <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);border-radius:10px;padding:14px 18px;margin-bottom:18px;">
                <div style="font-size:13px;color:#ffffff;">
                  ⚡ You have impressive skills, and our team continuously reviews exceptional talent. We will reach out to you directly as soon as new project requirements or team expansions arise!
                </div>
              </div>
              <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;margin-top:20px;">
                <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#ffffff;">Team Makerly AI</p>
                <p style="margin:0;font-size:12px;color:#94a3b8;">Talent &amp; Engineering Operations, Makerly AI</p>
                <p style="margin:6px 0 0;font-size:12px;"><a href="https://makerlyai.in/careers" style="color:#10b981;text-decoration:none;">makerlyai.in/careers</a> &bull; <a href="mailto:careers@makerlyai.in" style="color:#38bdf8;text-decoration:none;">careers@makerlyai.in</a></p>
              </div>
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
      from: `"${config.senderName}" <${config.email}>`,
      to: data.applicantEmail,
      replyTo: "careers@makerlyai.in",
      subject: `Profile Saved to Talent Roster — Makerly AI`,
      text: `Hello ${data.applicantName},\n\nThank you for sharing your portfolio with Makerly AI.\n\nPlease note that all immediate job openings are currently closed for now as our core team operates at full capacity. However, you have impressive skills and your profile has been added to our priority talent roster. We will review your work and reach out directly as soon as new requirements or project opportunities arise.\n\nWarm regards,\nTeam Makerly AI\nhttps://makerlyai.in/careers`,
      html,
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Careers AutoReply] Error dispatching email:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Sends a rich internal notification to Tousif Raza and careers@makerlyai.in
 * when an engineering candidate submits an application.
 */
export async function sendCareersApplicantNotification(data: {
  fullName: string;
  email: string;
  phone: string;
  roleTitle: string;
  experienceYears: string;
  primaryTechStack: string;
  githubUrl: string;
  liveProjectUrl: string;
  portfolioUrl?: string;
  resumeUrl: string;
  hardestProblem: string;
  availability: string;
  expectedSalary: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { transporter, config } = getTransporterForChannel("careers");

    const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:32px 16px;background-color:#07090e;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;color:#f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:620px;background:#0d1527;border-radius:20px;border:1px solid rgba(56,189,248,0.3);overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.6);">
          <tr>
            <td style="height:4px;background:linear-gradient(90deg, #10b981, #38bdf8, #6366f1);"></td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <div style="font-size:11px;font-weight:800;color:#10b981;text-transform:uppercase;letter-spacing:0.15em;margin-bottom:8px;">
                ⚡ NEW CANDIDATE APPLICATION &bull; MAKERLY AI
              </div>
              <h2 style="margin:0 0 8px;font-size:24px;color:#ffffff;letter-spacing:-0.02em;">
                ${data.fullName}
              </h2>
              <div style="font-size:14px;color:#38bdf8;font-weight:700;margin-bottom:20px;">
                Applied for: ${data.roleTitle}
              </div>

              <!-- Quick Contact Badges -->
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:12px;padding:16px;margin-bottom:20px;">
                <table width="100%" border="0" cellspacing="0" cellpadding="4" style="font-size:13px;color:#cbd5e1;">
                  <tr>
                    <td width="30%" style="color:#94a3b8;font-weight:600;">Email:</td>
                    <td><a href="mailto:${data.email}" style="color:#38bdf8;text-decoration:none;">${data.email}</a></td>
                  </tr>
                  <tr>
                    <td style="color:#94a3b8;font-weight:600;">Phone / WhatsApp:</td>
                    <td><a href="https://wa.me/${data.phone.replace(/[^0-9]/g, '')}" style="color:#22c55e;text-decoration:none;">${data.phone}</a></td>
                  </tr>
                  <tr>
                    <td style="color:#94a3b8;font-weight:600;">Experience:</td>
                    <td style="color:#ffffff;font-weight:700;">${data.experienceYears}</td>
                  </tr>
                  <tr>
                    <td style="color:#94a3b8;font-weight:600;">Availability:</td>
                    <td style="color:#ffffff;">${data.availability}</td>
                  </tr>
                  <tr>
                    <td style="color:#94a3b8;font-weight:600;">Expected Comp:</td>
                    <td style="color:#fcd34d;font-weight:700;">${data.expectedSalary}</td>
                  </tr>
                </table>
              </div>

              <!-- Proof of Work Links -->
              <div style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;">
                Proof of Work &amp; Repositories
              </div>
              <div style="background:rgba(56,189,248,0.08);border:1px solid rgba(56,189,248,0.2);border-radius:12px;padding:16px;margin-bottom:20px;font-size:13px;">
                <p style="margin:0 0 8px;"><strong>GitHub:</strong> <a href="${data.githubUrl}" target="_blank" style="color:#38bdf8;word-break:break-all;">${data.githubUrl}</a></p>
                <p style="margin:0 0 8px;"><strong>Live Demo / App:</strong> <a href="${data.liveProjectUrl}" target="_blank" style="color:#10b981;word-break:break-all;">${data.liveProjectUrl}</a></p>
                ${data.portfolioUrl ? `<p style="margin:0 0 8px;"><strong>Portfolio / LinkedIn:</strong> <a href="${data.portfolioUrl}" target="_blank" style="color:#cbd5e1;word-break:break-all;">${data.portfolioUrl}</a></p>` : ""}
                <p style="margin:0;"><strong>Resume Link:</strong> <a href="${data.resumeUrl}" target="_blank" style="color:#f59e0b;word-break:break-all;">${data.resumeUrl}</a></p>
              </div>

              <!-- Tech Stack -->
              <div style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;">
                Core Tech Stack
              </div>
              <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:14px;margin-bottom:20px;font-size:13px;color:#f1f5f9;">
                ${data.primaryTechStack}
              </div>

              <!-- Hardest Problem Solved -->
              <div style="font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:10px;">
                Hardest Technical Problem Solved
              </div>
              <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:16px;margin-bottom:20px;font-size:13px;color:#cbd5e1;line-height:1.6;white-space:pre-wrap;">
                ${data.hardestProblem}
              </div>

              <!-- Quick Action Button -->
              <div style="text-align:center;padding:12px 0 20px;">
                <a href="mailto:${data.email}?subject=Interview%20with%20Makerly%20AI%20-%20${encodeURIComponent(data.roleTitle)}" style="display:inline-block;padding:12px 24px;border-radius:10px;background:#38bdf8;color:#000000;font-weight:700;font-size:14px;text-decoration:none;">
                  Reply &amp; Schedule Architecture Review
                </a>
              </div>

              <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:16px;text-align:center;font-size:11px;color:#64748b;">
                Received at ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST via Makerly AI Careers Portal
              </div>
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
      from: `"${config.senderName}" <${config.email}>`,
      to: "tousif@makerlyai.in",
      cc: "careers@makerlyai.in",
      replyTo: data.email,
      subject: `[New Applicant] ${data.roleTitle} — ${data.fullName}`,
      text: `New applicant for ${data.roleTitle}:\nName: ${data.fullName}\nEmail: ${data.email}\nPhone: ${data.phone}\nExperience: ${data.experienceYears}\nGitHub: ${data.githubUrl}\nLive Project: ${data.liveProjectUrl}\nResume: ${data.resumeUrl}\nTech Stack: ${data.primaryTechStack}\nHardest Problem: ${data.hardestProblem}\nAvailability: ${data.availability}\nExpected Comp: ${data.expectedSalary}`,
      html,
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Careers Notification] Error dispatching internal alert:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Channel: support@makerlyai.in
 * Sends an automated ticket confirmation to clients.
 */
export async function sendSupportAutoReply(data: {
  clientName: string;
  clientEmail: string;
  ticketSubject: string;
  ticketId?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { transporter, config } = getTransporterForChannel("support");
    const tId = data.ticketId || "TICK-" + Date.now().toString(36).toUpperCase();

    const html = `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:32px 16px;background-color:#090d16;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,sans-serif;color:#f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#0d1527;border-radius:20px;border:1px solid rgba(245,158,11,0.3);overflow:hidden;box-shadow:0 20px 40px rgba(0,0,0,0.6);">
          <tr>
            <td style="height:3px;background:linear-gradient(90deg, #f59e0b, #38bdf8);"></td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <div style="font-size:12px;font-weight:800;color:#f59e0b;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">
                MAKERLY AI &bull; CLIENT SUPPORT SPRINT
              </div>
              <h2 style="margin:0 0 16px;font-size:22px;color:#ffffff;letter-spacing:-0.02em;">
                Ticket #${tId} Logged
              </h2>
              <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0 0 16px;">
                Hello <strong>${data.clientName || "Client"}</strong>,<br/><br/>
                Your support inquiry regarding <strong>"${data.ticketSubject}"</strong> has been logged in our active sprint queue.
              </p>
              <div style="background:rgba(245,158,11,0.1);border:1px solid rgba(245,158,11,0.25);border-radius:10px;padding:14px 18px;margin-bottom:18px;">
                <div style="font-size:12px;color:#fcd34d;font-weight:bold;margin-bottom:4px;">SLA Response Commitment</div>
                <div style="font-size:13px;color:#ffffff;">
                  Active sprint tickets receive engineering triage within <strong>4 hours</strong>. For urgent production blockers, notify founder Tousif Raza via WhatsApp.
                </div>
              </div>
              <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;margin-top:20px;">
                <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#ffffff;">Makerly AI Engineering Pod</p>
                <p style="margin:0;font-size:12px;color:#94a3b8;">Client Support &amp; Active Sprints</p>
                <p style="margin:6px 0 0;font-size:12px;"><a href="mailto:support@makerlyai.in" style="color:#f59e0b;text-decoration:none;">support@makerlyai.in</a> &bull; <a href="https://wa.me/918102308736" style="color:#22c55e;text-decoration:none;">Emergency WhatsApp: +91 81023 08736</a></p>
              </div>
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
      from: `"${config.senderName}" <${config.email}>`,
      to: data.clientEmail,
      replyTo: "support@makerlyai.in",
      subject: `[Ticket #${tId}] Support Request Received — Makerly AI`,
      text: `Hello ${data.clientName},\n\nYour support request regarding "${data.ticketSubject}" has been logged as #${tId}.\n\nOur engineering pod responds within 4 hours during active sprints.\n\nBest regards,\nMakerly AI Support Team\nsupport@makerlyai.in`,
      html,
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Support AutoReply] Error dispatching email:", err);
    return { success: false, error: err.message };
  }
}

/**
 * Channel: security@makerlyai.in
 * Sends an automated 6-digit OTP security code for CRM access or identity verification.
 */
export async function sendSecurityOtpCode(data: {
  recipientEmail: string;
  recipientName: string;
  code: string;
  isOwner?: boolean;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const { transporter, config } = getTransporterForChannel("security");
    const isOwner = Boolean(data.isOwner);

    const subject = isOwner
      ? `MakerlyAI Security • Owner Authorization Code: ${data.code}`
      : `MakerlyAI Security • Partner Verification Code: ${data.code}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin: 0; padding: 24px; background-color: #0b0f19; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #0d1527; border: 1px solid rgba(56,189,248,0.3); border-radius: 20px; overflow: hidden; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          <tr>
            <td style="height: 4px; background: linear-gradient(90deg, #38bdf8, #2563eb, #10b981);"></td>
          </tr>
          <tr>
            <td style="padding: 28px 32px 20px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.08);">
              <div style="font-size: 11px; font-weight: 800; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.15em; margin-bottom: 8px;">
                MAKERLY AI &bull; SECURITY PROTOCOL
              </div>
              <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.02em;">
                ${isOwner ? "Owner CRM Security Verification" : "Partner CRM Access Code"}
              </h1>
              <p style="margin: 6px 0 0; font-size: 13px; color: #94a3b8;">
                Dispatched from security@makerlyai.in &bull; makerlyai.in/crm
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Hello <strong>${data.recipientName}</strong>,
              </p>
              <p style="margin: 0 0 24px; font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                A secure sign-in request was initiated for your authorized account (<span style="font-family: monospace; color: #38bdf8; font-weight: 600;">${data.recipientEmail}</span>).
              </p>
              <div style="background-color: rgba(56,189,248,0.08); border: 1.5px dashed rgba(56,189,248,0.4); border-radius: 14px; padding: 22px; text-align: center; margin-bottom: 24px;">
                <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #38bdf8; font-weight: 800; margin-bottom: 8px;">
                  Your 6-Digit Authorization Code
                </div>
                <div style="font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace; font-size: 38px; font-weight: 900; letter-spacing: 0.25em; color: #ffffff;">
                  ${data.code}
                </div>
                <div style="margin-top: 10px; font-size: 11px; color: #94a3b8;">
                  ⏱️ Valid for 10 minutes &bull; Single-use only &bull; Do not share
                </div>
              </div>
              <p style="margin: 0 0 12px; font-size: 13px; line-height: 1.6; color: #94a3b8;">
                Enter this code on the CRM login screen to complete identity verification and access the workspace.
              </p>
              <p style="margin: 0; font-size: 11px; line-height: 1.6; color: #64748b;">
                If you did not request this code, no action is required. Your account remains protected with zero unauthorized access.
              </p>
              <div style="border-top: 1px solid rgba(255,255,255,0.08); padding-top: 20px; margin-top: 24px; text-align: center; font-size: 11px; color: #64748b;">
                Makerly AI Security Pod &bull; <a href="mailto:security@makerlyai.in" style="color: #38bdf8; text-decoration: none;">security@makerlyai.in</a>
              </div>
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
      from: `"${config.senderName}" <${config.email}>`,
      to: data.recipientEmail,
      replyTo: "security@makerlyai.in",
      subject,
      text: `Hello ${data.recipientName},\n\nYour MakerlyAI CRM authorization code is: ${data.code}\n\nValid for 10 minutes. Do not share this code.\n\nMakerly AI Security Pod\nsecurity@makerlyai.in`,
      html,
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Security Dispatcher] Error dispatching OTP email:", err);
    return { success: false, error: err.message };
  }
}

