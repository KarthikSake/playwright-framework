import type { Page } from '@playwright/test';

export type RoleName = Parameters<Page['getByRole']>[0];

/** One way to find an element. Prefer role → placeholder/label → css → text. */
export type LocatorStrategy =
  | {
      type: 'role';
      role: RoleName;
      name?: string | RegExp;
      exact?: boolean;
    }
  | { type: 'placeholder'; value: string | RegExp }
  | { type: 'label'; value: string | RegExp }
  | { type: 'css'; value: string }
  | { type: 'text'; value: string | RegExp; exact?: boolean }
  | { type: 'testId'; value: string };

/**
 * Named control with ordered fallback strategies.
 * Use multi-strategy only when the control is fragile (≥2 real alternatives).
 */
export interface LocatorConfig {
  /** Optional CSS root that scopes every strategy. */
  root?: string;
  strategies: LocatorStrategy[];
}
