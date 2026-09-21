"use client";

import React, { useState, useRef } from "react";
import * as XLSX from "xlsx";
import { User, REQUIREMENT_OPTIONS } from "@/lib/crm/types";
import { formatCurrency, isHighTicket } from "@/lib/crm/commission";
import {
  FileSpreadsheet,
  UploadCloud,
  Download,
  CheckCircle2,
  AlertCircle,
  X,
  Sparkles,
  ClipboardPaste,
  Flame,
  Check,
  Settings2,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { MakerlyLogoIcon } from "./makerly-logo";

interface ParsedLeadRow {
  clientName: string;
  businessName: string;
  phone: string;
  email: string;
  requirement: string;
  reason: string;
  notes?: string;
  dealValue: number;
  isHighTicket: boolean;
  projectedCommission: number;
  isValid: boolean;
  validationError?: string;
}

interface ColumnMapping {
  clientName: string;
  businessName: string;
  phone: string;
  email: string;
  reason: string;
  notes: string;
  dealValue: string;
}

interface BulkImportModalProps {
  isOpen: boolean;
  activeUser: User;
  onClose: () => void;
  onBulkImport: (
    leads: Array<{
      clientName: string;
      phone: string;
      email: string;
      businessName: string;
      requirement: string;
      reason?: string;
      notes?: string;
      dealValue?: number;
    }>
  ) => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  activeUser,
  onClose,
  onBulkImport,
}) => {
  const [importMode, setImportMode] = useState<"file" | "paste">("file");
  const [step, setStep] = useState<"upload" | "mapping" | "preview">("upload");
  const [rawRows, setRawRows] = useState<Array<Record<string, any>>>([]);
  const [availableHeaders, setAvailableHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    clientName: "",
    businessName: "",
    phone: "",
    email: "",
    reason: "",
    notes: "",
    dealValue: "",
  });
  const [parsedRows, setParsedRows] = useState<ParsedLeadRow[]>([]);
  const [fileName, setFileName] = useState<string>("");
  const [pasteContent, setPasteContent] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Adaptable heuristic detection for column names and cell content
  const detectBestColumn = (
    headers: string[],
    sampleRows: Array<Record<string, any>>,
    field: keyof ColumnMapping
  ): string => {
    const patterns: Record<keyof ColumnMapping, string[]> = {
      clientName: [
        "clientname",
        "client",
        "fullname",
        "name",
        "customer",
        "contactperson",
        "contactname",
        "leadname",
        "prospect",
        "founder",
        "poc",
      ],
      businessName: [
        "businessname",
        "business",
        "companyname",
        "company",
        "organization",
        "brand",
        "firm",
        "startup",
        "agency",
        "website",
        "domain",
      ],
      phone: [
        "phone",
        "mobile",
        "whatsapp",
        "contactno",
        "contactnumber",
        "cell",
        "tel",
        "phonenumber",
        "tele",
        "mob",
      ],
      email: [
        "email",
        "mail",
        "e-mail",
        "emailaddress",
        "mailid",
        "contactemail",
      ],
      reason: [
        "reason",
        "requirement",
        "service",
        "need",
        "lookingfor",
        "inquiry",
        "project",
        "problem",
        "usecase",
        "interest",
        "scope",
        "category",
      ],
      notes: [
        "notes",
        "note",
        "context",
        "remarks",
        "details",
        "description",
        "comments",
        "additionalinfo",
        "summary",
      ],
      dealValue: [
        "dealvalue",
        "value",
        "budget",
        "amount",
        "ticketsize",
        "ticket",
        "price",
        "revenue",
        "quote",
        "inr",
        "cost",
      ],
    };

    // 1. Direct header match
    for (const h of headers) {
      const cleanH = h.toLowerCase().replace(/[\s_\-./()]/g, "");
      if (patterns[field].some((pat) => cleanH.includes(pat))) {
        return h;
      }
    }

    // 2. Sample row values heuristic / regex inference
    for (const h of headers) {
      for (const row of sampleRows.slice(0, 5)) {
        const val = String(row[h] || "").trim();
        if (!val) continue;

        if (field === "email" && val.includes("@") && val.includes(".")) {
          return h;
        }
        if (
          field === "phone" &&
          (val.match(/\+?\d{9,14}/) || val.replace(/\D/g, "").length >= 10)
        ) {
          return h;
        }
        if (
          field === "dealValue" &&
          (val.includes("₹") || val.includes("$") || (!isNaN(Number(val)) && Number(val) >= 1000))
        ) {
          return h;
        }
      }
    }

    return "";
  };

  // Process raw parsed JSON objects from spreadsheet
  const processUploadedData = (rows: Array<Record<string, any>>, name: string) => {
    if (!rows || rows.length === 0) return;
    setRawRows(rows);
    setFileName(name);

    // Extract all unique headers across rows
    const headersSet = new Set<string>();
    rows.forEach((r) => Object.keys(r).forEach((k) => headersSet.add(k)));
    const headers = Array.from(headersSet);
    setAvailableHeaders(headers);

    // Auto-detect best mapping
    const detected: ColumnMapping = {
      clientName: detectBestColumn(headers, rows, "clientName"),
      businessName: detectBestColumn(headers, rows, "businessName"),
      phone: detectBestColumn(headers, rows, "phone"),
      email: detectBestColumn(headers, rows, "email"),
      reason: detectBestColumn(headers, rows, "reason"),
      notes: detectBestColumn(headers, rows, "notes"),
      dealValue: detectBestColumn(headers, rows, "dealValue"),
    };

    setColumnMapping(detected);
    generateParsedRows(rows, detected);
    setStep("mapping");
  };

  // Generate clean Lead rows using column mapping
  const generateParsedRows = (
    rows: Array<Record<string, any>>,
    mapping: ColumnMapping
  ) => {
    const parsed: ParsedLeadRow[] = rows.map((raw) => {
      const clientName = mapping.clientName ? String(raw[mapping.clientName] || "").trim() : "";
      const businessName = mapping.businessName ? String(raw[mapping.businessName] || "").trim() : "";
      const phone = mapping.phone ? String(raw[mapping.phone] || "").trim() : "";
      const email = mapping.email ? String(raw[mapping.email] || "").trim() : "";
      const reason = mapping.reason ? String(raw[mapping.reason] || "").trim() : "";
      const notes = mapping.notes ? String(raw[mapping.notes] || "").trim() : "";
      
      const rawVal = mapping.dealValue ? String(raw[mapping.dealValue] || "") : "";
      const cleanNum = parseFloat(rawVal.replace(/[^0-9.]/g, "")) || 0;
      const isHigh = isHighTicket(cleanNum);
      const commissionRate = isHigh ? 20 : 15; // 20% for High Ticket (> ₹100,000), 15% standard
      const projectedCommission = Math.round((cleanNum * commissionRate) / 100);

      // Best category matching for requirement
      let requirement = "AI Agents & Automation";
      const combinedReason = (reason + " " + notes).toLowerCase();
      if (combinedReason.includes("web") || combinedReason.includes("app") || combinedReason.includes("portal") || combinedReason.includes("fullstack")) {
        requirement = "Custom Web Application";
      } else if (combinedReason.includes("saas") || combinedReason.includes("mvp") || combinedReason.includes("product")) {
        requirement = "SaaS MVP Development";
      } else if (combinedReason.includes("crm") || combinedReason.includes("workflow") || combinedReason.includes("zapier") || combinedReason.includes("n8n")) {
        requirement = "CRM & Workflow Automation";
      } else if (combinedReason.includes("growth") || combinedReason.includes("funnel") || combinedReason.includes("conversion") || combinedReason.includes("lead")) {
        requirement = "Growth & Conversion Optimization";
      }

      const isValid = Boolean(clientName && businessName);
      const validationError = !clientName
        ? "Missing client name"
        : !businessName
        ? "Missing business name"
        : undefined;

      return {
        clientName: clientName || "Unnamed Contact",
        businessName: businessName || "Unnamed Business",
        phone: phone || "+91 00000 00000",
        email: email || "contact@client.com",
        requirement,
        reason: reason || requirement,
        notes: notes || reason,
        dealValue: cleanNum,
        isHighTicket: isHigh,
        projectedCommission,
        isValid,
        validationError,
      };
    });

    setParsedRows(parsed);
  };

  // Handle re-mapping change
  const handleMappingChange = (field: keyof ColumnMapping, header: string) => {
    const updated = { ...columnMapping, [field]: header };
    setColumnMapping(updated);
    generateParsedRows(rawRows, updated);
  };

  // Process File Upload (.xlsx, .xls, .csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        processUploadedData(json as Array<Record<string, any>>, file.name);
      } catch (err) {
        console.error("Failed to parse sheet", err);
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Process Pasted Text (TSV / CSV)
  const handleParsePastedText = () => {
    if (!pasteContent.trim()) return;
    setIsProcessing(true);

    try {
      const workbook = XLSX.read(pasteContent, { type: "string" });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet);

      processUploadedData(json as Array<Record<string, any>>, "Pasted_Spreadsheet_Data");
    } catch (err) {
      console.error("Failed to parse pasted text", err);
    } finally {
      setIsProcessing(false);
    }
  };

  // Download Sample Template
  const handleDownloadSample = () => {
    const sampleData = [
      {
        "Full Name": "Aditya Kapoor",
        "Company Name": "Zeta Retail AI",
        "WhatsApp No": "+91 98111 22334",
        "Email Address": "aditya@zetaretail.com",
        "Client Reason & Requirement": "Looking for autonomous customer service & inventory agents to automate orders.",
        "Internal Notes": "High intent founder. Budget confirmed above ₹1.5L. Fast closure expected.",
        "Expected Deal Value (INR)": 150000,
      },
      {
        "Full Name": "Sneha Sen",
        "Company Name": "Veritas Healthtech",
        "WhatsApp No": "+91 98222 44556",
        "Email Address": "sneha@veritashealth.in",
        "Client Reason & Requirement": "Doctor-patient teleconsultation web application with HIPAA compliance and Razorpay.",
        "Internal Notes": "Referred by seed investor. Urgently hiring tech partner.",
        "Expected Deal Value (INR)": 220000,
      },
      {
        "Full Name": "Rahul Verma",
        "Company Name": "Apex D2C Logistics",
        "WhatsApp No": "+91 97110 99887",
        "Email Address": "rahul@apexd2c.in",
        "Client Reason & Requirement": "Warehouse dispatch optimization engine and driver tracking portal.",
        "Internal Notes": "Looking for fixed-price 4 week MVP delivery.",
        "Expected Deal Value (INR)": 95000,
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "MakerlyAI_Leads");
    XLSX.writeFile(workbook, "MakerlyAI_Adaptable_Lead_Template.xlsx");
  };

  const validRows = parsedRows.filter((r) => r.isValid);
  const highTicketCount = parsedRows.filter((r) => r.isHighTicket).length;

  const handleImportSubmit = () => {
    if (validRows.length === 0) return;
    onBulkImport(validRows);
    setImportSuccess(true);
    setTimeout(() => {
      setImportSuccess(false);
      setParsedRows([]);
      setRawRows([]);
      setFileName("");
      setPasteContent("");
      setStep("upload");
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 dark:bg-black/80 p-4 backdrop-blur-md">
      <div className="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-obsidian-900 shadow-2xl flex flex-col max-h-[92vh] text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.08] bg-slate-50 dark:bg-obsidian-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#efe7d1] border border-[#2952cc]/30 shadow-xs p-1.5 transition-transform hover:scale-105">
              <MakerlyLogoIcon className="w-full h-full" color="#2952cc" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold tracking-tight">
                  Adaptable Bulk Lead Import
                </h3>
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Excel &bull; CSV &bull; Sheets
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Auto-detects names, numbers, emails, reasons, notes &amp; high-ticket values. Attributed to:{" "}
                <strong className="text-brand-600 dark:text-brand-300">{activeUser.name}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Dynamic Workflow Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-obsidian-950/40 px-6 py-2.5 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setStep("upload")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all ${
                step === "upload"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-obsidian-950 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
              }`}
            >
              <span>1. Upload or Paste</span>
            </button>
            <ArrowRight className="h-3 w-3 text-slate-400" />
            <button
              disabled={rawRows.length === 0}
              onClick={() => setStep("mapping")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all ${
                step === "mapping"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-obsidian-950 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-40"
              }`}
            >
              <Settings2 className="h-3.5 w-3.5" />
              <span>2. Adaptable Column Mapping</span>
            </button>
            <ArrowRight className="h-3 w-3 text-slate-400" />
            <button
              disabled={parsedRows.length === 0}
              onClick={() => setStep("preview")}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 font-medium transition-all ${
                step === "preview"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-obsidian-950 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 disabled:opacity-40"
              }`}
            >
              <span>3. Review &amp; Import ({parsedRows.length})</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleDownloadSample}
            className="flex items-center gap-1.5 rounded-md border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-obsidian-850 px-2.5 py-1 text-[11px] font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-obsidian-800 transition-colors"
          >
            <Download className="h-3 w-3 text-emerald-500" />
            <span>Sample Excel</span>
          </button>
        </div>

        {/* High Ticket Notice Banner */}
        <div className="flex items-center justify-between border-b border-amber-500/20 bg-amber-500/10 dark:bg-amber-950/30 px-6 py-2 text-xs text-amber-800 dark:text-amber-300">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span>
              <strong>High Ticket Sale Policy:</strong> Any deal above <strong>₹1,00,000</strong> unlocks the <strong>20% Partner Commission tier</strong> (decided by Owner <strong>Tousif Raza</strong>). Standard rate is 15%.
            </span>
          </div>
          {highTicketCount > 0 && (
            <span className="font-mono text-[11px] font-bold text-amber-600 dark:text-amber-400">
              🔥 {highTicketCount} High-Ticket Leads Detected
            </span>
          )}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {importSuccess ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-500">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h4 className="mt-3 text-lg font-bold text-slate-900 dark:text-white">
                {validRows.length} Leads Successfully Imported!
              </h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                All leads have been placed into the pipeline with auto-detected client reasons, contact details, and commission tiers.
              </p>
            </div>
          ) : (
            <>
              {/* Step 1: Upload or Paste */}
              {step === "upload" && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setImportMode("file")}
                      className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                        importMode === "file"
                          ? "bg-slate-900 text-white dark:bg-brand-600 shadow-sm"
                          : "bg-slate-100 text-slate-600 dark:bg-obsidian-850 dark:text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      <UploadCloud className="h-3.5 w-3.5" />
                      <span>Upload Spreadsheet (.xlsx, .csv)</span>
                    </button>
                    <button
                      onClick={() => setImportMode("paste")}
                      className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                        importMode === "paste"
                          ? "bg-slate-900 text-white dark:bg-brand-600 shadow-sm"
                          : "bg-slate-100 text-slate-600 dark:bg-obsidian-850 dark:text-slate-400 hover:bg-slate-200"
                      }`}
                    >
                      <ClipboardPaste className="h-3.5 w-3.5" />
                      <span>Paste from Google Sheets / Excel</span>
                    </button>
                  </div>

                  {importMode === "file" ? (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/15 bg-slate-50/50 dark:bg-obsidian-950/60 p-10 text-center transition-all hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-obsidian-950"
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".xlsx, .xls, .csv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <UploadCloud className="mx-auto h-10 w-10 text-brand-500 mb-3" />
                      <div className="text-sm font-semibold text-slate-800 dark:text-white">
                        {fileName ? fileName : "Click to select or drag & drop Excel / CSV file"}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Our intelligent parser will automatically match columns regardless of header names.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Copy and paste tabular rows directly from Google Sheets or Excel:</span>
                        <button
                          onClick={handleParsePastedText}
                          className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-500 transition-all active:scale-95"
                        >
                          Detect &amp; Parse
                        </button>
                      </div>
                      <textarea
                        value={pasteContent}
                        onChange={(e) => setPasteContent(e.target.value)}
                        placeholder={`Name\tCompany\tMobile\tEmail\tReason/Service\tNotes\tBudget\nAarav Kapoor\tNexus Retail AI\t+91 9876543210\taarav@nexus.in\tAutonomous customer service agents\tUrgent launch\t180000`}
                        rows={6}
                        className="w-full rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50 dark:bg-obsidian-950 p-3 font-mono text-xs text-slate-800 dark:text-slate-200 focus:border-brand-500 focus:outline-none resize-none"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Adaptable Column Mapping */}
              {step === "mapping" && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-obsidian-950/60 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                          Automated Column Intelligence
                        </h4>
                        <p className="text-[11px] text-slate-500">
                          We mapped your spreadsheet columns to CRM fields. Adjust any mapping if needed:
                        </p>
                      </div>
                      <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                        ✓ {availableHeaders.length} Columns Detected
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {/* Client Name */}
                      <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-900 p-2.5">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Client / Contact Name *
                        </label>
                        <select
                          value={columnMapping.clientName}
                          onChange={(e) => handleMappingChange("clientName", e.target.value)}
                          className="w-full rounded border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 p-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="">-- None Selected --</option>
                          {availableHeaders.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Business Name */}
                      <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-900 p-2.5">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Business / Company *
                        </label>
                        <select
                          value={columnMapping.businessName}
                          onChange={(e) => handleMappingChange("businessName", e.target.value)}
                          className="w-full rounded border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 p-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="">-- None Selected --</option>
                          {availableHeaders.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Phone Number */}
                      <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-900 p-2.5">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Phone / WhatsApp Number
                        </label>
                        <select
                          value={columnMapping.phone}
                          onChange={(e) => handleMappingChange("phone", e.target.value)}
                          className="w-full rounded border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 p-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="">-- None Selected --</option>
                          {availableHeaders.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Email */}
                      <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-900 p-2.5">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Email Address
                        </label>
                        <select
                          value={columnMapping.email}
                          onChange={(e) => handleMappingChange("email", e.target.value)}
                          className="w-full rounded border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 p-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="">-- None Selected --</option>
                          {availableHeaders.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Reason / Requirement */}
                      <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-900 p-2.5">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Reason / Project Requirement
                        </label>
                        <select
                          value={columnMapping.reason}
                          onChange={(e) => handleMappingChange("reason", e.target.value)}
                          className="w-full rounded border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 p-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="">-- None Selected --</option>
                          {availableHeaders.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Notes / Context */}
                      <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-900 p-2.5">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">
                          Notes &amp; Internal Context
                        </label>
                        <select
                          value={columnMapping.notes}
                          onChange={(e) => handleMappingChange("notes", e.target.value)}
                          className="w-full rounded border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 p-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="">-- None Selected --</option>
                          {availableHeaders.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Deal Value / Budget */}
                      <div className="rounded-lg border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-obsidian-900 p-2.5 sm:col-span-2 md:col-span-3">
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                            Deal Value / Budget (₹ INR)
                          </label>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400">
                            &gt; ₹1,00,000 auto-qualifies for 20% commission tier
                          </span>
                        </div>
                        <select
                          value={columnMapping.dealValue}
                          onChange={(e) => handleMappingChange("dealValue", e.target.value)}
                          className="w-full rounded border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-obsidian-950 p-1.5 text-xs text-slate-800 dark:text-slate-200 focus:outline-none"
                        >
                          <option value="">-- None Selected --</option>
                          {availableHeaders.map((h) => (
                            <option key={h} value={h}>
                              {h}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => setStep("preview")}
                        className="flex items-center gap-1.5 rounded-lg bg-slate-900 text-white dark:bg-brand-600 px-4 py-2 text-xs font-semibold hover:bg-slate-800 transition-all"
                      >
                        <span>Confirm Mappings &amp; Preview Rows</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Preview Table */}
              {(step === "preview" || parsedRows.length > 0) && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Live Parsed Leads Preview ({validRows.length} valid / {parsedRows.length} total)
                    </span>
                    <div className="flex items-center gap-3 text-xs">
                      {highTicketCount > 0 && (
                        <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Flame className="h-3 w-3" />
                          {highTicketCount} High-Ticket Deals (20% Comm)
                        </span>
                      )}
                      <button
                        onClick={() => setStep("mapping")}
                        className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline"
                      >
                        Adjust Mapping &rarr;
                      </button>
                    </div>
                  </div>

                  <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/50 dark:bg-obsidian-950">
                    <table className="w-full text-left text-xs">
                      <thead className="sticky top-0 border-b border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-obsidian-900 text-[10px] uppercase text-slate-500 dark:text-slate-400">
                        <tr>
                          <th className="px-3 py-2.5 font-semibold">#</th>
                          <th className="px-3 py-2.5 font-semibold">Client</th>
                          <th className="px-3 py-2.5 font-semibold">Business</th>
                          <th className="px-3 py-2.5 font-semibold">Phone / WhatsApp</th>
                          <th className="px-3 py-2.5 font-semibold">Reason / Service</th>
                          <th className="px-3 py-2.5 font-semibold">Budget / Deal</th>
                          <th className="px-3 py-2.5 font-semibold">Partner Comm</th>
                          <th className="px-3 py-2.5 font-semibold">Validation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200/60 dark:divide-white/[0.04]">
                        {parsedRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-100/60 dark:hover:bg-white/[0.02]">
                            <td className="px-3 py-2 font-mono text-slate-400">{idx + 1}</td>
                            <td className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">
                              {row.clientName}
                            </td>
                            <td className="px-3 py-2 text-slate-700 dark:text-slate-300">
                              {row.businessName}
                            </td>
                            <td className="px-3 py-2 font-mono text-[11px] text-slate-500 dark:text-slate-400">
                              {row.phone}
                            </td>
                            <td className="px-3 py-2 max-w-[200px] truncate text-slate-600 dark:text-slate-300" title={row.reason}>
                              {row.reason}
                            </td>
                            <td className="px-3 py-2 font-mono font-semibold">
                              {row.dealValue > 0 ? (
                                <div className="flex items-center gap-1">
                                  <span>{formatCurrency(row.dealValue)}</span>
                                  {row.isHighTicket && (
                                    <span className="rounded bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[9px] px-1 py-0.2 font-bold uppercase">
                                      High Ticket
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <span className="text-slate-400 italic">TBD</span>
                              )}
                            </td>
                            <td className="px-3 py-2 font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                              {row.dealValue > 0 ? (
                                <span>
                                  {formatCurrency(row.projectedCommission)} ({row.isHighTicket ? "20%" : "15%"})
                                </span>
                              ) : (
                                <span className="text-slate-400">&mdash;</span>
                              )}
                            </td>
                            <td className="px-3 py-2">
                              {row.isValid ? (
                                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                  <CheckCircle2 className="h-2.5 w-2.5" />
                                  Ready
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 rounded bg-rose-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-rose-600 dark:text-rose-400">
                                  <AlertCircle className="h-2.5 w-2.5" />
                                  {row.validationError}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!importSuccess && (
          <div className="flex items-center justify-between border-t border-slate-200/80 dark:border-white/[0.08] bg-slate-50 dark:bg-obsidian-950 px-6 py-3.5">
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {validRows.length > 0 ? (
                <span>
                  Ready to import <strong className="text-slate-900 dark:text-white font-bold">{validRows.length}</strong> leads into the MakerlyAI CRM pipeline.
                </span>
              ) : (
                <span>Upload a spreadsheet to preview and import</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-300 dark:border-white/[0.08] px-3.5 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={validRows.length === 0 || isProcessing}
                onClick={handleImportSubmit}
                className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-500 active:scale-95 disabled:opacity-50 transition-all"
              >
                <FileSpreadsheet className="h-3.5 w-3.5" />
                <span>Import {validRows.length} Leads</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

