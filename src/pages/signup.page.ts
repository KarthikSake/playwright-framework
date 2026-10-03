import { expect } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { SignupLocators } from '@pages/locators/signup.locators';
import { TestUser } from '@factories/user.factory';

/**
 * Account information form shown after New User Signup (multi-step: name/email → details).
 * Stable #id fields use direct locators; fragile CTAs use config fallbacks.
 */
export class SignupPage extends BasePage {
  accountInfoHeading = () => this.loc(SignupLocators.accountInfoHeading);
  titleMrs = () => this.loc(SignupLocators.titleMrs);
  titleMr = () => this.loc(SignupLocators.titleMr);
  createAccount = () => this.loc(SignupLocators.createAccount);
  accountCreated = () => this.loc(SignupLocators.accountCreated);
  continueLink = () => this.loc(SignupLocators.continue);

  password = () => this.page.locator('#password');
  days = () => this.page.locator('#days');
  months = () => this.page.locator('#months');
  years = () => this.page.locator('#years');
  firstName = () => this.page.locator('#first_name');
  lastName = () => this.page.locator('#last_name');
  company = () => this.page.locator('#company');
  address1 = () => this.page.locator('#address1');
  address2 = () => this.page.locator('#address2');
  country = () => this.page.locator('#country');
  state = () => this.page.locator('#state');
  city = () => this.page.locator('#city');
  zipcode = () => this.page.locator('#zipcode');
  mobile = () => this.page.locator('#mobile_number');

  async expectAccountInfoForm(): Promise<void> {
    await expect(this.accountInfoHeading()).toBeVisible();
  }

  async completeAccountDetails(user: TestUser): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.expectAccountInfoForm();

    if (user.title === 'Mrs' || user.title === 'Miss') {
      await this.titleMrs().check();
    } else {
      await this.titleMr().check();
    }

    await this.password().fill(user.password);
    await this.days().selectOption(user.birth_date);
    await this.months().selectOption(user.birth_month);
    await this.years().selectOption(user.birth_year);

    await this.firstName().fill(user.firstname);
    await this.lastName().fill(user.lastname);
    await this.company().fill(user.company);
    await this.address1().fill(user.address1);
    await this.address2().fill(user.address2);
    await this.country().selectOption(user.country);
    await this.state().fill(user.state);
    await this.city().fill(user.city);
    await this.zipcode().fill(user.zipcode);
    await this.mobile().fill(user.mobile_number);

    await this.createAccount().click();
  }

  async expectAccountCreated(): Promise<void> {
    await expect(this.accountCreated()).toBeVisible();
  }

  async clickContinue(): Promise<void> {
    await this.continueLink().click();
  }
}
