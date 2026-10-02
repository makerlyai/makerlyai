#!/usr/bin/env node
// ─────────────────────────────────────────────────────────────────
//  MakerlyAI Career Email Responder
//  Usage:  node career-responder.mjs
//
//  Reads candidate email details interactively, classifies intent,
//  generates a warm professional reply via Groq LLaMA, and sends
//  it from careers@makerlyai.in using Google Workspace SMTP.
// ─────────────────────────────────────────────────────────────────

import 'dotenv/config';
import nodemailer from 'nodemailer';
import readline from 'readline/promises';

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

// ── Helpers ─────────────────────────────────────────────────────

/** Send a chat completion request to Groq */
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

/** Classify whether the email is a job-related inquiry */
async function classifyIntent(subject, body) {
  const system = `You are an intent classifier. Given an email subject and body sent to careers@makerlyai.in, respond with EXACTLY one word:
- "JOB" if the email is a job application, resume submission, opportunity request, or candidate inquiry about joining.
- "OTHER" if it is spam, sales pitch, unrelated query, or anything that is NOT about a job/career.
Respond with ONLY the single word, nothing else.`;

  const user = `Subject: ${subject}\n\nBody:\n${body}`;
  const label = await groqChat(system, user);
  return label.toUpperCase().includes('JOB') ? 'JOB' : 'OTHER';
}

/** Generate a warm, professional reply for a job-related email */
async function generateReply(candidateName, subject, body) {
  const system = `You are writing an email reply on behalf of MakerlyAI (careers@makerlyai.in), an AI systems and digital product agency.

CONTEXT:
- MakerlyAI is a focused core engineering team that builds AI-powered websites, automation, and business systems.
- We are NOT actively hiring right now.
- We genuinely value every candidate who reaches out.

YOUR TASK:
Write a reply email that:
1. Greets the candidate warmly by name (use "${candidateName}" or "there" if unknown).
2. Appreciates their interest, skills, and the effort they put into reaching out.
3. Clearly but gently states that we are currently a compact team and not actively expanding.
4. Assures them their profile has been noted and they WILL be contacted when a relevant role opens.
5. Ends with an encouraging, positive note — never leave them feeling dismissed.

RULES:
- Tone: Polite, warm, premium, and human. NOT corporate-robotic.
- Do NOT mention any individual founder or personal names (do not mention Tousif). Speak collectively as Team MakerlyAI.
- Do NOT promise a job.
- Do NOT mention "limited budget", "no funding", or any negativity about the company.
- Do NOT sound like a template or auto-reply.
- Keep it 150-250 words.
- Sign off as:
Warm regards,
Team MakerlyAI
- Do NOT include a subject line — just the body.`;

  const user = `Candidate Name: ${candidateName}\nSubject: ${subject}\n\nEmail Body:\n${body}`;
  return groqChat(system, user);
}

import { renderCareerEmailHtml } from './career-email-template.mjs';

/** Send the email via SMTP */
async function sendEmail(to, subject, htmlBody, candidateName = 'there') {
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: true,
    auth: {
      user: CAREERS_MAIL_USER.trim(),
      pass: CAREERS_APP_PASSWORD.trim(),
    },
  });

  const replySubject = subject.toLowerCase().startsWith('re:') ? subject : `Re: ${subject}`;
  const htmlContent = renderCareerEmailHtml({
    candidateName,
    replyText: htmlBody,
  });

  const info = await transporter.sendMail({
    from: `"MakerlyAI Careers" <${CAREERS_MAIL_USER.trim()}>`,
    to,
    subject: replySubject,
    text: htmlBody,
    html: htmlContent,
  });

  return info.messageId;
}

// ── Main ────────────────────────────────────────────────────────
async function main() {
  // Validate env
  const missing = [];
  if (!CAREERS_MAIL_USER)   missing.push('CAREERS_MAIL_USER');
  if (!CAREERS_APP_PASSWORD) missing.push('CAREERS_APP_PASSWORD');
  if (!GROQ_API_KEY)         missing.push('GROQ_API_KEY');
  if (missing.length) {
    console.error(`\n❌ Missing env vars: ${missing.join(', ')}`);
    console.error('   Add them to .env.local and re-run.\n');
    process.exit(1);
  }

  console.log('\n╔══════════════════════════════════════════════════╗');
  console.log('║     MakerlyAI  ·  Career Email Responder        ║');
  console.log('╚══════════════════════════════════════════════════╝\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  const candidateEmail = await rl.question('📧  Candidate email address: ');
  const candidateName  = await rl.question('👤  Candidate name (or press Enter if unknown): ') || 'there';
  const emailSubject   = await rl.question('📌  Email subject line: ');

  console.log('📝  Paste the email body below (type END on a new line when done):');
  const bodyLines = [];
  for await (const line of rl) {
    if (line.trim().toUpperCase() === 'END') break;
    bodyLines.push(line);
  }
  const emailBody = bodyLines.join('\n');

  console.log('\n⏳ Classifying intent...');
  const intent = await classifyIntent(emailSubject, emailBody);

  if (intent !== 'JOB') {
    console.log('\n⚠️  This doesn\'t look like a job application or career inquiry.');
    const proceed = await rl.question('    Reply anyway? (y/n): ');
    if (proceed.toLowerCase() !== 'y') {
      console.log('    Skipped. No email sent.\n');
      rl.close();
      return;
    }
  }

  console.log('✨ Generating reply...\n');
  const replyText = await generateReply(candidateName, emailSubject, emailBody);

  console.log('─'.repeat(50));
  console.log(replyText);
  console.log('─'.repeat(50));

  const confirm = await rl.question('\n📤  Send this reply? (y/n): ');
  if (confirm.toLowerCase() !== 'y') {
    console.log('    Cancelled. No email sent.\n');
    rl.close();
    return;
  }

  console.log('\n📨 Sending via careers@makerlyai.in ...');
  try {
    const msgId = await sendEmail(candidateEmail, emailSubject, replyText, candidateName);
    console.log(`✅ Sent!  Message ID: ${msgId}\n`);
  } catch (err) {
    console.error(`❌ Failed to send: ${err.message}\n`);
  }

  rl.close();
}

main();
