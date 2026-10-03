import { test } from '@fixtures';

test.describe('UI category discovery', () => {
  test('filter Women > Dress shows matching category products', async ({
    productsPage,
    productDetailPage,
  }) => {
    await productsPage.open();
    await productsPage.filterByCategory('Women', 'Dress');
    await productsPage.expectCategoryResults('Women', 'Dress');

    const listName = await productsPage.firstProductName();
    await productsPage.openFirstProductDetail();
    await productDetailPage.expectProductDetailsVisible();
    await productDetailPage.expectName(listName);
  });

  test('filter Men > Tshirts shows matching category products', async ({ productsPage }) => {
    await productsPage.open();
    await productsPage.filterByCategory('Men', 'Tshirts');
    await productsPage.expectCategoryResults('Men', 'Tshirts');
  });
});
