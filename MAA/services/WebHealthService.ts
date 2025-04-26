import { Platform } from 'react-native';
import Constants from 'expo-constants';

declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}

interface SleepSampleResponse {
    startDate: string;
    endDate: string;
    value: number;
}

export interface HealthData {
    steps: number;
    heartRate: number;
    sleep: number;
    oxygenSaturation: number;
    meditation: number;
    activity: number;
}

interface SleepData {
    startTimeMillis: string;
    endTimeMillis: string;
    value: number;
}

class WebHealthService {
    private isAuthorized = false;
    private accessToken: string | null = null;
    private readonly API_KEY = Constants.expoConfig?.extra?.googleFit?.apiKey;
    private readonly CLIENT_ID = Constants.expoConfig?.extra?.googleFit?.clientId;
    private readonly SCOPES = [
        'https://www.googleapis.com/auth/fitness.activity.read',
        'https://www.googleapis.com/auth/fitness.body.read',
        'https://www.googleapis.com/auth/fitness.heart_rate.read',
        'https://www.googleapis.com/auth/fitness.sleep.read'
    ].join(' ');

    constructor() {
        if (Platform.OS === 'web') {
            console.log('Initializing WebHealthService with:', {
                apiKey: this.API_KEY,
                clientId: this.CLIENT_ID
            });
            this.initializeGoogleFit();
        }
    }

    async requestPermissions(): Promise<boolean> {
        if (Platform.OS !== 'web') {
            console.log('Web Health Service is only available on web');
            return false;
        }

        if (!this.API_KEY || !this.CLIENT_ID) {
            console.error('Google Fit configuration missing:', {
                apiKey: this.API_KEY,
                clientId: this.CLIENT_ID,
                config: Constants.expoConfig?.extra?.googleFit
            });
            return false;
        }

        try {
            await this.initializeGoogleFit();
            const client = window.google.accounts.oauth2.initTokenClient({
                client_id: this.CLIENT_ID,
                scope: this.SCOPES,
                callback: (tokenResponse: any) => {
                    if (tokenResponse && tokenResponse.access_token) {
                        this.accessToken = tokenResponse.access_token;
                        this.isAuthorized = true;
                        console.log('Successfully authorized with Google Fit');
                    }
                },
            });

            return new Promise((resolve) => {
                client.requestAccessToken();
                const checkAuth = setInterval(() => {
                    if (this.isAuthorized) {
                        clearInterval(checkAuth);
                        resolve(true);
                    }
                }, 100);

                // Timeout after 30 seconds
                setTimeout(() => {
                    clearInterval(checkAuth);
                    resolve(false);
                }, 30000);
            });
        } catch (error) {
            console.error('Error requesting health permissions:', error);
            return false;
        }
    }

    private async initializeGoogleFit(): Promise<void> {
        if (!window.gapi) {
            await this.loadScript('https://apis.google.com/js/api.js');
        }
        if (!window.google) {
            await this.loadScript('https://accounts.google.com/gsi/client');
        }
    }

    private loadScript(src: string): Promise<void> {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.body.appendChild(script);
        });
    }

    async getHealthData(): Promise<Partial<HealthData>> {
        if (!this.isAuthorized || !this.accessToken || Platform.OS !== 'web') {
            return {};
        }

        const endTimeMillis = Date.now();
        const startTimeMillis = endTimeMillis - (24 * 60 * 60 * 1000); // Last 24 hours

        try {
            const [
                steps,
                heartRate,
                sleep,
                oxygenSaturation,
                activity
            ] = await Promise.all([
                this.getSteps(startTimeMillis, endTimeMillis),
                this.getHeartRate(startTimeMillis, endTimeMillis),
                this.getSleepHours(startTimeMillis, endTimeMillis),
                this.getOxygenSaturation(startTimeMillis, endTimeMillis),
                this.getActivityMinutes(startTimeMillis, endTimeMillis)
            ]);

            return {
                steps,
                heartRate,
                sleep,
                oxygenSaturation,
                meditation: 0, // Not available in Google Fit
                activity
            };
        } catch (error) {
            console.error('Error fetching health data:', error);
            return {};
        }
    }

    private async getSteps(startTimeMillis: number, endTimeMillis: number): Promise<number> {
        try {
            const response = await fetch(
                `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        aggregateBy: [{
                            dataTypeName: "com.google.step_count.delta",
                            dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
                        }],
                        bucketByTime: { durationMillis: 86400000 },
                        startTimeMillis,
                        endTimeMillis
                    })
                }
            );

            const data = await response.json();
            return data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
        } catch (error) {
            console.error('Error fetching steps:', error);
            return 0;
        }
    }

    private async getHeartRate(startTimeMillis: number, endTimeMillis: number): Promise<number> {
        try {
            const response = await fetch(
                `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        aggregateBy: [{
                            dataTypeName: "com.google.heart_rate.bpm",
                            dataSourceId: "derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm"
                        }],
                        bucketByTime: { durationMillis: 86400000 },
                        startTimeMillis,
                        endTimeMillis
                    })
                }
            );

            const data = await response.json();
            return data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0;
        } catch (error) {
            console.error('Error fetching heart rate:', error);
            return 0;
        }
    }

    private async getSleepHours(startTimeMillis: number, endTimeMillis: number): Promise<number> {
        try {
            if (!this.accessToken) {
                console.error('Not authorized to access Google Fit data');
                return 0;
            }

            const response = await fetch(
                'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        aggregateBy: [{
                            dataTypeName: "com.google.sleep.segment",
                            dataSourceId: "derived:com.google.sleep.segment:com.google.android.gms:merge_sleep_segments"
                        }],
                        bucketByTime: { durationMillis: 86400000 },
                        startTimeMillis,
                        endTimeMillis
                    })
                }
            );

            const data = await response.json();
            const sleepMinutes = data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
            const hours = Math.round((sleepMinutes / 60) * 10) / 10; // Convert to hours and round to 1 decimal
            console.log('Total web sleep hours:', hours);
            return hours;
        } catch (error) {
            console.error('Error fetching web sleep data:', error);
            return 0;
        }
    }

    private async getOxygenSaturation(startTimeMillis: number, endTimeMillis: number): Promise<number> {
        try {
            if (!this.accessToken) {
                console.error('Not authorized to access Google Fit data');
                return 0;
            }

            const response = await fetch(
                'https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        aggregateBy: [{
                            dataTypeName: "com.google.oxygen_saturation",
                            dataSourceId: "derived:com.google.oxygen_saturation:com.google.android.gms:merge_oxygen_saturation"
                        }],
                        bucketByTime: { durationMillis: 86400000 },
                        startTimeMillis,
                        endTimeMillis
                    })
                }
            );

            const data = await response.json();
            const oxygenValue = data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.fpVal || 0;
            console.log('Web oxygen saturation data:', oxygenValue);
            return Math.round(oxygenValue);
        } catch (error) {
            console.error('Error fetching web oxygen saturation:', error);
            return 0;
        }
    }

    private async getActivityMinutes(startTimeMillis: number, endTimeMillis: number): Promise<number> {
        try {
            const response = await fetch(
                `https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        aggregateBy: [{
                            dataTypeName: "com.google.activity.segment",
                            dataSourceId: "derived:com.google.activity.segment:com.google.android.gms:merge_activity_segments"
                        }],
                        bucketByTime: { durationMillis: 86400000 },
                        startTimeMillis,
                        endTimeMillis
                    })
                }
            );

            const data = await response.json();
            const activeMinutes = data.bucket?.[0]?.dataset?.[0]?.point?.[0]?.value?.[0]?.intVal || 0;
            return Math.round(activeMinutes / 60000); // Convert milliseconds to minutes
        } catch (error) {
            console.error('Error fetching activity data:', error);
            return 0;
        }
    }
}

export default new WebHealthService(); 