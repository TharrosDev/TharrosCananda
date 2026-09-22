/** Verified public contact address (confirmed by the owner). NEXT_PUBLIC_RESEARCH_EMAIL overrides it per deployment. */
const verifiedResearchEmail = "TharrosDev@gmail.com";

export function researchEmail(): string {
  const value = process.env.NEXT_PUBLIC_RESEARCH_EMAIL?.trim();
  return value && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? value : verifiedResearchEmail;
}
