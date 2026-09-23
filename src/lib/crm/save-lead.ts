import { supabase } from "./supabase";
import { sendLeadAlertEmail } from "./email-alerts";

export interface InboundLeadInput {
  name?: string;
  phone?: string;
  email?: string;
  businessName?: string;
  projectDetails: string;
  timeSlot?: string;
  source: "Website Contact Form" | "AI Voice/Chat Assistant" | "Direct CRM Inquiry";
}

export interface SaveLeadResult {
  success: boolean;
  leadId?: string;
  emailSent: boolean;
  supabaseSaved: boolean;
  error?: string;
}

/**
 * Universally captures an inbound lead from Contact Form or AI Chatbot,
 * persists it directly into Supabase (crm_leads + crm_activities),
 * and dispatches luxury lead alert emails to getmakerlyai@gmail.com and iamtousifraza@gmail.com.
 */
export async function saveInboundLead(input: InboundLeadInput): Promise<SaveLeadResult> {
  const clientName = (input.name?.trim() || "Inbound Prospect").slice(0, 100);
  const phone = input.phone?.trim() || "Not provided";
  const email = input.email?.trim() || "";
  const businessName = (input.businessName?.trim() || "Direct Client Project").slice(0, 120);
  const requirement = (input.projectDetails?.trim() || "Digital product / MVP build").slice(0, 2000);
  const timeSlot = input.timeSlot?.trim() || undefined;
  const source = input.source;

  const notesText = [
    `Source: ${source}`,
    timeSlot ? `Preferred Consultation Time: ${timeSlot}` : null,
    `Logged: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} (IST)`
  ].filter(Boolean).join("\n");

  let supabaseSaved = false;
  let createdLeadId = "lead-" + Date.now().toString(36);

  // 1. Persist directly into Supabase crm_leads table
  try {
    const { data: inserted, error: leadError } = await supabase
      .from("crm_leads")
      .insert({
        client_name: clientName,
        phone,
        email: email || null,
        business_name: businessName,
        requirement,
        notes: notesText,
        status: "new",
        deal_value: 99000,
        is_high_ticket: false,
        commission_amount: 0,
        created_by_email: "inbound@makerlyai.in",
        created_by_name: source,
        created_by_role: "system",
      })
      .select("id")
      .single();

    if (!leadError && inserted?.id) {
      supabaseSaved = true;
      createdLeadId = inserted.id;

      // Log activity in crm_activities
      try {
        await supabase.from("crm_activities").insert({
          lead_id: inserted.id,
          type: "status_change",
          title: `New lead captured from ${source}`,
          description: `${clientName} submitted requirements via ${source}.${timeSlot ? ` Preferred time: ${timeSlot}.` : ""}`,
          created_by_name: source,
        });
      } catch (actErr) {
        console.warn("[CRM Activities] Activity log notice:", actErr);
      }
    } else if (leadError) {
      console.warn("[CRM Supabase] Notice inserting into crm_leads:", leadError.message);
    }
  } catch (dbErr) {
    console.warn("[CRM Supabase] Database execution notice:", dbErr);
  }

  // 2. Dispatch luxury email alerts to both getmakerlyai@gmail.com and iamtousifraza@gmail.com
  let emailSent = false;
  try {
    const emailRes = await sendLeadAlertEmail({
      name: clientName,
      email: email || "not-provided@lead.makerlyai.in",
      phone,
      projectDetails: requirement,
      timeSlot,
      source,
    });
    emailSent = emailRes.success;
  } catch (mailErr) {
    console.error("[Email Alert] Failed to dispatch email alerts:", mailErr);
  }

  return {
    success: supabaseSaved || emailSent,
    leadId: createdLeadId,
    emailSent,
    supabaseSaved,
  };
}
