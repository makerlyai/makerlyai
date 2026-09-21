import { Lead } from "./types";

export const DEFAULT_COMMISSION_RATE = 15; // 15% standard
export const HIGH_TICKET_THRESHOLD = 100000; // Above ₹1,00,000 qualifies as High Ticket
export const HIGH_TICKET_COMMISSION_RATE = 20; // 20% for high ticket deals (decided by Owner Tousif Raza)

/**
 * Checks whether a deal value qualifies as High Ticket (above ₹1,00,000)
 */
export function isHighTicket(dealValue: number): boolean {
  return (dealValue || 0) >= HIGH_TICKET_THRESHOLD;
}

/**
 * Determines effective commission rate:
 * - If lead has an explicit owner-assigned rate, use that
 * - If dealValue >= 100,000 and owner has approved high-ticket boost, defaults to 20%
 * - Otherwise 15% standard
 */
export function getEffectiveCommissionRate(dealValue: number, customRate?: number): number {
  if (customRate !== undefined && customRate !== null && customRate > 0) {
    return customRate;
  }
  return isHighTicket(dealValue) ? HIGH_TICKET_COMMISSION_RATE : DEFAULT_COMMISSION_RATE;
}

/**
 * Calculates commission based on status, deal value, and rate percentage
 */
export function calculateCommission(
  dealValue: number,
  status: string,
  ratePercentage?: number
): number {
  if (status === "Closed Won" && dealValue > 0) {
    const rate = ratePercentage || getEffectiveCommissionRate(dealValue);
    return Math.round((dealValue * rate) / 100);
  }
  return 0;
}

/**
 * Formats a currency number into clean locale string (supports both INR and USD symbols)
 */
export function formatCurrency(amount: number, currency: "INR" | "USD" = "INR"): string {
  if (isNaN(amount) || amount === null || amount === undefined) return "₹0";
  if (currency === "USD") {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Format as Indian Rupee
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Calculates aggregate commission for a partner's leads
 */
export function getPartnerCommissionSummary(leads: Lead[], partnerId: string) {
  const partnerLeads = leads.filter((l) => l.createdBy === partnerId);
  const closedWon = partnerLeads.filter((l) => l.status === "Closed Won");
  
  const totalEarnedCommission = closedWon.reduce((sum, l) => sum + (l.commission || 0), 0);
  const totalClosedDealValue = closedWon.reduce((sum, l) => sum + (l.dealValue || 0), 0);
  const potentialCommission = partnerLeads
    .filter((l) => l.status !== "Closed Won" && l.status !== "Closed Lost")
    .reduce((sum, l) => sum + calculateCommission(l.dealValue || 0, "Closed Won", l.commissionRate), 0);

  return {
    totalLeads: partnerLeads.length,
    closedWonCount: closedWon.length,
    totalEarnedCommission,
    totalClosedDealValue,
    potentialCommission,
  };
}

