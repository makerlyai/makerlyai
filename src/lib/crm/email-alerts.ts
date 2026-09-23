import nodemailer from "nodemailer";

export interface LeadAlertData {
  name: string;
  email: string;
  phone: string;
  projectDetails: string;
  source: "Website Contact Form" | "AI Voice/Chat Assistant" | "Direct CRM Inquiry";
  timeSlot?: string;
  businessName?: string;
}

export async function sendLeadAlertEmail(data: LeadAlertData): Promise<{ success: boolean; error?: string }> {
  const user = process.env.GMAIL_USER?.trim() || "getmakerlyai@gmail.com";
  const pass = process.env.GMAIL_APP_PASSWORD?.trim();

  if (!pass) {
    console.error("[Lead Alert] GMAIL_APP_PASSWORD is not set on the server.");
    return { success: false, error: "GMAIL_APP_PASSWORD missing" };
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass: pass.replace(/\s+/g, "") },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const cleanPhone = data.phone?.replace(/[^0-9+]/g, "") || "";
  const waPhone = cleanPhone.replace("+", "");
  const waLink = cleanPhone ? `https://wa.me/${waPhone}?text=Hi%20${encodeURIComponent(data.name || "there")}%2C%20this%20is%20Tousif%20Raza%20from%20MakerlyAI%20regarding%20your%20project%20inquiry.` : null;
  const createdAt = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const adminSubject = `⚡ [NEW LEAD] ${data.name || "Prospect"} · ${data.timeSlot ? `Meeting: ${data.timeSlot} · ` : ""}${data.source}`;

  const adminHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MakerlyAI Inbound Lead</title>
</head>
<body style="margin:0;padding:32px 16px;background-color:#030712;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;color:#f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <!-- Main Container Card -->
        <table width="100%" style="max-width:620px;background:linear-gradient(180deg, #0b1329 0%, #030712 100%);border-radius:24px;border:1px solid rgba(56,189,248,0.25);box-shadow:0 25px 60px -15px rgba(0,0,0,0.9), 0 0 40px rgba(37,99,235,0.25);overflow:hidden;border-collapse:separate;">
          
          <!-- Top Accent Bar -->
          <tr>
            <td style="height:4px;background:linear-gradient(90deg, #38bdf8 0%, #2563eb 50%, #6366f1 100%);"></td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td style="padding:36px 36px 28px;background:radial-gradient(ellipse at top, rgba(37,99,235,0.25) 0%, transparent 70%);border-bottom:1px solid rgba(255,255,255,0.08);">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="display:inline-block;padding:6px 14px;background:rgba(37,99,235,0.2);border:1px solid rgba(56,189,248,0.4);border-radius:9999px;font-size:11px;font-weight:800;color:#38bdf8;text-transform:uppercase;letter-spacing:0.12em;">
                      ⚡ INBOUND LEAD RADAR · ${data.source.toUpperCase()}
                    </div>
                    <h1 style="margin:16px 0 6px;font-size:26px;font-weight:900;letter-spacing:-0.03em;color:#ffffff;line-height:1.2;">
                      New Project Brief Captured
                    </h1>
                    <p style="margin:0;font-size:13px;color:#94a3b8;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">
                      Captured on ${createdAt} (IST) · High-Priority Intake
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Key Client Info Grid -->
          <tr>
            <td style="padding:32px 36px 24px;">
              <table width="100%" style="border-collapse:separate;border-spacing:0;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
                
                <!-- Client Name -->
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;width:130px;">
                    Client Name
                  </td>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:16px;font-weight:800;color:#ffffff;">
                    ${data.name || "Not provided"}
                  </td>
                </tr>

                <!-- Phone / WhatsApp -->
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">
                    Phone / WhatsApp
                  </td>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:15px;font-weight:800;color:#ffffff;">
                    <span>${data.phone || "Not provided"}</span>
                    ${waLink ? `
                    &nbsp;&nbsp;
                    <a href="${waLink}" target="_blank" style="display:inline-block;padding:5px 12px;background:#22c55e;color:#ffffff;text-decoration:none;border-radius:8px;font-size:11px;font-weight:800;letter-spacing:0.02em;vertical-align:middle;box-shadow:0 2px 8px rgba(34,197,94,0.4);">
                      💬 Chat on WhatsApp ➔
                    </a>` : ""}
                  </td>
                </tr>

                <!-- Email -->
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">
                    Email Address
                  </td>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:15px;font-weight:700;color:#38bdf8;">
                    ${data.email && !data.email.includes("@lead.makerlyai.in") ? `
                      <a href="mailto:${data.email}" style="color:#38bdf8;text-decoration:none;">${data.email}</a>
                    ` : `<span style="color:#64748b;font-style:italic;">Not provided (Follow up via WhatsApp)</span>`}
                  </td>
                </tr>

                <!-- Meeting Time Preference -->
                <tr>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">
                    Consultation Time
                  </td>
                  <td style="padding:16px 20px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;font-weight:800;color:#facc15;">
                    <span style="display:inline-block;padding:4px 10px;background:rgba(234,179,8,0.15);border:1px solid rgba(234,179,8,0.3);border-radius:6px;">
                      ⏱️ ${data.timeSlot || "Flexible / Ready for 24h Outreach"}
                    </span>
                  </td>
                </tr>

                <!-- Deal Tier / Target -->
                <tr>
                  <td style="padding:16px 20px;font-size:12px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:0.05em;">
                    Standard Sprint
                  </td>
                  <td style="padding:16px 20px;font-size:14px;font-weight:700;color:#a5b4fc;">
                    Starter MVP Sprint · ₹99,000 / $1,200 (48h Working Preview)
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Project Brief Card -->
          <tr>
            <td style="padding:0 36px 28px;">
              <div style="background:rgba(15,23,42,0.8);border:1px solid rgba(56,189,248,0.2);border-radius:16px;padding:24px;">
                <div style="font-size:11px;text-transform:uppercase;color:#38bdf8;font-weight:800;margin-bottom:12px;letter-spacing:0.08em;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">
                  📋 Project Brief &amp; Conversation Requirements
                </div>
                <div style="font-size:14px;line-height:1.7;color:#e2e8f0;white-space:pre-wrap;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
${data.projectDetails}
                </div>
              </div>
            </td>
          </tr>

          <!-- Primary CTA Button -->
          <tr>
            <td style="padding:0 36px 36px;text-align:center;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://makerlyai.in/crm" target="_blank" style="display:inline-block;padding:16px 36px;background:linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);color:#ffffff;text-decoration:none;border-radius:12px;font-size:15px;font-weight:800;letter-spacing:0.02em;box-shadow:0 8px 24px rgba(37,99,235,0.4);border:1px solid rgba(255,255,255,0.2);">
                      Open Lead in MakerlyAI CRM ➔
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Quick Action Sub-bar -->
              <div style="margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,0.08);font-size:12px;color:#94a3b8;">
                Founder Direct: &nbsp;
                ${cleanPhone ? `<a href="tel:${cleanPhone}" style="color:#ffffff;text-decoration:underline;margin:0 8px;">Call ${data.phone}</a> &bull;` : ""}
                ${waLink ? `<a href="${waLink}" style="color:#22c55e;text-decoration:underline;margin:0 8px;">WhatsApp</a> &bull;` : ""}
                ${data.email && !data.email.includes("@lead.makerlyai.in") ? `<a href="mailto:${data.email}" style="color:#38bdf8;text-decoration:underline;margin:0 8px;">Reply by Email</a>` : ""}
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 36px;background:rgba(0,0,0,0.5);border-top:1px solid rgba(255,255,255,0.06);text-align:center;">
              <p style="margin:0;font-size:11px;color:#64748b;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;">
                Makerly AI Engineering Studio &bull; 100% IP Transfer &bull; Automated Pipeline Alert
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

  try {
    // 1. Send Admin Alert to Tousif Raza & Team
    await transporter.sendMail({
      from: `"MakerlyAI Lead Radar" <${user}>`,
      to: ["getmakerlyai@gmail.com", "iamtousifraza@gmail.com"],
      subject: adminSubject,
      text: `[NEW MAKERLYAI LEAD]\nSource: ${data.source}\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nMeeting Slot: ${data.timeSlot || "Flexible"}\nTime: ${createdAt}\n\nProject Details:\n${data.projectDetails}\n\nOpen CRM: https://makerlyai.in/crm`,
      html: adminHtml,
      replyTo: data.email && !data.email.includes("@lead.makerlyai.in") ? data.email : undefined,
    });

    // 2. Send Sleek Client Confirmation if a valid email was provided
    if (data.email && !data.email.includes("@lead.makerlyai.in") && data.email.includes("@")) {
      try {
        const clientHtml = `
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
                MAKERLY AI &bull; EXECUTIVE SCOPING
              </div>
              <h2 style="margin:0 0 16px;font-size:22px;color:#ffffff;letter-spacing:-0.02em;">
                We received your project brief!
              </h2>
              <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0 0 16px;">
                Hello <strong>${data.name || "there"}</strong>,<br/><br/>
                Thank you for reaching out to <strong>Makerly AI</strong>. Founder <strong>Tousif Raza</strong> and our engineering pod have logged your project in our development queue.
              </p>
              ${data.timeSlot ? `
              <div style="background:rgba(37,99,235,0.15);border:1px solid rgba(56,189,248,0.3);border-radius:10px;padding:14px 18px;margin-bottom:18px;">
                <div style="font-size:11px;font-weight:700;color:#38bdf8;text-transform:uppercase;margin-bottom:4px;">Requested Meeting Slot</div>
                <div style="font-size:14px;font-weight:700;color:#ffffff;">⏱️ ${data.timeSlot}</div>
              </div>` : ""}
              <p style="color:#cbd5e1;font-size:14px;line-height:1.7;margin:0 0 20px;">
                We are reviewing your architecture requirements and will reach out via WhatsApp / Email with your initial technical roadmap and 48-hour working preview schedule.
              </p>
              <div style="border-top:1px solid rgba(255,255,255,0.1);padding-top:20px;margin-top:20px;">
                <p style="margin:0 0 4px;font-size:14px;font-weight:700;color:#ffffff;">Tousif Raza</p>
                <p style="margin:0;font-size:12px;color:#94a3b8;">Founder &amp; Technical Architect, Makerly AI</p>
                <p style="margin:6px 0 0;font-size:12px;"><a href="https://makerlyai.in" style="color:#38bdf8;text-decoration:none;">makerlyai.in</a> &bull; <a href="https://wa.me/918102308736" style="color:#22c55e;text-decoration:none;">WhatsApp: +91 81023 08736</a></p>
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
          from: `"Tousif Raza | MakerlyAI" <${user}>`,
          to: data.email,
          subject: "We received your project brief - MakerlyAI",
          text: `Hello ${data.name},\n\nThank you for reaching out to MakerlyAI. Tousif Raza and our engineering team have received your project details.\n\nWe will review your requirements and reach out within 24 hours to schedule your consultation and share your 48h prototype roadmap.\n\nBest regards,\nTousif Raza\nFounder & Technical Architect, MakerlyAI\nhttps://makerlyai.in`,
          html: clientHtml,
        });
      } catch (clientErr) {
        console.warn("[Lead Alert] Client confirmation warning:", clientErr);
      }
    }

    return { success: true };
  } catch (err: any) {
    console.error("[Lead Alert] Email dispatch failed:", err);
    return { success: false, error: err.message };
  }
}
