import type { LocatorConfig } from '@locators';

/** Logged-in delete account + deleted confirmation can use text or data-qa. */
export const HomeLocators = {
  deleteAccount: {
    strategies: [
      { type: 'role', role: 'link', name: /Delete Account/i },
      { type: 'css', value: 'a[href="/delete_account"]' },
    ],
  } satisfies LocatorConfig,

  accountDeleted: {
    strategies: [
      { type: 'css', value: 'h2[data-qa="account-deleted"]' },
      { type: 'role', role: 'heading', name: /Account Deleted!/i },
    ],
  } satisfies LocatorConfig,

  continueAfterDelete: {
    strategies: [
      { type: 'role', role: 'link', name: 'Continue' },
      { type: 'css', value: 'a[data-qa="continue-button"]' },
    ],
  } satisfies LocatorConfig,

  subscribeSuccess: {
    strategies: [
      { type: 'css', value: '#success-subscribe' },
      { type: 'text', value: /You have been successfully subscribed!/i },
    ],
  } satisfies LocatorConfig,
} as const;
