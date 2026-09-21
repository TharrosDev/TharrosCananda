---
name: Tharros Canada
description: A precise editorial evidence ledger for Canadian market intelligence.
colors:
  report-paper: "#f3f0e8"
  report-paper-deep: "#e8e3d7"
  report-paper-light: "#faf8f2"
  canadian-ink: "#11233b"
  softened-ink: "#415067"
  annotation-slate: "#677384"
  ledger-line: "#b7b6b0"
  ledger-line-dark: "#7e8791"
  signal-red: "#ad303a"
  signal-red-dark: "#84252d"
  data-blue: "#2f6690"
  verified-green: "#4f735e"
  focus-blue: "#176fab"
typography:
  display:
    fontFamily: "Newsreader Variable, Georgia, serif"
    fontSize: "clamp(56px, 5.8vw, 94px)"
    fontWeight: 470
    lineHeight: 0.96
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Newsreader Variable, Georgia, serif"
    fontSize: "clamp(42px, 4.2vw, 70px)"
    fontWeight: 470
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  title:
    fontFamily: "Newsreader Variable, Georgia, serif"
    fontSize: "29px"
    fontWeight: 590
    lineHeight: 1.2
  body:
    fontFamily: "Manrope Variable, Segoe UI, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Manrope Variable, Segoe UI, sans-serif"
    fontSize: "10px"
    fontWeight: 800
    lineHeight: 1.35
    letterSpacing: "0.14em"
rounded:
  square: "0px"
spacing:
  hairline: "1px"
  xs: "4px"
  sm: "8px"
  md: "12px"
  control: "14px"
  lg: "18px"
  xl: "24px"
  2xl: "32px"
  section: "112px"
components:
  button-primary:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.report-paper-light}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "12px 18px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.signal-red-dark}"
    textColor: "{colors.report-paper-light}"
    rounded: "{rounded.square}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.canadian-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "12px 18px"
    height: "48px"
  field:
    backgroundColor: "#ffffff"
    textColor: "{colors.canadian-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "0 14px"
    height: "50px"
  ledger-surface:
    backgroundColor: "{colors.report-paper-light}"
    textColor: "{colors.canadian-ink}"
    rounded: "{rounded.square}"
    padding: "18px"
  nav-action:
    backgroundColor: "{colors.signal-red}"
    textColor: "{colors.report-paper-light}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "11px 16px"
---

# Design System: Tharros Canada

## Overview

**Creative North Star: "The Evidence Ledger"**

Tharros Canada should feel like an exceptionally clear export dossier brought to life: editorial enough to establish authority, operational enough to interrogate, and restrained enough that evidence always outranks promotion. Warm uncoated report paper, deep Canadian ink, slate annotations, muted data colors, and a single signal red create an institutional world without drifting into a government portal.

The interface earns confidence through visible provenance and disciplined structure. Rules, registers, source strips, tabular numerals, and asymmetric editorial compositions organize the experience; decorative containers do not. The density is deliberate but breathable, with publication-scale headlines balanced by exact controls and compact evidence labels.

**Key Characteristics:**

- Editorial authority paired with precise interface control.
- Warm paper surfaces subdivided by hairline ledger rules.
- Asymmetric, evidence-forward compositions that become linear on small screens.
- Restrained Canadian red used as a signal, never as atmosphere.
- Honest status, source, limitation, and methodology treatments embedded in the visual hierarchy.

## Colors

The palette combines warm report stock with deep navy ink, quiet slate annotation, and muted signal colors that read as evidence rather than decoration.

### Primary

- **Signal Canadian Red:** Reserved for primary actions, active rules, numbered sequence markers, demonstration status, and exceptional emphasis.
- **Deep Signal Red:** The hover, required, and critical companion to the main signal color.

### Secondary

- **Measured Data Blue:** Used for quantitative series and chart marks where neutral evidence needs a distinct channel.
- **Verified Green:** Used for positive trend values, selected checks, route fit, and verified or ready states.

### Neutral

- **Warm Report Paper:** The default page ground; it keeps long research-oriented surfaces calm and tactile.
- **Deep Report Paper:** A tonal subdivision for tracks, selected controls, and secondary evidence regions.
- **Light Report Paper:** The lifted working surface for explorers, forms, and high-density evidence modules.
- **Deep Canadian Ink:** The primary text, dark band, and strongest structural-rule color.
- **Softened Ink:** Supporting copy that remains readable without competing with titles or findings.
- **Annotation Slate:** Metadata, helper text, axis labels, and provenance annotations.
- **Ledger Line / Dark Ledger Line:** The structural rule vocabulary. Use the darker line to bound a system; use the lighter line to divide its contents.
- **Accessible Focus Blue:** The dedicated keyboard-focus signal; it is not a decorative accent.

### Named Rules

**The Red Is a Signal Rule.** Signal red marks action, status, or a meaningful editorial cue; it never becomes a large decorative field.

**The Evidence Color Rule.** Data blue and verified green communicate distinct evidence channels. Do not recolor data for visual variety.

**The Paper, Not White Rule.** Warm report paper is the environmental ground. Pure white belongs only inside exact input and control surfaces.

## Typography

**Display Font:** Newsreader Variable (with Georgia and serif fallbacks)
**Body Font:** Manrope Variable (with Segoe UI and sans-serif fallbacks)
**Label Font:** Manrope Variable

**Character:** Newsreader supplies the measured authority of a financial publication or research brief; Manrope supplies unambiguous controls, dense metadata, and international legibility. Their contrast is the identity, so neither should be replaced by a generic all-purpose face.

### Hierarchy

- **Display:** Low-contrast editorial headlines with tight tracking and nearly solid leading. Use only for page propositions and major hero statements.
- **Headline:** Large section arguments and decision prompts; keep the measure controlled so the type reads as an editorial statement.
- **Title:** Service names, evidence-module headings, and compact editorial subheads.
- **Body:** Default reading and control copy. Keep long-form text at or below the established 70-character measure.
- **Label:** Compact uppercase metadata with wide tracking for provenance, sequence numbers, status, and field context. Never use it for sentences.

### Named Rules

**The Editorial-Control Pair Rule.** Newsreader speaks for propositions and interpretation; Manrope speaks for actions, inputs, metadata, and factual scaffolding.

**The Labels Are Evidence Rule.** Uppercase labels identify a datum or state. They do not serve as ornamental eyebrow text.

## Layout

The primary shell is a centered fluid frame capped at 1480px with 32px desktop gutters. Major sections use generous 112px vertical intervals, while evidence modules tighten to 18–32px internal spacing. Desktop compositions favor intentional asymmetry: proposition beside working interface, analysis beside source register, and research flow beside boundary notes.

The system changes at three implemented seams. At 1220px, the shell narrows and large gaps compress. At 980px, navigation becomes a menu and major multi-column compositions stack. At 700px, gutters reduce to 14px, action groups become vertical, evidence grids collapse, and the proposition remains ahead of the Explorer in document order. Dense data stays structured on mobile through reordered subdivisions, not horizontal overflow.

Hairline rules are part of the grid. A dark top or outer rule establishes the boundary of a ledger; lighter rules subdivide rows, columns, and source fields. Cards should not be introduced where a ruled list or divided field can express the same hierarchy.

**The Evidence Before Ornament Rule.** The layout allocates the most space to inspectable output, provenance, and next-step clarity—not to decorative brand staging.

**The Mobile Reading Order Rule.** On narrow screens, preserve proposition, action, then evidence. Do not merely squeeze the desktop split.

## Elevation & Depth

The system is flat by default and uses tonal layering plus rules for most depth. Soft navy shadows appear only beneath substantial working surfaces—the hero Explorer, full Explorer, request form, and opened mobile navigation—where the surface must read as an active instrument above report paper. Hover depth is expressed with a one-pixel lift on the compact navigation action; ordinary content rows remain flat.

### Shadow Vocabulary

- **Explorer Lift** (`0 18px 44px rgba(17, 35, 59, .08)`): The compact working Explorer in the first viewport.
- **Workspace Lift** (`0 22px 54px rgba(17, 35, 59, .08)`): Full Explorer pages and other primary workspaces.
- **Form Lift** (`0 22px 54px rgba(17, 35, 59, .07)`): The progressive request form.
- **Menu Lift** (`0 18px 30px rgba(17, 35, 59, .12)`): Temporary mobile navigation only.

### Named Rules

**The Flat-by-Default Rule.** Content remains on the report plane. Shadows identify active tools or temporary overlays, never generic cards.

## Shapes

The form language is rectilinear and exact. Controls, buttons, fields, chips, panels, status stamps, chart tracks, and selection marks use square corners. Structure comes from one-pixel rules, full-width bands, and hard subdivisions rather than rounded containers. The recurring silhouettes are ledger rows, source strips, split report fields, and dark institutional bands.

**The Square Instrument Rule.** Interactive geometry stays square. Do not import pill buttons, rounded cards, floating bubbles, or soft dashboard tiles.

## Components

### Buttons

- **Shape:** Square, minimum 48px high, with compact horizontal padding and a clear one-pixel boundary.
- **Primary:** Signal red with light report text; bold Manrope makes the action direct without oversized display treatment.
- **Hover / Focus:** Hover deepens to dark signal red. Arrow icons travel 4px to confirm direction. Keyboard focus uses the dedicated 3px blue outline with 3px offset.
- **Secondary:** Transparent with Canadian ink border and text; hover inverts to a solid ink field.
- **Text Link:** A minimum-height inline action with a single ink underline and the same directional arrow motion.

### Chips

- **Style:** Example-query actions and compact demonstration stamps are square, transparent, and rule-bound. They are annotations or shortcuts, not decorative pills.
- **State:** Selected research choices shift to deep report paper with an ink boundary; verified checks use green.

### Cards / Containers

- **Corner Style:** Square throughout.
- **Background:** Use light report paper for working surfaces and standard report paper for the environment.
- **Shadow Strategy:** Only primary tools lift; evidence rows and service entries remain rule-separated and flat.
- **Border:** Dark outer rules establish a ledger; light internal rules divide content.
- **Internal Padding:** Compact data cells use 18px; standard evidence groups use 24–32px.

### Inputs / Fields

- **Style:** White rectangular controls with dark ledger-line borders, 50px standard height, and concise internal padding.
- **Focus:** The field border shifts to accessible focus blue while the global 3px focus outline remains visible.
- **Error / Disabled:** Error copy uses a deep red and appears next to the affected field; disabled submission preserves shape and lowers opacity without obscuring the label.

### Navigation

The wordmark uses Newsreader with generous tracking and a red slash. Desktop links are quiet 13px Manrope labels whose active or hover state draws a fine red rule beneath the text. The request action is the only filled navigation item. Below 980px, a 44px square menu control opens a ruled, light-paper navigation panel with full-width link rows.

### Market Explorer

The Market Explorer is the signature instrument: a light report surface divided into topline, query controls, metadata, chart and province fields, interpretation, route/resource registers, and a source strip. It must always expose demonstration status and provenance. Loading dims and slightly desaturates the existing result rather than replacing the whole surface with a theatrical skeleton.

### Research Choice

Research objectives and route selections use full-width square rows. The unselected state is white and dark-line bound; the selected state shifts to deep report paper, strengthens the boundary, and reveals a verified-green check. The whole row carries the focus outline so keyboard state remains unambiguous.

## Do's and Don'ts

### Do:

- **Do** make sources, status, periods, limitations, and retrieval context visible within the evidence hierarchy.
- **Do** use hairline rules and aligned fields to organize dense information.
- **Do** preserve the Newsreader/Manrope division between editorial interpretation and interface control.
- **Do** treat red as a scarce action or status signal and blue/green as stable data channels.
- **Do** compose mobile screens deliberately around reading order, generous targets, and stacked evidence fields.

### Don't:

- **Don't** introduce rounded cards, pill controls, glass effects, gradients, or floating dashboard tiles.
- **Don't** use red as a broad background, decorative wash, or substitute for hierarchy.
- **Don't** bury provenance in a footer, tooltip, or secondary disclosure when it qualifies a visible result.
- **Don't** fabricate testimonials, partners, live-data claims, scale signals, or government affiliation.
- **Don't** add ornamental imagery where a working query, chart, source register, or clear written boundary provides stronger proof.
