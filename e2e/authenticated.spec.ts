import path from 'node:path';
import { expect, test } from '@playwright/test';

const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

test.describe('authenticated design lifecycle', () => {
    test.skip(!email || !password, 'Set E2E_USER_EMAIL and E2E_USER_PASSWORD to run authenticated CRUD tests.');

    test('opens a public workshop card after login', async ({ page }) => {
        await page.goto('/auth');
        await page.getByPlaceholder('your@email.com').fill(email!);
        await page.locator('input[type="password"]').fill(password!);
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page).toHaveURL(/\/profile/);

        await page.goto('/');
        const firstCard = page.locator('[role="button"][aria-label^="Open "]').first();
        await expect(firstCard).toBeVisible();
        await firstCard.click();
        await expect(page.getByRole('dialog')).toBeVisible();
    });

    test('creates a private design, sees it in profile, and deletes it', async ({ page }) => {
        const title = `E2E private design ${Date.now()}`;

        // 1. Log in
        await page.goto('/auth');
        await page.getByPlaceholder('your@email.com').fill(email!);
        await page.getByPlaceholder('••••••••').fill(password!);
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page).toHaveURL(/\/profile/);

        // 2. Go to /submit and upload private card
        await page.goto('/submit');
        await page.locator('input[aria-label="Upload screenshots"]').setInputFiles(
            path.join(process.cwd(), 'public', 'images', 'default-avatar.png')
        );
        await page.locator('#title-input').fill(title);
        await page.getByRole('button', { name: /Google Stitch/i }).click();
        await page.getByRole('button', { name: 'Dashboard', exact: true }).click();
        await page.getByRole('button', { name: /Private Vault/i }).click();
        await page.locator('#prompt-input').fill('Create a production-ready private dashboard with accessible navigation, responsive cards, clear hierarchy, and robust empty states.');
        await page.getByRole('button', { name: /Save to Private Vault/i }).click();

        // 3. Verify design in profile and delete it
        await expect(page).toHaveURL(/\/profile/);
        const cardLocator = page.locator('.group', { hasText: title });
        await expect(cardLocator).toBeVisible();

        await cardLocator.getByRole('button', { name: 'Delete' }).click();
        await page.locator('div.fixed button', { hasText: 'Delete' }).click();
        await expect(page.getByText(title, { exact: true })).toHaveCount(0);
    });
});
