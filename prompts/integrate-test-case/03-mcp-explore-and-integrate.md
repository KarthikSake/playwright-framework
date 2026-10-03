# Prompt 3 — MCP explore → short plan → implement

1. Fill `{…}` or copy the **filled example**.
2. Paste into Agent.
3. Agent explores the AUT, prints a short plan (≤15 lines), then implements in the same session (no wait for approval).

**Requirement:** Browser MCP enabled in Cursor. If missing, Agent should explore via existing page objects/docs only and say that MCP was unavailable.

---

## Blank template (copy from here)

Integrate a new test into this Playwright framework in **one session**: explore the AUT with browser MCP, write a short plan, then implement.

Follow `AGENTS.md`, `.cursor/skills/integrate-test-case/SKILL.md`, and the matching add-* skill (`add-ui-test`, `add-api-test`, or `add-page-object`).

## Goal

{What to verify — one clear user outcome or API contract. If vague, pick a single high-value path and state it.}

## Optional inputs

- **Entry URL:** {default: home `/`}
- **Auth:** {API-seeded user | guest | UI signup is the test}
- **Locators from me:** {paste table or "discover via MCP"}
- **Must not touch:** {e.g. do not add new API endpoints}

## Step A — Explore (browser MCP)

On `https://automationexercise.com` (or `BASE_URL`):

- Navigate → snapshot before each major action
- Prefer role / accessible names; record `#id` and `data-qa` when present
- If clicks fail, note ads/overlays — use `BasePage.dismissBlockingOverlays()` in the implementation
- If MCP is unavailable, say so and continue from existing POMs + docs

## Step B — Short plan (≤15 lines)

Before coding, print:

- Spec path + test name + api | ui | flow
- Reused fixtures vs new POM
- Key assertions

Then implement immediately (do not wait for approval unless blocked).

## Step C — Implement

- Import `test` / `expect` from `@fixtures` only
- Intent methods on POMs; never `new` page objects in specs
- API: assert `body.responseCode`; unique users via factory
- Hybrid: `userFactory.create()` → UI → dispose unless deleted in-test

## Step D — Verify

Run `npm run typecheck` and:

```bash
node node_modules/@playwright/test/cli.js test {path/to/new.spec.ts}
```

Report pass/fail and how to rerun one test (`-g "title fragment"`).

---

## Filled example

```text
Integrate a new test into this Playwright framework in **one session**: explore with browser MCP, short plan, then implement.

Follow `AGENTS.md`, `.cursor/skills/integrate-test-case/SKILL.md`, and `add-ui-test` / `add-page-object` as needed.

## Goal

From the Products page, open the Women category accordion, click Dress, assert the category heading shows Women - Dress Products and at least one product card is visible, then open the first product and assert the detail name is non-empty.

## Optional inputs

- **Entry URL:** /products
- **Auth:** guest
- **Locators from me:** discover via MCP
- **Must not touch:** checkout, auth APIs

## Step A — Explore (browser MCP)

Navigate /products → expand Women → Dress → snapshot results → open first View Product → snapshot detail. Note accordion flakiness / ads.

## Step B — Short plan (≤15 lines)

Then implement immediately.

## Step C — Implement

Reuse `productsPage` / `productDetailPage` if possible. Spec under `tests/ui/`. Fixtures only.

## Step D — Verify

npm run typecheck and run the new spec file; report the command.
```
