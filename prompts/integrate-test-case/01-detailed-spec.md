# Prompt 1 — Detailed spec (locators optional)

1. Copy the **blank template** (first block below the line) into Agent, fill `{…}`, send.
2. Or copy the **filled example** further down if you want a ready-made sample request.

---

## Blank template (copy from here)

Integrate a new test into this Playwright framework repo. Follow `AGENTS.md`, use `@fixtures` only, and match existing patterns in `tests/` and `src/pages/`.

## Test classification

- **Type:** {API | UI | hybrid flow}
- **Target file (suggested):** `tests/{api|ui|flows}/{name}.spec.ts`
- **Describe block title:** {e.g. "UI cart — remove line item"}

## Journey (step by step)

1. {Arrange — e.g. create user with userFactory.create()}
2. {Act — page intents in order}
3. {Assert — concrete checks, e.g. visible text, counts, responseCode}

## Test data

- **User:** {factory.create | buildUser + UI signup | anonymous guest}
- **Products / search / brand / category:** {terms, ids, or "pick from ProductFactory"}
- **Cleanup:** {fixture dispose | explicit deleteAccount + untrack | none}

## Assertions (must pass)

- {e.g. expect cart row count 0 after remove}
- {e.g. body.responseCode 201 on create}
- {API only: list responseCode values per call}

## Locators (optional)

If I provide selectors, use them in POMs; if empty, you choose stable `#id` / role first and multi-strategy configs only for fragile controls.

| Step / element | Locator strategy (optional) |
|----------------|----------------------------|
| {e.g. Submit on contact} | {data-qa="submit-button" OR role button name Submit} |
| | |

## Page objects

- **Reuse:** {homePage, productsPage, …}
- **New page needed?** {yes/no — if yes, name and route}

## Constraints

- Chromium only; no shared login accounts.
- Prefer API create → UI journey → API delete for authenticated flows unless this test *is* signup.
- Run `npm run typecheck` and the new spec when done; report the exact run command.

Implement the test (and any POM/locator/fixture changes) now.

---

## Filled example (hybrid: search → quantity → cart)

Use this as a model of how detailed your prompt should be. You can paste it as-is to practice, or rewrite the journey for your case.

```text
Integrate a new test into this Playwright framework repo. Follow `AGENTS.md`, use `@fixtures` only, and match existing patterns in `tests/` and `src/pages/`.

## Test classification

- **Type:** hybrid flow
- **Target file (suggested):** `tests/flows/quantity-checkout.flow.spec.ts`
- **Describe block title:** Search checkout with quantity (hybrid)

## Journey (step by step)

1. Arrange: create a unique user with `userFactory.create()`.
2. Open home → Signup / Login → log in with that email/password → assert "Logged in as {name}".
3. Open Products → search with `productFactory.defaultSearchTerm()` (or `'top'`).
4. Assert search results heading and that at least one product card is visible; capture the first product name from the list.
5. Open first product detail → assert product name matches the list name.
6. Set quantity to `2` on the detail page → Add to cart → View Cart.
7. On cart: assert product name fragment is present and quantity shows `2`.
8. Proceed to checkout → assert delivery address contains the user's firstname, lastname, and city.
9. Place order → fill payment via `buildPayment({ nameOnCard: firstname + lastname })` → Pay and Confirm.
10. Assert Order Placed success (heading + congratulations text).
11. Cleanup: rely on fixture `userFactory.dispose()` (do not untrack unless we delete mid-test).

## Test data

- **User:** `userFactory.create()` (API seed)
- **Products / search / brand / category:** `productFactory.defaultSearchTerm()`; first result from search
- **Cleanup:** fixture dispose after the test

## Assertions (must pass)

- After login: `Logged in as` visible for `user.name`
- After search: searched-products heading visible; product cards count > 0; features area contains the search term
- Detail: product name equals list name
- Cart: product in cart; quantity `2` for that row
- Checkout: `#address_delivery` contains firstname, lastname, city
- Payment success: Order Placed heading + congratulations message visible

## Locators (optional)

| Step / element | Locator strategy (optional) |
|----------------|----------------------------|
| Search input | `#search_product` |
| Search submit | `#submit_search` |
| Quantity on detail | `#quantity` |
| Add to cart (detail) | role button / `button.cart` (existing ProductDetailLocators) |
| View cart modal link | `#cartModal` → link View Cart (existing CartModalLocators) |
| Cart quantity cell | `.cart_quantity` inside matching row |
| Proceed to checkout | `a.check_out` / role link Proceed To Checkout |
| Delivery address | `#address_delivery` |
| Pay button | `button[data-qa="pay-button"]` |

(If a locator already exists on a page object, reuse the intent — do not duplicate.)

## Page objects

- **Reuse:** `homePage`, `signupLoginPage`, `productsPage`, `productDetailPage`, `cartPage`, `checkoutPage`, `userFactory`, `productFactory`
- **New page needed?** No — extend existing intents only if quantity/cart assertions are missing (`setQuantity`, `expectQuantity`, etc.)

## Constraints

- Chromium only; no shared login accounts.
- Prefer API create → UI journey → API delete for authenticated flows unless this test *is* signup.
- Run `npm run typecheck` and the new spec when done; report the exact run command.
- If a similar test already exists under `tests/flows/search-checkout.flow.spec.ts`, either extend that file with a focused case or skip and tell me — do not duplicate the same journey.

Implement the test (and any POM/locator/fixture changes) now.
```

### Why this example works

| Section | What good looks like |
|---------|----------------------|
| Journey | Numbered user steps + who creates the account |
| Assertions | Concrete UI/API oracles, not “page loads” |
| Locators | Stable ids when known; points agent to reuse POM |
| Page objects | Explicit reuse vs extend |
| Constraints | Teardown, no duplicates, how to verify |

### Shorter variant (locators omitted)

If you do not care about selectors, delete the Locators table and say:

```text
## Locators (optional)

None provided — discover via existing POMs first; add multi-strategy configs only for fragile controls.
```
