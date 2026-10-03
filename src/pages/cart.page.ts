import { expect } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { CartLocators } from '@pages/locators/cart.locators';
import { HomeLocators } from '@pages/locators/home.locators';

export class CartPage extends BasePage {
  cartRow = () => this.page.locator('#cart_info_table tbody tr');
  cartInfo = () => this.page.locator('#cart_info');
  proceedCheckout = () => this.loc(CartLocators.proceedToCheckout);
  checkoutModal = () => this.loc(CartLocators.checkoutModal);
  registerLoginFromCheckout = () => this.loc(CartLocators.registerLoginFromCheckout);
  emptyCart = () => this.loc(CartLocators.emptyCart);
  subscribeSuccess = () => this.loc(HomeLocators.subscribeSuccess);

  /** Stable footer subscription ids (shared with home). */
  subscribeEmail = () => this.page.locator('#susbscribe_email');
  subscribeButton = () => this.page.locator('#subscribe');

  async open(): Promise<void> {
    await this.goto('/view_cart');
    await this.dismissBlockingOverlays();
  }

  async expectHasItems(): Promise<void> {
    await expect(this.cartRow().first()).toBeVisible();
  }

  async expectItemCount(count: number): Promise<void> {
    await expect(this.cartRow()).toHaveCount(count);
  }

  async proceedToCheckout(): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.proceedCheckout().click();
  }

  /**
   * Guest checkout opens a modal requiring Register / Login.
   * Use after proceedToCheckout when the user is not authenticated.
   */
  async goToRegisterLoginFromCheckoutModal(): Promise<void> {
    await expect(this.checkoutModal()).toBeVisible();
    await this.registerLoginFromCheckout().click();
  }

  async expectProductInCart(nameFragment: string): Promise<void> {
    await expect(this.cartInfo()).toContainText(new RegExp(nameFragment, 'i'));
  }

  async expectQuantity(productNameFragment: string, quantity: number): Promise<void> {
    const row = this.cartRow().filter({ hasText: new RegExp(productNameFragment, 'i') });
    await expect(row.locator('.cart_quantity')).toContainText(String(quantity));
  }

  async expectLineTotal(productNameFragment: string, totalText: RegExp | string): Promise<void> {
    const row = this.cartRow().filter({ hasText: new RegExp(productNameFragment, 'i') });
    await expect(row.locator('.cart_total_price')).toContainText(totalText);
  }

  async removeProduct(nameFragment: string): Promise<void> {
    await this.dismissBlockingOverlays();
    const row = this.cartRow().filter({ hasText: new RegExp(nameFragment, 'i') });
    await row.locator('a.cart_quantity_delete').click();
    await expect(row).toHaveCount(0);
  }

  async expectEmpty(): Promise<void> {
    await expect(this.emptyCart()).toBeVisible();
  }

  async subscribe(email: string): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.subscribeEmail().scrollIntoViewIfNeeded();
    await this.subscribeEmail().fill(email);
    await this.subscribeButton().click();
  }

  async expectSubscribed(): Promise<void> {
    await expect(this.subscribeSuccess()).toBeVisible();
    await expect(this.subscribeSuccess()).toContainText(/successfully subscribed/i);
  }
}
