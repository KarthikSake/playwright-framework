# Decisions

Architecture choices for this Playwright framework against [automationexercise.com](https://automationexercise.com/).

## 1. Simple POM (locators + actions together)

| | |
|--|--|
| **Chose** | One class per page with locators and intent methods in the same file (`src/pages/*.page.ts`). |
| **Rejected** | Split locator-map files vs action classes. |
| **Flip if** | Page objects grow past ~300 lines or multiple teams edit the same page concurrently and need stricter separation. |

## 2. API-first data & auth

| | |
|--|--|
| **Chose** | Create/delete users and verify login via API; use UI only for journeys that require the browser (`UserFactory.create` / `dispose`). |
| **Rejected** | Pure-UI signup before every test (slow/flaky); hard-coded shared accounts (parallel collisions). |
| **Flip if** | The AUT removes public account APIs or signup becomes the only supported path. |

## 3. Custom fixtures as dependency injection

| | |
|--|--|
| **Chose** | Extended Playwright `test` in `src/fixtures` injecting pages, `api`, and factories. Specs never `new` page objects ad hoc. |
| **Rejected** | Manual construction in each spec / helper `getPages(page)` without fixture lifecycle. |
| **Flip if** | Fixture graph becomes deep/circular; then introduce a thinner composition root — still keep a single import for specs. |

## 4. Agent-native by design

| | |
|--|--|
| **Chose** | `AGENTS.md` + `.cursor/rules` + `.cursor/skills` + `.github/copilot-instructions.md` + compilable `templates/`. |
| **Rejected** | Docs-only “how to contribute” without executable constraints. |
| **Flip if** | The team standardizes on a single agent product and wants one surface only — keep `AGENTS.md` as the shared core. |

## 5. Chromium-only

| | |
|--|--|
| **Chose** | Single Playwright project: Desktop Chrome / Chromium. |
| **Rejected** | Multi-browser matrix by default. |
| **Flip if** | Cross-browser regressions become a release gate — add Firefox/WebKit projects then. |

## 6. Parallel-safe data + workers

| | |
|--|--|
| **Chose** | `fullyParallel: true`, WORKERS env (local ≈ half CPUs, CI = 2), UUID `uniqueToken` + `@faker-js/faker` for users/payments, per-test factory create/dispose. |
| **Rejected** | Shared login accounts; `Date.now()+Math.random` uniqueness; serial-only runs. |
| **Flip if** | Public AUT rate-limits force lower concurrency — set `WORKERS=1` / `npm run test:serial`. |

## 7. Locator configs + Playwright `.or()` fallbacks

| | |
|--|--|
| **Chose** | Per-page locator configs (`strategies[]`) + page getters via `this.loc()` / `locatorFrom`; Playwright `.or()` for fallbacks. No disk LKG cache. |
| **Rejected** | Healenium / LLM heal; sticky filesystem heal caches; wrapping every `#id` in multi-strategy defs. |
| **Flip if** | AUT ships stable `data-testid`s everywhere — then prefer single testId strategies and drop most fallbacks. |

## Out of scope

Full site coverage, load testing, mutating shared AUT data beyond per-test users, multi-environment grids, AI/DOM-similarity locator healing.

**CI:** GitHub Actions runs `typecheck` + Chromium Playwright on push/PR (`.github/workflows/playwright.yml`).
