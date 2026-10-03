import type { LocatorConfig } from '@locators';

/** Error banners only — form fields are scoped CSS on the page. */
export const SignupLoginLocators = {
  loginError: {
    strategies: [
      { type: 'text', value: /Your email or password is incorrect/i },
    ],
  } satisfies LocatorConfig,

  signupEmailExists: {
    strategies: [
      { type: 'text', value: /Email Address already exist/i },
    ],
  } satisfies LocatorConfig,
} as const;
