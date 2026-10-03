# Add API test

Step-by-step skill for adding an API spec.

## Checklist

1. Copy `templates/api-test.spec.ts.template` to `tests/api/<name>.api.spec.ts`.
2. Import `test` / `expect` from `@fixtures`.
3. Use `api.auth` / `api.products` (or extend `src/api/` first if a new endpoint is needed).
4. Assert **`body.responseCode`** (and message when useful). Do not rely on HTTP status alone.
5. For mutating endpoints: unique data + delete in the same test or via `userFactory`.
6. Form bodies go through `ApiClient.postForm` / `deleteForm` (urlencoded).
7. Run: `npm run test:api`.
