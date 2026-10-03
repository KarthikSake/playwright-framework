import { ApiClient } from '@api/client';
import { ApiEnvelope, ProductsListResponse } from '@api/types';

export class ProductsApi {
  constructor(private readonly client: ApiClient) {}

  async getProductsList() {
    return this.client.get<ProductsListResponse>('/productsList');
  }

  async searchProduct(searchProduct: string) {
    return this.client.postForm<ProductsListResponse>('/searchProduct', {
      search_product: searchProduct,
    });
  }

  async searchProductMissingParam() {
    return this.client.postRaw<ApiEnvelope>('/searchProduct', {});
  }
}
