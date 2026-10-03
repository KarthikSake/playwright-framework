import type { LocatorConfig } from '@locators';

/** Success copy is the reliable oracle; empty `.status.alert-success` stays hidden pre-submit. */
export const ContactLocators = {
  successAlert: {
    strategies: [
      {
        type: 'text',
        value: /Success!\s*Your details have been submitted successfully/i,
      },
    ],
  } satisfies LocatorConfig,

  homeButton: {
    strategies: [
      { type: 'role', role: 'link', name: /Home/i },
      { type: 'css', value: '.btn-success' },
    ],
  } satisfies LocatorConfig,
} as const;
