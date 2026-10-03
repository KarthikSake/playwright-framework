# AGENTS.md — Agent entry point for this Playwright framework

Tool-agnostic instructions for Claude, Codex, Cursor, Copilot, and humans adding tests.

## Folder map

```text
src/api/         API client, auth/products endpoints, responseCode types
src/config/      BASE_URL / API_BASE_URL from env
src/factories/   UserFactory (create/dispose), ProductFactory
src/fixtures/    Custom Playwright fixtures — ALWAYS import test/expect from here
src/locators/    locatorFrom / strategy builders (Playwright `.or()` fallbacks)
src/pages/       Simple POM (getters + intents); locator configs under pages/locators/
tests/api/       Pure API specs
tests/ui/        Pure UI specs
tests/flows/     Hybrid API-seed → UI journey specs
templates/       Golden skeletons to copy
.cursor/skills/  Step-by-step agent skills
```

## Non-negotiable rules

1. **Import `test` / `expect` from `@fixtures`**, never directly from `@playwright/test` in specs.
2. **Do not `new` page objects in specs** — use fixtures (`homePage`, `productsPage`, `api`, `userFactory`, …).
3. **Unique users per test** — `userFactory.create()` or `buildUser()`; never shared accounts.
4. **API assertions use `body.responseCode`**, not only HTTP status (Automation Exercise quirk).
5. **Form-urlencoded** for create/delete/login API calls (already handled by `ApiClient.postForm` / `deleteForm`).
6. **Locators:** multi-strategy configs only for fragile controls (`src/pages/locators/`); stable `#id` / `data-qa` / scoped CSS stay as `this.page.locator(...)`. Prefer role → placeholder/label → CSS.
7. **Chromium only** — do not add browser projects unless asked.
8. Path aliases: `@api`, `@pages`, `@factories`, `@fixtures`, `@config`, `@locators`.
9. Prefer **API create → UI journey → API delete** (`userFactory.create` / `track` + fixture `dispose`).

## How to add work

| Goal | Follow |
|------|--------|
| New UI test | `.cursor/skills/add-ui-test/SKILL.md` + `templates/ui-test.spec.ts.template` |
| New page object | `.cursor/skills/add-page-object/SKILL.md` + `templates/page-object.ts.template` |
| New API test | `.cursor/skills/add-api-test/SKILL.md` + `templates/api-test.spec.ts.template` |
| New factory field | Extend typed `TestUser` / factory; wire cleanup in `dispose()` |
| Integrate a test (spec / MCP explore) | `.cursor/skills/integrate-test-case/SKILL.md` + copy a prompt from `prompts/integrate-test-case/` |

After adding a page object, register it in `src/fixtures/index.ts`.

## Run commands

```bash
npm install
cp .env.example .env   # if needed
npx playwright install chromium
npm run typecheck
npm test               # all (parallel workers)
WORKERS=4 npm test     # override worker count
npm run test:serial    # --workers=1
npm run test:api
npm run test:ui
npm run test:flows
npm run test:headed
npm run report
```

## Auth & data pattern

- Prefer **API create → UI journey → API delete** (factory `create` / fixture teardown `dispose`).
- UI signup only when the journey under test *is* signup.
- Never mutate shared AUT data beyond per-test users you create and delete.

## Page object method naming

Name methods as **user intents**: `searchProduct`, `addToCart`, `placeOrder`, `login` — agents compose journeys from intents, not CSS.
