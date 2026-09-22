export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tharros.ca").replace(/\/+$/, "");

/** JSON for a <script type="application/ld+json">; escapes "<" so data can never close the tag. */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\u003c");

// Locale-free date text: built from numeric parts only, so server and every browser render the same
// string (en-CA month names differ between ICU versions, e.g. "Sep" vs "Sept.", and break hydration).
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function dateParts(value: string, timeZone: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((part) => part.type === type)?.value);
  return { year: get("year"), month: months[get("month") - 1], day: get("day"), hour: get("hour"), minute: get("minute") };
}

/** "Sep 2026" */
export function formatMonthYear(value: string) {
  const p = dateParts(value, "UTC");
  return p ? `${p.month} ${p.year}` : "Date unavailable";
}

/** "June 1, 2026" (UTC) */
export function formatLongDate(value: string) {
  const p = dateParts(value, "UTC");
  return p ? `${fullMonths[months.indexOf(p.month)]} ${p.day}, ${p.year}` : "Date unavailable";
}

/** "June 2026" (UTC) */
export function formatFullMonthYear(value: string) {
  const p = dateParts(value, "UTC");
  return p ? `${fullMonths[months.indexOf(p.month)]} ${p.year}` : "Date unavailable";
}

/** "Sep 22, 4:15 p.m." in the given time zone */
export function formatDateTime(value: string, timeZone: string) {
  const p = dateParts(value, timeZone);
  if (!p) return "time unavailable";
  const hour12 = p.hour % 12 || 12;
  return `${p.month} ${p.day}, ${hour12}:${String(p.minute).padStart(2, "0")} ${p.hour < 12 ? "a.m." : "p.m."}`;
}
