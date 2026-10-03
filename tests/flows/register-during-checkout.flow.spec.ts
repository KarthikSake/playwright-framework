import { test } from '@fixtures';
import { buildUser } from '@factories/user.factory';
import { buildPayment } from '@factories/payment.factory';

test.describe('Register during checkout (hybrid)', () => {
  test('guest adds product, registers from checkout, and places order', async ({
    productFactory,
    productDetailPage,
    cartPage,
    signupLoginPage,
    signupPage,
    homePage,
    checkoutPage,
    userFactory,
  }) => {
    const user = buildUser();
    const product = await productFactory.pickFirst();
    const payment = buildPayment({
      nameOnCard: `${user.firstname} ${user.lastname}`,
    });

    await productDetailPage.open(product.id);
    const productName = await productDetailPage.getProductName();
    await productDetailPage.addToCartAndViewCart();

    await cartPage.expectHasItems();
    await cartPage.proceedToCheckout();
    await cartPage.goToRegisterLoginFromCheckoutModal();

    await signupLoginPage.startSignup(user.name, user.email);
    await signupPage.completeAccountDetails(user);
    await signupPage.expectAccountCreated();
    userFactory.track(user);
    await signupPage.clickContinue();
    await homePage.expectLoggedInAs(user.name);

    await cartPage.open();
    await cartPage.expectProductInCart(productName.split(' ')[0]);
    await cartPage.proceedToCheckout();

    await checkoutPage.expectDeliveryAddressFor(user);
    await checkoutPage.placeOrder();
    await checkoutPage.completePayment(payment);
  });
});
