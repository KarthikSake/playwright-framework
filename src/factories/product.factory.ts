import { faker } from '@faker-js/faker';
import { ProductsApi } from '@api/products.api';
import { Product } from '@api/types';

/** Well-known search terms that reliably return products on Automation Exercise. */
export const KNOWN_SEARCH_TERMS = ['top', 'tshirt', 'jean', 'dress', 'shirt', 'blue'] as const;

export type KnownSearchTerm = (typeof KNOWN_SEARCH_TERMS)[number];

export class ProductFactory {
  private cachedProducts: Product[] | null = null;

  constructor(private readonly productsApi: ProductsApi) {}

  async getProducts(): Promise<Product[]> {
    if (this.cachedProducts) {
      return this.cachedProducts;
    }
    const { body } = await this.productsApi.getProductsList();
    if (body.responseCode !== 200 || !body.products?.length) {
      throw new Error(
        `ProductFactory: productsList failed responseCode=${body.responseCode}`,
      );
    }
    this.cachedProducts = body.products;
    return this.cachedProducts;
  }

  async pickFirst(): Promise<Product> {
    const products = await this.getProducts();
    return products[0];
  }

  /** Pick a random product from the live catalog (no shared mutable pick). */
  async pickRandom(): Promise<Product> {
    const products = await this.getProducts();
    return faker.helpers.arrayElement(products);
  }

  async pickByNameContains(fragment: string): Promise<Product> {
    const products = await this.getProducts();
    const match = products.find((p) =>
      p.name.toLowerCase().includes(fragment.toLowerCase()),
    );
    if (!match) {
      throw new Error(`ProductFactory: no product matching "${fragment}"`);
    }
    return match;
  }

  defaultSearchTerm(): KnownSearchTerm {
    return KNOWN_SEARCH_TERMS[0];
  }

  /** Random known-good search term — useful when spreading load across catalog. */
  randomSearchTerm(): KnownSearchTerm {
    return faker.helpers.arrayElement(KNOWN_SEARCH_TERMS);
  }
}
