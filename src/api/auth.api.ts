import { ApiClient } from '@api/client';
import {
  ApiEnvelope,
  CreateAccountPayload,
  DeleteAccountPayload,
  UserDetailResponse,
  VerifyLoginPayload,
  toForm,
} from '@api/types';

export class AuthApi {
  constructor(private readonly client: ApiClient) {}

  async createAccount(payload: CreateAccountPayload) {
    return this.client.postForm<ApiEnvelope>('/createAccount', toForm(payload));
  }

  async deleteAccount(payload: DeleteAccountPayload) {
    return this.client.deleteForm<ApiEnvelope>('/deleteAccount', toForm(payload));
  }

  async verifyLogin(payload: VerifyLoginPayload) {
    return this.client.postForm<ApiEnvelope>('/verifyLogin', toForm(payload));
  }

  async verifyLoginMissingEmail(password: string) {
    return this.client.postForm<ApiEnvelope>('/verifyLogin', { password });
  }

  async getUserDetailByEmail(email: string) {
    return this.client.get<UserDetailResponse>('/getUserDetailByEmail', { email });
  }
}
