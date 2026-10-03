import { test } from '@fixtures';
import { buildPayment } from '@factories/payment.factory';

test.describe('Search and checkout (hybrid)', () => {
  test('logged-in user searches, opens detail with quantity, and checks out', async ({
    userFactory,
    productFactory,
    homePage,
    signupLoginPage,
    productsPage,
    productDetailPage,
    cartPage,
    checkoutPage,
  }) => {
    const user = await userFactory.create();
    const term = productFactory.randomSearchTerm();
    const payment = buildPayment({
      nameOnCard: `${user.firstname} ${user.lastname}`,
    });

    await homePage.open();
    await homePage.goToSignupLogin();
    await signupLoginPage.login(user.email, user.password);
    await homePage.expectLoggedInAs(user.name);

    await productsPage.open();
    await productsPage.searchProduct(term);
    await productsPage.expectSearchResultsContain(term);
    const listName = await productsPage.firstProductName();
    await productsPage.openFirstProductDetail();

    await productDetailPage.expectName(listName);
    await productDetailPage.setQuantity(2);
    await productDetailPage.addToCartAndViewCart();

    await cartPage.expectProductInCart(listName.split(' ')[0]);
    await cartPage.expectQuantity(listName, 2);
    await cartPage.proceedToCheckout();

    await checkoutPage.expectDeliveryAddressFor(user);
    await checkoutPage.placeOrder();
    await checkoutPage.completePayment(payment);
  });
});
