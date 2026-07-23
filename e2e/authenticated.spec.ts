import path from 'node:path';
import { expect, test } from '@playwright/test';

const email = process.env.E2E_USER_EMAIL;
const password = process.env.E2E_USER_PASSWORD;

test.describe('authenticated design lifecycle', () => {
    test.skip(!email || !password, 'Set E2E_USER_EMAIL and E2E_USER_PASSWORD to run authenticated CRUD tests.');

    test('creates a private design, sees it in profile, and deletes it', async ({ page }) => {
        const title = `E2E private design ${Date.now()}`;

        await page.goto('/auth?returnUrl=/submit');
        await page.getByPlaceholder('your@email.com').fill(email!);
        await page.getByPlaceholder('••••••••').fill(password!);
        await page.getByRole('button', { name: 'Log In' }).click();
        await expect(page).toHaveURL(/\/submit/);

        await page.locator('input[aria-label="Upload screenshots"]').setInputFiles(
            path.join(process.cwd(), 'public', 'images', 'default-avatar.png')
        );
        await page.locator('#title-input').fill(title);
        await page.getByRole('button', { name: /Google Stitch/i }).click();
        await page.getByRole('button', { name: 'UI/UX', exact: true }).click();
        await page.getByRole('button', { name: /Private Vault/i }).click();
        await page.locator('#prompt-input').fill('Create a production-ready private dashboard with accessible navigation, responsive cards, clear hierarchy, and robust empty states.');
        await page.getByRole('button', { name: /Save to Private Vault/i }).click();

        await expect(page).toHaveURL(/\/profile/);
        await expect(page.getByText(title, { exact: true })).toBeVisible();

        await page.getByRole('button', { name: `Delete ${title}` }).click();
        await page.getByRole('button', { name: 'Delete', exact: true }).click();
        await expect(page.getByText(title, { exact: true })).toHaveCount(0);
    });
});
