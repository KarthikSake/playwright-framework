import { faker } from '@faker-js/faker';
import { AuthApi } from '@api/auth.api';
import { CreateAccountPayload, assertResponseCode } from '@api/types';
import { uniqueToken } from '@factories/unique';

/** Countries present in Automation Exercise signup dropdown. */
export const AE_COUNTRIES = [
  'India',
  'United States',
  'Canada',
  'Australia',
  'Israel',
  'New Zealand',
  'Singapore',
] as const;

export type AeCountry = (typeof AE_COUNTRIES)[number];

/** Same shape as API createAccount — one source of truth. */
export type TestUser = CreateAccountPayload;

export type UserOverrides = Partial<TestUser>;

/**
 * Build a unique, realistic TestUser (no API call).
 * Emails / passwords always include a UUID-backed token — parallel-safe.
 */
export function buildUser(overrides: UserOverrides = {}): TestUser {
  const token = uniqueToken(10);
  const firstname = overrides.firstname ?? faker.person.firstName();
  const lastname = overrides.lastname ?? faker.person.lastName();
  const title =
    overrides.title ?? faker.helpers.arrayElement(['Mr', 'Mrs', 'Miss'] as const);

  return {
    name: overrides.name ?? `${firstname} ${lastname}`,
    email: overrides.email ?? `qa.user.${token}@example.com`,
    password: overrides.password ?? `Pass_${token}!Aa1`,
    title,
    birth_date: overrides.birth_date ?? String(faker.number.int({ min: 1, max: 28 })),
    birth_month: overrides.birth_month ?? String(faker.number.int({ min: 1, max: 12 })),
    birth_year: overrides.birth_year ?? String(faker.number.int({ min: 1970, max: 2000 })),
    firstname,
    lastname,
    company: overrides.company ?? faker.company.name(),
    address1: overrides.address1 ?? faker.location.streetAddress(),
    address2: overrides.address2 ?? faker.location.secondaryAddress(),
    country: overrides.country ?? faker.helpers.arrayElement(AE_COUNTRIES),
    zipcode: overrides.zipcode ?? faker.location.zipCode('#####'),
    state: overrides.state ?? faker.location.state({ abbreviated: false }),
    city: overrides.city ?? faker.location.city(),
    mobile_number: overrides.mobile_number ?? faker.string.numeric(10),
  };
}

/**
 * Creates users via API and tracks them for teardown (deleteAccount).
 * Prefer create()/track() so fixture dispose always cleans up — including failed mid-tests.
 */
export class UserFactory {
  private created: TestUser[] = [];

  constructor(private readonly authApi: AuthApi) {}

  /** Build a unique user object without registering it. */
  build(overrides: UserOverrides = {}): TestUser {
    return buildUser(overrides);
  }

  /** Track an already-created user (e.g. UI signup) for fixture dispose(). */
  track(user: TestUser): void {
    if (!this.created.some((u) => u.email === user.email)) {
      this.created.push(user);
    }
  }

  /** Stop tracking after the test deleted the account itself (auth lifecycle). */
  untrack(email: string): void {
    this.created = this.created.filter((u) => u.email !== email);
  }

  /** Register via API and track for dispose(). */
  async create(overrides: UserOverrides = {}): Promise<TestUser> {
    const user = buildUser(overrides);
    const { body } = await this.authApi.createAccount(user);
    assertResponseCode(body, 201, 'UserFactory.create');
    this.track(user);
    return user;
  }

  /**
   * Delete all tracked users. Surfaces failures so parallel pollution is visible.
   * Safe to call when the list is empty.
   */
  async dispose(): Promise<void> {
    const pending = [...this.created];
    this.created = [];
    if (pending.length === 0) {
      return;
    }

    const failures: string[] = [];
    await Promise.all(
      pending.map(async (user) => {
        try {
          const { body } = await this.authApi.deleteAccount({
            email: user.email,
            password: user.password,
          });
          // 200 = deleted; 404 = already gone (e.g. test deleted explicitly) — both OK
          if (body.responseCode !== 200 && body.responseCode !== 404) {
            failures.push(`${user.email}: responseCode=${body.responseCode} message=${body.message}`);
          }
        } catch (error) {
          failures.push(`${user.email}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }),
    );

    if (failures.length > 0) {
      throw new Error(
        `UserFactory.dispose failed for ${failures.length} user(s): ${failures.join('; ')}`,
      );
    }
  }
}
