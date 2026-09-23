import { NextResponse } from "next/server";
import { supabase } from "@/lib/crm/supabase";
import { SEED_LEADS } from "@/lib/crm/seed-data";

export const runtime = "nodejs";

async function verifyCrmSession(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return { authorized: false, error: "Unauthorized: Missing CRM authentication token." };
  }

  const token = authHeader.replace("Bearer ", "").trim();
  if (!token) {
    return { authorized: false, error: "Unauthorized: Empty authentication token." };
  }

  const now = new Date().toISOString();
  const { data: session, error } = await supabase
    .from("crm_sessions")
    .select("*")
    .eq("session_token", token)
    .gt("expires_at", now)
    .single();

  if (error || !session) {
    return { authorized: false, error: "Unauthorized: Invalid or expired session." };
  }

  return { authorized: true, session };
}

export async function GET(request: Request) {
  const auth = await verifyCrmSession(request);
  if (!auth.authorized) {
    return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
  }

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
    const auth = await verifyCrmSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
    }

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

