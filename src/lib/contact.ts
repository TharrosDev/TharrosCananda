/** Public contact address, only when explicitly configured. No address is assumed in source code. */
export function researchEmail(): string | null {
  const value = process.env.NEXT_PUBLIC_RESEARCH_EMAIL?.trim();
  return value && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ? value : null;
}
