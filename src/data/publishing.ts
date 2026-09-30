/** Owner-approved launch positioning. Intake and pricing are deliberately forthcoming. */
export const publishing = {
  name: "Tharros Undergraduate Publishing",
  slogan: "Your résumé looks better when you’re published.",
  supportingLine: "Turn your strongest undergraduate work into a professional publication.",
  description:
    "Tharros Undergraduate Publishing transforms strong undergraduate work into professionally published research students can showcase beyond the classroom.",
  submissionsOpen: false,
  fee: null,
} as const;

export const eligibleWork = [
  "Research papers",
  "Essays",
  "Policy briefs",
  "Data-analysis projects",
  "Literature reviews",
  "Case studies",
  "Honours research",
  "Interdisciplinary work",
] as const;
