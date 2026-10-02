import { NextResponse } from "next/server";
import {
  getPipelineStats,
  loadCachedLeads,
  syncLeadToCRM,
  updateLeadStatusInCRM,
  saveLeadProposal,
  deleteLeadFromCRM,
} from "@/lib/sales-engine/crm-sync.mjs";
import {
  loadDailyTracker,
  getNextAvailableMailbox,
  sendOutreachEmail,
  getRandomHumanDelay,
} from "@/lib/sales-engine/deliverability-rotator.mjs";
import { loadExperiments, createExperiment } from "@/lib/sales-engine/growth-experiment-engine.mjs";
import { discoverTargetsFromWeb } from "@/lib/sales-engine/scrapers/serp-discovery.mjs";
import { enrichWebsite } from "@/lib/sales-engine/scrapers/website-enricher.mjs";
import { qualifyLead } from "@/lib/sales-engine/qualifier.mjs";
import { generateSequence } from "@/lib/sales-engine/sequence-generator.mjs";
import { generateProposalAndBrief } from "@/lib/sales-engine/proposal-generator.mjs";
import { buildSalesEmailHtml, buildSalesEmailText } from "@/lib/sales-engine/email-template.mjs";
import { SALES_ENGINE_CONFIG } from "@/lib/sales-engine/config.mjs";

export const runtime = "nodejs";

/**
 * GET /api/sales-engine
 * Returns pipeline metrics, daily mailbox status, leads, and active experiments
 */
export async function GET() {
  try {
    const stats = getPipelineStats();
    const tracker = loadDailyTracker();
    const experiments = loadExperiments();
    const allLeads = loadCachedLeads();

    return NextResponse.json({
      success: true,
      stats,
      dailyTracker: tracker,
      experiments,
      leads: allLeads,
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
 * Dispatches autonomous actions: autopilot, discover, qualify, campaign, send_single_touch, update_lead_stage, generate_proposal, delete_lead, add_lead, experiment_create
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    switch (action) {
      // ─────────────────────────────────────────────────────────────
      // 1. AUTONOMOUS FLYWHEEL: End-to-end Auto-Pilot Cycle
      // ─────────────────────────────────────────────────────────────
      case "autopilot": {
        const niche = body.niche || "b2b";
        const limit = Number(body.limit) || 3;
        const autoOutreach = Boolean(body.autoOutreach);
        const dryRun = body.dryRun !== false;

        const logs: any[] = [];
        const addLog = (stage: string, message: string, level: "info" | "success" | "warning" = "info") => {
          logs.push({
            id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            timestamp: new Date().toLocaleTimeString("en-IN", { hour12: false }),
            stage,
            message,
            level,
          });
        };

        addLog("Scrapling Engine", `[D4Vinci/Scrapling] Initializing stealth crawler for niche [${niche.toUpperCase()}]...`);

        // Step 1: Discover targets using Scrapling Python engine with web fallback
        let targets: any[] = [];
        try {
          const { execSync } = await import("child_process");
          const pyCmd = `python src/lib/sales-engine/scrapers/scrapling_harvester.py --niche ${niche} --limit ${limit}`;
          const pyOutput = execSync(pyCmd, { encoding: "utf-8", timeout: 35000 });
          const parsed = JSON.parse(pyOutput);
          if (parsed.leads && parsed.leads.length > 0) {
            targets = parsed.leads;
            addLog("Scrapling Engine", `Stealth crawler extracted ${targets.length} target domains via Patchright.`, "success");
          }
        } catch (e: any) {
          addLog("Scrapling Engine", `Scrapling headless process notice: running Node stealth search fallback...`, "warning");
        }

        if (targets.length < limit) {
          const fallback = await discoverTargetsFromWeb({ niche, limit: limit - targets.length, query: body.query || null });
          targets.push(...fallback);
          addLog("SERP Discovery", `Discovered ${fallback.length} targets via unrolled query search.`, "info");
        }

        // Step 2: Website Enrichment & DNS MX Record Validation
        addLog("Lead Extractor", `[Madi-S/Lead-Generation & OpenOutreach] Deep crawling targets for emails, tech stack & MX records...`);
        const enrichedLeads: any[] = [];

        for (const t of targets) {
          try {
            const enrichment: any = await enrichWebsite(t.websiteUrl);
            t.emails = enrichment.emails || [];
            t.phones = enrichment.phones || [];
            t.techStack = enrichment.techStack || [];
            t.painPointsIdentified = enrichment.painPointsIdentified || [];
            t.metaDescription = enrichment.metaDescription || "";
            t.h1s = enrichment.h1s || [];
            t.hasValidMx = Boolean(enrichment.hasValidMx);
            if (t.emails.length > 0 && !t.email) t.email = t.emails[0];

            addLog(
              "Enricher",
              `Enriched ${t.businessName}: ${t.email || "No direct email"} &bull; MX: ${t.hasValidMx ? "Valid ✓" : "Pending"} &bull; Tech: ${t.techStack.slice(0, 3).join(", ") || "Web"}`,
              t.hasValidMx ? "success" : "info"
            );

            // Step 3: BANT + MEDDIC Qualification via Groq LLM
            addLog("Qualifier", `[zubair-trabzada/ai-sales-team-claude] Scoring BANT & MEDDIC for ${t.businessName}...`);
            const evalRes = await qualifyLead(t);
            t.qualificationScore = evalRes.qualificationScore;
            t.tier = evalRes.tier;
            t.isHighTicket = evalRes.isHighTicket;
            t.dealValue = evalRes.dealValue;
            t.personalizedHook = evalRes.personalizedHook;
            t.recommendedOffer = evalRes.recommendedOffer;
            t.bant = evalRes.bant;
            t.meddic = evalRes.meddic;
            t.status = evalRes.qualificationScore >= 60 ? "Qualified" : "Unqualified";

            addLog(
              "Qualifier",
              `${t.businessName} score: ${t.qualificationScore}/100 (${t.tier}) &bull; Deal Est: ₹${(t.dealValue || 99000).toLocaleString("en-IN")}`,
              t.qualificationScore >= 60 ? "success" : "warning"
            );

            // Step 4: 4-Touch Sequence Generation
            if (t.qualificationScore >= 55) {
              addLog("Sequence Gen", `Crafting 4-Touch personalized outreach sequence for ${t.businessName}...`);
              t.sequence = await generateSequence(t);
            }

            await syncLeadToCRM(t);
            enrichedLeads.push(t);
          } catch (err: any) {
            addLog("Pipeline Error", `Failed processing ${t.websiteUrl}: ${err.message}`, "warning");
          }
        }

        // Step 5: Optional Automated Safe Outreach Dispatch
        let dispatchedCount = 0;
        if (autoOutreach) {
          const qualifiedCandidates = enrichedLeads.filter(
            (l: any) => l.email && l.email.includes("@") && (l.qualificationScore || 0) >= 60 && (!l.touchCount || l.touchCount === 0)
          );

          if (qualifiedCandidates.length > 0) {
            addLog("Deliverability Rotator", `[BillionMail] Routing ${qualifiedCandidates.length} leads through 20/day safe mailboxes...`);
            const nextMailbox = getNextAvailableMailbox() || SALES_ENGINE_CONFIG.mailboxes[0];

            for (const lead of qualifiedCandidates) {
              const seq = lead.sequence?.touch1 || {
                subject: `quick idea for ${lead.businessName}`,
                bodyPlain: `At MakerlyAI, we build custom high-converting web apps and AI workflows...`,
                bodyHtml: `<p>At MakerlyAI, we build custom high-converting web apps and AI workflows...</p>`,
                ctaText: "Book a 15-Min Strategy Call"
              };

              const html = buildSalesEmailHtml({
                recipientName: lead.clientName || "there",
                businessName: lead.businessName,
                subject: seq.subject,
                touchNumber: 1,
                personalizedHook: lead.personalizedHook,
                bodyContent: seq.bodyHtml,
                ctaText: seq.ctaText || "Book a 15-Minute Strategy Call",
                senderName: nextMailbox.name,
                senderTitle: nextMailbox.title,
                senderEmail: nextMailbox.email,
                recipientEmail: lead.email,
              });

              const plain = buildSalesEmailText({
                recipientName: lead.clientName || "there",
                businessName: lead.businessName,
                personalizedHook: lead.personalizedHook,
                bodyContentPlain: seq.bodyPlain,
                senderName: nextMailbox.name,
                senderTitle: nextMailbox.title,
                senderEmail: nextMailbox.email,
                recipientEmail: lead.email,
              });

              const res = await sendOutreachEmail({
                recipientEmail: lead.email,
                recipientName: lead.clientName || "Decision Maker",
                businessName: lead.businessName,
                subject: seq.subject,
                htmlContent: html,
                plainTextContent: plain,
                touchNumber: 1,
                dryRun,
              });

              if (res.success) {
                dispatchedCount++;
                if (!dryRun) {
                  lead.touchCount = 1;
                  lead.lastTouchAt = new Date().toISOString();
                  lead.status = "Contacted";
                  lead.mailboxUsed = res.mailboxUsed;
                  await syncLeadToCRM(lead);
                }
                addLog(
                  "Outreach Dispatch",
                  `${dryRun ? "[Dry Run] Verified" : "Dispatched"} Touch 1 to ${lead.email} via ${res.mailboxUsed}`,
                  "success"
                );
              }
            }
          } else {
            addLog("Outreach Dispatch", "No leads met qualification threshold for immediate automated dispatch.", "info");
          }
        }

        addLog("Auto-Pilot Complete", `Autonomous cycle finished. ${enrichedLeads.length} leads in CRM, ${dispatchedCount} touched.`, "success");

        return NextResponse.json({
          success: true,
          action: "autopilot",
          count: enrichedLeads.length,
          dispatchedCount,
          leads: enrichedLeads,
          logs,
        });
      }

      // ─────────────────────────────────────────────────────────────
      // 2. DISCOVER: Targeted Web & Scrapling Crawl
      // ─────────────────────────────────────────────────────────────
      case "discover": {
        const niche = body.niche || "d2c";
        const limit = Number(body.limit) || 4;

        let targets: any[] = [];
        try {
          const { execSync } = await import("child_process");
          const pyCmd = `python src/lib/sales-engine/scrapers/scrapling_harvester.py --niche ${niche} --limit ${limit}`;
          const pyOutput = execSync(pyCmd, { encoding: "utf-8", timeout: 35000 });
          const parsed = JSON.parse(pyOutput);
          if (parsed.leads && parsed.leads.length > 0) {
            targets = parsed.leads;
          }
        } catch {}

        if (targets.length < limit) {
          const fallback = await discoverTargetsFromWeb({ niche, limit: limit - targets.length, query: body.query || null });
          targets.push(...fallback);
        }

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
          if (t.emails.length > 0 && !t.email) t.email = t.emails[0];

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

      // ─────────────────────────────────────────────────────────────
      // 3. QUALIFY: BANT + MEDDIC Qualification & Sequences
      // ─────────────────────────────────────────────────────────────
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
          lead.bant = evalRes.bant;
          lead.meddic = evalRes.meddic;
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

      // ─────────────────────────────────────────────────────────────
      // 4. CAMPAIGN: Batch Deliverability Rotator Outreach
      // ─────────────────────────────────────────────────────────────
      case "campaign": {
        const isDryRun = body.dryRun !== false;
        const batchSize = Number(body.batch) || 3;
        const leads = loadCachedLeads();

        const candidates = leads.filter((l: any) =>
          l.email &&
          l.email.includes("@") &&
          (l.qualificationScore || 0) >= 55 &&
          (!l.touchCount || l.touchCount === 0)
        ).slice(0, batchSize);

        if (candidates.length === 0) {
          return NextResponse.json({
            success: false,
            message: "No qualified leads currently pending Touch 1 outreach."
          }, { status: 400 });
        }

        const results = [];
        const nextMailbox = getNextAvailableMailbox() || SALES_ENGINE_CONFIG.mailboxes[0];

        for (let i = 0; i < candidates.length; i++) {
          const lead = candidates[i];
          const seq = lead.sequence?.touch1 || {
            subject: `quick idea for ${lead.businessName}`,
            bodyPlain: `At MakerlyAI, we build custom high-converting web apps and AI workflows...`,
            bodyHtml: `<p>At MakerlyAI, we build custom high-converting web apps and AI workflows...</p>`,
            ctaText: "Book a 15-Min Strategy Call"
          };

          const html = buildSalesEmailHtml({
            recipientName: lead.clientName || "there",
            businessName: lead.businessName,
            subject: seq.subject,
            touchNumber: 1,
            personalizedHook: lead.personalizedHook,
            bodyContent: seq.bodyHtml,
            ctaText: seq.ctaText || "Book a 15-Minute Strategy Call",
            senderName: nextMailbox.name,
            senderTitle: nextMailbox.title,
            senderEmail: nextMailbox.email,
            recipientEmail: lead.email,
          });

          const plain = buildSalesEmailText({
            recipientName: lead.clientName || "there",
            businessName: lead.businessName,
            personalizedHook: lead.personalizedHook,
            bodyContentPlain: seq.bodyPlain,
            senderName: nextMailbox.name,
            senderTitle: nextMailbox.title,
            senderEmail: nextMailbox.email,
            recipientEmail: lead.email,
          });

          const res = await sendOutreachEmail({
            recipientEmail: lead.email,
            recipientName: lead.clientName || "Decision Maker",
            businessName: lead.businessName,
            subject: seq.subject,
            htmlContent: html,
            plainTextContent: plain,
            touchNumber: 1,
            dryRun: isDryRun,
          });

          if (res.success && !isDryRun) {
            lead.touchCount = 1;
            lead.lastTouchAt = new Date().toISOString();
            lead.status = "Contacted";
            lead.mailboxUsed = res.mailboxUsed;
            await syncLeadToCRM(lead);
          }

          results.push({
            lead: lead.businessName,
            email: lead.email,
            subject: seq.subject,
            res,
          });
        }

        return NextResponse.json({
          success: true,
          dryRun: isDryRun,
          results,
        });
      }

      // ─────────────────────────────────────────────────────────────
      // 5. SEND SINGLE TOUCH: Tousif manual or targeted dispatch
      // ─────────────────────────────────────────────────────────────
      case "send_single_touch": {
        const { leadId, touchNumber = 1, customSubject, customBody, dryRun = false } = body;
        const leads = loadCachedLeads();
        const lead = leads.find((l: any) => l.id === leadId);

        if (!lead || !lead.email) {
          return NextResponse.json({ success: false, error: "Lead not found or lacks email." }, { status: 404 });
        }

        const touchKey = `touch${touchNumber}`;
        const seqData = lead.sequence?.[touchKey] || {
          subject: customSubject || `quick note regarding ${lead.businessName}`,
          bodyPlain: customBody || `At MakerlyAI, we build custom software and AI workflows for growing teams.`,
          bodyHtml: `<p>${customBody || "At MakerlyAI, we build custom software and AI workflows for growing teams."}</p>`,
          ctaText: "Schedule a 15-Minute Strategy Call"
        };

        const subject = customSubject || seqData.subject;
        const bodyContent = customBody ? `<p style="white-space: pre-line;">${customBody}</p>` : seqData.bodyHtml;
        const bodyPlain = customBody || seqData.bodyPlain;

        const nextMailbox = getNextAvailableMailbox() || SALES_ENGINE_CONFIG.mailboxes[0];

        const html = buildSalesEmailHtml({
          recipientName: lead.clientName || "there",
          businessName: lead.businessName,
          subject,
          touchNumber,
          personalizedHook: lead.personalizedHook,
          bodyContent,
          ctaText: seqData.ctaText || "Book a 15-Minute Strategy Call",
          senderName: nextMailbox.name,
          senderTitle: nextMailbox.title,
          senderEmail: nextMailbox.email,
          recipientEmail: lead.email,
        });

        const plain = buildSalesEmailText({
          recipientName: lead.clientName || "there",
          businessName: lead.businessName,
          personalizedHook: lead.personalizedHook,
          bodyContentPlain: bodyPlain,
          senderName: nextMailbox.name,
          senderTitle: nextMailbox.title,
          senderEmail: nextMailbox.email,
          recipientEmail: lead.email,
        });

        const res = await sendOutreachEmail({
          recipientEmail: lead.email,
          recipientName: lead.clientName || "Decision Maker",
          businessName: lead.businessName,
          subject,
          htmlContent: html,
          plainTextContent: plain,
          touchNumber,
          dryRun,
        });

        if (res.success && !dryRun) {
          lead.touchCount = Math.max(lead.touchCount || 0, touchNumber);
          lead.lastTouchAt = new Date().toISOString();
          lead.status = "Contacted";
          lead.mailboxUsed = res.mailboxUsed;
          await syncLeadToCRM(lead);
        }

        return NextResponse.json({
          success: res.success,
          dryRun,
          result: res,
          lead,
        });
      }

      // ─────────────────────────────────────────────────────────────
      // 6. UPDATE LEAD STAGE: SuiteCRM Stage Progression
      // ─────────────────────────────────────────────────────────────
      case "update_lead_stage": {
        const { leadId, status } = body;
        if (!leadId || !status) {
          return NextResponse.json({ success: false, error: "leadId and status are required." }, { status: 400 });
        }

        const updatedLead = await updateLeadStatusInCRM(leadId, status);
        if (!updatedLead) {
          return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, lead: updatedLead });
      }

      // ─────────────────────────────────────────────────────────────
      // 7. GENERATE PROPOSAL: AI Sales Team proposal & meeting brief
      // ─────────────────────────────────────────────────────────────
      case "generate_proposal": {
        const { leadId } = body;
        const leads = loadCachedLeads();
        const lead = leads.find((l: any) => l.id === leadId);

        if (!lead) {
          return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
        }

        const proposal = await generateProposalAndBrief(lead);
        await saveLeadProposal(leadId, proposal);

        return NextResponse.json({
          success: true,
          leadId,
          proposal,
        });
      }

      // ─────────────────────────────────────────────────────────────
      // 8. DELETE / ARCHIVE LEAD
      // ─────────────────────────────────────────────────────────────
      case "delete_lead": {
        const { leadId } = body;
        if (!leadId) {
          return NextResponse.json({ success: false, error: "leadId required." }, { status: 400 });
        }
        deleteLeadFromCRM(leadId);
        return NextResponse.json({ success: true, leadId });
      }

      // ─────────────────────────────────────────────────────────────
      // 9. ADD MANUAL LEAD
      // ─────────────────────────────────────────────────────────────
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
          hasValidMx: Boolean(enrichment.hasValidMx),
          niche: niche || "b2b",
          status: "Discovered",
        };

        const evalRes = await qualifyLead(lead);
        lead.qualificationScore = evalRes.qualificationScore;
        lead.tier = evalRes.tier;
        lead.isHighTicket = evalRes.isHighTicket;
        lead.dealValue = evalRes.dealValue;
        lead.personalizedHook = evalRes.personalizedHook;
        lead.recommendedOffer = evalRes.recommendedOffer;
        lead.bant = evalRes.bant;
        lead.meddic = evalRes.meddic;
        lead.status = evalRes.qualificationScore >= 60 ? "Qualified" : "Unqualified";

        if (evalRes.qualificationScore >= 55) {
          lead.sequence = await generateSequence(lead);
        }

        await syncLeadToCRM(lead);
        return NextResponse.json({ success: true, lead });
      }

      // ─────────────────────────────────────────────────────────────
      // 10. CREATE GROWTH EXPERIMENT
      // ─────────────────────────────────────────────────────────────
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
