# Framework guide

Playwright + TypeScript framework for [automationexercise.com](https://automationexercise.com/) (API under `/api/*`). Chromium only.

> Fixtures as DI, API-first test data, simple Page Object Model, multi-strategy locators for fragile controls. Specs live under `tests/{api,ui,flows}`.

---

## 1. Stack

| Item | Choice |
|------|--------|
| Language | TypeScript (strict) |
| Runner | Playwright Test `@playwright/test` |
| Browser | Chromium (Desktop Chrome) |
| Node | ≥ 20 |
| Config | `dotenv` → `BASE_URL` / `API_BASE_URL` / optional `WORKERS` |
| Aliases | `@api`, `@pages`, `@factories`, `@fixtures`, `@config`, `@locators` |
| Data | `@faker-js/faker` + UUID tokens (`uniqueToken`) |

```bash
npm install
cp .env.example .env
npx playwright install chromium
npm test
WORKERS=4 npm test
npm run test:api | test:ui | test:flows
```

---

## 2. Folder structure

```text
├── AGENTS.md                 # Non-negotiable rules for contributors / agents
├── DECISIONS.md              # Chose / rejected / flip-if
├── README.md
├── FRAMEWORK_GUIDE.md        # This file
├── playwright.config.ts
├── templates/                # Skeletons for new API / UI / page work
├── prompts/                  # Copy-paste Agent prompts to integrate tests
├── .cursor/rules/ + skills/
├── .github/                  # Copilot instructions + CI workflow
├── src/
│   ├── api/                  # ApiClient, AuthApi, ProductsApi, types
│   ├── config/               # env
│   ├── factories/            # User, product, payment, unique helpers
│   ├── fixtures/             # Custom test + injected deps
│   ├── locators/             # locatorFrom / strategy builders
│   └── pages/                # POM + pages/locators/*.locators.ts
└── tests/
    ├── api/                  # Pure API
    ├── ui/                   # Pure UI
    └── flows/                # Hybrid: API seed → UI journey
```

```text
AGENTS / Cursor / Copilot / templates
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

---

## 3. Non-negotiable rules

1. Import `test` / `expect` from `@fixtures`, never from `@playwright/test` in specs.
2. Do not `new` page objects in specs — use fixtures.
3. Unique users per test (`userFactory.create()` or `buildUser()`).
4. Assert API `body.responseCode`, not only HTTP status.
5. Create / delete / login use form-urlencoded (`postForm` / `deleteForm`).
6. Multi-strategy locator configs only for fragile controls; stable `#id` / `data-qa` stay direct.
7. Chromium only unless explicitly asked.
8. Prefer **API create → UI journey → API delete**.

---

## 4. How the API layer works

### Pipeline

```text
tests/api/*.spec.ts  (or hybrid flows)
        │
        ▼
@fixtures → api: { client, auth, products }
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
   ApiClient    AuthApi    ProductsApi
        │
        ▼
Playwright APIRequestContext → https://automationexercise.com/api/...
```

Specs call fixture methods only (`api.auth.*`, `api.products.*`). They do not open raw Playwright request contexts.

### Files

| File | Role |
|------|------|
| `client.ts` | Shared HTTP: `get`, `postForm`, `deleteForm`, `putForm`, `postRaw`. Returns `{ httpStatus, body }`. |
| `auth.api.ts` | `createAccount`, `deleteAccount`, `verifyLogin`, `getUserDetailByEmail`, missing-email helper |
| `products.api.ts` | `getProductsList`, `searchProduct`, missing-param helper |
| `types.ts` | `ApiEnvelope`, payloads, `toForm()`, `assertResponseCode()`, `parseApiBody()` |

### AUT quirks (must follow)

1. **Business result is in the body.** HTTP is often `200` while `responseCode` is `201` / `400` / `404`. Always assert `body.responseCode`.
2. **Form-urlencoded for auth-style writes.** Use `postForm` / `deleteForm` + `toForm(payload)` — not JSON bodies.
3. **Relative API paths.** If `API_BASE_URL` ends with `/api` and the path starts with `/`, Playwright resolves from the origin and drops `/api`. The client keeps a trailing-slash base and strips a leading `/`.

### Config

```ts
// src/config/env.ts
baseUrl:    process.env.BASE_URL     ?? 'https://automationexercise.com'
apiBaseUrl: process.env.API_BASE_URL ?? 'https://automationexercise.com/api'
```

### Fixture lifecycle

```ts
api: async ({}, use) => {
  const client = await ApiClient.create();
  await use({ client, auth: new AuthApi(client), products: new ProductsApi(client) });
  await client.dispose();
};

userFactory: async ({ api }, use) => {
  const factory = new UserFactory(api.auth);
  await use(factory);
  await factory.dispose(); // deletes tracked users (200 / 404 OK)
};
```

### Example pure API test

```ts
import { test, expect } from '@fixtures';

test('verifyLogin without email returns responseCode 400', async ({ api }) => {
  const result = await api.auth.verifyLoginMissingEmail('any-password');
  expect(result.body.responseCode).toBe(400);
});
```

### Example seeded user (API create)

```ts
const user = await userFactory.create(); // responseCode 201 + track
// … use user.email / user.password …
// fixture dispose() deletes unless you delete + untrack mid-test
```

### Hybrid pattern

Same API stack seeds UI journeys:

```text
userFactory.create()  →  UI login / cart / checkout  →  factory.dispose()
```

---

## 5. Factories

### UserFactory

| Method | Behavior |
|--------|----------|
| `buildUser()` / `build()` | Unique `TestUser` only (no API) |
| `create()` | API register (`responseCode` 201) + `track()` |
| `track()` / `untrack()` | UI-created users / explicit mid-test delete |
| `dispose()` | Delete tracked users; fails if delete ≠ 200/404 |

Emails: `qa.user.${uniqueToken}@example.com` — parallel-safe.

### ProductFactory

- Caches `productsList`
- `defaultSearchTerm()` / `randomSearchTerm()` from known-good terms
- `pickFirst()` / `pickRandom()` / `pickByNameContains()`

### Payment

`buildPayment()` in `payment.factory.ts` — pass explicitly from checkout specs.

---

## 6. UI layer

### Fixtures inject pages

`homePage`, `signupLoginPage`, `signupPage`, `productsPage`, `productDetailPage`, `cartPage`, `checkoutPage`, `contactPage`

### Page pattern

Extend `BasePage` → locator getters → intent methods (`searchProduct`, `placeOrder`, `login`).

`BasePage` provides `goto()` and `dismissBlockingOverlays()` (ads/consent, including ad iframes — best-effort).

### Locators

- Fragile controls → `src/pages/locators/*.locators.ts` strategy arrays → `this.loc(config)` → Playwright `.or().first()`
- Stable `#id` / `data-qa` → `this.page.locator(...)`
- Prefer role → placeholder/label → css → text

---

## 7. Playwright config

```ts
fullyParallel: true
retries: CI ? 2 : 1
workers: WORKERS env ?? (CI ? 2 : max(2, cpus/2))
timeout: 60s
expect.timeout: 15s
trace: on-first-retry
screenshot: only-on-failure
video: retain-on-failure
projects: [ chromium ]
```

---

## 8. Test inventory

### API (`tests/api/`)

| File | Coverage |
|------|----------|
| `auth.api.spec.ts` | Create → login → detail → delete; login missing email → 400 |
| `products.api.spec.ts` | Product list; search hit; search missing param → 400 |

### UI (`tests/ui/`)

| File | Coverage |
|------|----------|
| `signup.ui.spec.ts` | Multi-step UI registration + API cleanup |
| `signup-negatives.ui.spec.ts` | Duplicate email error |
| `login.ui.spec.ts` | Bad credentials error |
| `auth-session.ui.spec.ts` | Login/logout; UI delete account |
| `product-discovery.ui.spec.ts` | Search → detail; brand filter |
| `category.ui.spec.ts` | Category accordion filters |
| `cart.ui.spec.ts` | Quantity/line total; remove; multi-product |
| `review.ui.spec.ts` | Product review submit |
| `contact.ui.spec.ts` | Contact Us success |
| `subscription.ui.spec.ts` | Footer subscribe (home + cart) |

### Flows (`tests/flows/`)

| File | Coverage |
|------|----------|
| `checkout.flow.spec.ts` | API user → login → search → cart → pay |
| `guest-checkout-login.flow.spec.ts` | Guest cart → checkout modal → login → pay |
| `register-during-checkout.flow.spec.ts` | Guest cart → register → pay |
| `search-checkout.flow.spec.ts` | Search → quantity → checkout |
| `brand-checkout.flow.spec.ts` | Brand filter → checkout |

---

## 9. Adding work

| Goal | Follow |
|------|--------|
| New UI / flow test | `.cursor/skills/add-ui-test/SKILL.md` + `templates/ui-test.spec.ts.template` |
| New API test | `.cursor/skills/add-api-test/SKILL.md` + `templates/api-test.spec.ts.template` |
| New page object | `.cursor/skills/add-page-object/SKILL.md` + templates; register in `src/fixtures/index.ts` |

Also see `AGENTS.md` and `DECISIONS.md`.
