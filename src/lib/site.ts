export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tharros.ca").replace(/\/+$/, "");

/** JSON for a <script type="application/ld+json">; escapes "<" so data can never close the tag. */
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\u003c");
