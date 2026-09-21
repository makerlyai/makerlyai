"use client";

import { OWNER_EMAILS, OwnerEmail, isOwnerEmail } from "./auth-constants";
export { OWNER_EMAILS, type OwnerEmail, isOwnerEmail };

export interface AuthSession {
  isAuthorized: boolean;
  email: string;
  name: string;
  role: "owner" | "partner";
  token: string;
  authorizedAt: string;
}

export interface AccessRequest {
  id: string;
  name: string;
  email: string;
  organization?: string;
  note?: string;
  status: "pending" | "approved" | "rejected";
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

const AUTH_SESSION_KEY = "makerlyai_auth_session_v1";
const ACCESS_REQUESTS_KEY = "makerlyai_access_requests_v2";
const TEMP_CODES_KEY = "makerlyai_temp_codes_v1";

const SEED_ACCESS_REQUESTS: AccessRequest[] = [];

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setAuthSession(session: AuthSession | null): void {
  if (typeof window === "undefined") return;
  try {
    if (!session) {
      localStorage.removeItem(AUTH_SESSION_KEY);
    } else {
      localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
    }
  } catch (err) {
    console.error("Failed to save auth session", err);
  }
}

export function getAccessRequests(): AccessRequest[] {
  if (typeof window === "undefined") return SEED_ACCESS_REQUESTS;
  try {
    const raw = localStorage.getItem(ACCESS_REQUESTS_KEY);
    if (!raw) {
      localStorage.setItem(ACCESS_REQUESTS_KEY, JSON.stringify(SEED_ACCESS_REQUESTS));
      return SEED_ACCESS_REQUESTS;
    }
    return JSON.parse(raw);
  } catch {
    return SEED_ACCESS_REQUESTS;
  }
}

export function saveAccessRequests(requests: AccessRequest[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ACCESS_REQUESTS_KEY, JSON.stringify(requests));
  } catch (err) {
    console.error("Failed to save access requests", err);
  }
}

/**
 * Generates a 6-digit confirmation code for an email (Owner or Approved Partner)
 */
export function generateConfirmationCode(email: string): {
  code: string;
  expiresInMinutes: number;
} {
  const normalized = email.trim().toLowerCase();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(TEMP_CODES_KEY);
      const store: Record<string, { code: string; expiresAt: number }> = raw
        ? JSON.parse(raw)
        : {};
      store[normalized] = { code, expiresAt };
      localStorage.setItem(TEMP_CODES_KEY, JSON.stringify(store));
    } catch (e) {
      console.error(e);
    }
  }

  return { code, expiresInMinutes: 10 };
}

/**
 * Gets the current active code for an email (for dev preview / one-click test)
 */
export function getActiveCodeForEmail(email: string): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TEMP_CODES_KEY);
    if (!raw) return null;
    const store = JSON.parse(raw);
    const entry = store[email.trim().toLowerCase()];
    if (entry && entry.expiresAt > Date.now()) {
      return entry.code;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Verifies code and creates a session
 */
export function verifyConfirmationCode(
  email: string,
  code: string
): { success: boolean; session?: AuthSession; message: string } {
  const normalized = email.trim().toLowerCase();
  const cleanCode = code.trim();

  // Validate code
  let isValid = false;

  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(TEMP_CODES_KEY);
      if (raw) {
        const store = JSON.parse(raw);
        const entry = store[normalized];
        if (entry && entry.code === cleanCode && entry.expiresAt > Date.now()) {
          isValid = true;
        }
      }
    } catch {
      isValid = false;
    }
  }

  if (!isValid) {
    return {
      success: false,
      message: "Invalid or expired confirmation code. Please try again or request a new code.",
    };
  }

  // Determine role & name
  const isOwner = isOwnerEmail(normalized);
  let name = "MakerlyAI (Tousif Raza)";
  let role: "owner" | "partner" = "owner";

  if (!isOwner) {
    const requests = getAccessRequests();
    const req = requests.find((r) => r.email.toLowerCase() === normalized && r.status === "approved");
    if (!req) {
      return {
        success: false,
        message: "This account has not been approved yet by Tousif Raza.",
      };
    }
    name = req.name;
    role = "partner";
  }

  const session: AuthSession = {
    isAuthorized: true,
    email: normalized,
    name,
    role,
    token: "mkr_auth_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9),
    authorizedAt: new Date().toISOString(),
  };

  setAuthSession(session);

  return {
    success: true,
    session,
    message: "Authorization successful.",
  };
}


/**
 * Submit partner access request for Tousif Raza's personal authorization
 */
export function submitAccessRequest(data: {
  name: string;
  email: string;
  organization?: string;
  note?: string;
}): { success: boolean; request: AccessRequest; message: string } {
  const normalizedEmail = data.email.trim().toLowerCase();
  const requests = getAccessRequests();

  const existing = requests.find((r) => r.email.toLowerCase() === normalizedEmail);
  if (existing) {
    if (existing.status === "approved") {
      return {
        success: true,
        request: existing,
        message: "You are already approved! You can log in directly.",
      };
    }
    return {
      success: true,
      request: existing,
      message: "Your request is currently pending approval by Tousif Raza.",
    };
  }

  const newRequest: AccessRequest = {
    id: "req-" + Date.now(),
    name: data.name.trim(),
    email: normalizedEmail,
    organization: data.organization?.trim() || "Lead Partner",
    note: data.note?.trim() || "Partner requesting CRM access",
    status: "pending",
    requestedAt: new Date().toISOString(),
  };

  const updated = [newRequest, ...requests];
  saveAccessRequests(updated);

  return {
    success: true,
    request: newRequest,
    message: "Authorization request submitted to Tousif Raza (iamtousifraza@gmail.com / getmakerlyai@gmail.com).",
  };
}

/**
 * Approve access request by Tousif Raza
 */
export function approveAccessRequest(
  requestId: string,
  approvedByEmail: string
): boolean {
  const requests = getAccessRequests();
  const updated = requests.map((req) => {
    if (req.id === requestId) {
      return {
        ...req,
        status: "approved" as const,
        approvedAt: new Date().toISOString(),
        approvedBy: approvedByEmail,
      };
    }
    return req;
  });
  saveAccessRequests(updated);
  return true;
}

/**
 * Reject access request
 */
export function rejectAccessRequest(requestId: string): boolean {
  const requests = getAccessRequests();
  const updated = requests.map((req) => {
    if (req.id === requestId) {
      return {
        ...req,
        status: "rejected" as const,
      };
    }
    return req;
  });
  saveAccessRequests(updated);
  return true;
}

/**
 * Clear session
 */
export function logoutSession(): void {
  setAuthSession(null);
}

