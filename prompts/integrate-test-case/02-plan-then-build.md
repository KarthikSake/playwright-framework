# Prompt 2 — MCP explore → plan only → wait for approval

1. Fill `{…}` in the **blank template**, or copy the **filled example**.
2. Paste into Agent.
3. Agent explores the site and returns a plan only.
4. Reply `approved` (or edit the plan), then Agent implements.

**Requirement:** A browser MCP must be enabled in Cursor (Playwright MCP, or any tools that can navigate + snapshot a page). If none is available, Agent should say so and stop after proposing a plan from docs alone.

---

## Blank template (copy from here)

Integrate a new test into this Playwright framework. **Phase 1 is plan only — do not write spec or POM code until I reply "approved" or "go implement".**

Read `AGENTS.md` and `.cursor/skills/integrate-test-case/SKILL.md`.

## Goal (my summary)

{One paragraph: what user outcome we need to prove}

## Hints (optional)

- **Start URL:** {/ or /products or leave blank}
- **Logged in?** {yes — seed via API | no | either}
- **Type preference:** {API | UI | hybrid flow | you decide}
- **Known flaky areas:** {ads, checkout modal, etc.}

## Phase 1 — Explore with browser MCP

Against `https://automationexercise.com` (or `BASE_URL` from `.env.example`):

1. Navigate to the relevant entry point.
2. Snapshot before each major action; walk the journey from my Goal.
3. Note stable selectors: `#id`, `data-qa`, roles; note what needs multi-strategy fallbacks.
4. Call out overlay/ad behavior and where `dismissBlockingOverlays()` applies.
5. If browser MCP is unavailable, stop and tell me — do not invent selectors.

## Phase 1 deliverable — Test integration plan

Output a markdown plan with:

1. **Classification** — `tests/api` | `tests/ui` | `tests/flows`
2. **Spec file name** and **test title**
3. **Arrange / Act / Assert** table (concrete oracles)
4. **Data** — factory methods, unique email strategy, teardown
5. **POM changes** — reuse vs new page object; locator config files needed or not
6. **API calls** (if any) — endpoints and expected `responseCode` values
7. **Risks** — flakiness, AUT quirks, suggested retries or navigation fallback
8. **Run command** — `node node_modules/@playwright/test/cli.js test …`

**Stop after the plan.** Ask me to approve.

## Phase 2 — After I approve

Implement per plan: templates under `templates/`, skills `add-ui-test` / `add-api-test` / `add-page-object`, register new pages in `src/fixtures/index.ts`, run typecheck + the new spec.

---

## Filled example

```text
Integrate a new test into this Playwright framework. **Phase 1 is plan only — do not write spec or POM code until I reply "approved" or "go implement".**

Read `AGENTS.md` and `.cursor/skills/integrate-test-case/SKILL.md`.

## Goal (my summary)

Guest user opens Contact Us, fills name/email/subject/message, submits (accept the browser confirm), and sees a success message that details were submitted.

## Hints (optional)

- **Start URL:** /contact_us
- **Logged in?** no
- **Type preference:** UI
- **Known flaky areas:** ads intercepting Submit; jQuery confirm() on form submit

## Phase 1 — Explore with browser MCP

Against https://automationexercise.com:

1. Open /contact_us and snapshot the form.
2. Fill fields and submit; handle confirm dialog if it appears.
3. Record success selector/text and any overlay issues.
4. If browser MCP is unavailable, stop and tell me.

## Phase 1 deliverable — Test integration plan

Include classification, file name, AAA table, data/teardown, POM changes, risks, run command.

**Stop after the plan.** Ask me to approve.

## Phase 2 — After I approve

Implement per plan using templates and fixtures; run typecheck + the new spec.
```
