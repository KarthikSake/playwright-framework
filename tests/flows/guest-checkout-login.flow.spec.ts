import { test } from '@fixtures';
import { buildPayment } from '@factories/payment.factory';

test.describe('Guest checkout then login (hybrid)', () => {
  test('guest adds product, logs in from checkout modal, and places order', async ({
    userFactory,
    productFactory,
    productDetailPage,
    cartPage,
    homePage,
    signupLoginPage,
    checkoutPage,
  }) => {
    const user = await userFactory.create();
    const product = await productFactory.pickFirst();
    const payment = buildPayment({
      nameOnCard: `${user.firstname} ${user.lastname}`,
    });

    await productDetailPage.open(product.id);
    const productName = await productDetailPage.getProductName();
    await productDetailPage.addToCartAndViewCart();

    await cartPage.expectHasItems();
    await cartPage.expectProductInCart(productName.split(' ')[0]);
    await cartPage.proceedToCheckout();
    await cartPage.goToRegisterLoginFromCheckoutModal();

    await signupLoginPage.login(user.email, user.password);
    await homePage.expectLoggedInAs(user.name);

    await cartPage.open();
    await cartPage.expectProductInCart(productName.split(' ')[0]);
    await cartPage.proceedToCheckout();

    await checkoutPage.expectDeliveryAddressFor(user);
    await checkoutPage.placeOrder();
    await checkoutPage.completePayment(payment);
  });
});
