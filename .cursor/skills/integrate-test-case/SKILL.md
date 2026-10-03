# Integrate a test case into this framework

Use when the user asks to add, integrate, or port a test into this Playwright repo — with a written spec, with locators provided, or by exploring the AUT first.

## Before coding

1. Read `AGENTS.md` and this repo’s rules (fixtures, no `new` page objects, `responseCode`, Chromium only).
2. Pick the user’s prompt style:
   - **Detailed spec** → `prompts/integrate-test-case/01-detailed-spec.md`
   - **Plan first (MCP)** → `prompts/integrate-test-case/02-plan-then-build.md`
   - **Explore + plan + build (MCP)** → `prompts/integrate-test-case/03-mcp-explore-and-integrate.md`
3. Classify the test:
   - Pure API → `tests/api/` + `.cursor/skills/add-api-test/SKILL.md`
   - Pure UI → `tests/ui/` + `add-ui-test`
   - API seed → UI → API delete → `tests/flows/` + `add-ui-test`

## Locators: with vs without user-provided selectors

| User provides locators? | Action |
|-------------------------|--------|
| **Yes** | Prefer their selectors if stable on AUT; still map to POM getters. Use multi-strategy configs in `src/pages/locators/` only when fragile or they gave fallbacks. |
| **No** | Use browser MCP (navigate + snapshot) or a local headed run to discover role → placeholder → CSS. Stable `#id` / `data-qa` on the page class; fragile only in locators files. |

Always call `dismissBlockingOverlays()` before fragile clicks on automationexercise.com.

## Browser MCP (prompts 2 & 3)

Use whatever browser MCP is configured in Cursor. Prefer role / `data-qa` / `#id` from snapshots. If MCP tools are missing: for plan-only prompts, stop and say so; otherwise fall back to existing POMs/docs and state that MCP was unavailable.

## Implementation checklist

1. Reuse existing page objects and intents before adding new ones.
2. New page object → `add-page-object` skill + register in `src/fixtures/index.ts`.
3. Spec imports `test` / `expect` from `@fixtures` only.
4. Users: `userFactory.create()` or `buildUser()` + `track()`; never shared accounts.
5. API: assert `body.responseCode`; form endpoints via `postForm` / `deleteForm`.
6. Run: `npm run typecheck` and the new spec path with `node node_modules/@playwright/test/cli.js test <file>`.

## MCP exploration notes

- Base URL from `BASE_URL` / default `https://automationexercise.com`.
- Record URL path, user steps, concrete assertions, and selector notes from snapshots.
- Do not commit MCP scratch logs or screenshots unless the user asks.

## Deliverables

- New or updated `tests/**/*.spec.ts`
- Any new `src/pages/**` + locators + fixture registration
- One-line note: how to run the new test
