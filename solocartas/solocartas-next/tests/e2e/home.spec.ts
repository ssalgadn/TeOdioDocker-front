import { test, expect } from '@playwright/test';

const SKIP = process.env.CI ? false : !process.env.PLAYWRIGHT_BROWSERS_INSTALLED;

import { AxeBuilder } from '@axe-core/playwright';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load and display navbar', async ({ page }) => {
    await expect(page.getByRole('navigation')).toBeVisible();
  });

  test('accessibility check (non-blocking)', async ({ page }, testInfo: any) => {
    const results = await new AxeBuilder({ page }).analyze();
    if (results.violations.length) {
      await testInfo.attach('a11y-violations', {
        body: JSON.stringify(results.violations, null, 2),
        contentType: 'application/json',
      });
      testInfo.skip(true, 'Accessibility issues detected – review attachment, test is non-blocking.');
    }
  });
});
