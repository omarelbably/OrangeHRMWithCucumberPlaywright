import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ApiPage } from '../../pages/Api/CandidateModule';

let apiPage: ApiPage;
let candidateId: number;
let candidateData: any;

When('user logins via API with username {string} and password {string}', async function (username: string, password: string) {
    apiPage = new ApiPage(this.page);
    await apiPage.authenticateViaAPI(username, password);
});

When('user adds a candidate via API with the following details:', async function (dataTable: any) {
    const data = dataTable.rowsHash();
    const candidate = {
        firstName: data['First Name'],
        middleName: data['Middle Name'] || '',
        lastName: data['Last Name'],
        email: data['Email'],
        contactNumber: data['Contact Number'] || '',
        keywords: data['Keywords'] || '',
        comment: data['Comment'] || '',
    };

    const response = await apiPage.addCandidate(candidate);
    
    if (response && response.data) {
        candidateData = response.data;
        candidateId = response.data.id;
    }
});

Then('the candidate should be created successfully via API', async function () {
    expect(candidateData).toBeDefined();
    expect(candidateId).toBeGreaterThan(0);
    console.log(`Candidate created with ID: ${candidateId}`);
});

When('user retrieves the candidate list via API', async function () {
    const response = await apiPage.getCandidates();
    expect(response).toBeDefined();
    expect(response.data).toBeDefined();
    console.log(`total number of candidates: ${response.data.length}`);
});

When('user finds the candidate with first name {string} and last name {string} via API', async function (firstName: string, lastName: string) {
    const candidate = await apiPage.findCandidateByName(firstName, lastName);
    
    if (candidate) {
        candidateId = candidate.id;
        candidateData = candidate;
    }
    
    expect(candidate).toBeDefined();
    console.info(`Found candidate with ID: ${candidateId}`);
});

When('user deletes the candidate via API', async function () {
    expect(candidateId).toBeDefined();
    await apiPage.deleteCandidate(candidateId);
});

Then('the candidate should be deleted successfully via API', async function () {
    const candidates = await apiPage.getCandidates();
    
    const stillExists = candidates.data.find((c: any) => c.id === candidateId);
    expect(stillExists).toBeUndefined();
    console.info(`Candidate with ID ${candidateId} has been deleted`);
});

Then('the candidate with first name {string} and last name {string} should not exist in the system', async function (firstName: string, lastName: string) {
    const candidate = await apiPage.findCandidateByName(firstName, lastName);
    expect(candidate).toBeNull();
    console.info(`Candidate with first name ${firstName} and last name ${lastName} does not exist in the system`);
});
