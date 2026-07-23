import { expect, test } from '@playwright/test';

test('public pages, legal links, and security headers are available', async ({ page, request }) => {
    const homeResponse = await page.goto('/');
    expect(homeResponse?.status()).toBe(200);
    await expect(page.getByRole('heading', { name: /community ui/i })).toBeVisible();

    const csp = homeResponse?.headers()['content-security-policy'];
    expect(csp).toContain("frame-ancestors 'none'");
    expect(homeResponse?.headers()['x-content-type-options']).toBe('nosniff');

    await expect((await request.get('/privacy')).status()).toBe(200);
    await expect((await request.get('/terms')).status()).toBe(200);
    await expect((await request.get('/contact')).status()).toBe(200);
    await expect((await request.get('/api/diag')).status()).toBe(404);
});

test('protected pages redirect anonymous visitors to authentication', async ({ page }) => {
    await page.goto('/submit');
    await expect(page).toHaveURL(/\/auth\?returnUrl=%2Fsubmit/);

    await page.goto('/profile');
    await expect(page).toHaveURL(/\/auth\?returnUrl=%2Fprofile/);
});
