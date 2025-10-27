import { When } from '@cucumber/cucumber';
import { AddEmployeePage } from '../pages/AddEmployeePage';

let addEmployeePage: AddEmployeePage;

When('user fill in the new employee details with the following data:', async function (dataTable: any) {
    const data = dataTable.rowsHash();
    addEmployeePage = new AddEmployeePage(this.page);
    await addEmployeePage.enterUserDetails(
        data['userRole'],
        data['employeeName'],
        data['status'],
        data['username'],
        data['password']
    );
});

When('user clicks on save button', async function () {
    await addEmployeePage.clickSaveButton();
});

