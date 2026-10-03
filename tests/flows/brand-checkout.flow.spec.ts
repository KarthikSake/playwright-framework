import { test } from '@fixtures';
import { buildPayment } from '@factories/payment.factory';

test.describe('Brand filter checkout (hybrid)', () => {
  test('logged-in user filters by brand and places order', async ({
    userFactory,
    homePage,
    signupLoginPage,
    productsPage,
    productDetailPage,
    cartPage,
    checkoutPage,
  }) => {
    const user = await userFactory.create();
    const brand = 'H&M';
    const payment = buildPayment({
      nameOnCard: `${user.firstname} ${user.lastname}`,
    });

    await homePage.open();
    await homePage.goToSignupLogin();
    await signupLoginPage.login(user.email, user.password);
    await homePage.expectLoggedInAs(user.name);

    await productsPage.open();
    await productsPage.filterByBrand(brand);
    await productsPage.expectBrandResults(brand);
    await productsPage.openFirstProductDetail();
    await productDetailPage.expectBrand(brand);
    await productDetailPage.addToCartAndViewCart();

    await cartPage.expectHasItems();
    await cartPage.proceedToCheckout();
    await checkoutPage.expectDeliveryAddressFor(user);
    await checkoutPage.placeOrder();
    await checkoutPage.completePayment(payment);
  });
});
