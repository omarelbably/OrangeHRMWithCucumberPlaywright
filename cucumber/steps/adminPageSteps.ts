import { Given, When, Then } from '@cucumber/cucumber';
import { AdminPage } from '../pages/AdminPage';
import { BasePage } from '../pages/BasePage';
import { expect } from '@playwright/test';

let adminPage: AdminPage;

When('get the total number of records found', async function () {
    adminPage = new AdminPage(this.page);
    BasePage.recordsCount = await adminPage.getTotalRecordsCount();
    console.log(`Total Records Found: ${BasePage.recordsCount}`);
});

When('user clicks on add employee button', async function () {
    await adminPage.clickOnAddEmployeeButton();
});

Then('verify that the new record is increased by 1 or more', async function () {
    await this.page.waitForURL("https://opensource-demo.orangehrmlive.com/web/index.php/admin/viewSystemUsers");
    const newRecordsCount = await adminPage.getTotalRecordsCount();
    console.log(`New Total Records Found: ${newRecordsCount}`);
    if (newRecordsCount !== BasePage.recordsCount + 1) {
        console.error(`Expected ${BasePage.recordsCount + 1} records, but found ${newRecordsCount}`);
    }
    expect(newRecordsCount).toBeGreaterThan(BasePage.recordsCount);
});
When('user searches for employee with username {string}', async function (username: string) {
    await adminPage.clickOnSystemUsersDropdownButton();
    await adminPage.enterUsernameInSearchField(username);
    await adminPage.clickOnSearchButton();
});

When('user deletes the employee record', async function () {
    const isRecordPresent = await adminPage.isRecordWithUsernamePresent('OmarElbably');
    if (isRecordPresent) {
        await adminPage.clickOnDeleteRecordButton();
    } else {
        console.error('Record with the specified username not found.');
    }
});

Then('verify that the new record is decreased by 1 or more', async function () {
    await adminPage.clickOnResetSearchButton();
    const newRecordsCount = await adminPage.getTotalRecordsCount();
    if (newRecordsCount !== BasePage.recordsCount) {
        console.error(`Expected ${BasePage.recordsCount} records, but found ${newRecordsCount}`);
    }
    expect(newRecordsCount).toBeGreaterThanOrEqual(BasePage.recordsCount);
});

