# Copilot instructions — Playwright framework

Follow `AGENTS.md` as the source of truth.

## Always

- Import `test` / `expect` from `@fixtures`, not `@playwright/test`.
- Use fixtures for pages, `api`, `userFactory`, `productFactory`.
- Assert API `responseCode` in the JSON body (HTTP status is often always 200).
- Unique users; factory create/dispose; no shared accounts.
- Locators: config strategy arrays in `src/pages/locators/` + page getters via `this.loc()`; multi-strategy only when fragile.
- Chromium only; path aliases `@api` `@pages` `@factories` `@fixtures` `@config` `@locators`.

## Adding code

- Prefer copying `templates/*.template`.
- Register new page objects in `src/fixtures/index.ts`.
- API form endpoints use urlencoded helpers on `ApiClient`.
- Name POM methods as user intents for journey composition.
