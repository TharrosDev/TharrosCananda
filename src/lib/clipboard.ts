/** Copies text; false when the clipboard is unavailable or denied, so the caller can offer a manual fallback. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
