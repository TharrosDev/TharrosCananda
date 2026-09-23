# Site-wide UX Polish Implementation Plan (PR 4 of 4)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Polish the whole site within its existing theme:
- motion tokens and quiet reveals;
- mobile navigation and tap targets;
- a clearer home flow;
- a stronger services comparison and a better request form (validation on blur, a labelled stepper, a saved draft);
- designed states;
- a legibility audit.

**Architecture:** CSS-first. Motion lives in tokens in `globals.css`, and reveals use CSS scroll-driven animation (`animation-timeline: view()`), wrapped in `@supports` and `prefers-reduced-motion: no-preference`. JavaScript changes are limited to the request form (blur validation, sessionStorage draft) and nothing else.

**Tech Stack:** CSS, React 19, Vitest, Playwright + axe.

**Spec:** `docs/superpowers/specs/2026-09-22-research-monitor-ux-design.md` §4 (+ §5 PR 4)

## Global Constraints

- Palette, typefaces and grid stay unchanged. No new dependencies.
- Legibility: labels ≥ 11.5px, body ≥ 19px, section titles use the existing clamp scale. When in doubt, go larger (owner preference).
- Motion: `--ease: cubic-bezier(.2,.7,.2,1)`, `--dur-1: 150ms`, `--dur-2: 250ms`. No animation under `prefers-reduced-motion: reduce`.
- Tap targets ≥ 44 × 44px on mobile.
- No em-dashes added to body copy. Keep copy short. Invent no clients, data or publications.
- Every commit ends with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.

## Review Focus

1. **Reduced motion.** No element stays invisible because its reveal animation never ran. Content must be visible by default, with the animation only enhancing it. Test: Task 1 (e2e with `reducedMotion: "reduce"`: every `section h2` is visible).
2. **Browsers without scroll-driven animations** (Safari 18, Firefox). Content is fully visible, because the animation sits in `@supports (animation-timeline: view())`. Test: Task 1 (CSS review plus a unit grep test that every `animation-timeline` rule is inside `@supports`).
3. **A form draft restored after reload** doesn't resurrect a *submitted* request. The draft is cleared on success. Test: Task 3 (e2e).
4. **`sessionStorage` blocked.** The form still works. Test: Task 3 (unit on the storage helpers from `monitor-view.ts`, reused).
5. **320px viewport.** There is no horizontal overflow on any route. Test: extend the overflow loop to every route in the sitemap (Task 4).

---

### Task 1: Motion tokens and reveals
- **Files:** `src/app/globals.css`, `e2e/site.spec.ts`, `tests/css-guard.test.ts`.
- Add the motion tokens to `:root`.
- Unify the existing `transition:` durations onto the tokens (grep `transition:` in all CSS files).
- Add `.reveal` behaviour for section headings and cards: `@supports (animation-timeline: view()) { @media (prefers-reduced-motion: no-preference) { … animation: reveal linear both; animation-timeline: view(); animation-range: entry 0% entry 40%; } }`, with keyframes from `opacity: .001; translate: 0 12px` to `opacity: 1; translate: 0 0`.
- Apply it with selectors, not new classes: `main > section h2`, `.archive-list > li`, `.monitor-dispatch-grid > li` and `.service-list article`.
- Tests:
  - `tests/css-guard.test.ts` reads every `.css` file and asserts each `animation-timeline` occurrence sits after an `@supports (animation-timeline` opening.
  - An e2e run with `test.use({ reducedMotion: "reduce" })` asserts `/` section headings are visible with computed opacity 1.

### Task 2: Mobile navigation, tap targets and focus
- **Files:** `src/app/globals.css`, `src/components/header.tsx`, `e2e/site.spec.ts`.
- Mobile nav sheet: full-height panel below the header, links at 28px display type with 56px rows, "Commission research" pinned at the bottom, body scroll locked while open (`overflow: hidden` on `html` via a `data-menu-open` attribute set by the existing `open` state).
- A consistent `:focus-visible` ring (2px `--focus`, 3px offset) across buttons, links, chips and inputs.
- Tap-target sweep: every interactive element on ≤ 760px has `min-height: 44px`.
- e2e (mobile project):
  - opening the menu sets `data-menu-open` and shows 5 links;
  - Escape closes it and returns focus;
  - an axe run with the menu open.
  - A tap-target check: every `a, button` in `main` has a bounding box height ≥ 44 at 390px, excluding inline text links inside paragraphs.

### Task 3: Home flow, services and request form
- **Files:** `src/app/page.tsx`, `src/app/globals.css`, `src/components/service-list.tsx`, `src/components/research-request-form.tsx`, `e2e/site.spec.ts`.
- Home order: hero → "Start with a question" → services summary (moved up) → research areas → Live Monitor → research → closing CTA.
  - The Live Monitor band copy becomes sentence case at ≥ 20px (it is currently all-caps).
  - The "No publications yet." block becomes: "First publications in preparation." plus a link "See how a report is published" → `/research/example-report`.
- Services: each service card gets a consistent spec row: "You receive", "Typical scope", "Format". Take the values from `src/lib/services.ts` fields; add fields only if a value genuinely exists there (no invented prices or timelines).
- Request form:
  - a stepper with 3 labelled steps ("Organization", "Question", "Review") above the progress bar, with the current step `aria-current="step"`;
  - validate a field on blur (show its error once touched);
  - save a draft to `sessionStorage` (`tharros.request.draft`) on change, restore it on load (URL prefill wins for prefilled fields), and clear it on success.
- e2e:
  - Blur on an empty "Business email" after typing "x" shows the email error.
  - Fill step 1, reload, and the values are restored.
  - Submit success (mock the route to 201) → reload → the form is empty.
  - The stepper shows "Question" as current on step 2.

### Task 4: States, legibility audit, full sweep
- **Files:** `src/app/globals.css`, `src/app/not-found.tsx`, `src/app/error.tsx`, `e2e/site.spec.ts`.
- Legibility audit: grep every `font-size:` below 11.5px in the CSS files and raise to ≥ 11.5px. Body copy under 17px in content areas goes to ≥ 17px.
- Not-found: add three useful links (Research, Live Monitor, Commission research) under the existing message.
- Loading skeletons: the Live Monitor skeleton matches the final layout height, which reduces CLS.
- Overflow e2e: loop over every static route (read `/sitemap.xml` plus `/research/example-report`) at 320px and 1024px.
- Axe on every sitemap route (desktop).
- Final: `npx tsc --noEmit && npx eslint . --max-warnings=0 && npx vitest run && npm run build && npx playwright test`. Then push `feat/site-polish`, dispatch baselines, review every changed baseline, open the PR, wait for CI, merge, and run the production smoke test.
