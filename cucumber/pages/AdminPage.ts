
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AdminPage extends BasePage {
    private totalRecordsLocator: string;
    private addEmployeeBtn: string;
    private systemUsersDropdownBtn: string;
    private usernameSearchField: string;
    private searchBtn: string;
    private deleteRecordBtn: string;
    private resetSearchBtn: string;

    private recordWithUsernameLocator(username: string): string {
        return `//*[contains(text(), "${username}")]`;
    }
    constructor(page: Page) {
        super(page);

        this.totalRecordsLocator = '[role=row]';
        this.addEmployeeBtn = '[class="oxd-icon bi-plus oxd-button-icon"]';
        this.systemUsersDropdownBtn = '[class="oxd-icon bi-caret-down-fill"]';
        this.usernameSearchField = '(//*[@class="oxd-input-group oxd-input-field-bottom-space"]//input)[1]';
        this.searchBtn = '[class="oxd-button oxd-button--medium oxd-button--secondary orangehrm-left-space"]';
        this.deleteRecordBtn = '.oxd-table-cell-actions button:first-child';
        this.resetSearchBtn = '[class="oxd-button oxd-button--medium oxd-button--ghost"]';
    }

    public async getTotalRecordsCount(): Promise<number> {
        await this.page.waitForLoadState("load");
        try{
            await this.page.waitForSelector(this.totalRecordsLocator, { timeout: 10000 });
        } catch (error) {
            console.warn('Total records locator not found.');
        }
        if (await this.page.locator(this.totalRecordsLocator).count() === 0 || null) {
            console.warn('No records found on the Admin Page.');
            await this.page.waitForTimeout(2000);
            console.info('Retrying to fetch total records count...');
            console.info(`Total Records Found after retry: ${await this.page.locator(this.totalRecordsLocator).count()}`);
            return await this.page.locator(this.totalRecordsLocator).count();
        }
        return await this.page.locator(this.totalRecordsLocator).count();
    }
    async clickOnAddEmployeeButton(): Promise<void> {
        await this.clickAndWaitForNavigation(this.addEmployeeBtn);
    }
    async clickOnSystemUsersDropdownButton(): Promise<void> {
        try{
            await this.page.click(this.systemUsersDropdownBtn, { timeout: 2000 });
        }catch(error){
            console.warn('System Users Dropdown Button not found.');
        }
    }
    async enterUsernameInSearchField(username: string): Promise<void> {
        await this.fill(this.usernameSearchField, username);
    }
    async clickOnSearchButton(): Promise<void> {
        await this.clickAndWaitForNavigation(this.searchBtn);
    }
    async isRecordWithUsernamePresent(username: string): Promise<boolean> {
        await this.page.waitForLoadState("networkidle");
        await this.page.waitForSelector(this.recordWithUsernameLocator(username), { timeout: 10000 }).catch(() => {
            console.warn(`Record with username: ${username} not found within timeout.`);
        });
        if (await this.page.locator(this.recordWithUsernameLocator(username)).count() === 0) {
            console.warn(`No record found with username: ${username}`);
            return false;
        }else{
            console.info(`Record found with username: ${username}`);
            return await this.isVisible(this.recordWithUsernameLocator(username));
        }
    }
    async clickOnDeleteRecordButton(): Promise<void> {
        await this.page.locator(this.deleteRecordBtn).click();
        // Wait for confirmation dialog and click "Yes, Delete"
        await this.page.waitForSelector('button:has-text("Yes, Delete")', { timeout: 5000 });
        await this.page.click('button:has-text("Yes, Delete")');
        // Wait for success message
        await this.page.waitForSelector('text=Successfully Deleted', { timeout: 5000 }).catch(() => {
            console.warn('Success message not found after deletion.');
        });
    }
    async clickOnResetSearchButton(): Promise<void> {
        await this.clickAndWaitForNavigation(this.resetSearchBtn);
    }

}



