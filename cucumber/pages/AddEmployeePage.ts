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

    /**
     * Select user role from dropdown
     * @param role - The role to select (e.g., "Admin", "ESS")
     */
    async selectUserRole(role: string): Promise<void> {
        // Click on the first dropdown (User Role)
        await this.page.locator(this.userRoleDropdown).first().click();
        await this.wait(500);
        
        // Check if the option exists with a short timeout
        const optionLocator = this.page.getByRole('option', { name: role });
        const exists = await optionLocator.count() > 0;
        
        if (exists) {
            await optionLocator.click();
        } else {
            await this.page.keyboard.press('ArrowDown');
            await this.page.keyboard.press('Enter');
        }
    }


    /**
     * Enter employee name in autocomplete field
     * @param employeeName - The employee name to type
     */
    async enterEmployeeName(employeeName: string): Promise<void> {
        await this.fill(this.employeeNameInput, employeeName);
        
        // Dynamically wait for autocomplete dropdown to appear
        await this.page.waitForSelector('[role="listbox"]', { 
            state: 'visible', 
            timeout: 10000 
        });
        
        // Wait for options to load (not "Searching....")
        await this.page.waitForSelector('[role="option"]:not(:has-text("Searching"))', {
            state: 'visible',
            timeout: 10000
        });
        
        // Select the first suggestion
        await this.page.keyboard.press('ArrowDown');
        await this.page.keyboard.press('Enter');
    }

    /**
     * Select status from dropdown
     * @param status - The status to select (e.g., "Enabled", "Disabled")
     */
    async selectStatus(status: string): Promise<void> {
        // Click on the second dropdown (Status)
        await this.page.locator(this.userRoleDropdown).nth(1).click();
        await this.wait(500);
        
        // Check if the option exists with a short timeout
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

    /**
     * Enter username
     * @param username - The username to enter
     */
    async enterUsername(username: string): Promise<void> {
        // Find the username input (it's after the Employee Name field)
        const usernameInputs = this.page.locator(this.usernameInput);
        await usernameInputs.nth(1).fill(username);
    }

    /**
     * Enter password
     * @param password - The password to enter
     */
    async enterPassword(password: string): Promise<void> {
        // Fill the first password input
        await this.page.locator(this.passwordInput).first().fill(password);
    }

    /**
     * Enter confirm password
     * @param password - The password to confirm
     */
    async enterConfirmPassword(password: string): Promise<void> {
        // Fill the second password input
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

    /**
     * Click the Save button
     */
    async clickSaveButton(): Promise<void> {
        await this.clickAndWaitForNavigation(this.saveButton);
        await this.wait(2000);
    }

    /**
     * Click the Cancel button
     */
    async clickCancelButton(): Promise<void> {
        await this.page.locator(this.cancelButton).click();
    }
}
