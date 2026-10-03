import { test, expect } from '@fixtures';

test.describe('UI product discovery', () => {
  test('search, open product detail, and assert name continuity', async ({
    productsPage,
    productDetailPage,
    productFactory,
  }) => {
    const term = productFactory.defaultSearchTerm();

    await productsPage.open();
    await productsPage.searchProduct(term);
    await productsPage.expectSearchResultsContain(term);
    const listName = await productsPage.firstProductName();
    await productsPage.openFirstProductDetail();

    await productDetailPage.expectProductDetailsVisible();
    await productDetailPage.expectName(listName);
    const price = await productDetailPage.getProductPrice();
    expect(price).toMatch(/Rs\.\s*\d+/i);
  });

  test('filter by brand shows matching products', async ({
    productsPage,
    productDetailPage,
  }) => {
    const brand = 'Polo';
    await productsPage.open();
    await productsPage.filterByBrand(brand);
    await productsPage.expectBrandResults(brand);
    await productsPage.openFirstProductDetail();
    await productDetailPage.expectBrand(brand);
  });
});
