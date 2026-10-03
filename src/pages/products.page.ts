import { expect } from '@playwright/test';
import { BasePage } from '@pages/base.page';
import {
  ProductsLocators,
  brandHeadingStrategies,
  brandLinkStrategies,
  categoryHeadingStrategies,
} from '@pages/locators/products.locators';
import { CartModalLocators } from '@pages/locators/cart-modal.locators';

/** Known Automation Exercise category URLs used when the accordion click is blocked. */
const CATEGORY_PATHS: Record<string, Record<string, string>> = {
  Women: {
    Dress: '/category_products/1',
    Tops: '/category_products/2',
    Saree: '/category_products/7',
  },
  Men: {
    Tshirts: '/category_products/3',
    Jeans: '/category_products/6',
  },
  Kids: {
    Dress: '/category_products/4',
    'Tops & Shirts': '/category_products/5',
  },
};

export class ProductsPage extends BasePage {
  allProductsHeading = () => this.loc(ProductsLocators.allProductsHeading);
  searchedHeading = () => this.loc(ProductsLocators.searchedHeading);
  firstViewProduct = () => this.loc(ProductsLocators.firstViewProduct);
  cartModal = () => this.loc(CartModalLocators.modal);
  modalViewCart = () => this.loc(CartModalLocators.viewCart);
  modalContinue = () => this.loc(CartModalLocators.continueShopping);
  brandLink = (brandName: string) =>
    this.locStrategies(brandLinkStrategies(brandName), '.brands-name');
  brandHeading = (brandName: string) => this.locStrategies(brandHeadingStrategies(brandName));
  categoryHeading = (group: string, subcategory: string) =>
    this.locStrategies(categoryHeadingStrategies(group, subcategory));

  /** Stable #ids / list containers — direct locators. */
  searchInput = () => this.page.locator('#search_product');
  searchSubmit = () => this.page.locator('#submit_search');
  productCards = () => this.page.locator('.features_items .product-image-wrapper');
  featuresItems = () => this.page.locator('.features_items');
  categoryGroup = (group: string) => this.page.locator(`a[href="#${group}"]`);

  async open(): Promise<void> {
    await this.goto('/products');
    await this.dismissBlockingOverlays();
    await expect(this.allProductsHeading()).toBeVisible();
  }

  async searchProduct(term: string): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.searchInput().fill(term);
    await this.searchSubmit().click();
    await expect(this.searchedHeading()).toBeVisible();
  }

  async expectSearchResultsContain(term: string): Promise<void> {
    await expect(this.productCards().first()).toBeVisible();
    expect(await this.productCards().count()).toBeGreaterThan(0);
    await expect(this.featuresItems()).toContainText(new RegExp(term, 'i'));
  }

  async firstProductName(): Promise<string> {
    return (await this.productCards().first().locator('.productinfo p').innerText()).trim();
  }

  async openFirstProductDetail(): Promise<void> {
    await this.dismissBlockingOverlays();
    const link = this.firstViewProduct();
    const href = await link.getAttribute('href');
    try {
      await Promise.all([
        this.page.waitForURL(/\/product_details\//, { timeout: 8_000 }),
        link.click(),
      ]);
    } catch {
      // Vignette ads often appear between dismiss and click and swallow the pointer event.
      await this.dismissBlockingOverlays();
      if (!href) {
        await link.click({ force: true });
        return;
      }
      await this.page.goto(href, { waitUntil: 'domcontentloaded' });
    }
    await this.dismissBlockingOverlays();
  }

  async addFirstProductToCart(): Promise<void> {
    await this.dismissBlockingOverlays();
    const first = this.productCards().first();
    await first.hover();
    await first.locator('a.add-to-cart').first().click();
    await this.confirmAddedModal('continue');
  }

  async addFirstProductAndViewCart(): Promise<void> {
    await this.dismissBlockingOverlays();
    const first = this.productCards().first();
    await first.hover();
    await first.locator('a.add-to-cart').first().click();
    await this.confirmAddedModal('viewCart');
  }

  async addProductAtIndexToCart(
    index: number,
    action: 'continue' | 'viewCart' = 'continue',
  ): Promise<void> {
    await this.dismissBlockingOverlays();
    const card = this.productCards().nth(index);
    await expect(card).toBeVisible();
    await card.hover();
    await card.locator('a.add-to-cart').first().click();
    await this.confirmAddedModal(action);
  }

  private async confirmAddedModal(action: 'continue' | 'viewCart'): Promise<void> {
    await expect(this.cartModal()).toBeVisible();
    if (action === 'viewCart') {
      await this.modalViewCart().click();
    } else {
      await this.modalContinue().click();
    }
  }

  async filterByBrand(brandName: string): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.brandLink(brandName).click();
  }

  async expectBrandResults(brandName: string): Promise<void> {
    await expect(this.brandHeading(brandName)).toBeVisible();
    await expect(this.productCards().first()).toBeVisible();
    expect(await this.productCards().count()).toBeGreaterThan(0);
  }

  async filterByCategory(group: string, subcategory: string): Promise<void> {
    await this.dismissBlockingOverlays();
    await this.categoryGroup(group).click();
    const link = this.page
      .locator('.left-sidebar')
      .getByRole('link', { name: subcategory, exact: true });
    try {
      await expect(link).toBeVisible({ timeout: 5_000 });
      await Promise.all([
        this.page.waitForURL(/\/category_products\//, { timeout: 8_000 }),
        link.click(),
      ]);
    } catch {
      // Ads or collapsed accordion can block the subcategory click — use known paths.
      const path = CATEGORY_PATHS[group]?.[subcategory];
      if (!path) {
        throw new Error(`Unknown category path for ${group} > ${subcategory}`);
      }
      await this.dismissBlockingOverlays();
      await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    }
    await this.dismissBlockingOverlays();
  }

  async expectCategoryResults(group: string, subcategory: string): Promise<void> {
    await expect(this.categoryHeading(group, subcategory)).toBeVisible();
    await expect(this.productCards().first()).toBeVisible();
    expect(await this.productCards().count()).toBeGreaterThan(0);
  }
}
