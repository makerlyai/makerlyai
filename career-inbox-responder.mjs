#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────
//  MakerlyAI Career Inbox Auto-Responder
//  Usage:  node career-inbox-responder.mjs
//
//  Connects to careers@makerlyai.in via IMAP, reads UNSEEN emails,
//  classifies job/opportunity seekers via Groq LLaMA, generates
//  a warm professional reply, and sends it — then marks the email
//  as read (SEEN).
// ─────────────────────────────────────────────────────────────────

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import Imap from 'imap';
import { simpleParser } from 'mailparser';
import nodemailer from 'nodemailer';

// ── Config ──────────────────────────────────────────────────────
const {
  CAREERS_MAIL_USER,
  CAREERS_APP_PASSWORD,
  SMTP_HOST = 'smtp.gmail.com',
  SMTP_PORT = '465',
  GROQ_API_KEY,
} = process.env;

const GROQ_MODEL = 'openai/gpt-oss-120b';
const GROQ_URL   = 'https://api.groq.com/openai/v1/chat/completions';

// ── Groq helper ─────────────────────────────────────────────────
async function groqChat(systemPrompt, userMessage) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.7,
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userMessage },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq API ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

// ── Intent classifier ───────────────────────────────────────────
async function classifyIntent(subject, body) {
  const system = `You are an intent classifier for MakerlyAI recruitment (careers@makerlyai.in).
Determine if the email is an active candidate inquiring or applying for a job, internship, or role.

Respond with EXACTLY one word:
- "JOB" if this is a job application, resume/portfolio submission, internship inquiry, or someone asking for work/employment opportunities.
- "OTHER" if this is:
  1) A candidate just saying "Thank you", "Got it", or acknowledging a previous rejection/update.
  2) Automated notification, newsletter, spam, or marketing pitch.
  3) Not seeking employment.

Respond with ONLY the single word: JOB or OTHER.`;

  const result = await groqChat(system, `Subject: ${subject}\n\nBody:\n${body}`);
  return result.toUpperCase().includes('JOB') ? 'JOB' : 'OTHER';
}

// ── Reply generator ─────────────────────────────────────────────
async function generateReply(fromName, fromEmail, subject, body) {
  const system = `You are an AI assistant handling recruitment emails for MakerlyAI (careers@makerlyai.in), an elite AI systems and digital product agency.

CANDIDATE CONTEXT:
Read the candidate's email, portfolio/resume highlights, and subject line.
First, determine their actual first name (look in the sign-off, subject line, or body). If no real name is found, use their provided display name, or "there".

COMPANY SITUATION:
- MakerlyAI is currently operating as a compact, focused core engineering team.
- We are not actively hiring or onboarding new roles at this immediate moment.
- We genuinely review every single application and hold exceptional talent in very high regard.

REQUIREMENTS FOR YOUR REPLY:
1. Greet them warmly and personally by their real first name (e.g. "Hi [First Name],").
2. Explicitly acknowledge the specific role/skills they reached out about (e.g., Full-Stack AI Engineer, RAG, agentic workflows, etc.) so it's clear their email was actually read with attention.
3. Express genuine appreciation for their background, projects, and the initiative to connect with MakerlyAI.
4. Transparently share that we are currently keeping our core team compact and are not actively bringing on new roles right now.
5. Emphasize that their profile and portfolio are being retained in our active talent pipeline, and when relevant project or expansion openings arise, we will reach out to them directly.
6. End with encouraging, positive words for their ongoing projects and career journey.

STRICT CONSTRAINTS:
- Do NOT sound like an automated robot or boiler-plate rejection template. Keep it conversational, warm, and professional.
- Do NOT mention any individual founder or personal names (do not mention Tousif). Only sign off and speak collectively as Team MakerlyAI.
- Do NOT promise a guaranteed job offer or definite timeline.
- Do NOT mention company limitations negatively (e.g., no "budget constraints" or "small company issues").
- Length: Around 140 - 220 words.
- Sign off cleanly as:
Warm regards,
Team MakerlyAI

Return ONLY the email body text. Do not include markdown codeblocks or subject lines.`;

  return groqChat(system, `From Display: ${fromName}\nFrom Email: ${fromEmail}\nSubject: ${subject}\n\nCandidate Email Content:\n${body}`);
}

import { renderCareerEmailHtml } from './career-email-template.mjs';

// ── SMTP sender ─────────────────────────────────────────────────
function createTransporter() {
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: true,
    auth: {
      user: CAREERS_MAIL_USER.trim(),
      pass: CAREERS_APP_PASSWORD.trim(),
    },
  });
}

async function sendReply(to, subject, replyBody, candidateName = 'there') {
  const transporter = createTransporter();
  const replySubject = subject.toLowerCase().startsWith('re:') ? subject : `Re: ${subject}`;
  const htmlContent = renderCareerEmailHtml({
    candidateName,
    replyText: replyBody,
  });

  const info = await transporter.sendMail({
    from: `"MakerlyAI Careers" <${CAREERS_MAIL_USER.trim()}>`,
    to,
    subject: replySubject,
    text: replyBody,
    html: htmlContent,
  });
  return info.messageId;
}

// ── IMAP reader ─────────────────────────────────────────────────
function connectImap() {
  return new Promise((resolve, reject) => {
    const imap = new Imap({
      user: CAREERS_MAIL_USER,
      password: CAREERS_APP_PASSWORD,
      host: 'imap.gmail.com',
      port: 993,
      tls: true,
      tlsOptions: { rejectUnauthorized: false },
    });

    imap.once('ready', () => resolve(imap));
    imap.once('error', reject);
    imap.connect();
  });
}

function openInbox(imap) {
  return new Promise((resolve, reject) => {
    imap.openBox('INBOX', false, (err, box) => {
      if (err) reject(err);
      else resolve(box);
    });
  });
}

function searchEmails(imap, criteria) {
  return new Promise((resolve, reject) => {
    imap.search(criteria, (err, results) => {
      if (err) reject(err);
      else resolve(results || []);
    });
  });
}

function fetchAndParse(imap, uids) {
  return new Promise((resolve, reject) => {
    if (!uids.length) return resolve([]);

    const emails = [];
    const f = imap.fetch(uids, { bodies: '', markSeen: true });

    f.on('message', (msg, seqno) => {
      let buffer = '';
      let attrs = null;

      msg.on('body', (stream) => {
        stream.on('data', (chunk) => { buffer += chunk.toString('utf8'); });
      });
      msg.once('attributes', (a) => { attrs = a; });
      msg.once('end', () => {
        emails.push({ raw: buffer, attrs, seqno });
      });
    });

    f.once('error', reject);
    f.once('end', async () => {
      const parsed = [];
      for (const e of emails) {
        try {
          const mail = await simpleParser(e.raw);
          parsed.push({
            uid: e.attrs?.uid,
            from: mail.from?.value?.[0]?.address || '',
            fromName: mail.from?.value?.[0]?.name || '',
            subject: mail.subject || '(no subject)',
            text: mail.text || '',
            date: mail.date,
          });
        } catch (parseErr) {
          console.error(`  ⚠ Parse error for seq ${e.seqno}: ${parseErr.message}`);
        }
      }
      resolve(parsed);
    });
  });
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  // Validate
  const missing = [];
  if (!CAREERS_MAIL_USER)    missing.push('CAREERS_MAIL_USER');
  if (!CAREERS_APP_PASSWORD) missing.push('CAREERS_APP_PASSWORD');
  if (!GROQ_API_KEY)         missing.push('GROQ_API_KEY');
  if (missing.length) {
    console.error(`\n❌ Missing env vars: ${missing.join(', ')}`);
    process.exit(1);
  }

  console.log('\n╔══════════════════════════════════════════════════════╗');
  console.log('║   MakerlyAI · Career Inbox Auto-Responder           ║');
  console.log('╚══════════════════════════════════════════════════════╝');
  console.log(`\n📧 Connecting to ${CAREERS_MAIL_USER} via IMAP...\n`);

  let imap;
  try {
    imap = await connectImap();
  } catch (err) {
    console.error(`❌ IMAP connection failed: ${err.message}`);
    process.exit(1);
  }

  console.log('✅ Connected. Opening INBOX...\n');
  await openInbox(imap);

  // Fetch ALL emails (not just unseen) so we can respond to everything
  console.log('🔍 Searching for ALL emails in inbox...\n');
  const allUids = await searchEmails(imap, ['ALL']);

  if (!allUids.length) {
    console.log('📭 No emails found in the inbox. Nothing to do.\n');
    imap.end();
    return;
  }

  console.log(`📬 Found ${allUids.length} email(s). Fetching & parsing...\n`);
  const emails = await fetchAndParse(imap, allUids);

  // Filter out self-sent emails and known system/notification senders
  const incoming = emails.filter(e => {
    const from = (e.from || '').toLowerCase();
    if (!from || from === CAREERS_MAIL_USER.toLowerCase()) return false;
    if (from.includes('google.com') || from.includes('noreply') || from.includes('no-reply') || from.includes('mailer-daemon')) {
      return false;
    }
    return true;
  });

  if (!incoming.length) {
    console.log('📭 No candidate emails found to process. Nothing to do.\n');
    imap.end();
    return;
  }

  // Deduplicate by sender email (keep the latest email from each candidate)
  const candidateMap = new Map();
  for (const email of incoming) {
    const key = email.from.toLowerCase().trim();
    // Since emails are fetched in order, later entries are newer
    candidateMap.set(key, email);
  }
  const uniqueEmails = Array.from(candidateMap.values());

  console.log(`📨 Found ${incoming.length} total message(s) across ${uniqueEmails.length} unique sender(s).\n`);
  console.log('═'.repeat(60));

  let replied = 0;
  let skipped = 0;

  for (const email of uniqueEmails) {
    const shortBody = (email.text || '').substring(0, 300).replace(/\s+/g, ' ');

    console.log(`\n📩 From: ${email.fromName || email.from}`);
    console.log(`   Email: ${email.from}`);
    console.log(`   Subject: ${email.subject}`);
    console.log(`   Date: ${email.date ? email.date.toLocaleString() : 'unknown'}`);
    console.log(`   Preview: ${shortBody.substring(0, 110)}...`);

    // Classify
    console.log('   ⏳ Classifying intent...');
    let intent;
    try {
      intent = await classifyIntent(email.subject, (email.text || '').substring(0, 1500));
    } catch (err) {
      console.log(`   ❌ Classification failed: ${err.message}. Skipping.`);
      skipped++;
      continue;
    }

    if (intent !== 'JOB') {
      console.log('   ⏩ Not an active job application or already acknowledged — skipped.');
      skipped++;
      continue;
    }

    console.log('   🎯 Active opportunity/job application confirmed.');

    // Generate reply
    console.log('   ✨ Generating customized MakerlyAI response...');
    let replyText;
    try {
      replyText = await generateReply(
        email.fromName || '',
        email.from,
        email.subject,
        (email.text || '').substring(0, 2500)
      );
    } catch (err) {
      console.log(`   ❌ Reply generation failed: ${err.message}. Skipping.`);
      skipped++;
      continue;
    }

    console.log('\n' + '─'.repeat(45));
    console.log(replyText);
    console.log('─'.repeat(45) + '\n');

    // Send
    console.log(`   📤 Sending reply from careers@makerlyai.in to ${email.from}...`);
    try {
      const msgId = await sendReply(email.from, email.subject, replyText, email.fromName || '');
      console.log(`   ✅ Sent! Message ID: ${msgId}`);
      replied++;
    } catch (err) {
      console.log(`   ❌ Send failed: ${err.message}`);
      skipped++;
    }

    // Small delay between emails to respect SMTP and Groq rate limits
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log('\n' + '═'.repeat(60));
  console.log(`\n📊 Summary:`);
  console.log(`   Total incoming:  ${incoming.length}`);
  console.log(`   Replied:         ${replied}`);
  console.log(`   Skipped/Failed:  ${skipped}`);
  console.log(`\n✅ Done!\n`);

  imap.end();
}

main().catch(err => {
  console.error(`\n💥 Fatal error: ${err.message}\n`);
  process.exit(1);
});
