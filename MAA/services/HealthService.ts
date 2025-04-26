import GoogleFit, { Scopes, AuthorizeOptions, StartAndEndDate } from 'react-native-google-fit';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

export interface HealthData {
    steps: number;
    heartRate: number;
    sleep: number;
    oxygenSaturation: number;
    meditation: number;
    activity: number;
}

interface StepResponse {
    date: string;
    value: number;
}

interface HeartRateResponse {
    startDate: string;
    endDate: string;
    value: number;
}

interface SleepResponse {
    startDate: string;
    endDate: string;
}

interface CalorieResponse {
    startDate: string;
    endDate: string;
    calorie: number;
}

class HealthService {
    private isAuthorized = false;
    private readonly CLIENT_ID = Constants.expoConfig?.extra?.googleFit?.clientId;

    constructor() {
        if (Platform.OS !== 'web') {
            GoogleSignin.configure({
                scopes: [
                    'https://www.googleapis.com/auth/fitness.activity.read',
                    'https://www.googleapis.com/auth/fitness.body.read',
                    'https://www.googleapis.com/auth/fitness.heart_rate.read',
                    'https://www.googleapis.com/auth/fitness.sleep.read',
                    'https://www.googleapis.com/auth/fitness.body.temperature.read',
                    'https://www.googleapis.com/auth/fitness.body.oxygen.read'
                ],
                webClientId: this.CLIENT_ID,
                offlineAccess: true
            });
        }
    }

    async requestPermissions(): Promise<boolean> {
        if (Platform.OS === 'web') {
            console.log('Native Health Service is not available on web');
            return false;
        }

        if (!this.CLIENT_ID) {
            console.error('Google Fit client ID is missing');
            return false;
        }

        try {
            console.log('Requesting Google Sign-In...');
            await GoogleSignin.signIn();
            const tokens = await GoogleSignin.getTokens();
            
            if (tokens.accessToken) {
                console.log('Successfully signed in with Google');
                this.isAuthorized = true;
                return true;
            } else {
                console.error('Failed to get access token');
                return false;
            }
        } catch (error) {
            console.error('Error requesting health permissions:', error);
            return false;
        }
    }

    async getHealthData(): Promise<Partial<HealthData>> {
        if (!this.isAuthorized || Platform.OS === 'web') {
            return {};
        }

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 1); // Last 24 hours

        try {
            const [
                steps,
                heartRate,
                sleep,
                oxygenSaturation,
                activity
            ] = await Promise.all([
                this.getSteps(startDate, endDate),
                this.getHeartRate(startDate, endDate),
                this.getSleepHours(startDate, endDate),
                this.getOxygenSaturation(startDate, endDate),
                this.getActivityMinutes(startDate, endDate)
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

    private async getSteps(startDate: Date, endDate: Date): Promise<number> {
        try {
            const options: StartAndEndDate = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            };
            const stepsData = await GoogleFit.getDailySteps(options) as StepResponse[];
            return stepsData.reduce((total, day) => total + (day.value || 0), 0);
        } catch (error) {
            console.error('Error fetching steps:', error);
            return 0;
        }
    }

    private async getHeartRate(startDate: Date, endDate: Date): Promise<number> {
        try {
            const options: StartAndEndDate = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            };
            const data = await GoogleFit.getHeartRateSamples(options) as HeartRateResponse[];
            return data.length > 0 ? Math.round(data[data.length - 1].value) : 0;
        } catch (error) {
            console.error('Error fetching heart rate:', error);
            return 0;
        }
    }

    private async getOxygenSaturation(startDate: Date, endDate: Date): Promise<number> {
        try {
            const options: StartAndEndDate = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            };
            const data = await GoogleFit.getOxygenSaturationSamples(options);
            if (data && data.length > 0) {
                // Get the most recent reading
                const latestReading = data[data.length - 1];
                console.log('Oxygen saturation data:', latestReading);
                return Math.round(latestReading.value);
            }
            console.log('No oxygen saturation data available');
            return 0;
        } catch (error) {
            console.error('Error fetching oxygen saturation:', error);
            return 0;
        }
    }

    private async getSleepHours(startDate: Date, endDate: Date): Promise<number> {
        try {
            const options: StartAndEndDate = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            };
            // Try to get sleep data from multiple sources
            const [sleepData, sleepStages] = await Promise.all([
                GoogleFit.getSleepSamples(options),
                GoogleFit.getSleepStages(options)
            ]);

            let totalMinutes = 0;

            // Calculate from sleep samples
            if (sleepData && sleepData.length > 0) {
                console.log('Sleep samples data:', sleepData);
                totalMinutes += sleepData.reduce((acc: number, curr) => {
                    return acc + (new Date(curr.endDate).getTime() - new Date(curr.startDate).getTime()) / (1000 * 60);
                }, 0);
            }

            // Add sleep stages if available
            if (sleepStages && sleepStages.length > 0) {
                console.log('Sleep stages data:', sleepStages);
                totalMinutes += sleepStages.reduce((acc: number, curr) => {
                    return acc + (new Date(curr.endDate).getTime() - new Date(curr.startDate).getTime()) / (1000 * 60);
                }, 0);
            }

            const hours = Math.round((totalMinutes / 60) * 10) / 10; // Convert to hours and round to 1 decimal
            console.log('Total sleep hours:', hours);
            return hours;
        } catch (error) {
            console.error('Error fetching sleep data:', error);
            return 0;
        }
    }

    private async getActivityMinutes(startDate: Date, endDate: Date): Promise<number> {
        try {
            const options: StartAndEndDate = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            };
            const data = await GoogleFit.getDailyCalorieSamples(options) as CalorieResponse[];
            const activeMinutes = data.reduce((acc: number, curr) => {
                // Assuming moderate to vigorous activity based on calorie burn rate
                const minutes = (new Date(curr.endDate).getTime() - new Date(curr.startDate).getTime()) / (1000 * 60);
                return acc + (curr.calorie > 3.5 ? minutes : 0); // 3.5 calories per minute is considered moderate activity
            }, 0);
            return Math.round(activeMinutes);
        } catch (error) {
            console.error('Error fetching activity data:', error);
            return 0;
        }
    }
}

export default new HealthService(); 