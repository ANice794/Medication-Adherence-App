import axios from 'axios';

const EPIC_SANDBOX_URL = 'https://fhir.epic.com/interconnect-fhir-oauth';
const EPIC_CLIENT_ID = process.env.EPIC_CLIENT_ID;
const EPIC_CLIENT_SECRET = process.env.EPIC_CLIENT_SECRET;

interface EpicToken {
    access_token: string;
    token_type: string;
    expires_in: number;
}

interface EpicMedication {
    resourceType: string;
    id: string;
    meta: {
        versionId: string;
        lastUpdated: string;
    };
    status: string;
    intent: string;
    medicationReference: {
        reference: string;
    };
    subject: {
        reference: string;
    };
    dosageInstruction: Array<{
        sequence: number;
        text: string;
        timing: {
            code: {
                text: string;
            };
        };
        route: {
            coding: Array<{
                system: string;
                code: string;
                display: string;
            }>;
        };
        doseAndRate: Array<{
            doseQuantity: {
                value: number;
                unit: string;
            };
        }>;
    }>;
}

class EpicService {
    private static instance: EpicService;
    private accessToken: string | null = null;
    private tokenExpiry: number | null = null;

    private constructor() {}

    public static getInstance(): EpicService {
        if (!EpicService.instance) {
            EpicService.instance = new EpicService();
        }
        return EpicService.instance;
    }

    private async getAccessToken(): Promise<string> {
        if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
            return this.accessToken;
        }

        try {
            const response = await axios.post<EpicToken>(
                `${EPIC_SANDBOX_URL}/oauth2/token`,
                {
                    grant_type: 'client_credentials',
                    client_id: EPIC_CLIENT_ID,
                    client_secret: EPIC_CLIENT_SECRET,
                },
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            this.accessToken = response.data.access_token;
            this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
            return this.accessToken;
        } catch (error) {
            console.error('Error getting EPIC access token:', error);
            throw new Error('Failed to authenticate with EPIC');
        }
    }

    public async searchMedications(query: string): Promise<EpicMedication[]> {
        try {
            const token = await this.getAccessToken();
            const response = await axios.get<{ entry: Array<{ resource: EpicMedication }> }>(
                `${EPIC_SANDBOX_URL}/MedicationRequest`,
                {
                    params: {
                        patient: query,
                        _count: 50,
                    },
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data.entry.map(entry => entry.resource);
        } catch (error) {
            console.error('Error searching EPIC medications:', error);
            throw new Error('Failed to search EPIC medications');
        }
    }

    public async getMedicationDetails(medicationId: string): Promise<EpicMedication> {
        try {
            const token = await this.getAccessToken();
            const response = await axios.get<EpicMedication>(
                `${EPIC_SANDBOX_URL}/MedicationRequest/${medicationId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error getting EPIC medication details:', error);
            throw new Error('Failed to get EPIC medication details');
        }
    }

    public async createMedication(patientId: string, medicationData: {
        name: string;
        dosage: string;
        frequency: string;
        route: string;
        startDate: string;
    }): Promise<EpicMedication> {
        try {
            const token = await this.getAccessToken();
            const response = await axios.post<EpicMedication>(
                `${EPIC_SANDBOX_URL}/MedicationRequest`,
                {
                    resourceType: 'MedicationRequest',
                    status: 'active',
                    intent: 'order',
                    subject: {
                        reference: `Patient/${patientId}`,
                    },
                    medicationReference: {
                        reference: `Medication/${medicationData.name}`,
                    },
                    dosageInstruction: [{
                        sequence: 1,
                        text: `${medicationData.dosage} ${medicationData.frequency}`,
                        timing: {
                            code: {
                                text: medicationData.frequency,
                            },
                        },
                        route: {
                            coding: [{
                                system: 'http://snomed.info/sct',
                                code: this.getRouteCode(medicationData.route),
                                display: medicationData.route,
                            }],
                        },
                        doseAndRate: [{
                            doseQuantity: {
                                value: parseFloat(medicationData.dosage),
                                unit: this.getDosageUnit(medicationData.dosage),
                            },
                        }],
                    }],
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error creating EPIC medication:', error);
            throw new Error('Failed to create EPIC medication');
        }
    }

    private getRouteCode(route: string): string {
        const routeMap: { [key: string]: string } = {
            'oral': '34206005',
            'subcutaneous': '34206005',
            'intramuscular': '78421000',
            'intravenous': '47625008',
            'topical': '34206005',
            'inhaled': '34206005',
        };
        return routeMap[route.toLowerCase()] || '34206005';
    }

    private getDosageUnit(dosage: string): string {
        if (dosage.toLowerCase().includes('mg')) return 'mg';
        if (dosage.toLowerCase().includes('ml')) return 'mL';
        if (dosage.toLowerCase().includes('g')) return 'g';
        return 'mg';
    }
}

export const epicService = EpicService.getInstance(); 