import { APIRequestContext, request } from '@playwright/test';
import { env } from '@config/env';
import { ApiEnvelope, parseApiBody } from '@api/types';

/**
 * Playwright resolves paths that start with `/` from the origin, dropping any
 * `/api` suffix on baseURL. Keep baseURL trailing-slash and paths relative.
 */
function apiBaseUrl(): string {
  return env.apiBaseUrl.endsWith('/') ? env.apiBaseUrl : `${env.apiBaseUrl}/`;
}

function relativePath(path: string): string {
  return path.replace(/^\//, '');
}

function parseResponseBody<T extends ApiEnvelope>(raw: string, url: string): T {
  const trimmed = raw.trim();
  if (trimmed.startsWith('<') || trimmed.startsWith('<!')) {
    throw new Error(
      `Expected JSON from ${url} but received HTML. Check API base URL / path resolution.`,
    );
  }
  return parseApiBody<T>(raw);
}

/**
 * Thin wrapper around Playwright's APIRequestContext.
 * Encodes the Automation Exercise quirk: prefer body.responseCode over HTTP status.
 */
export class ApiClient {
  constructor(private readonly ctx: APIRequestContext) {}

  static async create(): Promise<ApiClient> {
    const ctx = await request.newContext({
      baseURL: apiBaseUrl(),
      extraHTTPHeaders: {
        Accept: 'application/json',
      },
    });
    return new ApiClient(ctx);
  }

  async dispose(): Promise<void> {
    await this.ctx.dispose();
  }

  /**
   * POST with application/x-www-form-urlencoded body (required by AE create/login/delete).
   */
  async postForm<T extends ApiEnvelope>(
    path: string,
    form: Record<string, string>,
  ): Promise<{ httpStatus: number; body: T }> {
    const response = await this.ctx.post(relativePath(path), { form });
    const raw = await response.text();
    const body = parseResponseBody<T>(raw, response.url());
    return { httpStatus: response.status(), body };
  }

  async putForm<T extends ApiEnvelope>(
    path: string,
    form: Record<string, string>,
  ): Promise<{ httpStatus: number; body: T }> {
    const response = await this.ctx.put(relativePath(path), { form });
    const raw = await response.text();
    const body = parseResponseBody<T>(raw, response.url());
    return { httpStatus: response.status(), body };
  }

  async deleteForm<T extends ApiEnvelope>(
    path: string,
    form: Record<string, string>,
  ): Promise<{ httpStatus: number; body: T }> {
    const response = await this.ctx.delete(relativePath(path), { form });
    const raw = await response.text();
    const body = parseResponseBody<T>(raw, response.url());
    return { httpStatus: response.status(), body };
  }

  async get<T extends ApiEnvelope>(
    path: string,
    params?: Record<string, string>,
  ): Promise<{ httpStatus: number; body: T }> {
    const response = await this.ctx.get(relativePath(path), { params });
    const raw = await response.text();
    const body = parseResponseBody<T>(raw, response.url());
    return { httpStatus: response.status(), body };
  }

  async postRaw<T extends ApiEnvelope>(
    path: string,
    options?: { form?: Record<string, string>; data?: unknown },
  ): Promise<{ httpStatus: number; body: T }> {
    const response = await this.ctx.post(relativePath(path), options);
    const raw = await response.text();
    const body = parseResponseBody<T>(raw, response.url());
    return { httpStatus: response.status(), body };
  }
}
