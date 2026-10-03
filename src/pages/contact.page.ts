import { expect } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import { ContactLocators } from '@pages/locators/contact.locators';

export type ContactFormInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

/**
 * Contact Us form at /contact_us.
 * Stable data-qa fields stay as direct locators; success banner keeps fallbacks.
 */
export class ContactPage extends BasePage {
  successAlert = () => this.loc(ContactLocators.successAlert);
  homeButton = () => this.loc(ContactLocators.homeButton);

  nameInput = () => this.page.locator('[data-qa="name"]');
  emailInput = () => this.page.locator('[data-qa="email"]');
  subjectInput = () => this.page.locator('[data-qa="subject"]');
  messageInput = () => this.page.locator('[data-qa="message"]');
  submitButton = () => this.page.locator('[data-qa="submit-button"]');

  async open(): Promise<void> {
    await this.goto('/contact_us');
    await this.dismissBlockingOverlays();
    await expect(this.nameInput()).toBeVisible();
  }

  async submitContact(form: ContactFormInput): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.nameInput().fill(form.name);
    await this.emailInput().fill(form.email);
    await this.subjectInput().fill(form.subject);
    await this.messageInput().fill(form.message);

    await this.page.waitForFunction(() => typeof (window as unknown as { jQuery?: unknown }).jQuery === 'function');

    // Site wires confirm() via jQuery submit; trigger that path and accept the dialog.
    await Promise.all([
      this.page.waitForEvent('dialog').then(async (dialog) => {
        await dialog.accept();
      }),
      this.page.evaluate(() => {
        const jq = (window as unknown as { jQuery: (sel: string) => { trigger: (e: string) => void } }).jQuery;
        jq('#contact-us-form').trigger('submit');
      }),
    ]);
  }

  async expectSubmitted(): Promise<void> {
    await expect(this.successAlert()).toBeVisible();
  }
}
