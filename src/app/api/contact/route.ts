import { Client } from "@notionhq/client";
import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ContactRequestBody = {
  name: string;
  email: string;
  phone: string;
  projectDetails: string;
};

type ContactResults = {
  notion: boolean;
  adminEmail: boolean;
  clientEmail: boolean;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validateContactPayload(payload: unknown):
  | { data: ContactRequestBody }
  | { error: string } {
  if (!payload || typeof payload !== "object") {
    return { error: "Invalid request body." };
  }

  const rawPayload = payload as Record<string, unknown>;

  const data: ContactRequestBody = {
    name: normalizeField(rawPayload.name),
    email: normalizeField(rawPayload.email),
    phone: normalizeField(rawPayload.phone),
    projectDetails: normalizeField(rawPayload.projectDetails),
  };

  if (!data.name || !data.email || !data.phone || !data.projectDetails) {
    return { error: "All fields are required." };
  }

  if (!EMAIL_PATTERN.test(data.email)) {
    return { error: "Please provide a valid email address." };
  }

  return { data };
}

function getEnvConfig() {
  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.trim();
  const notionApiKey = process.env.NOTION_API_KEY?.trim();
  const notionDatabaseId = process.env.NOTION_DATABASE_ID?.trim();

  if (!gmailUser || !gmailAppPassword || !notionApiKey || !notionDatabaseId) {
    return null;
  }

  return {
    gmailUser,
    gmailAppPassword,
    notionApiKey,
    notionDatabaseId,
  };
}

async function saveLeadToNotion(
  notion: Client,
  notionDatabaseId: string,
  data: ContactRequestBody,
  createdAt: string,
) {
  await notion.pages.create({
    parent: {
      database_id: notionDatabaseId,
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: data.name,
            },
          },
        ],
      },
      Email: {
        email: data.email,
      },
      Phone: {
        phone_number: data.phone,
      },
      "Project Details": {
        rich_text: [
          {
            text: {
              content: data.projectDetails,
            },
          },
        ],
      },
      Status: {
        select: {
          name: "New",
        },
      },
      "Created At": {
        date: {
          start: createdAt,
        },
      },
    },
  });
}

function buildAdminNotificationText(data: ContactRequestBody) {
  return [
    "A new lead has been submitted through Makerlyai.",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    "",
    "Project Details:",
    data.projectDetails,
  ].join("\n");
}

function buildClientConfirmationText(name: string) {
  return [
    `Hello ${name},`,
    "",
    "Thank you for reaching out to Makerlyai.",
    "We’ve received your project request and our team will review it shortly.",
    "",
    "You can expect a response within 24 hours.",
    "",
    "Best regards",
    "Makerlyai Team",
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const validation = validateContactPayload(payload);

    if ("error" in validation) {
      return NextResponse.json(
        {
          success: false,
          message: validation.error,
          results: {
            notion: false,
            adminEmail: false,
            clientEmail: false,
          } satisfies ContactResults,
        },
        { status: 400 },
      );
    }

    const config = getEnvConfig();

    if (!config) {
      return NextResponse.json(
        {
          success: false,
          message: "Server configuration is incomplete.",
          results: {
            notion: false,
            adminEmail: false,
            clientEmail: false,
          } satisfies ContactResults,
        },
        { status: 500 },
      );
    }

    const data = validation.data;
    const createdAt = new Date().toISOString();
    const notion = new Client({ auth: config.notionApiKey });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: config.gmailUser,
        pass: config.gmailAppPassword,
      },
    });

    const results: ContactResults = {
      notion: false,
      adminEmail: false,
      clientEmail: false,
    };

    try {
      await saveLeadToNotion(notion, config.notionDatabaseId, data, createdAt);
      results.notion = true;
    } catch (error) {
      console.error("Failed to save lead to Notion.", error);
    }

    try {
      await transporter.sendMail({
        from: config.gmailUser,
        to: "getmakerlyai@gmail.com",
        subject: "🚀 New Lead — Makerlyai",
        text: buildAdminNotificationText(data),
        replyTo: data.email,
      });
      results.adminEmail = true;
    } catch (error) {
      console.error("Failed to send admin notification email.", error);
    }

    try {
      await transporter.sendMail({
        from: config.gmailUser,
        to: data.email,
        subject: "We received your request — Makerlyai",
        text: buildClientConfirmationText(data.name),
      });
      results.clientEmail = true;
    } catch (error) {
      console.error("Failed to send client confirmation email.", error);
    }

    const success = results.notion || results.adminEmail || results.clientEmail;

    if (!success) {
      return NextResponse.json(
        {
          success: false,
          message: "We could not process your request at this time.",
          results,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your request has been received successfully.",
        results,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Unexpected contact submission error.", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process the request.",
        results: {
          notion: false,
          adminEmail: false,
          clientEmail: false,
        } satisfies ContactResults,
      },
      { status: 500 },
    );
  }
}
