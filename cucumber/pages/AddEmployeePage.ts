import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AddEmployeePage extends BasePage {
    private userRoleDropdown: string;
    private employeeNameInput: string;
    private statusDropdown: string;
    private usernameInput: string;
    private passwordInput: string;
    private confirmPasswordInput: string;
    private saveButton: string;
    private cancelButton: string;

    constructor(page: Page) {
        super(page);
        
        this.userRoleDropdown = '.oxd-select-text-input';
        this.statusDropdown = '.oxd-select-text-input';  
        this.employeeNameInput = 'input[placeholder="Type for hints..."]';
        this.usernameInput = '.oxd-input--active';
        this.passwordInput = 'input[type="password"]'
        this.confirmPasswordInput = 'input[type="password"]';        
        this.saveButton = 'button[type="submit"]';
        this.cancelButton = 'button.oxd-button--ghost';
    }

    async selectUserRole(role: string): Promise<void> {
        await this.page.locator(this.userRoleDropdown).first().click();
        await this.wait(500);
        const optionLocator = this.page.getByRole('option', { name: role });
        const exists = await optionLocator.count() > 0;
        
        if (exists) {
            await optionLocator.click();
        } else {
            await this.page.keyboard.press('ArrowDown');
            await this.page.keyboard.press('Enter');
        }
    }

    async enterEmployeeName(employeeName: string): Promise<void> {
        await this.fill(this.employeeNameInput, employeeName);
        await this.page.waitForSelector('[role="listbox"]', { 
            state: 'visible', 
            timeout: 10000 
        });
        await this.page.waitForSelector('[role="option"]:not(:has-text("Searching"))', {
            state: 'visible',
            timeout: 10000
        });
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');
    }

    async selectStatus(status: string): Promise<void> {
        await this.page.locator(this.userRoleDropdown).nth(1).click();
        await this.wait(500);
        
        const optionLocator = this.page.getByRole('option', { name: status });
        const exists = await optionLocator.count() > 0;
        
        if (exists) {
            await optionLocator.click();
        } else {
            console.log(`Status "${status}" not found, selecting default option.`);
            await this.page.keyboard.press('ArrowDown');
            await this.page.keyboard.press('Enter');
        }
    }

    async enterUsername(username: string): Promise<void> {
        const usernameInputs = this.page.locator(this.usernameInput);
        await usernameInputs.nth(1).fill(username);
    }

    async enterPassword(password: string): Promise<void> {
        await this.page.locator(this.passwordInput).first().fill(password);
    }
    async enterConfirmPassword(password: string): Promise<void> {
        await this.page.locator(this.passwordInput).nth(1).fill(password);
    }

    /**
     * Complete method to fill all user details
     * @param userRole - User role to select
     * @param employeeName - Employee name to enter
     * @param status - Status to select
     * @param username - Username to enter
     * @param password - Password to enter
     */
    async enterUserDetails(
        userRole: string,
        employeeName: string,
        status: string,
        username: string,
        password: string
    ): Promise<void> {
        await this.selectUserRole(userRole);
        await this.enterEmployeeName(employeeName);
        await this.selectStatus(status);
        await this.enterUsername(username);
        await this.enterPassword(password);
        await this.enterConfirmPassword(password);
    }

    async clickSaveButton(): Promise<void> {
        await this.clickAndWaitForNavigation(this.saveButton);
        await this.wait(2000);
    }

    async clickCancelButton(): Promise<void> {
        await this.page.locator(this.cancelButton).click();
    }
}
