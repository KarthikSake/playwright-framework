import { test, expect } from '@fixtures';

test.describe('UI cart', () => {
  test('quantity on detail carries into cart line total', async ({
    productDetailPage,
    cartPage,
  }) => {
    const quantity = 3;
    await productDetailPage.open(1);
    const name = await productDetailPage.getProductName();
    const unitPriceText = await productDetailPage.getProductPrice();
    const unit = Number(unitPriceText.replace(/[^\d]/g, ''));
    expect(unit).toBeGreaterThan(0);

    await productDetailPage.setQuantity(quantity);
    await productDetailPage.addToCartAndViewCart();

    await cartPage.expectHasItems();
    await cartPage.expectProductInCart(name);
    await cartPage.expectQuantity(name, quantity);
    await cartPage.expectLineTotal(name, new RegExp(`Rs\\.\\s*${unit * quantity}`));
  });

  test('remove product leaves cart empty', async ({ productDetailPage, cartPage }) => {
    await productDetailPage.open(1);
    const name = await productDetailPage.getProductName();
    await productDetailPage.addToCartAndViewCart();

    await cartPage.expectHasItems();
    await cartPage.removeProduct(name);
    await cartPage.expectEmpty();
  });

  test('adding two products shows both rows in cart', async ({ productsPage, cartPage }) => {
    await productsPage.open();
    const firstName = await productsPage.firstProductName();
    await productsPage.addProductAtIndexToCart(0, 'continue');
    const secondName = (
      await productsPage.productCards().nth(1).locator('.productinfo p').innerText()
    ).trim();
    await productsPage.addProductAtIndexToCart(1, 'viewCart');

    await cartPage.expectHasItems();
    await cartPage.expectItemCount(2);
    await cartPage.expectProductInCart(firstName.split(' ')[0]);
    await cartPage.expectProductInCart(secondName.split(' ')[0]);
  });
});
