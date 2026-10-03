import { test, expect } from '@fixtures';

test.describe('API product discovery', () => {
  test('productsList returns products with responseCode 200', async ({ api }) => {
    const { httpStatus, body } = await api.products.getProductsList();
    expect(httpStatus).toBe(200);
    expect(body.responseCode).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
    expect(body.products[0]).toHaveProperty('name');
    expect(body.products[0]).toHaveProperty('price');
  });

  test('searchProduct with known term returns matches', async ({ api, productFactory }) => {
    const term = productFactory.defaultSearchTerm();
    const { body } = await api.products.searchProduct(term);
    expect(body.responseCode).toBe(200);
    expect(body.products.length).toBeGreaterThan(0);
    const names = body.products.map((p) => p.name.toLowerCase()).join(' ');
    expect(names).toContain(term.toLowerCase());
  });

  test('searchProduct without parameter returns responseCode 400', async ({ api }) => {
    const { body } = await api.products.searchProductMissingParam();
    expect(body.responseCode).toBe(400);
    expect(body.message).toMatch(/search_product parameter is missing/i);
  });
});
