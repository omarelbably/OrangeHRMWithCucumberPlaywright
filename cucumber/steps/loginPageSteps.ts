import { Given, When, Then } from '@cucumber/cucumber';
import { LoginPage } from '../pages/LoginPage';

let loginPage: LoginPage;

When('user enters username {string} and password {string}', async function (username: string, password: string) {
    loginPage = new LoginPage(this.page);
    await loginPage.enterCredentials(username, password);
});

When('user clicks on the login button', async function () {
    await loginPage.clickLoginButton();
});

