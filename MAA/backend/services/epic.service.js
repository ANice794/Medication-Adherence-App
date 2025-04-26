const axios = require('axios');

class EpicService {
    constructor() {
        this.baseUrl = process.env.EPIC_API_URL;
        this.clientId = process.env.EPIC_CLIENT_ID;
        this.clientSecret = process.env.EPIC_CLIENT_SECRET;
        this.accessToken = null;
        this.tokenExpiry = null;
    }

    async getAccessToken() {
        // Check if we have a valid token
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const response = await axios.post(`${this.baseUrl}/oauth2/token`, {
                grant_type: 'client_credentials',
                client_id: this.clientId,
                client_secret: this.clientSecret
            });

            this.accessToken = response.data.access_token;
            // Set token expiry to 1 hour before actual expiry for safety
            this.tokenExpiry = Date.now() + (response.data.expires_in - 3600) * 1000;
            
            return this.accessToken;
        } catch (error) {
            console.error('Error getting EPIC access token:', error);
            throw new Error('Failed to authenticate with EPIC');
        }
    }

    async createMedication(medicationData) {
        try {
            const token = await this.getAccessToken();
            
            const response = await axios.post(
                `${this.baseUrl}/api/FHIR/R4/MedicationRequest`,
                {
                    resourceType: 'MedicationRequest',
                    status: 'active',
                    intent: 'order',
                    medicationCodeableConcept: {
                        coding: [{
                            system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                            code: medicationData.name,
                            display: medicationData.name
                        }]
                    },
                    subject: {
                        reference: `Patient/${medicationData.patientId}`
                    },
                    dosageInstruction: [{
                        text: `${medicationData.dosage} ${medicationData.frequency}`,
                        route: {
                            coding: [{
                                system: 'http://snomed.info/sct',
                                code: medicationData.route,
                                display: medicationData.route
                            }]
                        }
                    }],
                    authoredOn: medicationData.startDate
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error creating medication in EPIC:', error);
            throw new Error('Failed to create medication in EPIC');
        }
    }

    getRouteCode(route) {
        // Map common routes to SNOMED CT codes
        const routeMap = {
            'oral': '34206005',
            'intravenous': '34206005',
            'subcutaneous': '34206005',
            'intramuscular': '34206005',
            'topical': '34206005',
            'inhaled': '34206005'
        };
        return routeMap[route.toLowerCase()] || '34206005';
    }
}

module.exports = new EpicService(); 