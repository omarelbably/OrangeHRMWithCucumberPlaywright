import { Page, APIRequestContext } from '@playwright/test';
import { BasePage } from '../BasePage';

export class ApiPage extends BasePage{
    private baseURL: string;
    constructor(page: Page, baseURL: string = 'https://opensource-demo.orangehrmlive.com') {
        super(page);
        this.baseURL = baseURL;
    }

    /**
     * Authenticate via UI to establish session
     * This automatically sets up cookies for API calls
     */
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

    /**
     * Add a candidate through API
     */
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

    /**
     * Get all candidates
     */
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

    /**
     * Delete a candidate by ID
     */
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

    /**
     * Delete multiple candidates by IDs
     */
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

    /**
     * Find candidate by name
     */
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
