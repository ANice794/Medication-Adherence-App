const axios = require('axios');

class EpicService {
    constructor() {
        this.baseUrl = process.env.EPIC_FHIR_URL;
        this.clientId = process.env.EPIC_CLIENT_ID;
        this.clientSecret = process.env.EPIC_CLIENT_SECRET;
        this.accessToken = null;
    }

    async getAccessToken() {
        try {
            const response = await axios.post(`${this.baseUrl}/oauth2/token`, {
                grant_type: 'client_credentials',
                client_id: this.clientId,
                client_secret: this.clientSecret
            });

            this.accessToken = response.data.access_token;
            return this.accessToken;
        } catch (error) {
            console.error('Error getting EPIC access token:', error);
            throw new Error('Failed to authenticate with EPIC');
        }
    }

    async createMedication(patientId, medicationData) {
        try {
            if (!this.accessToken) {
                await this.getAccessToken();
            }

            const fhirMedication = {
                resourceType: 'MedicationRequest',
                status: 'active',
                intent: 'order',
                subject: {
                    reference: `Patient/${patientId}`
                },
                medicationCodeableConcept: {
                    coding: [{
                        system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                        code: medicationData.name,
                        display: medicationData.name
                    }]
                },
                dosageInstruction: [{
                    doseAndRate: [{
                        doseQuantity: {
                            value: medicationData.dosage
                        }
                    }],
                    timing: {
                        repeat: {
                            frequency: medicationData.frequency
                        }
                    },
                    route: {
                        coding: [{
                            system: 'http://snomed.info/sct',
                            code: medicationData.route,
                            display: medicationData.route
                        }]
                    }
                }],
                authoredOn: medicationData.startDate
            };

            const response = await axios.post(
                `${this.baseUrl}/MedicationRequest`,
                fhirMedication,
                {
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return {
                id: response.data.id,
                resourceType: response.data.resourceType,
                status: response.data.status
            };
        } catch (error) {
            console.error('Error creating medication in EPIC:', error);
            throw new Error('Failed to create medication in EPIC');
        }
    }
}

module.exports = new EpicService(); 