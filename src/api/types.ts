/**
 * Automation Exercise API quirk: HTTP status is often 200 even when the
 * business outcome is 201/400/404. Always inspect body.responseCode.
 */

export interface ApiEnvelope {
  responseCode: number;
  message?: string;
}

/** Account fields shared by API createAccount and UI signup (TestUser). */
export interface CreateAccountPayload {
  name: string;
  email: string;
  password: string;
  title: 'Mr' | 'Mrs' | 'Miss';
  birth_date: string;
  birth_month: string;
  birth_year: string;
  firstname: string;
  lastname: string;
  company: string;
  address1: string;
  address2: string;
  country: string;
  zipcode: string;
  state: string;
  city: string;
  mobile_number: string;
}

export interface DeleteAccountPayload {
  email: string;
  password: string;
}

export interface VerifyLoginPayload {
  email: string;
  password: string;
}

export interface Product {
  id: number;
  name: string;
  price: string;
  brand: string;
  category: {
    usertype: { usertype: string };
    category: string;
  };
}

export interface ProductsListResponse extends ApiEnvelope {
  products: Product[];
}

export interface UserDetail {
  id?: number;
  name: string;
  email: string;
  title?: string;
  birth_day?: string;
  birth_month?: string;
  birth_year?: string;
  first_name?: string;
  last_name?: string;
  company?: string;
  address1?: string;
  address2?: string;
  country?: string;
  state?: string;
  city?: string;
  zipcode?: string;
}

export interface UserDetailResponse extends ApiEnvelope {
  user: UserDetail;
}

export function parseApiBody<T extends ApiEnvelope>(raw: string): T {
  return JSON.parse(raw) as T;
}

export function assertResponseCode(
  body: ApiEnvelope,
  expected: number | number[],
  context?: string,
): void {
  const allowed = Array.isArray(expected) ? expected : [expected];
  if (!allowed.includes(body.responseCode)) {
    const where = context ? ` (${context})` : '';
    throw new Error(
      `Expected responseCode ${allowed.join(' or ')}, got ${body.responseCode}` +
        `${where}. message=${body.message ?? '(none)'}`,
    );
  }
}

/**
 * Serialize a typed string-field payload for AE form-urlencoded endpoints.
 * Avoids `as Record<string, string>` casts at call sites.
 */
export function toForm(payload: object): Record<string, string> {
  const form: Record<string, string> = {};
  for (const [key, value] of Object.entries(payload)) {
    if (typeof value === 'string') {
      form[key] = value;
    }
  }
  return form;
}
