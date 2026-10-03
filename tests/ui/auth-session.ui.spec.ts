import { test } from '@fixtures';

test.describe('UI auth session', () => {
  test('API-seeded user can log in and log out', async ({
    userFactory,
    homePage,
    signupLoginPage,
  }) => {
    const user = await userFactory.create();

    await homePage.open();
    await homePage.goToSignupLogin();
    await signupLoginPage.login(user.email, user.password);
    await homePage.expectLoggedInAs(user.name);

    await homePage.logout();
  });

  test('logged-in user can delete account from nav', async ({
    userFactory,
    homePage,
    signupLoginPage,
  }) => {
    const user = await userFactory.create();

    await homePage.open();
    await homePage.goToSignupLogin();
    await signupLoginPage.login(user.email, user.password);
    await homePage.expectLoggedInAs(user.name);

    await homePage.deleteAccount();
    userFactory.untrack(user.email);
    await homePage.continueAfterAccountDeleted();
    await homePage.expectLoggedOut();
  });
});
