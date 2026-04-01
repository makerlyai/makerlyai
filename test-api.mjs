import { Client } from "@notionhq/client";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testEmail() {
  console.log("Testing Email with", process.env.GMAIL_USER);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: "test@example.com",
      subject: "Test email",
      text: "Testing email functionality",
    });
    console.log("Email sent successfully!");
  } catch (err) {
    console.error("Email Error:", err);
  }
}

async function testNotion() {
  console.log("Testing Notion...");
  const notion = new Client({ auth: process.env.NOTION_API_KEY });
  try {
    await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        Name: { title: [{ text: { content: "Test Lead" } }] },
        Email: { email: "test@example.com" },
        Phone: { phone_number: "1234567890" },
        "Project Details": { rich_text: [{ text: { content: "Test details" } }] },
        Status: { select: { name: "New" } },
        "Created At": { date: { start: new Date().toISOString() } },
      },
    });
    console.log("Notion row created successfully!");
  } catch (err) {
    console.error("Notion Error:", err.message || err);
  }
}

await testEmail();
await testNotion();
