import "server-only";

// Server-only: PostgREST access to the tharros-canada project with the service-role key (never sent to browsers).
export function supabaseServer() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return url && key ? { url, headers: { apikey: key, Authorization: `Bearer ${key}` } } : null;
}

let cachedIntakeSecret: string | null = null;

/**
 * The intake webhook secret lives in the service-role-only `intake_config` table, shared with the
 * research-intake Edge Function, so it never has to be copied between systems. Null when unavailable.
 * Cached per instance: rotating the secret needs a redeploy of both sides.
 */
export async function intakeSecretFromDatabase() {
  if (cachedIntakeSecret) return cachedIntakeSecret;
  const db = supabaseServer();
  if (!db) return null;
  try {
    const response = await fetch(
      `${db.url}/rest/v1/intake_config?key=eq.webhook_secret&select=value`,
      {
        headers: db.headers,
        cache: "no-store",
        signal: AbortSignal.timeout(4000),
      },
    );
    if (!response.ok) return null;
    const [row] = (await response.json()) as { value: string }[];
    cachedIntakeSecret = row?.value || null;
    return cachedIntakeSecret;
  } catch {
    return null;
  }
}
