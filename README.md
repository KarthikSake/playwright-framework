# Playwright Framework — Automation Exercise

Playwright + TypeScript test framework for [automationexercise.com](https://automationexercise.com/). Covers API, UI, and hybrid (API-seed → UI) flows. Chromium only.

## Prerequisites

- Node.js **20+**
- npm 10+
- Network access to `https://automationexercise.com`

## Setup

```bash
npm install
cp .env.example .env          # optional; defaults match production AUT
npx playwright install chromium
```

If `npx` resolves an older Node on your PATH:

```bash
node node_modules/@playwright/test/cli.js install chromium
node node_modules/@playwright/test/cli.js test
```

## Run tests

```bash
npm run typecheck
npm test                 # full suite (API + UI + flows), parallel
WORKERS=4 npm test       # override worker count
npm run test:api         # tests/api
npm run test:ui          # tests/ui
npm run test:flows       # tests/flows
npm run test:headed      # headed Chromium
npm run test:serial      # --workers=1
npm run report           # open last HTML report
```

Parallelism is on by default (`fullyParallel: true`). Local default is half of logical CPUs (min 2); CI defaults to 2. Each test uses unique factory data so workers do not collide.

## Architecture

```text
AGENTS.md / Cursor rules & skills / templates
            │
            ▼
   tests (api | ui | flows)
            │
            ▼
      src/fixtures ──► pages / api / factories
                            │
                            ▼
                         config (env)
```

- Specs import `test` / `expect` from `@fixtures` only.
- Fixtures inject page objects, `api`, and factories — never `new` pages in specs.
- API assertions use JSON **`body.responseCode`** (HTTP is often 200 regardless).
- Prefer **API create → UI journey → API delete** for authenticated flows.

## Docs

| File | Purpose |
|------|---------|
| [`FRAMEWORK_GUIDE.md`](FRAMEWORK_GUIDE.md) | Architecture, API layer, pages, test inventory |
| [`DECISIONS.md`](DECISIONS.md) | Chose / rejected / flip-if constraints |
| [`AGENTS.md`](AGENTS.md) | Rules for humans and agents adding tests |
| [`prompts/integrate-test-case/`](prompts/integrate-test-case/) | Copy-paste Agent prompts to add tests (detailed spec or MCP explore) |

## Notes

- Chromium only (see `DECISIONS.md`).
- Public AUT may show ads — `dismissBlockingOverlays()` is best-effort; local retries are enabled (`retries: 1`).
- Fragile controls use ordered locator strategies (Playwright `.or()`); stable `#id` / `data-qa` stay as direct locators.
