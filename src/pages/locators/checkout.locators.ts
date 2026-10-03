import type { LocatorConfig } from '@locators';

/** Multi-strategy only for fragile checkout CTAs / headings. Payment fields live on the page. */
export const CheckoutLocators = {
  addressDetails: {
    strategies: [
      { type: 'text', value: /Address Details/i },
      { type: 'css', value: '#address_delivery' },
    ],
  } satisfies LocatorConfig,

  reviewOrder: {
    strategies: [
      { type: 'text', value: /Review Your Order/i },
      { type: 'css', value: '#cart_info' },
    ],
  } satisfies LocatorConfig,

  placeOrder: {
    strategies: [
      { type: 'css', value: 'a[href="/payment"]' },
      { type: 'role', role: 'link', name: /Place Order/i },
    ],
  } satisfies LocatorConfig,

  payConfirm: {
    strategies: [
      { type: 'role', role: 'button', name: /Pay and Confirm Order/i },
      { type: 'css', value: 'button[data-qa="pay-button"]' },
    ],
  } satisfies LocatorConfig,

  orderPlaced: {
    strategies: [
      { type: 'css', value: 'h2[data-qa="order-placed"]' },
      { type: 'role', role: 'heading', name: /Order Placed!/i },
    ],
  } satisfies LocatorConfig,

  orderCongrats: {
    strategies: [
      { type: 'text', value: /Congratulations! Your order has been confirmed!/i },
    ],
  } satisfies LocatorConfig,
} as const;
