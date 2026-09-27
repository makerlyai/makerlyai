export interface OwnerAccount {
  name: string;
  email: string;
  role: string;
  badge: string;
}

export const OWNER_ACCOUNTS: OwnerAccount[] = [
  {
    name: "Tousif Raza",
    email: "tousif@makerlyai.in",
    role: "Founder & Technical Architect",
    badge: "Primary Owner",
  },
  {
    name: "Tousif Raza",
    email: "iamtousifraza@gmail.com",
    role: "Personal Recovery Account",
    badge: "Backup Access",
  },
];

export const OWNER_EMAILS = [
  "tousif@makerlyai.in",
  "iamtousifraza@gmail.com",
] as const;

export type OwnerEmail = (typeof OWNER_EMAILS)[number];

export function isOwnerEmail(email: string): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return OWNER_EMAILS.some((e) => e.toLowerCase() === normalized);
}

// All verified operational domain accounts for Makerly AI
export const MAKERLY_DOMAIN_EMAILS = [
  "tousif@makerlyai.in",
  "hello@makerlyai.in",
  "support@makerlyai.in",
  "billing@makerlyai.in",
  "careers@makerlyai.in",
] as const;
