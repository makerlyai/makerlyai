import { NextResponse } from "next/server";
import { SEED_LEADS } from "@/lib/crm/seed-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const partnerId = searchParams.get("partnerId");

  let filtered = [...SEED_LEADS];
  if (status && status !== "all") {
    filtered = filtered.filter((l) => l.status === status);
  }
  if (partnerId) {
    filtered = filtered.filter((l) => l.createdBy === partnerId);
  }

  return NextResponse.json({ success: true, leads: filtered });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientName, phone, email, businessName, requirement, notes, partnerId, partnerName } = body;

    if (!clientName || !phone || !email || !businessName || !requirement) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newLead = {
      id: "lead-" + Date.now().toString(36),
      clientName,
      phone,
      email,
      businessName,
      requirement,
      notes: notes || "",
      status: "New",
      assignedTo: null,
      assignedToName: null,
      createdBy: partnerId || "user-partner-1",
      createdByName: partnerName || "Partner",
      dealValue: 0,
      commission: 0,
      nextFollowupDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, lead: newLead }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create lead" },
      { status: 500 }
    );
  }
}

