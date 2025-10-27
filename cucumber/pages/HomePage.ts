
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
    private sideMenuBtn: string;
    private adminPageBtn: string;

    constructor(page: Page) {
        super(page);
        
        this.sideMenuBtn = 'i[class="oxd-icon bi-x oxd-sidepanel-header-close"]';
        this.adminPageBtn = '[href="/web/index.php/admin/viewAdminModule"]';
    }

    async clickOnSideMenuButton(): Promise<void> {
        if (await this.page.isVisible(this.sideMenuBtn)) {
            await this.clickAndWaitForNavigation(this.sideMenuBtn);
        }else{
            console.info("Side menu is already closed.");
        }
    }
    async clickOnAdminPageButton(): Promise<void> {
        await this.clickAndWaitForNavigation(this.adminPageBtn);
    }
}
