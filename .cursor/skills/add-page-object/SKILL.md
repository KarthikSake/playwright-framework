# Add page object

Step-by-step skill for adding a Playwright page object.

## Checklist

1. Copy `templates/page-object.ts.template` → `src/pages/<name>.page.ts`.
2. Copy `templates/name.locators.ts.template` → `src/pages/locators/<name>.locators.ts` (fragile controls only).
3. Extend `BasePage`; name the class `<Name>Page`.
4. Intent-named methods; locator getters on the class.
5. Multi-strategy via `this.loc(config)` only when fragile (≥2 alternatives). Stable `#id` / `data-qa` → `this.page.locator(...)`.
6. Register in `src/fixtures/index.ts`:
   - Import the class
   - Add to `Fixtures` type
   - Add `pageFixture(XPage)` entry
7. Consume via fixture in specs — never `new` in tests.
8. Optional: thin UI smoke that exercises the new intents.
