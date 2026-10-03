import { test as base, expect, type Page } from '@playwright/test';
import { ApiClient } from '@api/client';
import { AuthApi } from '@api/auth.api';
import { ProductsApi } from '@api/products.api';
import { UserFactory } from '@factories/user.factory';
import { ProductFactory } from '@factories/product.factory';
import { HomePage } from '@pages/home.page';
import { SignupLoginPage } from '@pages/signup-login.page';
import { SignupPage } from '@pages/signup.page';
import { ProductsPage } from '@pages/products.page';
import { ProductDetailPage } from '@pages/product-detail.page';
import { CartPage } from '@pages/cart.page';
import { CheckoutPage } from '@pages/checkout.page';
import { ContactPage } from '@pages/contact.page';

export type ApiBundle = {
  client: ApiClient;
  auth: AuthApi;
  products: ProductsApi;
};

type Fixtures = {
  api: ApiBundle;
  userFactory: UserFactory;
  productFactory: ProductFactory;
  homePage: HomePage;
  signupLoginPage: SignupLoginPage;
  signupPage: SignupPage;
  productsPage: ProductsPage;
  productDetailPage: ProductDetailPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  contactPage: ContactPage;
};

function pageFixture<T>(PageClass: new (page: Page) => T) {
  return async (
    { page }: { page: Page },
    use: (instance: T) => Promise<void>,
  ): Promise<void> => {
    await use(new PageClass(page));
  };
}

export const test = base.extend<Fixtures>({
  api: async ({}, use) => {
    const client = await ApiClient.create();
    const bundle: ApiBundle = {
      client,
      auth: new AuthApi(client),
      products: new ProductsApi(client),
    };
    await use(bundle);
    await client.dispose();
  },

  userFactory: async ({ api }, use) => {
    const factory = new UserFactory(api.auth);
    await use(factory);
    await factory.dispose();
  },

  productFactory: async ({ api }, use) => {
    await use(new ProductFactory(api.products));
  },

  homePage: pageFixture(HomePage),
  signupLoginPage: pageFixture(SignupLoginPage),
  signupPage: pageFixture(SignupPage),
  productsPage: pageFixture(ProductsPage),
  productDetailPage: pageFixture(ProductDetailPage),
  cartPage: pageFixture(CartPage),
  checkoutPage: pageFixture(CheckoutPage),
  contactPage: pageFixture(ContactPage),
});

export { expect };
