import { test, expect } from '@playwright/test';

test.describe('HomePage E2E', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('http://localhost:5174/');
    });

    test('should display main heading and subtitle', async ({ page }) => {
        await expect(page.getByText('One Tap. Neighbors Respond.')).toBeVisible();
        await expect(page.getByText('Instant help from your community during emergencies.')).toBeVisible();
    });

    test('should display all metrics', async ({ page }) => {
        await expect(page.getByText('10,000+')).toBeVisible();
        await expect(page.getByText('5,000+')).toBeVisible();
        await expect(page.getByText('<3 min')).toBeVisible();
        await expect(page.getByText('300+')).toBeVisible();
    });

    test('should navigate to signup when clicking Get Help', async ({ page }) => {
        await page.getByRole('button', { name: /get help/i }).first().click();
        await expect(page).toHaveURL(/.*signup/);
        expect(await page.evaluate(() => localStorage.getItem('role'))).toBe('requester');
    });

    test('should navigate to signup when clicking Join as Volunteer', async ({ page }) => {
        await page.getByRole('button', { name: /join as volunteer/i }).click();
        await expect(page).toHaveURL(/.*signup/);
        expect(await page.evaluate(() => localStorage.getItem('role'))).toBe('volunteer');
    });

    test('should have accessible navigation', async ({ page }) => {
        const nav = page.getByRole('navigation');
        await expect(nav).toBeVisible();
    });

    test('should display all three steps', async ({ page }) => {
        await expect(page.getByText('Request Help')).toBeVisible();
        await expect(page.getByText('Get Matched')).toBeVisible();
        await expect(page.getByText('Receive Support')).toBeVisible();
    });

    test('should display all six features', async ({ page }) => {
        await expect(page.getByText('Real-Time Alerts')).toBeVisible();
        await expect(page.getByText('Verified Volunteers')).toBeVisible();
        await expect(page.getByText('GPS Tracking')).toBeVisible();
        await expect(page.getByText('Emergency Contacts')).toBeVisible();
        await expect(page.getByText('Community Network')).toBeVisible();
        await expect(page.getByText('24/7 Availability')).toBeVisible();
    });

    test('should have proper color scheme', async ({ page }) => {
        const hero = page.locator('section').first();
        const bgColor = await hero.evaluate((el) => window.getComputedStyle(el).background);
        expect(bgColor).toContain('rgb(23, 102, 224)'); // #1766E0
    });
});
