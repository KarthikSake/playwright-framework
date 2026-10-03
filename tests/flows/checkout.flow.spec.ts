import { test, expect } from '@fixtures';
import { buildPayment } from '@factories/payment.factory';

test.describe('Checkout flow (hybrid)', () => {
  test('API-seeded user logs in, adds product, and places order', async ({
    userFactory,
    productFactory,
    homePage,
    signupLoginPage,
    productsPage,
    cartPage,
    checkoutPage,
  }) => {
    const user = await userFactory.create();
    const searchTerm = productFactory.defaultSearchTerm();
    const payment = buildPayment({
      nameOnCard: `${user.firstname} ${user.lastname}`,
    });

    await homePage.open();
    await homePage.goToSignupLogin();
    await signupLoginPage.login(user.email, user.password);
    await homePage.expectLoggedInAs(user.name);

    await productsPage.open();
    await productsPage.searchProduct(searchTerm);
    await productsPage.expectSearchResultsContain(searchTerm);
    const productName = await productsPage.firstProductName();
    await productsPage.addFirstProductAndViewCart();

    await cartPage.expectHasItems();
    await cartPage.expectProductInCart(productName.split(' ')[0]);
    await cartPage.proceedToCheckout();

    await checkoutPage.expectDeliveryAddressFor(user);
    await checkoutPage.placeOrder();
    await checkoutPage.completePayment(payment);
  });
});
