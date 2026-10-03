import type { LocatorConfig } from '@locators';

/** Multi-strategy only where a11y names / data-qa differ from CSS. Stable #ids stay on the page. */
export const SignupLocators = {
  accountInfoHeading: {
    strategies: [{ type: 'text', value: /Enter Account Information/i }],
  } satisfies LocatorConfig,

  titleMrs: {
    strategies: [
      { type: 'role', role: 'radio', name: 'Mrs.' },
      { type: 'css', value: '#id_gender2' },
    ],
  } satisfies LocatorConfig,

  titleMr: {
    strategies: [
      { type: 'role', role: 'radio', name: 'Mr.' },
      { type: 'css', value: '#id_gender1' },
    ],
  } satisfies LocatorConfig,

  createAccount: {
    strategies: [
      { type: 'role', role: 'button', name: 'Create Account' },
      { type: 'css', value: 'button[data-qa="create-account"]' },
      { type: 'text', value: 'Create Account' },
    ],
  } satisfies LocatorConfig,

  accountCreated: {
    strategies: [
      { type: 'css', value: 'h2[data-qa="account-created"]' },
      { type: 'role', role: 'heading', name: /Account Created!/i },
    ],
  } satisfies LocatorConfig,

  continue: {
    strategies: [
      { type: 'role', role: 'link', name: 'Continue' },
      { type: 'css', value: 'a[data-qa="continue-button"]' },
      { type: 'text', value: 'Continue' },
    ],
  } satisfies LocatorConfig,
} as const;
