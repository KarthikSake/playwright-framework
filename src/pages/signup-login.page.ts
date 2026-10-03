import { expect } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { SignupLoginLocators } from '@pages/locators/signup-login.locators';

/**
 * Combined Signup / Login page at /login.
 * Form fields use scoped CSS (duplicate placeholders on the page); errors keep text strategies.
 */
export class SignupLoginPage extends BasePage {
  signupName = () => this.page.locator('.signup-form input[name="name"]');
  signupEmail = () => this.page.locator('.signup-form input[name="email"]');
  signupButton = () => this.page.locator('.signup-form button[type="submit"]');
  loginEmail = () => this.page.locator('.login-form input[name="email"]');
  loginPassword = () => this.page.locator('.login-form input[name="password"]');
  loginButton = () => this.page.locator('.login-form button[type="submit"]');
  loginError = () => this.loc(SignupLoginLocators.loginError);
  signupEmailExists = () => this.loc(SignupLoginLocators.signupEmailExists);

  async open(): Promise<void> {
    await this.goto('/login');
  }

  async startSignup(name: string, email: string): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.signupName().fill(name);
    await this.signupEmail().fill(email);
    await this.signupButton().click();
  }

  async login(email: string, password: string): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.loginEmail().fill(email);
    await this.loginPassword().fill(password);
    await this.loginButton().click();
  }

  async expectLoginError(): Promise<void> {
    await expect(this.loginError()).toBeVisible();
  }

  async expectSignupEmailExistsError(): Promise<void> {
    await expect(this.signupEmailExists()).toBeVisible();
  }
}
