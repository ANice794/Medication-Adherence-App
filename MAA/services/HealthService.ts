import GoogleFit, { Scopes, AuthorizeOptions, StartAndEndDate } from 'react-native-google-fit';
import { Platform } from 'react-native';

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

    async requestPermissions(): Promise<boolean> {
        if (Platform.OS !== 'android') {
            console.log('Google Fit is only available on Android');
            return false;
        }

        try {
            const options: AuthorizeOptions = {
                scopes: [
                    Scopes.FITNESS_ACTIVITY_READ,
                    Scopes.FITNESS_BODY_READ,
                    Scopes.FITNESS_HEART_RATE_READ,
                    Scopes.FITNESS_SLEEP_READ,
                    Scopes.FITNESS_BODY_TEMPERATURE_READ,
                ],
            };
            const response = await GoogleFit.authorize(options);
            this.isAuthorized = response.success;
            return response.success;
        } catch (error) {
            console.error('Error requesting health permissions:', error);
            return false;
        }
    }

    async getHealthData(): Promise<Partial<HealthData>> {
        if (!this.isAuthorized || Platform.OS !== 'android') {
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
                activity
            ] = await Promise.all([
                this.getSteps(startDate, endDate),
                this.getHeartRate(startDate, endDate),
                this.getSleepHours(startDate, endDate),
                this.getActivityMinutes(startDate, endDate)
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

    private async getSleepHours(startDate: Date, endDate: Date): Promise<number> {
        try {
            const options: StartAndEndDate = {
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
            };
            const sleepData = await GoogleFit.getSleepSamples(options) as SleepResponse[];
            const totalMinutes = sleepData.reduce((acc: number, curr) => {
                return acc + (new Date(curr.endDate).getTime() - new Date(curr.startDate).getTime()) / (1000 * 60);
            }, 0);
            return Math.round(totalMinutes / 60 * 10) / 10; // Round to 1 decimal place
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