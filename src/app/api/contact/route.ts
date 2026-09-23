import { Client } from "@notionhq/client";
import { NextResponse } from "next/server";
import { saveInboundLead } from "@/lib/crm/save-lead";

export const runtime = "nodejs";

type ContactRequestBody = {
  name: string;
  email: string;
  phone: string;
  projectDetails: string;
  timeSlot?: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeField(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function validateContactPayload(
  payload: unknown,
): { data: ContactRequestBody } | { error: string } {
  if (!payload || typeof payload !== "object") {
    return { error: "Invalid request body." };
  }

  const rawPayload = payload as Record<string, unknown>;

  const data: ContactRequestBody = {
    name: normalizeField(rawPayload.name),
    email: normalizeField(rawPayload.email),
    phone: normalizeField(rawPayload.phone),
    projectDetails: normalizeField(rawPayload.projectDetails),
    timeSlot: normalizeField(rawPayload.timeSlot || rawPayload.meetingTime),
  };

  // Must have name and at least phone or email, plus projectDetails
  if (!data.name || (!data.email && !data.phone) || !data.projectDetails) {
    return { error: "Name, project details, and at least one contact method (phone or email) are required." };
  }

  if (data.email && !EMAIL_PATTERN.test(data.email)) {
    return { error: "Please provide a valid email address." };
  }

  return { data };
}

async function saveLeadToNotion(
  data: ContactRequestBody,
  createdAt: string,
) {
  const notionApiKey = process.env.NOTION_API_KEY?.trim();
  const notionDatabaseId = process.env.NOTION_DATABASE_ID?.trim();

  if (!notionApiKey || !notionDatabaseId) return;

  try {
    const notion = new Client({ auth: notionApiKey });
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
          email: data.email || "not-provided@lead.makerlyai.in",
        },
        Phone: {
          phone_number: data.phone || "",
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
  } catch (err) {
    console.warn("[Notion] Optional Notion sync notice:", err);
  }
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
        },
        { status: 400 },
      );
    }

    const data = validation.data;
    const createdAt = new Date().toISOString();

    // 1. Save lead to Supabase (crm_leads + crm_activities) and dispatch dual email alerts
    const leadResult = await saveInboundLead({
      name: data.name,
      phone: data.phone,
      email: data.email,
      projectDetails: data.projectDetails,
      timeSlot: data.timeSlot,
      source: "Website Contact Form",
    });

    // 2. Optionally sync with Notion if configured
    await saveLeadToNotion(data, createdAt);

    return NextResponse.json(
      {
        success: true,
        message: "Your project brief has been received successfully. Tousif Raza will review it within 24 hours.",
        leadId: leadResult.leadId,
        emailSent: leadResult.emailSent,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("Unexpected contact submission error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to process the request at this moment.",
        error: error.message,
      },
      { status: 500 },
    );
  }
}