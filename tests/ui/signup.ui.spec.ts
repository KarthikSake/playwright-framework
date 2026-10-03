import { test, expect } from '@fixtures';
import { buildUser } from '@factories/user.factory';

test.describe('UI signup', () => {
  test('registers a unique user via multi-step UI form and lands logged in', async ({
    homePage,
    signupLoginPage,
    signupPage,
    api,
    userFactory,
  }) => {
    const user = buildUser();

    await homePage.open();
    await homePage.goToSignupLogin();
    await signupLoginPage.startSignup(user.name, user.email);
    await signupPage.completeAccountDetails(user);
    await signupPage.expectAccountCreated();
    userFactory.track(user);

    await signupPage.clickContinue();
    await homePage.expectLoggedInAs(user.name);

    const deleted = await api.auth.deleteAccount({
      email: user.email,
      password: user.password,
    });
    expect(deleted.body.responseCode).toBe(200);
    userFactory.untrack(user.email);
  });
});
