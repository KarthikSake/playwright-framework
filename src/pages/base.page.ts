import type { Locator, Page } from '@playwright/test';
import { locatorFrom, type LocatorConfig, type LocatorStrategy } from '@locators';

/**
 * Shared page helpers. Subclasses expose locator getters and intent methods.
 */
export class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.dismissBlockingOverlays();
  }

  /**
   * Automation Exercise often injects ad/consent iframes that intercept clicks.
   * Best-effort dismiss; never fail the test if overlays are absent.
   */
  async dismissBlockingOverlays(): Promise<void> {
    try {
      await this.page.keyboard.press('Escape').catch(() => undefined);
    } catch {
      // ignore
    }

    try {
      const consent = this.page.getByRole('button', {
        name: /accept|agree|consent|got it|ok/i,
      });
      if (await consent.first().isVisible({ timeout: 1500 }).catch(() => false)) {
        await consent.first().click({ timeout: 2000 }).catch(() => undefined);
      }
    } catch {
      // ignore
    }

    try {
      const closeAd = this.page.locator('#dismiss-button, .close-button, [aria-label="Close"]');
      if (await closeAd.first().isVisible({ timeout: 1000 }).catch(() => false)) {
        await closeAd.first().click({ timeout: 2000 }).catch(() => undefined);
      }
    } catch {
      // ignore
    }

    await this.dismissAdFrames();
  }

  /**
   * Google vignette ads render Close inside a cross-origin iframe, so a main-page
   * click never reaches it. Click #dismiss-button in child frames, then drop the
   * ad hosts from the top document if the frame click cannot land.
   */
  private async dismissAdFrames(): Promise<void> {
    for (const frame of this.page.frames()) {
      if (frame === this.page.mainFrame()) continue;
      try {
        const dismiss = frame.locator('#dismiss-button');
        if (await dismiss.isVisible().catch(() => false)) {
          await dismiss.click({ timeout: 2000 }).catch(() => undefined);
        }
      } catch {
        // Detached or cross-origin frames are ignored.
      }
    }

    await this.page
      .evaluate(() => {
        document
          .querySelectorAll(
            'iframe[id^="aswift"], iframe[id^="google_ads"], iframe[name^="aswift"], ins.adsbygoogle, #google_vignette',
          )
          .forEach((node) => node.remove());
      })
      .catch(() => undefined);
  }

  /** Build a locator from a config (ordered `.or()` fallbacks). */
  protected loc(config: LocatorConfig): Locator {
    return locatorFrom(this.page, config);
  }

  protected locStrategies(strategies: LocatorStrategy[], root?: string): Locator {
    return locatorFrom(this.page, { strategies, root });
  }
}
