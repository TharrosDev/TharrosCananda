export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tharros.ca").replace(
  /\/+$/,
  "",
);

/** JSON for a <script type="application/ld+json">; escapes "<" so data can never close the tag. */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\u003c");

// Locale-free date text: built from numeric parts only, so server and every browser render the same
// string (en-CA month names differ between ICU versions, e.g. "Sep" vs "Sept.", and break hydration).
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const fullMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function dateParts(value: string, timeZone: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(date);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);
  return { year: get("year"), month: months[get("month") - 1], day: get("day") };
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

export const siteName = "Tharros Canada";

/**
 * Title, description, canonical, Open Graph and Twitter for one page. A page's openGraph object
 * replaces the layout's wholesale, so every page must set its own title, description and url here;
 * otherwise shared links would all preview as the homepage.
 */
export function pageMetadata({
  title,
  description,
  path,
  type = "website",
}: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type, locale: "en_CA", siteName, url: path, title, description },
    twitter: { card: "summary_large_image" as const, title, description },
  };
}

/** Every static public page, in sitemap order. The sitemap and the e2e route sweep both read this. */
export const coreRoutes = [
  "",
  "/research-services",
  "/research",
  "/request-research",
  "/about",
  "/how-it-works",
  "/methodology",
  "/privacy",
  "/accessibility",
  "/copyright",
];
