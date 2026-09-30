import { publications } from "@/data/publications";

export type AuthorProfile = {
  slug: string;
  name: string;
  /** Optional details are published only after the author supplies and approves them. */
  institution?: string;
  program?: string;
  bio?: string;
  linkedin?: string;
  orcid?: string;
  /** Profile indexing is approved separately from publication indexing. */
  indexable: boolean;
};

// The existing reports verify the byline. No affiliation, biography or profile links have been supplied.
export const authors: AuthorProfile[] = [
  { slug: "magnus-abdelnour", name: "Magnus Abdelnour", indexable: false },
];

export function authorBySlug(slug: string) {
  return authors.find((author) => author.slug === slug);
}

export function authorByName(name: string) {
  return authors.find((author) => author.name === name);
}

export function publicationsForAuthor(slug: string) {
  const author = authorBySlug(slug);
  if (!author) return [];
  return publications
    .filter((publication) => publication.authors.includes(author.name))
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}
