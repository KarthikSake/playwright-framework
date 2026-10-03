import { expect } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { CheckoutLocators } from '@pages/locators/checkout.locators';
import type { PaymentDetails } from '@factories/payment.factory';
import type { TestUser } from '@factories/user.factory';

export type { PaymentDetails };

export class CheckoutPage extends BasePage {
  /** Fragile CTAs / headings keep strategy fallbacks. */
  addressDetails = () => this.loc(CheckoutLocators.addressDetails);
  reviewOrder = () => this.loc(CheckoutLocators.reviewOrder);
  placeOrderLink = () => this.loc(CheckoutLocators.placeOrder);
  payConfirm = () => this.loc(CheckoutLocators.payConfirm);
  orderPlaced = () => this.loc(CheckoutLocators.orderPlaced);
  orderCongrats = () => this.loc(CheckoutLocators.orderCongrats);

  /** Stable data-qa payment fields — direct locators. */
  nameOnCard = () => this.page.locator('[data-qa="name-on-card"]');
  cardNumber = () => this.page.locator('[data-qa="card-number"]');
  cvc = () => this.page.locator('[data-qa="cvc"]');
  expiryMonth = () => this.page.locator('[data-qa="expiry-month"]');
  expiryYear = () => this.page.locator('[data-qa="expiry-year"]');

  async expectAddressAndReviewVisible(): Promise<void> {
    await expect(this.addressDetails()).toBeVisible();
    await expect(this.reviewOrder()).toBeVisible();
  }

  async expectDeliveryAddressFor(user: TestUser): Promise<void> {
    await this.expectAddressAndReviewVisible();
    const delivery = this.page.locator('#address_delivery');
    await expect(delivery).toContainText(user.firstname);
    await expect(delivery).toContainText(user.lastname);
    await expect(delivery).toContainText(user.city);
  }

  async placeOrder(): Promise<void> {
    await this.dismissBlockingOverlays();
    const link = this.placeOrderLink();
    try {
      await expect(link).toBeVisible({ timeout: 10_000 });
      await Promise.all([
        this.page.waitForURL(/\/payment/, { timeout: 15_000 }),
        link.click({ force: true }),
      ]);
    } catch {
      // Public AUT ads often intercept the Place Order CTA after address review.
      await this.page.goto('/payment', { waitUntil: 'domcontentloaded' });
    }
    await this.dismissBlockingOverlays();
    await expect(this.nameOnCard()).toBeVisible({ timeout: 30_000 });
  }

  async fillPayment(details: PaymentDetails): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.nameOnCard().fill(details.nameOnCard);
    await this.cardNumber().fill(details.cardNumber);
    await this.cvc().fill(details.cvc);
    await this.expiryMonth().fill(details.expiryMonth);
    await this.expiryYear().fill(details.expiryYear);
  }

  async payAndConfirm(): Promise<void> {
    await this.payConfirm().click();
  }

  async expectOrderSuccess(): Promise<void> {
    await expect(this.orderPlaced()).toBeVisible();
    await expect(this.orderCongrats()).toBeVisible();
  }

  async completePayment(details: PaymentDetails): Promise<void> {
    await this.fillPayment(details);
    await this.payAndConfirm();
    await this.expectOrderSuccess();
  }
}
