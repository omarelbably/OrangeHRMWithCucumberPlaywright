import { Given, When, Then } from '@cucumber/cucumber';
import { BasePage } from '../pages/BasePage';

let basePage: BasePage;

Given('user navigates to {string}', async function (url: string) {
    basePage = new BasePage(this.page);
    await basePage.navigateTo(url);
});