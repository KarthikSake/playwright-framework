# Add UI test

Step-by-step skill for adding a UI or hybrid UI flow to this framework.

## Checklist

1. Decide folder: `tests/ui/` (pure UI) or `tests/flows/` (API seed → UI).
2. Copy `templates/ui-test.spec.ts.template` to the target path; rename the file `*.spec.ts`.
3. Import only from `@fixtures` (and factories if building data without create).
4. Use fixture page objects — do not instantiate pages manually.
5. For authenticated journeys: `const user = await userFactory.create()` then UI login.
6. Prefer intent methods on POMs (`searchProduct`, `addToCart`, …).
7. Clean up: factory `dispose()` via fixture, or explicit `api.auth.deleteAccount` for UI-created users.
8. Run: `npm run test:ui` or the specific file path.

## Locator reminder

`getByRole` → `getByPlaceholder` → CSS last. Dismiss overlays via `BasePage.dismissBlockingOverlays` if clicks flake.
