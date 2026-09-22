<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project commands

- `npm run lint` · `npm run typecheck` · `npm test` (Vitest, `tests/`) · `npm run build`
- `npx playwright test e2e/site.spec.ts`: functional + axe checks against a production build with Currents mocked by `e2e/mock-sources.mjs`.
- Visual baselines (`e2e/visual.spec.ts-snapshots/`) are Linux-only. Refresh them by pushing a branch commit whose message contains `[update-baselines]`, then re-run the PR checks after the bot's commit lands.
- `npm run smoke -- https://tharros.ca`: post-deploy smoke test.
