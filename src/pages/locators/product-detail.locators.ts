import type { LocatorConfig } from '@locators';

/** Price + add-to-cart can vary; name/info containers are on the page. */
export const ProductDetailLocators = {
  price: {
    strategies: [
      { type: 'css', value: '.product-information span span' },
      { type: 'text', value: /Rs\.\s*\d+/i },
    ],
  } satisfies LocatorConfig,

  addToCart: {
    strategies: [
      { type: 'role', role: 'button', name: /Add to cart/i },
      { type: 'css', value: 'button.cart' },
    ],
  } satisfies LocatorConfig,
} as const;
