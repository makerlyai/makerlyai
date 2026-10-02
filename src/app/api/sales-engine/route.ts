import { NextResponse } from "next/server";
import { getPipelineStats, loadCachedLeads } from "@/lib/sales-engine/crm-sync.mjs";
import { loadDailyTracker } from "@/lib/sales-engine/deliverability-rotator.mjs";
import { loadExperiments, createExperiment } from "@/lib/sales-engine/growth-experiment-engine.mjs";
import { discoverTargetsFromWeb } from "@/lib/sales-engine/scrapers/serp-discovery.mjs";
import { enrichWebsite } from "@/lib/sales-engine/scrapers/website-enricher.mjs";
import { qualifyLead } from "@/lib/sales-engine/qualifier.mjs";
import { syncLeadToCRM } from "@/lib/sales-engine/crm-sync.mjs";
import { generateSequence } from "@/lib/sales-engine/sequence-generator.mjs";

export const runtime = "nodejs";

/**
 * GET /api/sales-engine
 * Returns pipeline metrics, daily mailbox status, and active experiments
 */
export async function GET() {
  try {
    const stats = getPipelineStats();
    const tracker = loadDailyTracker();
    const experiments = loadExperiments();
    const recentLeads = loadCachedLeads().slice(0, 20);

    return NextResponse.json({
      success: true,
      stats,
      dailyTracker: tracker,
      experiments,
      leads: recentLeads,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/sales-engine
 * Dispatches actions: discover, qualify, add_lead, experiment
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "discover": {
        const niche = body.niche || "d2c";
        const limit = Number(body.limit) || 5;
        const targets = await discoverTargetsFromWeb({ niche, limit });

        const enrichedLeads = [];
        for (const t of targets) {
          const enrichment: any = await enrichWebsite(t.websiteUrl);
          t.emails = enrichment.emails || [];
          t.phones = enrichment.phones || [];
          t.techStack = enrichment.techStack || [];
          t.painPointsIdentified = enrichment.painPointsIdentified || [];
          t.metaDescription = enrichment.metaDescription || "";
          t.h1s = enrichment.h1s || [];
          t.hasValidMx = enrichment.hasValidMx;
          if (t.emails.length > 0) t.email = t.emails[0];

          await syncLeadToCRM(t);
          enrichedLeads.push(t);
        }

        return NextResponse.json({
          success: true,
          action: "discover",
          count: enrichedLeads.length,
          leads: enrichedLeads,
        });
      }

      case "qualify": {
        const leads = loadCachedLeads();
        const unrated = leads.filter((l: any) => !l.qualificationScore || l.status === "Discovered");
        const qualifiedResults = [];

        for (const lead of unrated.slice(0, 5)) {
          const evalRes = await qualifyLead(lead);
          lead.qualificationScore = evalRes.qualificationScore;
          lead.tier = evalRes.tier;
          lead.isHighTicket = evalRes.isHighTicket;
          lead.dealValue = evalRes.dealValue;
          lead.personalizedHook = evalRes.personalizedHook;
          lead.recommendedOffer = evalRes.recommendedOffer;
          lead.status = evalRes.qualificationScore >= 60 ? "Qualified" : "Unqualified";

          if (evalRes.qualificationScore >= 55) {
            lead.sequence = await generateSequence(lead);
          }

          await syncLeadToCRM(lead);
          qualifiedResults.push(lead);
        }

        return NextResponse.json({
          success: true,
          action: "qualify",
          evaluatedCount: qualifiedResults.length,
          leads: qualifiedResults,
        });
      }

      case "add_lead": {
        const { url, company, name, niche, email } = body;
        if (!url) {
          return NextResponse.json(
            { success: false, error: "Missing required 'url' parameter" },
            { status: 400 }
          );
        }

        const enrichment: any = await enrichWebsite(url);
        const lead: any = {
          id: `lead-${Date.now().toString(36)}`,
          businessName: company || enrichment.domain || "Target Brand",
          clientName: name || "Decision Maker",
          websiteUrl: url,
          email: email || enrichment.emails[0] || "",
          emails: enrichment.emails,
          phones: enrichment.phones,
          techStack: enrichment.techStack,
          metaDescription: enrichment.metaDescription,
          h1s: enrichment.h1s,
          painPointsIdentified: enrichment.painPointsIdentified,
          niche: niche || "d2c",
          status: "Discovered",
        };

        const evalRes = await qualifyLead(lead);
        lead.qualificationScore = evalRes.qualificationScore;
        lead.tier = evalRes.tier;
        lead.isHighTicket = evalRes.isHighTicket;
        lead.dealValue = evalRes.dealValue;
        lead.personalizedHook = evalRes.personalizedHook;
        lead.recommendedOffer = evalRes.recommendedOffer;
        lead.status = evalRes.qualificationScore >= 60 ? "Qualified" : "Unqualified";

        if (evalRes.qualificationScore >= 55) {
          lead.sequence = await generateSequence(lead);
        }

        await syncLeadToCRM(lead);
        return NextResponse.json({ success: true, lead });
      }

      case "experiment_create": {
        const { name, hypothesis, variable, variants, metric } = body;
        const exp = createExperiment({
          name,
          hypothesis,
          variable,
          variants,
          metric: metric || "reply_rate",
        });
        return NextResponse.json({ success: true, experiment: exp });
      }

      default:
        return NextResponse.json(
          { success: false, error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
