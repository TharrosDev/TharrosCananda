// Excludes address specials (<>()[]\,;:") too: Resend rejects them as reply_to, and the notification would never send.
export const emailPattern = /^[^\s@<>()[\]\\,;:"]+@[^\s@<>()[\]\\,;:"]+\.[^\s@<>()[\]\\,;:"]{2,}$/;

/** Verified public contact address (confirmed by the owner). NEXT_PUBLIC_RESEARCH_EMAIL overrides it per deployment. */
const verifiedResearchEmail = "TharrosDev@gmail.com";

export function researchEmail(): string {
  const value = process.env.NEXT_PUBLIC_RESEARCH_EMAIL?.trim();
  return value && emailPattern.test(value) ? value : verifiedResearchEmail;
}
