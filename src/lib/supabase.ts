import "server-only";

// Server-only: PostgREST access to the tharros-canada project with the service-role key (never sent to browsers).
export function supabaseServer() {
  const url = process.env.SUPABASE_URL?.replace(/\/+$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  return url && key ? { url, headers: { apikey: key, Authorization: `Bearer ${key}` } } : null;
}
