# Playwright Framework — Automation Exercise

Playwright + TypeScript test framework for [automationexercise.com](https://automationexercise.com/).  
Covers **API**, **UI**, and **hybrid flows** (API seed → UI journey → API cleanup). Chromium only.

---

## At a glance

| Capability | Status | Notes |
|------------|:------:|-------|
| **UI tests** | ✅ | Signup, login, cart, discovery, contact, subscription, reviews, auth session |
| **API tests** | ✅ | Auth lifecycle + product list/search; asserts `body.responseCode` |
| **Hybrid flows** | ✅ | Checkout journeys mixing API data with UI |
| **Data generators** | ✅ | Faker + UUID factories for users, payments, products |
| **Agentic prompts / skills** | ✅ | `AGENTS.md`, Cursor skills, copy-paste integrate prompts |
| **Reporting** | ✅ | HTML report, list reporter, traces / screenshots / video on failure |
| **Parallel execution** | ✅ | `fullyParallel` + `WORKERS` env; unique data per test |
| **CI** | ✅ | GitHub Actions: typecheck + Chromium |
| **Page Object Model** | ✅ | Intent methods + multi-strategy locators for fragile controls |
| **Fixtures (DI)** | ✅ | Pages, `api`, factories injected — no `new` in specs |

---

## How the framework is structured

```text
prompts / AGENTS.md / .cursor skills & rules / templates
            │  (agent guidance)
            ▼
   tests/
     api/      Pure API contracts
     ui/       Pure browser journeys
     flows/    API seed → UI → teardown
            │
            ▼
   src/fixtures  →  pages · api · factories
            │
            ▼
   config (BASE_URL / API_BASE_URL) → automationexercise.com
```

**Core idea:** specs stay thin. Fixtures inject page objects and an API client. Factories create unique users and clean them up. Agents follow `AGENTS.md` + prompts so new tests land in the same shape.

---

## UI ✅

Specs live under `tests/ui/`.

| Area | Coverage |
|------|----------|
| Auth | Signup (happy path), duplicate-email error, bad login, login/logout, delete account |
| Catalog | Search → detail, brand filter, category filter (Women/Dress, Men/Tshirts) |
| Cart | Quantity + line total, remove to empty, multi-product cart |
| Other | Contact Us, footer subscription (home + cart), product review |

**Pattern:** page intents (`searchProduct`, `addToCart`, `login`) via fixtures; overlays dismissed best-effort on the public AUT.

---

## API ✅

Specs live under `tests/api/`.

| Suite | Coverage |
|-------|----------|
| Auth | Create → verify login → get user detail → delete; missing-email → `responseCode` 400 |
| Products | Product list; search hit; missing search param → 400 |

**AUT quirk:** HTTP is often **200** while business result is in JSON **`responseCode`** (201 / 400 / 404). Always assert the body code. Auth writes use **form-urlencoded** (`postForm` / `deleteForm`).

---

## Hybrid flows ✅

Specs live under `tests/flows/` — API creates the user, UI exercises the journey, fixture teardown deletes the account.

| Flow | What it proves |
|------|----------------|
| `checkout.flow.spec.ts` | Logged-in user: search → cart → place order → pay |
| `search-checkout.flow.spec.ts` | Search → set quantity → checkout |
| `brand-checkout.flow.spec.ts` | Brand filter → detail → checkout |
| `guest-checkout-login.flow.spec.ts` | Guest cart → checkout modal → login → pay |
| `register-during-checkout.flow.spec.ts` | Guest cart → register from checkout → pay |

---

## Data generators ✅

| Factory | Role |
|---------|------|
| `UserFactory` / `buildUser()` | Unique email/password (UUID token + Faker); `create()` via API; `dispose()` deletes tracked users |
| `ProductFactory` | Known search terms, pick from live catalog |
| `buildPayment()` | Card details for checkout |

No shared accounts — safe under parallel workers.

---

## Agentic prompts & skills ✅

Built so Cursor / Copilot agents add tests without inventing a parallel layout.

| Asset | Purpose |
|-------|---------|
| [`AGENTS.md`](AGENTS.md) | Non-negotiable rules (fixtures, `responseCode`, Chromium only) |
| [`.cursor/skills/`](.cursor/skills/) | Step-by-step: add UI / API / page object / integrate test |
| [`prompts/integrate-test-case/`](prompts/integrate-test-case/) | Copy-paste prompts: detailed spec, MCP plan-then-build, MCP explore-and-implement |
| [`templates/`](templates/) | Spec & page-object skeletons |

---

## Reporting ✅

| Artifact | When |
|----------|------|
| **HTML report** | Always (`npm run report`) |
| **List** | Console during run |
| **Trace** | On first retry |
| **Screenshot** | On failure |
| **Video** | Retained on failure |

---

## Parallel execution ✅

- `fullyParallel: true`
- Workers: `WORKERS` env, or local ≈ half CPUs (min 2), or **2 on CI**
- Isolation: unique factory emails per test; factory dispose on teardown
- Escape hatch: `npm run test:serial` (`--workers=1`)

```bash
WORKERS=4 npm test
```

---

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

If `npx` picks an older Node:

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

Single file / title:

```bash
node node_modules/@playwright/test/cli.js test tests/ui/auth-session.ui.spec.ts -g "delete account"
```

---

## Docs

| File | Purpose |
|------|---------|
| [`FRAMEWORK_GUIDE.md`](FRAMEWORK_GUIDE.md) | Deep dive: API layer, POM, full inventory |
| [`DECISIONS.md`](DECISIONS.md) | Chose / rejected / flip-if architecture notes |
| [`AGENTS.md`](AGENTS.md) | Rules for humans and agents |
| [`prompts/integrate-test-case/`](prompts/integrate-test-case/) | Prompts to integrate new test cases |

## Notes

- Chromium only (see `DECISIONS.md`).
- Public AUT may show ads — `dismissBlockingOverlays()` is best-effort; local retries enabled (`retries: 1`).
- Fragile controls use ordered locator strategies (Playwright `.or()`); stable `#id` / `data-qa` stay as direct locators.
