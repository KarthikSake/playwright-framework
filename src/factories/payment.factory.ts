import { faker } from '@faker-js/faker';

export interface PaymentDetails {
  nameOnCard: string;
  cardNumber: string;
  cvc: string;
  expiryMonth: string;
  expiryYear: string;
}

export type PaymentOverrides = Partial<PaymentDetails>;

/** AE accepts any non-empty card fields; use a well-known Visa test PAN. */
const TEST_VISA = '4111111111111111';

/**
 * Build payment form data for checkout. Not a real charge — AUT is a demo site.
 */
export function buildPayment(overrides: PaymentOverrides = {}): PaymentDetails {
  const future = faker.date.future({ years: 5 });
  return {
    nameOnCard: overrides.nameOnCard ?? faker.person.fullName(),
    cardNumber: overrides.cardNumber ?? TEST_VISA,
    cvc: overrides.cvc ?? faker.string.numeric(3),
    expiryMonth: overrides.expiryMonth ?? String(future.getMonth() + 1).padStart(2, '0'),
    expiryYear: overrides.expiryYear ?? String(future.getFullYear()),
  };
}
