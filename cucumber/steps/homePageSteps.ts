import { Given, When, Then } from '@cucumber/cucumber';
import { HomePage } from '../pages/HomePage';

let homePage: HomePage;

When('user clicks on the side menu button', async function () {
    homePage = new HomePage(this.page);
    await homePage.clickOnSideMenuButton();
});

When('user clicks on the admin page button', async function () {
    await homePage.clickOnAdminPageButton();
});

