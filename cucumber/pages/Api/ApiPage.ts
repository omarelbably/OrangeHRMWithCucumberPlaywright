import { Page, APIRequestContext } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ApiPage extends BasePage {
    private baseURL: string;
    constructor(page: Page, baseURL: string = 'https://opensource-demo.orangehrmlive.com') {
        super(page);
        this.baseURL = baseURL;
    }

    async authenticateViaAPI(username: string, password: string): Promise<void> {
        // Step 1: Get CSRF token from the login page
        const loginPageResp = await this.request.get(`${this.baseURL}/web/index.php/auth/login`);
        if (!loginPageResp.ok()) {
            throw new Error(`Failed to load login page: ${loginPageResp.status()} ${loginPageResp.statusText()}`);
        }

        const html = await loginPageResp.text();

        const tokenMatch = html.match(/:token=\"&quot;([^\"]+)&quot;\"/);
        const csrfToken = tokenMatch?.[1];

        if (!csrfToken) {
            throw new Error('CSRF token not found on login page');
        }

        const loginResp = await this.request.post(
            `${this.baseURL}/web/index.php/auth/validate`,
            {
                form: {
                    _token: csrfToken,
                    username,
                    password,
                },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            }
        );

        const status = loginResp.status();
        if (![200, 302].includes(status)) {
            const body = await loginResp.text();
            throw new Error(`API login failed: ${status} ${loginResp.statusText()} - ${body}`);
        }

        const verifyResp = await this.request.get(`${this.baseURL}/web/index.php/dashboard/index`);
        if (!verifyResp.ok()) {
            throw new Error(`Login verification failed: ${verifyResp.status()} ${verifyResp.statusText()}`);
        }

        await this.page.goto(`${this.baseURL}/web/index.php/dashboard/index`);
    }

    async authenticateViaUI(username: string, password: string): Promise<void> {
        try {
            await this.page.goto(`${this.baseURL}/web/index.php/auth/login`);
            await this.page.fill('input[name="username"]', username);
            await this.page.fill('input[name="password"]', password);
            await this.page.click('button[type="submit"]');
            await this.page.waitForLoadState('networkidle');

            console.log('Authentication successful - cookies are now available for API calls');
        } catch (error: any) {
            console.error('Authentication failed:', error.message);
            throw new Error(`Authentication failed: ${error.message}`);
        }
    }

    async addCandidate(candidateData: {
        firstName: string;
        middleName?: string;
        lastName: string;
        email: string;
        contactNumber?: string;
        keywords?: string;
        comment?: string;
    }): Promise<any> {
        try {
            const payload = {
                firstName: candidateData.firstName,
                middleName: candidateData.middleName || '',
                lastName: candidateData.lastName,
                email: candidateData.email,
                contactNumber: candidateData.contactNumber || '',
                keywords: candidateData.keywords || '',
                comment: candidateData.comment || '',
                dateOfApplication: new Date().toISOString().split('T')[0],
            };

            const response = await this.request.post(
                `${this.baseURL}/web/index.php/api/v2/recruitment/candidates`,
                {
                    data: payload,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok()) {
                const errorBody = await response.text();
                console.error('Failed to add candidate:', errorBody);
                throw new Error(`Failed to add candidate: ${response.status()} ${response.statusText()}`);
            }

            const responseData = await response.json();
            console.log('Candidate added successfully:', responseData);
            return responseData;
        } catch (error: any) {
            console.error('Failed to add candidate:', error.message);
            throw new Error(`Failed to add candidate: ${error.message}`);
        }
    }

    async getCandidates(): Promise<any> {
        try {
            const response = await this.request.get(
                `${this.baseURL}/web/index.php/api/v2/recruitment/candidates`,
                {
                    params: {
                        limit: 50,
                        offset: 0,
                    },
                }
            );

            if (!response.ok()) {
                const errorBody = await response.text();
                console.error('Failed to get candidates:', errorBody);
                throw new Error(`Failed to get candidates: ${response.status()} ${response.statusText()}`);
            }

            const responseData = await response.json();
            console.log('Candidates retrieved successfully');
            return responseData;
        } catch (error: any) {
            console.error('Failed to get candidates:', error.message);
            throw new Error(`Failed to get candidates: ${error.message}`);
        }
    }

    async deleteCandidate(candidateId: number | string): Promise<void> {
        try {
            const response = await this.request.delete(
                `${this.baseURL}/web/index.php/api/v2/recruitment/candidates`,
                {
                    data: {
                        ids: [candidateId],
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok()) {
                const errorBody = await response.text();
                console.error('Failed to delete candidate:', errorBody);
                throw new Error(`Failed to delete candidate: ${response.status()} ${response.statusText()}`);
            }

            const responseData = await response.json();
            console.log('Candidate deleted successfully:', responseData);
        } catch (error: any) {
            console.error('Failed to delete candidate:', error.message);
            throw new Error(`Failed to delete candidate: ${error.message}`);
        }
    }

    async deleteCandidates(candidateIds: number[]): Promise<void> {
        try {
            const response = await this.request.delete(
                `${this.baseURL}/web/index.php/api/v2/recruitment/candidates`,
                {
                    data: {
                        ids: candidateIds,
                    },
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (!response.ok()) {
                const errorBody = await response.text();
                console.error('Failed to delete candidates:', errorBody);
                throw new Error(`Failed to delete candidates: ${response.status()} ${response.statusText()}`);
            }

            const responseData = await response.json();
            console.log('Candidates deleted successfully:', responseData);
        } catch (error: any) {
            console.error('Failed to delete candidates:', error.message);
            throw new Error(`Failed to delete candidates: ${error.message}`);
        }
    }

    async findCandidateByName(firstName: string, lastName: string): Promise<any> {
        try {
            const candidates = await this.getCandidates();

            if (candidates && candidates.data) {
                const found = candidates.data.find((candidate: any) =>
                    candidate.firstName === firstName && candidate.lastName === lastName
                );

                if (found) {
                    console.log('Candidate found:', found);
                    return found;
                }
            }

            console.log('Candidate not found');
            return null;
        } catch (error: any) {
            console.error('Failed to find candidate:', error.message);
            throw new Error(`Failed to find candidate: ${error.message}`);
        }
    }
}
