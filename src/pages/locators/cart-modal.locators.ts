import type { LocatorConfig } from '@locators';

/** Shared “added to cart” modal — #cartModal is stable; CTAs keep role fallbacks. */
export const CartModalLocators = {
  modal: {
    strategies: [{ type: 'css', value: '#cartModal' }],
  } satisfies LocatorConfig,

  viewCart: {
    root: '#cartModal',
    strategies: [
      { type: 'role', role: 'link', name: /View Cart/i },
      { type: 'css', value: 'a[href="/view_cart"]' },
    ],
  } satisfies LocatorConfig,

  continueShopping: {
    root: '#cartModal',
    strategies: [
      { type: 'role', role: 'button', name: /Continue Shopping/i },
      { type: 'text', value: /Continue Shopping/i },
    ],
  } satisfies LocatorConfig,
} as const;
