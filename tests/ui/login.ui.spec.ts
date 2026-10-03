import { test } from '@fixtures';

test.describe('UI login negatives', () => {
  test('shows error for incorrect email or password', async ({ signupLoginPage }) => {
    await signupLoginPage.open();
    await signupLoginPage.login('nope.user@example.com', 'WrongPass1!');
    await signupLoginPage.expectLoginError();
  });
});
