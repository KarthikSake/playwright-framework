import type { LocatorConfig } from '@locators';

/** Proceed CTA + guest checkout modal are fragile; table ids live on the page. */
export const CartLocators = {
  proceedToCheckout: {
    strategies: [
      { type: 'css', value: 'a.check_out' },
      { type: 'role', role: 'link', name: /Proceed To Checkout/i },
    ],
  } satisfies LocatorConfig,

  checkoutModal: {
    strategies: [{ type: 'css', value: '#checkoutModal' }],
  } satisfies LocatorConfig,

  registerLoginFromCheckout: {
    root: '#checkoutModal',
    strategies: [
      { type: 'role', role: 'link', name: /Register \/ Login/i },
      { type: 'css', value: 'a[href="/login"]' },
    ],
  } satisfies LocatorConfig,

  emptyCart: {
    strategies: [
      { type: 'text', value: /Cart is empty/i },
      { type: 'css', value: '#empty_cart' },
    ],
  } satisfies LocatorConfig,
} as const;
