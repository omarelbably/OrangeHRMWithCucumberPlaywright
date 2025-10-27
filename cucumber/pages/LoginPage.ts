import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    private usernameInput: string;
    private passwordInput: string;
    private loginButton: string;

    constructor(page: Page) {
        super(page);
        
        this.usernameInput = 'input[name="username"]';
        this.passwordInput = 'input[name="password"]';
        this.loginButton = 'button[type="submit"]';
    }

    async enterCredentials(username: string, password: string): Promise<void> {
        await this.fill(this.usernameInput, username);
        await this.fill(this.passwordInput, password);
    }

    async clickLoginButton(): Promise<void> {
        await this.clickAndWaitForNavigation(this.loginButton);
    }

    async authenticateViaUI(username: string, password: string): Promise<void> {
        try {
            await this.enterCredentials(username, password);
            await this.clickLoginButton();
            await this.page.waitForLoadState('networkidle');
            
            console.log('Authentication successful - cookies are now available for API calls');
        } catch (error: any) {
            console.error('Authentication failed:', error.message);
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }
}
