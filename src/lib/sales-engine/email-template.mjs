// ─────────────────────────────────────────────────────────────────
//  MakerlyAI Autonomous Sales Engine - VIP Email Template & Renderer
// ─────────────────────────────────────────────────────────────────

import { SALES_ENGINE_CONFIG } from './config.mjs';

/**
 * Builds responsive luxury HTML email matching MakerlyAI brand guidelines
 */
export function buildSalesEmailHtml(options) {
  const {
    recipientName = 'there',
    businessName = 'your brand',
    subject = '',
    touchNumber = 1,
    personalizedHook = '',
    bodyContent = '',
    ctaText = 'Book a 15-Minute Strategy Call',
    ctaUrl = SALES_ENGINE_CONFIG.branding.calendlyUrl,
    senderName = 'Tousif Raza',
    senderTitle = 'Founder & Tech Lead, MakerlyAI',
    senderEmail = 'tousif@makerlyai.in',
    recipientEmail = '',
    optOutToken = '',
  } = options;

  const optOutUrl = `mailto:${senderEmail}?subject=Unsubscribe%20${encodeURIComponent(recipientEmail)}&body=Please%20remove%20me%20from%20future%20updates.`;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="x-apple-disable-message-reformatting">
  <title>${escapeHtml(subject)}</title>
  <!--[if mso]>
  <style>
    table {border-collapse:collapse;border-spacing:0;margin:0;}
    div, td {padding:0;}
    div {margin:0 !important;}
  </style>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    body {
      margin: 0 !important;
      padding: 0 !important;
      background-color: #080c14 !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    table { border-collapse: collapse; }
    img { border: 0; outline: none; text-decoration: none; display: block; }
    a { color: #38bdf8; text-decoration: none; }
    .btn-gradient:hover {
      background: linear-gradient(135deg, #0ea5e9 0%, #059669 100%) !important;
      box-shadow: 0 0 20px rgba(56, 189, 248, 0.4) !important;
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #080c14;">
  <div style="background-color: #080c14; padding: 32px 12px;">
    <!-- Container -->
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; margin: 0 auto; background-color: #0d131f; border-radius: 16px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);">
      
      <!-- Top Neon Glow Accent Bar -->
      <tr>
        <td style="height: 4px; background: linear-gradient(90deg, #38bdf8 0%, #34d399 50%, #818cf8 100%); font-size: 0; line-height: 0;">&nbsp;</td>
      </tr>

      <!-- Header with Logo -->
      <tr>
        <td style="padding: 28px 36px 20px 36px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td align="left" valign="middle">
                <a href="${SALES_ENGINE_CONFIG.branding.websiteUrl}" target="_blank" style="text-decoration: none; display: inline-block;">
                  <!-- Clickable MakerlyAI Brand Mark -->
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="background: linear-gradient(135deg, #38bdf8 0%, #34d399 100%); border-radius: 8px; width: 34px; height: 34px; text-align: center; vertical-align: middle;">
                        <span style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 19px; font-weight: 900; color: #080c14; line-height: 34px; display: inline-block;">M</span>
                      </td>
                      <td style="padding-left: 10px; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #ffffff;">
                        Makerly<span style="color: #38bdf8;">AI</span>
                      </td>
                    </tr>
                  </table>
                </a>
              </td>
              <td align="right" valign="middle">
                <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; background-color: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.3); font-size: 11px; font-weight: 600; color: #38bdf8; letter-spacing: 0.5px; text-transform: uppercase;">
                  ${touchNumber === 1 ? 'Growth Advisory' : touchNumber === 2 ? 'Value Brief' : touchNumber === 3 ? 'Video Audit' : 'Follow Up'}
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- Divider -->
      <tr>
        <td style="padding: 0 36px;">
          <div style="height: 1px; background-color: #1e293b; width: 100%;"></div>
        </td>
      </tr>

      <!-- Body Content -->
      <tr>
        <td style="padding: 32px 36px 24px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #e2e8f0; font-size: 15px; line-height: 1.65;">
          
          <div style="font-size: 16px; font-weight: 600; color: #ffffff; margin-bottom: 16px;">
            Hi ${escapeHtml(recipientName)},
          </div>

          <!-- Personalized Observation Box -->
          ${personalizedHook ? `
          <div style="margin: 20px 0 24px 0; padding: 16px 20px; background-color: rgba(15, 23, 42, 0.8); border-left: 4px solid #38bdf8; border-radius: 0 10px 10px 0; border-top: 1px solid rgba(56, 189, 248, 0.15); border-right: 1px solid rgba(56, 189, 248, 0.15); border-bottom: 1px solid rgba(56, 189, 248, 0.15);">
            <div style="font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px;">
              Observation for ${escapeHtml(businessName)}
            </div>
            <div style="font-size: 14px; color: #cbd5e1; line-height: 1.55; font-style: italic;">
              "${escapeHtml(personalizedHook)}"
            </div>
          </div>
          ` : ''}

          <!-- Custom Body Paragraphs -->
          <div style="color: #cbd5e1; font-size: 15px; line-height: 1.68;">
            ${bodyContent}
          </div>

          <!-- Call to Action Button -->
          <div style="margin: 32px 0 24px 0; text-align: left;">
            <a href="${ctaUrl}" class="btn-gradient" target="_blank" style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #0284c7 0%, #059669 100%); color: #ffffff; font-weight: 700; font-size: 14px; border-radius: 10px; text-decoration: none; letter-spacing: 0.2px; box-shadow: 0 4px 15px rgba(2, 132, 199, 0.35);">
              ${escapeHtml(ctaText)} &rarr;
            </a>
            <div style="font-size: 12px; color: #64748b; margin-top: 10px;">
              Or simply reply directly to this email — I personally review every note.
            </div>
          </div>

          <!-- Sign-off Block -->
          <div style="margin-top: 36px; padding-top: 20px; border-top: 1px solid #1e293b;">
            <div style="font-size: 15px; font-weight: 700; color: #f8fafc;">${escapeHtml(senderName)}</div>
            <div style="font-size: 13px; color: #94a3b8; margin-top: 2px;">${escapeHtml(senderTitle)}</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
              <a href="${SALES_ENGINE_CONFIG.branding.websiteUrl}" target="_blank" style="color: #38bdf8; text-decoration: none;">makerlyai.in</a> &bull; Bengaluru, India
            </div>
          </div>

        </td>
      </tr>

      <!-- Footer / Unsubscribe / Legal -->
      <tr>
        <td style="padding: 20px 36px 28px 36px; background-color: #090e17; border-top: 1px solid #1e293b; font-family: -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; color: #475569; line-height: 1.5; text-align: center;">
          <p style="margin: 0 0 8px 0;">
            Sent by MakerlyAI Labs. We help ambitious founders deploy high-converting web apps & AI automation.
          </p>
          <p style="margin: 0;">
            If you'd prefer not to hear from us regarding ${escapeHtml(businessName)}, 
            <a href="${optOutUrl}" style="color: #64748b; text-decoration: underline;">click here to opt out immediately</a>.
          </p>
        </td>
      </tr>

    </table>
  </div>
</body>
</html>`;
}

/**
 * Builds Plaintext version for multi-part deliverability
 */
export function buildSalesEmailText(options) {
  const {
    recipientName = 'there',
    businessName = 'your brand',
    personalizedHook = '',
    bodyContentPlain = '',
    senderName = 'Tousif Raza',
    senderTitle = 'Founder & Tech Lead, MakerlyAI',
    senderEmail = 'tousif@makerlyai.in',
    recipientEmail = '',
  } = options;

  return `Hi ${recipientName},

${personalizedHook ? `Observation for ${businessName}:\n"${personalizedHook}"\n\n` : ''}${bodyContentPlain}

You can book a 15-minute strategy call with me here: ${SALES_ENGINE_CONFIG.branding.calendlyUrl}
Or simply reply directly to this email.

Best regards,

${senderName}
${senderTitle}
MakerlyAI (https://makerlyai.in)
Bengaluru, India

---
To opt out, reply with 'unsubscribe' or click: mailto:${senderEmail}?subject=Unsubscribe%20${encodeURIComponent(recipientEmail)}`;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
