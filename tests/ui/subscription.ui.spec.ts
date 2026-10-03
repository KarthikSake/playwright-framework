import { test } from '@fixtures';
import { buildUser } from '@factories/user.factory';

test.describe('UI subscription', () => {
  test('subscribes from home footer', async ({ homePage }) => {
    const user = buildUser();

    await homePage.open();
    await homePage.subscribe(user.email);
    await homePage.expectSubscribed();
  });

  test('subscribes from cart page footer', async ({ cartPage }) => {
    const user = buildUser();

    await cartPage.open();
    await cartPage.subscribe(user.email);
    await cartPage.expectSubscribed();
  });
});
