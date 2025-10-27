import { Page, Locator, APIRequestContext } from '@playwright/test';

export class BasePage {
    protected page: Page;
    protected request: APIRequestContext;
    public static recordsCount: number;

    constructor(page: Page) {
        this.page = page;
        this.request = page.context().request;
    }

    /**
     * Navigate to a specific URL
     */
    async navigateTo(url: string): Promise<void> {
        await this.page.goto(url, {timeout: 100*1000});
        await this.waitForNetworkIdle();
    }

    /**
     * Click on an element
     */
    async click(selector: string): Promise<void> {
        await this.page.click(selector);
    }

    /**
     * Fill an input field
     */
    async fill(selector: string, value: string): Promise<void> {
        await this.page.fill(selector, value);
    }

    public async getTotalRecordsCount(stringLocator: string): Promise<number> {
        const records = await this.page.$$(stringLocator);
        BasePage.recordsCount = records.length;
        return BasePage.recordsCount;
    }

    /**
     * Get text content of an element
     */
    async getTextContent(selector: string): Promise<string | null> {
        return await this.page.locator(selector).first().textContent();
    }

    /**
     * Check if an element is visible
     */
    async isVisible(selector: string): Promise<boolean> {
        return await this.page.isVisible(selector);
    }

    /**
     * Wait for a selector to be visible
     */
    async waitForSelector(selector: string, timeout: number = 10000): Promise<void> {
        await this.page.waitForSelector(selector, { timeout });
    }

    /**
     * Wait for network to be idle
     */
    async waitForNetworkIdle(): Promise<void> {
        await this.page.waitForLoadState('networkidle', { timeout: 100*1000 });
    }

    /**
     * Wait for a specific time (use sparingly)
     */
    async wait(milliseconds: number): Promise<void> {
        await this.page.waitForTimeout(milliseconds);
    }

    /**
     * Get a locator for an element
     */
    getLocator(selector: string): Locator {
        return this.page.locator(selector);
    }

    /**
     * Clear and fill an input field
     */
    async clearAndFill(locator: Locator, value: string): Promise<void> {
        await locator.clear();
        await locator.fill(value);
    }

    /**
     * Click and wait for navigation
     */
    async clickAndWaitForNavigation(selector: string): Promise<void> {
        await this.waitForSelector(selector, 10000);
        await this.click(selector);
        await this.waitForNetworkIdle();
    }
}
