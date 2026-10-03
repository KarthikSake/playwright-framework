import { test, expect } from '@fixtures';

test.describe('API auth lifecycle', () => {
  test('createAccount → verifyLogin → getUserDetailByEmail → deleteAccount', async ({
    api,
    userFactory,
  }) => {
    const user = await userFactory.create();

    const login = await api.auth.verifyLogin({
      email: user.email,
      password: user.password,
    });
    expect(login.body.responseCode).toBe(200);
    expect(login.body.message).toMatch(/User exists/i);

    const detail = await api.auth.getUserDetailByEmail(user.email);
    expect(detail.body.responseCode).toBe(200);
    expect(detail.body.user.email).toBe(user.email);
    expect(detail.body.user.name).toBe(user.name);

    const deleted = await api.auth.deleteAccount({
      email: user.email,
      password: user.password,
    });
    expect(deleted.body.responseCode).toBe(200);
    expect(deleted.body.message).toMatch(/Account deleted/i);
    userFactory.untrack(user.email);

    const afterDelete = await api.auth.verifyLogin({
      email: user.email,
      password: user.password,
    });
    expect(afterDelete.body.responseCode).toBe(404);
  });

  test('verifyLogin without email returns responseCode 400', async ({ api }) => {
    const result = await api.auth.verifyLoginMissingEmail('any-password');
    expect(result.body.responseCode).toBe(400);
    expect(result.body.message).toMatch(/email or password parameter is missing/i);
  });
});
