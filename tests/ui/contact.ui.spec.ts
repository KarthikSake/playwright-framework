import { test } from '@fixtures';
import { buildUser } from '@factories/user.factory';

test.describe('UI contact us', () => {
  test('submits contact form and shows success', async ({ contactPage }) => {
    const user = buildUser();

    await contactPage.open();
    await contactPage.submitContact({
      name: user.name,
      email: user.email,
      subject: 'Automation contact inquiry',
      message: 'Please ignore — Playwright UI coverage for Contact Us.',
    });
    await contactPage.expectSubmitted();
  });
});
