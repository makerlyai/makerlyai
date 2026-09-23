import { NextResponse } from "next/server";
import { supabase } from "@/lib/crm/supabase";
import { SEED_LEADS } from "@/lib/crm/seed-data";
import { Lead } from "@/lib/crm/types";

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

  try {
    // 1. Fetch real leads from Supabase crm_leads table
    const { data: dbLeads, error } = await supabase
      .from("crm_leads")
      .select("*")
      .order("created_at", { ascending: false });

    let leads: Lead[] = [];

    if (!error && dbLeads && dbLeads.length > 0) {
      leads = dbLeads.map((row: any) => ({
        id: row.id,
        clientName: row.client_name,
        phone: row.phone,
        email: row.email || "",
        businessName: row.business_name,
        requirement: row.requirement,
        notes: row.notes || "",
        status: (row.status ? (row.status.charAt(0).toUpperCase() + row.status.slice(1)) : "New") as any,
        assignedTo: null,
        assignedToName: null,
        createdBy: row.created_by_user_id || "system",
        createdByName: row.created_by_name || "Inbound Pipeline",
        dealValue: Number(row.deal_value) || 99000,
        commission: Number(row.commission_amount) || 0,
        commissionRate: row.is_high_ticket ? 20 : 15,
        isHighTicket: Boolean(row.is_high_ticket),
        nextFollowupDate: new Date(Date.now() + 86400000 * 2).toISOString(),
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      }));
    }

    // Combine with seed demo leads so the CRM dashboard always has context
    const allLeads = [...leads, ...SEED_LEADS];

    let filtered = allLeads;
    if (status && status !== "all") {
      filtered = filtered.filter((l) => l.status === status);
    }
    if (partnerId) {
      filtered = filtered.filter((l) => l.createdBy === partnerId);
    }

    return NextResponse.json({ success: true, leads: filtered });
  } catch (err: any) {
    console.error("[Leads GET] Error querying crm_leads:", err);
    return NextResponse.json({ success: true, leads: SEED_LEADS });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyCrmSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error }, { status: 401 });
    }

    const body = await request.json();
    const { clientName, phone, email, businessName, requirement, notes, partnerId, partnerName, dealValue } = body;

    if (!clientName || !phone || !email || !businessName || !requirement) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const val = Number(dealValue) || 99000;
    const isHigh = val >= 100000;

    // Insert into Supabase crm_leads table
    const { data: inserted, error } = await supabase
      .from("crm_leads")
      .insert({
        client_name: clientName,
        phone,
        email,
        business_name: businessName,
        requirement,
        notes: notes || "",
        status: "new",
        deal_value: val,
        is_high_ticket: isHigh,
        commission_amount: isHigh ? val * 0.2 : val * 0.15,
        created_by_user_id: partnerId ? null : null,
        created_by_email: auth.session?.email || "partner@makerlyai.in",
        created_by_name: partnerName || auth.session?.email?.split("@")[0] || "Partner",
        created_by_role: auth.session?.role || "partner",
      })
      .select("*")
      .single();

    if (error || !inserted) {
      throw new Error(error?.message || "Failed to persist lead to database.");
    }

    const newLead: Lead = {
      id: inserted.id,
      clientName: inserted.client_name,
      phone: inserted.phone,
      email: inserted.email || "",
      businessName: inserted.business_name,
      requirement: inserted.requirement,
      notes: inserted.notes || "",
      status: "New",
      assignedTo: null,
      assignedToName: null,
      createdBy: partnerId || auth.session?.id || "partner",
      createdByName: partnerName || "Partner",
      dealValue: val,
      commission: isHigh ? val * 0.2 : val * 0.15,
      commissionRate: isHigh ? 20 : 15,
      isHighTicket: isHigh,
      nextFollowupDate: new Date(Date.now() + 86400000 * 2).toISOString(),
      createdAt: inserted.created_at,
      updatedAt: inserted.updated_at,
    };

    return NextResponse.json({ success: true, lead: newLead }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || "Failed to create lead" },
      { status: 500 }
    );
  }
}
