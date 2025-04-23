import { Platform } from 'react-native';

declare global {
    interface Window {
        gapi: any;
        google: any;
    }
}

export interface HealthData {
    steps: number;
    heartRate: number;
    sleep: number;
    oxygenSaturation: number;
    meditation: number;
    activity: number;
}

class WebHealthService {
    private isAuthorized = false;
    private accessToken: string | null = null;
    private readonly API_KEY = process.env.EXPO_PUBLIC_GOOGLE_FIT_API_KEY;
    private readonly CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;
    private readonly SCOPES = [
        'https://www.googleapis.com/auth/fitness.activity.read',
        'https://www.googleapis.com/auth/fitness.heart_rate.read',
        'https://www.googleapis.com/auth/fitness.sleep.read',
        'https://www.googleapis.com/auth/fitness.body.read'
    ].join(' ');

    async requestPermissions(): Promise<boolean> {
        if (Platform.OS !== 'web') {
            console.log('Web health service is only available on web platforms');
            return false;
        }

        try {
            // Load both required scripts
            await Promise.all([
                this.loadScript('https://apis.google.com/js/platform.js'),
                this.loadScript('https://accounts.google.com/gsi/client')
            ]);

            // Initialize the client
            await this.initializeGoogleSignIn();
            
            // Sign in the user
            const result = await new Promise((resolve, reject) => {
                window.google.accounts.oauth2.initTokenClient({
                    client_id: this.CLIENT_ID,
                    scope: this.SCOPES,
                    callback: (response: any) => {
                        if (response.access_token) {
                            this.accessToken = response.access_token;
                            this.isAuthorized = true;
                            resolve(true);
                        } else {
                            reject(new Error('Failed to get access token'));
                        }
                    },
                }).requestAccessToken();
            });

            return result as boolean;
        } catch (error) {
            console.error('Error requesting health permissions:', error);
            return false;
        }
    }

    private loadScript(src: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
            document.body.appendChild(script);
        });
    }

    private async initializeGoogleSignIn(): Promise<void> {
        return new Promise((resolve) => {
            if (window.google?.accounts) {
                resolve();
                return;
            }
            
            const checkGoogleExists = setInterval(() => {
                if (window.google?.accounts) {
                    clearInterval(checkGoogleExists);
                    resolve();
                }
            }, 100);

            // Set a timeout to prevent infinite checking
            setTimeout(() => {
                clearInterval(checkGoogleExists);
                resolve();
            }, 10000);
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
                activity
            ] = await Promise.all([
                this.getSteps(startTimeMillis, endTimeMillis),
                this.getHeartRate(startTimeMillis, endTimeMillis),
                this.getSleepHours(startTimeMillis, endTimeMillis),
                this.getActivityMinutes(startTimeMillis, endTimeMillis)
            ]);

            return {
                steps,
                heartRate,
                sleep,
                oxygenSaturation: 0, // Not available in Google Fit
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
            return Math.round((sleepMinutes / 60) * 10) / 10; // Convert to hours and round to 1 decimal
        } catch (error) {
            console.error('Error fetching sleep data:', error);
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