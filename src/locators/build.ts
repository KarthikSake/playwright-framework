import type { Locator, Page } from '@playwright/test';
import type { LocatorConfig, LocatorStrategy } from '@locators/types';

export function buildStrategyLocator(
  page: Page,
  strategy: LocatorStrategy,
  root?: string,
): Locator {
  const scope: Page | Locator = root ? page.locator(root) : page;

  switch (strategy.type) {
    case 'role':
      return scope.getByRole(strategy.role, {
        name: strategy.name,
        exact: strategy.exact,
      });
    case 'placeholder':
      return scope.getByPlaceholder(strategy.value);
    case 'label':
      return scope.getByLabel(strategy.value);
    case 'css':
      // `scope` is already rooted when root is set
      return root ? scope.locator(strategy.value) : page.locator(strategy.value);
    case 'text':
      return scope.getByText(strategy.value, { exact: strategy.exact });
    case 'testId':
      return scope.getByTestId(strategy.value);
    default: {
      const _exhaustive: never = strategy;
      throw new Error(`Unknown strategy: ${JSON.stringify(_exhaustive)}`);
    }
  }
}

/**
 * Build a Playwright locator from an ordered fallback array.
 * Uses `.or()` so Playwright auto-waits until any strategy is actionable.
 * Always resolves to `.first()` so overlapping fallbacks do not trip strict mode.
 */
export function locatorFromStrategies(
  page: Page,
  strategies: LocatorStrategy[],
  root?: string,
): Locator {
  if (!strategies.length) {
    throw new Error('locatorFromStrategies: strategies array must not be empty');
  }
  const locs = strategies.map((s) => buildStrategyLocator(page, s, root));
  return locs.reduce((acc, loc) => acc.or(loc)).first();
}

/** Convenience: resolve a LocatorConfig (root + strategies). */
export function locatorFrom(page: Page, config: LocatorConfig): Locator {
  return locatorFromStrategies(page, config.strategies, config.root);
}
