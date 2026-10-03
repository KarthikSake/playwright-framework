import { test } from '@fixtures';

test.describe('UI signup negatives', () => {
  test('existing email shows signup error', async ({
    userFactory,
    homePage,
    signupLoginPage,
  }) => {
    const user = await userFactory.create();

    await homePage.open();
    await homePage.goToSignupLogin();
    await signupLoginPage.startSignup(user.name, user.email);
    await signupLoginPage.expectSignupEmailExistsError();
  });
});
