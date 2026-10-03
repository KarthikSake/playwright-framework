import { test } from '@fixtures';
import { buildUser } from '@factories/user.factory';

test.describe('UI product review', () => {
  test('submits a review on product detail', async ({ productDetailPage }) => {
    const user = buildUser();

    await productDetailPage.open(1);
    await productDetailPage.submitReview(
      user.name,
      user.email,
      'Solid quality — automated review from Playwright.',
    );
    await productDetailPage.expectReviewThanks();
  });
});
