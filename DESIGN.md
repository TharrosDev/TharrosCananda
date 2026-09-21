---
name: Tharros Canada
description: Canadian market intelligence laid out as one authoritative tariff schedule.
colors:
  ivory: "#f4f1ea"
  ivory-deep: "#ebe6db"
  ivory-light: "#faf8f3"
  ink: "#1c1d1f"
  ink-soft: "#45484d"
  slate: "#5d6166"
  rule: "rgba(28, 29, 31, 0.13)"
  rule-strong: "rgba(28, 29, 31, 0.32)"
  soft-black: "#161719"
  graphite: "#232528"
  on-dark: "#ece8df"
  on-dark-soft: "#aeaba3"
  rule-dark: "rgba(236, 232, 223, 0.14)"
  red: "#9e3a35"
  red-dark: "#7f2c28"
  steel: "#46677f"
  steel-on-dark: "#8fb0c7"
  green: "#4f6e58"
  green-on-dark: "#9bbfa4"
  error: "#8a312d"
  focus: "#2f6fae"
  focus-on-dark: "#8fb8e0"
typography:
  display:
    fontFamily: "Source Serif 4 Variable, Source Serif Pro, Georgia, serif"
    fontSize: "clamp(52px, 6.6vw, 96px)"
    fontWeight: 380
    lineHeight: 0.98
    letterSpacing: "-0.028em"
  headline:
    fontFamily: "Source Serif 4 Variable, Source Serif Pro, Georgia, serif"
    fontSize: "clamp(36px, 3.6vw, 56px)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Source Serif 4 Variable, Source Serif Pro, Georgia, serif"
    fontSize: "28px"
    fontWeight: 500
    lineHeight: 1.15
  entry-figure:
    fontFamily: "Source Serif 4 Variable, Source Serif Pro, Georgia, serif"
    fontSize: "30px"
    fontWeight: 400
    lineHeight: 1.1
    letterSpacing: "-0.01em"
    fontFeature: "tnum, lnum"
  body:
    fontFamily: "Schibsted Grotesk Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Schibsted Grotesk Variable, Helvetica Neue, Arial, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.08em"
rounded:
  square: "0px"
spacing:
  hairline: "1px"
  gutter: "clamp(20px, 4.2vw, 64px)"
  col-gap: "clamp(16px, 2vw, 32px)"
  section: "clamp(88px, 10vw, 152px)"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.ivory-light}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "12px 22px"
    height: "50px"
  button-primary-hover:
    backgroundColor: "{colors.red-dark}"
    textColor: "{colors.ivory-light}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "12px 22px"
    height: "50px"
  button-secondary-hover:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ivory-light}"
  nav-action:
    backgroundColor: "{colors.red}"
    textColor: "{colors.ivory-light}"
    rounded: "{rounded.square}"
    padding: "0 18px"
    height: "44px"
  field:
    backgroundColor: "#ffffff"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "0 14px"
    height: "52px"
  band:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.on-dark}"
  band-dark:
    backgroundColor: "{colors.soft-black}"
    textColor: "{colors.on-dark}"
---

# Design System: Tharros Canada

## Overview

**Creative North Star: "The Tariff Schedule"**

The whole site reads as one authoritative schedule, like a customs tariff: ruled entries in fixed columns, every fact set beside its source. Warm-ivory uncoated stock carries graphite ink, never pure black. Soft-black and graphite chapter bands run full bleed for the question index, the cross-border band and the footer. A serif at display optical size speaks; a grotesk with tabular numerals keeps the schedule.

Density is editorial on the ground and tabular inside the entries. Everything sits on a strict 12-column grid with wide gutters. Structure comes from horizontal rules, never from boxes. Rules are sparse: one per boundary. The one authored motion is chart registration, where the entry prints like a plate, keyline first and series second, once.

**Key Characteristics:**
- Ivory ground (#f4f1ea), graphite ink (#1c1d1f), full-bleed dark bands only as chapters and footer.
- A strict 12-column grid; content spans columns such as 1/6 + 7/6 or 1/4 + 6/7.
- Ruled entries instead of cards, with one rule per section boundary and square geometry throughout.
- Red for action only. Steel and green are data channels.
- Tabular numerals wherever a figure is read or compared.
- One motion: the chart registers in, and it is disabled under reduced motion.

## Colors

A warm paper-and-ink palette with one action colour and two data channels. Contrast ratios below were computed from the token values. The only contrast claim in the source is the `:root` comment on slate (≥5:1 on every ivory tone), and it holds: 5.53 on ivory, 5.01 on ivory-deep, 5.88 on ivory-light.

### Primary
- **Muted Canadian Red** (red): action only. Primary buttons, the header's Request research action, the selected-sample underline in the Explorer picker, and the text caret. Ivory-light text on it measures 6.36:1.
- **Deep Oxide** (red-dark): the hover state of every red action (8.63:1 with ivory-light).

### Secondary
- **Survey Steel** (steel): the trend line, the 10% area wash under it, chart points and province bars (5.31:1 on ivory). On dark bands use steel-on-dark.

### Tertiary
- **Ledger Green** (green): positive change readouts, list check marks and the success state (5.03:1 on ivory). On dark bands use green-on-dark (7.60:1 on graphite).

### Neutral
- **Warm Ivory** (ivory): the page ground and header background.
- **Ivory Deep** (ivory-deep): chart tracks, progress tracks and the scrollbar track.
- **Ivory Light** (ivory-light): text on red and ink fills, the request-form sheet and the mobile menu sheet.
- **Graphite Ink** (ink): body text (14.95:1 on ivory), strong 1–2px section rules, secondary-button stroke.
- **Soft Ink** (ink-soft): descriptions and secondary copy (8.14:1).
- **Annotation Slate** (slate): field labels, captions, step numerals.
- **Rule / Rule Strong** (rule, rule-strong): hairline dividers inside entries; the stronger value for field strokes, chart axes and ticks.
- **Soft Black / Graphite** (soft-black, graphite): full-bleed bands and the footer. On-dark text measures 14.67:1 on soft-black, and on-dark-soft measures 7.82:1.
- **Focus Blue** (focus, focus-on-dark): the 2px focus outline (4.65:1 on ivory). Bands and the footer swap it to focus-on-dark (8.63:1).
- **Error Oxide** (error): invalid-field stroke and error text.

### Named Rules
**The Red Means Act Rule.** Red marks something the visitor can do. It never tints a surface, never colours a datum, and never decorates a heading.

**The Data Channel Rule.** Steel carries series and magnitudes, and green carries positive change and confirmation. Neither is used for action or ornament.

**The Band Rule.** Dark tones appear only as full-bleed chapter bands and the footer, never as boxes on the ivory ground. Inside a band, every colour switches to its on-dark partner, including focus.

## Typography

**Display Font:** Source Serif 4 Variable, optical sizing on (fallback Source Serif Pro, Georgia)
**Body Font:** Schibsted Grotesk Variable (fallback Helvetica Neue, Arial)

**Character:** The serif speaks for the headings, entry names and interpretive sentences. The grotesk runs the schedule: body, controls, labels and tabular readouts.

### Hierarchy
- **Display** (380, clamp(52px, 6.6vw, 96px), 0.98, max 12ch): home hero h1. Inner-page h1 uses clamp(46px, 5.6vw, 84px) at weight 380.
- **Headline** (400, clamp(36px, 3.6vw, 56px), 1.05): section and band h2s. Secondary section h2s step down to clamp(34px, 3.2vw, 48px).
- **Title** (500, 28px, 1.15): service names, process steps (32px) and policy headings (30px). Index entries use 26px, and sub-headings 20–24px.
- **Entry Figure** (400, 30px, tabular lining numerals): the HS heading readout in the Explorer.
- **Body** (400, 17px, 1.6; 16px under 640px): measures held at 32–44em. Hero description clamp(18px, 1.35vw, 21px).
- **Label** (600, 12px, 0.08em, uppercase, slate): field labels that name a datum (HS heading, source status, provenance terms, footer column heads).

### Named Rules
**The No Kicker Rule.** Nothing sits above a heading as a label. Uppercase appears only as a field label for data, placed directly above the value it names.

**The Meaningful Numeral Rule.** Numbering (01–05, 1–3, the success-step counter) is used only where the sequence carries meaning: the five-question index, process and request steps, and HS headings. Numerals are always tabular and slate.

**The Tabular Rule.** Every figure a reader compares (chart labels, shares, prices, change readouts, progress) uses tabular numerals.

## Layout

Every section sits in a shell of min(1440px, 100vw − 2 × gutter) and on a 12-column grid with col-gap clamp(16px, 2vw, 32px). The usual split puts a heading block in columns 1–4 or 1–5 and ruled content in 6–12 or 7–12. The home hero runs six and six: proposition on the left, Explorer entry on the right. Vertical rhythm is set by the section token, clamp(88px, 10vw, 152px).

Under 1180px the hero shifts to five and seven. Under 980px every split collapses to a single full-width column and the navigation becomes a toggled sheet. Under 640px, multi-column entries (result meta, provenance, service terms, choice grids) stack, and actions stretch to full width in forms.

**The One Rule Per Boundary Rule.** Each boundary gets exactly one rule. A strong 1px ink (or 2px on entry heads and sidebars) opens a list or entry, and hairline rules divide its rows. Never double a rule with padding boxes or borders on both sides.

## Elevation & Depth

The system is flat. Depth comes from tone, not shadow: ivory ground, the ivory-light sheet for the request form, and full-bleed dark bands for chapters. The only box-shadow in the build is the mobile menu sheet's soft drop. That shadow is an existing value, not a system rule (see drift).

**The Printed Plate Rule.** Surfaces never lift or float. Hover changes colour, underline or arrow position, never elevation.

## Shapes

The geometry is square: 0 radius on buttons, fields, checks, tracks and sheets. The single exception is the radio mark, a native circle, because a round mark is how a radio reads. The wordmark separator is a 1px red slash skewed −18deg, part of the identity mark only. Arrows are inline 18px SVGs that move 4px right on hover.

## Components

### Buttons
Firm and typographic, never pill-shaped.
- **Shape:** square (0px), minimum height 50px, 16px/600 text, 14px gap to the trailing arrow.
- **Primary:** red fill, ivory-light text, 12px 22px padding. Hover moves to red-dark over 160ms on the ease-out curve.
- **Secondary:** 1px ink stroke, transparent fill. Hover inverts to an ink fill with ivory-light text.
- **Text link:** no padding, 1px ink bottom rule, arrow nudges on hover.
- **Focus:** 2px focus-blue outline, 3px offset.

### Cards / Containers
There are no cards. Content is ruled entries on the ivory ground: lists open with an ink rule and divide rows with hairlines. The request form is the only tinted sheet (ivory-light, 2px ink top rule, no border or shadow).

### Inputs / Fields
- **Style:** white fill, 1px rule-strong stroke, square, 52px tall (50px inline in the Explorer ask), 14px horizontal padding. Labels are 15px/600 sans, and the "Required" marker is an uppercase 12px em.
- **Hover / Focus:** stroke darkens to ink-soft, then to focus blue on focus.
- **Error:** error-oxide stroke plus a 14px/600 message. The form error block has a 2px error top rule.
- **Choices:** ruled rows at least 60px tall with a square 22px check that fills ink when selected. Radios use a ring that thickens to 6px ink.

### Navigation
84px bar on ivory with a hairline bottom rule. Links are 14px/500 ink-soft. On hover or on the current page they turn ink, and a 1px ink underline scales in from the left (240ms). The red Request research action sits last. Under 980px a 44px square toggle opens a full-width ivory-light sheet of 17px ruled rows.

### Market Explorer (signature)
The schedule entry. It opens with a 2px ink top rule and closes with a 1px ink bottom rule. From top to bottom:
- a title line with the sample-data stamp;
- a sample picker whose selected tab gains a 2px red underline;
- a result meta row of labelled fields, including the HS heading as the entry figure;
- the trend chart with a labelled graticule, beside province bars (5px steel on ivory-deep tracks);
- a source strip, a serif interpretation line (22px), routes, resources and a provenance record.

**Chart registration (the one authored motion).** The graticule fades in over 500ms. The line then draws via stroke-dashoffset (1400ms, 350ms delay), and the area and points fade in last (700ms, 1000ms delay). Province bars scale in from the left (1100ms, 500ms delay). Everything runs once on the ease-out curve cubic-bezier(0.16, 1, 0.3, 1). Under prefers-reduced-motion, all animation and transition durations collapse to 0.01ms with no delay.

### Question Index
A soft-black band. Heading in columns 1–4, and a ruled list in 6–12 of numbered entries (tabular slate numeral, serif title, sans description, right-aligned service link).

### Footer
A soft-black band with the light wordmark, a 26px serif line, three link columns under uppercase field-label heads, and a legal line under a rule-dark hairline.

## Do's and Don'ts

### Do:
- **Do** lay every section on the 12-column grid inside the shell, and split heading from ruled content by columns.
- **Do** separate entries with one rule per boundary: ink to open, hairline rule between rows.
- **Do** keep red for actions and the selected state of an action control. Use steel and green for data.
- **Do** switch to the on-dark tokens, including focus-on-dark, inside bands and the footer.
- **Do** set every compared figure in tabular numerals.
- **Do** keep the chart registration as the only authored motion, and keep it disabled under prefers-reduced-motion.

### Don't:
- **Don't** put a kicker, eyebrow or label line above any heading. Uppercase is only for field labels that name a datum.
- **Don't** number anything whose order carries no meaning.
- **Don't** use cards, boxed panels or dark boxes on the ivory ground. Dark tones are only full-bleed bands and the footer.
- **Don't** round corners or add shadows to surfaces.
- **Don't** use pure black (#000) for ink or bands.
- **Don't** add a second animated moment or scroll-triggered reveals.
