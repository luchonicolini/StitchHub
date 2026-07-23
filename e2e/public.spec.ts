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

test('public creator profiles do not require authentication', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.locator('a[href^="/profile/"]').evaluateAll(links =>
        links.map(link => link.getAttribute('href')).filter((href): href is string => Boolean(href))
    );
    const publicProfileHref = hrefs.find(href => !decodeURIComponent(href).includes('/profile/@'));
    test.skip(!publicProfileHref, 'No database-backed public profile is available in this environment.');

    const response = await page.goto(publicProfileHref!);
    expect(response?.status()).toBe(200);
    await expect(page).not.toHaveURL(/\/auth/);
    await expect(page.getByText('Unexpected error', { exact: false })).toHaveCount(0);
});
