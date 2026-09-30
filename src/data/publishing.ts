/** Owner-supplied showcase positioning. New submissions remain forthcoming. */
export const publishing = {
  name: "Tharros Canada",
  slogan: "Strong work deserves a life beyond the classroom.",
  supportingLine: "A professional home for strong student work.",
  description:
    "Tharros Canada is an undergraduate research showcase and database designed to give strong student work a professional home beyond the classroom.",
  missionStatement:
    "Tharros Canada is an undergraduate research showcase and database designed to give strong student work a professional home beyond the classroom. The platform combines elements of a research repository, professional portfolio, and easy LinkedIn-style referencing profile system displaying authored works, allowing undergraduate students to publish and showcase papers, research projects, policy briefs, data work, and other academic work in a searchable public database. Tharros helps students turn work that might otherwise disappear after receiving a grade into something they can share, reference, and include in résumés, applications, and professional portfolios.",
  submissionsOpen: false,
  fee: null,
} as const;

export const eligibleWork = [
  "Research papers",
  "Research projects",
  "Essays",
  "Policy briefs",
  "Data-analysis projects",
  "Literature reviews",
  "Case studies",
  "Honours research",
  "Interdisciplinary work",
] as const;
