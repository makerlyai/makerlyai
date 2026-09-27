import nodemailer from "nodemailer";

export type MailChannel = "primary" | "hello" | "support" | "billing" | "careers";

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
                MAKERLY AI &bull; TALENT INTAKE
              </div>
              <h2 style="margin:0 0 16px;font-size:22px;color:#ffffff;letter-spacing:-0.02em;">
                Application Received ${data.roleTitle ? `— ${data.roleTitle}` : ""}
              </h2>
              <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0 0 16px;">
                Hello <strong>${data.applicantName || "there"}</strong>,<br/><br/>
                Thank you for applying to join the engineering pod at <strong>Makerly AI</strong>.
              </p>
              <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0 0 16px;">
                We prioritize shipping speed and proof of work over bureaucratic hiring processes. Founder <strong>Tousif Raza</strong> personally reviews every submitted portfolio, GitHub repo, and project demo within <strong>48 hours</strong>.
              </p>
              <div style="background:rgba(16,185,129,0.1);border:1px solid rgba(16,185,129,0.25);border-radius:10px;padding:14px 18px;margin-bottom:18px;">
                <div style="font-size:13px;color:#ffffff;">
                  ⚡ If your work matches our active sprint requirements, we will schedule a 20-minute architecture deep-dive directly with the founder.
                </div>
              </div>
              <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;margin-top:20px;">
                <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#ffffff;">Tousif Raza</p>
                <p style="margin:0;font-size:12px;color:#94a3b8;">Founder &amp; Technical Architect, Makerly AI</p>
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
      subject: `Application Received — Makerly AI Engineering Pod`,
      text: `Hello ${data.applicantName},\n\nThank you for applying to Makerly AI. Tousif Raza personally reviews all portfolios and GitHub repositories within 48 hours.\n\nBest regards,\nTousif Raza\nFounder & Technical Architect\nhttps://makerlyai.in/careers`,
      html,
    });

    return { success: true };
  } catch (err: any) {
    console.error("[Careers AutoReply] Error dispatching email:", err);
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
