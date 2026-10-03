import type { LocatorConfig, LocatorStrategy } from '@locators';

/** Multi-strategy for headings / view-product; stable #ids live on the page. */
export const ProductsLocators = {
  allProductsHeading: {
    strategies: [
      { type: 'role', role: 'heading', name: /All Products/i },
      { type: 'css', value: '.features_items h2.title' },
    ],
  } satisfies LocatorConfig,

  searchedHeading: {
    strategies: [
      { type: 'role', role: 'heading', name: /Searched Products/i },
      { type: 'css', value: '.features_items h2.title' },
    ],
  } satisfies LocatorConfig,

  firstViewProduct: {
    strategies: [
      {
        type: 'css',
        value: '.features_items .product-image-wrapper >> nth=0 >> a[href*="product_details"]',
      },
    ],
  } satisfies LocatorConfig,
} as const;

export function brandLinkStrategies(brandName: string): LocatorStrategy[] {
  return [
    { type: 'role', role: 'link', name: new RegExp(brandName, 'i') },
    { type: 'text', value: new RegExp(brandName, 'i') },
  ];
}

export function brandHeadingStrategies(brandName: string): LocatorStrategy[] {
  return [
    {
      type: 'role',
      role: 'heading',
      name: new RegExp(`Brand\\s*-\\s*${brandName}\\s*Products`, 'i'),
    },
    { type: 'text', value: new RegExp(`Brand\\s*-\\s*${brandName}\\s*Products`, 'i') },
  ];
}

export function categoryHeadingStrategies(
  group: string,
  subcategory: string,
): LocatorStrategy[] {
  return [
    {
      type: 'role',
      role: 'heading',
      name: new RegExp(`${group}\\s*-\\s*${subcategory}\\s*Products`, 'i'),
    },
    {
      type: 'text',
      value: new RegExp(`${group}\\s*-\\s*${subcategory}\\s*Products`, 'i'),
    },
  ];
}
