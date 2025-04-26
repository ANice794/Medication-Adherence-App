import axios from 'axios';
import { API_URL } from '../config';

export interface Reward {
    id: number;
    name: string;
    description: string;
    points_required: number;
    image_url: string;
}

export interface UserPoints {
    current_points: number;
    overall_points: number;
}

export interface ActiveReward extends Reward {
    redeemed_at: string;
    expiration_date: string;
}

class RewardsService {
    async getAllRewards(): Promise<Reward[]> {
        try {
            const response = await axios.get<Reward[]>(`${API_URL}/rewards`);
            return response.data;
        } catch (error) {
            console.error('Error fetching rewards:', error);
            throw error;
        }
    }

    async getOneReward(rewardId: number): Promise<Reward> {
        try {
            const response = await axios.get<Reward>(`${API_URL}/rewards/${rewardId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching reward:', error);
            throw error;
        }
    }

    async purchaseReward(patientId: string, rewardId: number): Promise<any> {
        try {
            const response = await axios.post(`${API_URL}/patients/${patientId}/rewards/${rewardId}`);
            return response.data;
        } catch (error) {
            console.error('Error purchasing reward:', error);
            throw error;
        }
    }

    async getPatientRewards(patientId: string): Promise<ActiveReward[]> {
        try {
            const response = await axios.get<ActiveReward[]>(`${API_URL}/patients/${patientId}/rewards`);
            return response.data;
        } catch (error) {
            console.error('Error fetching patient rewards:', error);
            throw error;
        }
    }

    async getUserPoints(userId: string): Promise<UserPoints> {
        try {
            const response = await axios.get<UserPoints>(`${API_URL}/patients/${userId}/points/current`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user points:', error);
            throw error;
        }
    }
}

export const rewardsService = new RewardsService(); 