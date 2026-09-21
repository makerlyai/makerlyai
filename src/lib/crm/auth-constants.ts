export const OWNER_EMAILS = [
  "iamtousifraza@gmail.com",
  "getmakerlyai@gmail.com",
] as const;

export type OwnerEmail = (typeof OWNER_EMAILS)[number];

export function isOwnerEmail(email: string): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return OWNER_EMAILS.some((e) => e.toLowerCase() === normalized);
}
