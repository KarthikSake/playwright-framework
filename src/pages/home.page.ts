import { expect } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { HomeLocators } from '@pages/locators/home.locators';

/** Nav links use stable roles/hrefs — fragile delete/subscribe keep strategy fallbacks. */
export class HomePage extends BasePage {
  signupLogin = () => this.page.getByRole('link', { name: /Signup \/ Login/i });
  products = () => this.page.getByRole('link', { name: 'Products' });
  cart = () => this.page.getByRole('link', { name: 'Cart' });
  contactUs = () => this.page.getByRole('link', { name: /Contact us/i });
  logoutLink = () => this.page.getByRole('link', { name: 'Logout' });
  loggedInAs = (name: string) =>
    this.page.getByText(new RegExp(`Logged in as\\s+${name}`, 'i'));
  deleteAccountLink = () => this.loc(HomeLocators.deleteAccount);
  accountDeleted = () => this.loc(HomeLocators.accountDeleted);
  continueAfterDelete = () => this.loc(HomeLocators.continueAfterDelete);
  subscribeSuccess = () => this.loc(HomeLocators.subscribeSuccess);

  /** Stable footer subscription ids (site typo: susbscribe_email). */
  subscribeEmail = () => this.page.locator('#susbscribe_email');
  subscribeButton = () => this.page.locator('#subscribe');

  async open(): Promise<void> {
    await this.goto('/');
    await expect(this.page).toHaveTitle(/Automation Exercise/i);
  }

  async goToSignupLogin(): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.signupLogin().click();
  }

  async goToProducts(): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.products().click();
  }

  async goToCart(): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.cart().click();
  }

  async goToContactUs(): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.contactUs().click();
  }

  async expectLoggedInAs(name: string): Promise<void> {
    await expect(this.loggedInAs(name)).toBeVisible();
  }

  async expectLoggedOut(): Promise<void> {
    await expect(this.signupLogin()).toBeVisible();
    await expect(this.logoutLink()).toHaveCount(0);
  }

  async logout(): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.logoutLink().click();
    await this.expectLoggedOut();
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

  async deleteAccount(): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.deleteAccountLink().click();
    await expect(this.accountDeleted()).toBeVisible();
  }

  async continueAfterAccountDeleted(): Promise<void> {
    await this.continueAfterDelete().click();
  }
}
