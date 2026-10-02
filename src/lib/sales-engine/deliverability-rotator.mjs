// ─────────────────────────────────────────────────────────────────
//  MakerlyAI Autonomous Sales Engine - Deliverability Rotator & Sender
//  Synthesizes BillionMail & enterprise deliverability safety standards
// ─────────────────────────────────────────────────────────────────

import nodemailer from 'nodemailer';
import fs from 'fs';
import dns from 'dns/promises';
import { SALES_ENGINE_CONFIG } from './config.mjs';

const TRACKER_FILE = SALES_ENGINE_CONFIG.crm.dailyTrackerFile;
const UNSUBSCRIBES_FILE = SALES_ENGINE_CONFIG.crm.unsubscribesFile;

/**
 * Gets today's date formatted in Asia/Kolkata (YYYY-MM-DD)
 */
function getTodayDateString() {
  const d = new Date();
  const options = { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' };
  const parts = new Intl.DateTimeFormat('en-CA', options).format(d);
  return parts; // e.g. "2026-10-03"
}

/**
 * Loads daily sending tracker
 */
export function loadDailyTracker() {
  const today = getTodayDateString();
  try {
    if (fs.existsSync(TRACKER_FILE)) {
      const data = JSON.parse(fs.readFileSync(TRACKER_FILE, 'utf-8'));
      if (data.date === today) {
        return data;
      }
    }
  } catch {}

  // New day reset
  const fresh = {
    date: today,
    mailboxes: {
      founder: { sentCount: 0, limit: 20 },
      growth: { sentCount: 0, limit: 20 }
    },
    totalSent: 0,
    history: []
  };
  saveDailyTracker(fresh);
  return fresh;
}

/**
 * Saves daily sending tracker
 */
export function saveDailyTracker(tracker) {
  try {
    fs.writeFileSync(TRACKER_FILE, JSON.stringify(tracker, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Tracker Error] Failed to save daily tracker:', err.message);
  }
}

/**
 * Loads unsubscribed emails
 */
export function loadUnsubscribes() {
  try {
    if (fs.existsSync(UNSUBSCRIBES_FILE)) {
      return JSON.parse(fs.readFileSync(UNSUBSCRIBES_FILE, 'utf-8'));
    }
  } catch {}
  return [];
}

/**
 * Adds an email to the unsubscribe suppression list
 */
export function addUnsubscribe(email) {
  const list = loadUnsubscribes();
  const clean = email.toLowerCase().trim();
  if (!list.includes(clean)) {
    list.push(clean);
    fs.writeFileSync(UNSUBSCRIBES_FILE, JSON.stringify(list, null, 2), 'utf-8');
    console.log(`[Deliverability] Added ${clean} to unsubscribe suppression list.`);
  }
}

/**
 * Selects the next available mailbox respecting the 20 emails/day cap
 */
export function getNextAvailableMailbox() {
  const tracker = loadDailyTracker();
  const mailboxes = SALES_ENGINE_CONFIG.mailboxes;

  // Find mailboxes that have not reached their daily limit
  const available = mailboxes.filter(m => {
    const stats = tracker.mailboxes[m.id] || { sentCount: 0, limit: 20 };
    return stats.sentCount < stats.limit && m.password;
  });

  if (available.length === 0) {
    return null; // All mailboxes reached daily quota
  }

  // Sort by lowest sentCount for balanced rotation
  available.sort((a, b) => {
    const aCount = tracker.mailboxes[a.id]?.sentCount || 0;
    const bCount = tracker.mailboxes[b.id]?.sentCount || 0;
    return aCount - bCount;
  });

  return available[0];
}

/**
 * Verifies if an email address domain has active MX records
 */
export async function isDeliverableEmail(email) {
  if (!email || !email.includes('@')) return false;
  const domain = email.split('@')[1].toLowerCase().trim();
  try {
    const mx = await dns.resolveMx(domain);
    return mx && mx.length > 0;
  } catch {
    return false;
  }
}

/**
 * Sends a single cold outreach email through the rotated mailbox with deliverability checks
 */
export async function sendOutreachEmail({
  recipientEmail,
  recipientName,
  businessName,
  subject,
  htmlContent,
  plainTextContent,
  touchNumber = 1,
  dryRun = false,
}) {
  const cleanEmail = recipientEmail.toLowerCase().trim();

  // 1. Unsubscribe check
  const unsubscribed = loadUnsubscribes();
  if (unsubscribed.includes(cleanEmail)) {
    return { success: false, skipped: true, reason: 'Recipient previously unsubscribed' };
  }

  // 2. MX check
  const hasMx = await isDeliverableEmail(cleanEmail);
  if (!hasMx) {
    return { success: false, skipped: true, reason: 'Invalid domain: No active MX records found' };
  }

  // 3. Mailbox Quota & Rotation check
  const mailbox = getNextAvailableMailbox();
  if (!mailbox) {
    return {
      success: false,
      skipped: true,
      reason: 'Daily sending limit reached across all mailboxes (20 emails/day/account limit reached). Resuming tomorrow.'
    };
  }

  if (dryRun) {
    console.log(`   [DRY RUN] Would send Touch #${touchNumber} to ${cleanEmail} via ${mailbox.email}`);
    return {
      success: true,
      dryRun: true,
      mailboxUsed: mailbox.email,
      recipientEmail: cleanEmail,
      subject,
    };
  }

  // 4. Create authenticated Transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: mailbox.email,
      pass: mailbox.password.replace(/\s+/g, ''),
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 15000,
  });

  try {
    const info = await transporter.sendMail({
      from: `"${mailbox.name}" <${mailbox.email}>`,
      to: `"${recipientName}" <${cleanEmail}>`,
      subject,
      text: plainTextContent,
      html: htmlContent,
      headers: {
        'List-Unsubscribe': `<mailto:${mailbox.email}?subject=Unsubscribe>`,
        'X-Mailer': 'MakerlyAI Sales Engine v1.0',
        'X-Entity-Ref-ID': `makerly-${Date.now()}`,
      }
    });

    // 5. Update daily tracker
    const tracker = loadDailyTracker();
    if (!tracker.mailboxes[mailbox.id]) {
      tracker.mailboxes[mailbox.id] = { sentCount: 0, limit: 20 };
    }
    tracker.mailboxes[mailbox.id].sentCount += 1;
    tracker.totalSent += 1;
    tracker.history.push({
      timestamp: new Date().toISOString(),
      mailbox: mailbox.email,
      to: cleanEmail,
      businessName,
      touchNumber,
      messageId: info.messageId,
    });
    saveDailyTracker(tracker);

    return {
      success: true,
      messageId: info.messageId,
      mailboxUsed: mailbox.email,
      sentCountToday: tracker.mailboxes[mailbox.id].sentCount,
    };
  } catch (err) {
    console.error(`[Outreach Error] Failed sending to ${cleanEmail}:`, err.message);
    return {
      success: false,
      error: err.message,
      mailboxUsed: mailbox.email,
    };
  }
}

/**
 * Calculates humanized random delay between sends (e.g. 45s - 180s)
 */
export function getRandomHumanDelay() {
  const min = SALES_ENGINE_CONFIG.deliverability.minDelayMs;
  const max = SALES_ENGINE_CONFIG.deliverability.maxDelayMs;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
