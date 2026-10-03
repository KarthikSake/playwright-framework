import { expect } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { ProductDetailLocators } from '@pages/locators/product-detail.locators';
import { CartModalLocators } from '@pages/locators/cart-modal.locators';

export class ProductDetailPage extends BasePage {
  productInfo = () => this.page.locator('.product-information');
  productName = () => this.page.locator('.product-information h2');
  productPrice = () => this.loc(ProductDetailLocators.price);
  addToCartButton = () => this.loc(ProductDetailLocators.addToCart);
  cartModal = () => this.loc(CartModalLocators.modal);
  modalContinue = () => this.loc(CartModalLocators.continueShopping);
  modalViewCart = () => this.loc(CartModalLocators.viewCart);

  /** Stable detail fields. */
  quantityInput = () => this.page.locator('#quantity');
  reviewName = () => this.page.locator('#review-form #name');
  reviewEmail = () => this.page.locator('#review-form #email');
  reviewBody = () => this.page.locator('#review');
  reviewSubmit = () => this.page.locator('#button-review');
  reviewThanks = () => this.page.locator('#review-section');

  async open(productId: number | string): Promise<void> {
    await this.goto(`/product_details/${productId}`);
    await this.dismissBlockingOverlays();
    await this.expectProductDetailsVisible();
  }

  async expectProductDetailsVisible(): Promise<void> {
    await expect(this.productInfo()).toBeVisible();
    await expect(this.productName()).toBeVisible();
    await expect(this.productPrice()).toBeVisible();
  }

  async getProductName(): Promise<string> {
    return (await this.productName().innerText()).trim();
  }

  async getProductPrice(): Promise<string> {
    return (await this.productPrice().innerText()).trim();
  }

  async expectName(name: string): Promise<void> {
    await expect(this.productName()).toHaveText(name);
  }

  async expectBrand(brandName: string): Promise<void> {
    await expect(this.productInfo()).toContainText(new RegExp(`Brand\\s*:\\s*${brandName}`, 'i'));
  }

  async setQuantity(quantity: number): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.quantityInput().fill(String(quantity));
  }

  async addToCart(): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.addToCartButton().click();
    await expect(this.cartModal()).toBeVisible();
    await this.modalContinue().click();
  }

  async addToCartAndViewCart(): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.addToCartButton().click();
    await expect(this.cartModal()).toBeVisible();
    await this.modalViewCart().click();
  }

  async submitReview(name: string, email: string, review: string): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.reviewName().scrollIntoViewIfNeeded();
    await this.reviewName().fill(name);
    await this.reviewEmail().fill(email);
    await this.reviewBody().fill(review);
    await this.reviewSubmit().click();
  }

  async expectReviewThanks(): Promise<void> {
    await expect(this.reviewThanks()).toContainText(/Thank you for your review/i);
  }
}
