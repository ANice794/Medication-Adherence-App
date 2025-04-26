import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from "expo-router";
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { rewardsService, ActiveReward } from '../../../services/rewardsService';

interface Reminder {
    id: string;
    user_id: string;
    medication_name: string;
    dosage: string;
    schedule_time: string;
    frequency: string;
    start_date: string;
    end_date: string;
}

interface UserStats {
    current_points: number;
    overall_points: number;
    streak: number;
    rank: string;
    overall_rank: number;
}

interface PointsResponse {
    current_points: number;
    overall_points: number;
}

interface AdherenceData {
    id: string;
    user_id: string;
    reminder_id: string;
    schedule_for: string;
    points_awarded: number;
    taken: boolean;
}

export default function Home() {
    const router = useRouter();
    const { id, firstName } = useUser();
    const [reminders, setReminders] = useState<Reminder[]>([]);
    const [todayReminders, setTodayReminders] = useState<Reminder[]>([]);
    const [activeRewards, setActiveRewards] = useState<ActiveReward[]>([]);
    const [userStats, setUserStats] = useState<UserStats>({
        current_points: 0,
        overall_points: 0,
        streak: 0,
        rank: 'Beginner',
        overall_rank: 0
    });
    const [loading, setLoading] = useState(false);
    const [takenReminders, setTakenReminders] = useState<Set<string>>(new Set());

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) {
            return 'Good Morning';
        } else if (hour < 17) {
            return 'Good Afternoon';
        } else {
            return 'Good Evening';
        }
    };

    useEffect(() => {
        if (id === 0) return; // Don't fetch if user ID is not loaded
        fetchReminders();
        fetchUserStats();
        fetchActiveRewards();
    }, [id]); // Add id as a dependency

    const filterTodayReminders = (allReminders: Reminder[]) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        console.log('Filtering reminders for today:', today);
        console.log('All reminders:', allReminders);
        
        const filtered = allReminders
            .filter(reminder => {
                const startDate = new Date(reminder.start_date);
                const endDate = new Date(reminder.end_date);
                startDate.setHours(0, 0, 0, 0);
                endDate.setHours(0, 0, 0, 0);
                
                console.log('Checking reminder:', reminder.medication_name);
                console.log('Start date:', startDate);
                console.log('End date:', endDate);
                
                const isToday = startDate <= today && today <= endDate;
                console.log('Is today?', isToday);
                return isToday;
            })
            .sort((a, b) => {
                const timeA = a.schedule_time;
                const timeB = b.schedule_time;
                return timeA.localeCompare(timeB);
            });
            
        console.log('Filtered reminders:', filtered);
        return filtered;
    };

    const fetchReminders = async () => {
        try {
            setLoading(true);
            console.log('Fetching reminders for user:', id);
            const response = await axios.get<Reminder[]>(`http://localhost:3000/patients/${id}/reminders`);
            console.log('API Response:', response.data);
            
            setReminders(response.data);
            
            // Filter and set today's reminders
            const todayRems = filterTodayReminders(response.data);
            console.log('Setting today reminders:', todayRems);
            setTodayReminders(todayRems);
            
            // Fetch adherence data to see which reminders are already marked as taken
            const adherenceResponse = await axios.get<AdherenceData | AdherenceData[]>(`http://localhost:3000/patients/${id}/adherence`);
            console.log('Adherence data:', adherenceResponse.data);
            
            // Handle both array and single object responses
            const adherenceArray = Array.isArray(adherenceResponse.data) 
                ? adherenceResponse.data 
                : [adherenceResponse.data];
            
            const takenReminderIds = new Set(
                adherenceArray
                    .filter(record => record && record.taken)
                    .map(record => record.reminder_id)
            );
            
            console.log('Taken reminder IDs:', takenReminderIds);
            setTakenReminders(takenReminderIds);
        } catch (error) {
            console.error('Error fetching reminders:', error);
            setReminders([]); // Set empty array on error
            setTodayReminders([]); // Set empty array for today's reminders
        } finally {
            setLoading(false);
        }
    };

    const fetchActiveRewards = async () => {
        try {
            const rewards = await rewardsService.getPatientRewards(id.toString());
            setActiveRewards(rewards);
        } catch (error) {
            console.error('Error fetching active rewards:', error);
        }
    };

    const fetchUserStats = async () => {
        try {
            // First try to get points, this will create a tracker if it doesn't exist
            const pointsResponse = await axios.get<PointsResponse>(`http://localhost:3000/patients/${id}/points/current`);
            
            // If we don't get points data, create a new points tracker
            if (!pointsResponse.data || !pointsResponse.data.current_points) {
                console.log('No points data found, creating new points tracker');
                await axios.post(`http://localhost:3000/patients/${id}/points`);
                // Fetch points again after creating tracker
                const newPointsResponse = await axios.get<PointsResponse>(`http://localhost:3000/patients/${id}/points/current`);
                if (newPointsResponse.data) {
                    pointsResponse.data = newPointsResponse.data;
                }
            }

            const adherenceResponse = await axios.get<AdherenceData[]>(`http://localhost:3000/patients/${id}/adherence`);
            
            // Calculate streak based on adherence data
            const streak = calculateStreak(adherenceResponse.data);
            
            // Calculate rank based on overall points
            const rank = calculateRank(pointsResponse.data.overall_points || 0);
            
            // Fetch overall rank 
            const rankResponse = await axios.get<{ overall_rank: number }>(`http://localhost:3000/patients/${id}/points/all`);
            
            setUserStats({
                current_points: pointsResponse.data.current_points || 0,
                overall_points: pointsResponse.data.overall_points || 0,
                streak,
                rank,
                overall_rank: rankResponse.data.overall_rank || 0
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
            // Set default values if there's an error
            setUserStats({
                current_points: 0,
                overall_points: 0,
                streak: 0,
                rank: 'Beginner',
                overall_rank: 0
            });
        }
    };

    const calculateStreak = (adherenceData: AdherenceData[]) => {
        // Implementation of streak calculation based on adherence data
        // This is a simplified version - you may want to implement more complex logic
        return adherenceData.length > 0 ? 7 : 0; // Example: return 7 if there's any adherence data
    };

    const calculateRank = (points: number) => {
        if (points >= 1000) return 'Master';
        if (points >= 500) return 'Expert';
        if (points >= 200) return 'Intermediate';
        return 'Beginner';
    };

    const handleAddMedication = () => {
        router.push('/add-medication');
    };

    const calculateTimeLeft = (expirationDate: string) => {
        const expiry = new Date(expirationDate);
        const now = new Date();
        const diff = expiry.getTime() - now.getTime();
        
        if (diff <= 0) return 'Expired';
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 24) return `${hours}h left`;
        
        const days = Math.floor(hours / 24);
        return `${days}d left`;
    };

    const formatScheduleTime = (timeString: string) => {
        try {
            // If timeString is already in HH:mm format, convert to 12-hour format
            const [hours, minutes] = timeString.split(':').map(Number);
            const period = hours >= 12 ? 'PM' : 'AM';
            const hour12 = hours % 12 || 12;
            return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
        } catch (error) {
            console.error('Error formatting time:', error);
            return 'Schedule not set';
        }
    };

    const createScheduleTimestamp = (scheduleTime: string, date: Date = new Date()) => {
        // Extract hours and minutes from the schedule time (HH:mm format)
        const [hours, minutes] = scheduleTime.split(':').map(Number);
        
        // Create a new date object for today with the schedule time
        const timestamp = new Date(date);
        timestamp.setHours(hours, minutes, 0, 0);
        
        return timestamp.toISOString();
    };

    const handleMarkAsTaken = async (reminderId: string) => {
        try {
            // Check if the reminder is already marked as taken
            if (takenReminders.has(reminderId)) {
                Alert.alert('Already Taken', 'This medication has already been marked as taken.');
                return;
            }
            
            // Find the reminder to get its schedule time
            const reminder = reminders.find(r => r.id === reminderId);
            if (!reminder) {
                console.error('Reminder not found:', reminderId);
                return;
            }

            // Optimistically update the UI
            setTakenReminders(prev => {
                const newSet = new Set(prev);
                newSet.add(reminderId);
                return newSet;
            });
            
            // Create proper timestamps for the adherence record
            const now = new Date();
            const scheduleForTimestamp = createScheduleTimestamp(reminder.schedule_time);
            
            // Create adherence record
            const adherenceData = {
                reminder_id: reminderId,
                user_id: id,
                schedule_for: scheduleForTimestamp,
                points_awarded: 10,
                taken_at: now.toISOString(),
                status: "taken"
            };
            
            console.log('Creating adherence record:', adherenceData);
            
            // Send the request to mark as taken
            await axios.post(
                `http://localhost:3000/patients/${id}/reminders/${reminderId}/adherence`,
                adherenceData
            );
            
            // Refresh user stats to update points
            await fetchUserStats();
            
            // Show success message
            Alert.alert('Success', 'Medication marked as taken!');
        } catch (error) {
            console.error('Error marking reminder as taken:', error);
            // Revert the optimistic update if the request failed
            setTakenReminders(prev => {
                const newSet = new Set(prev);
                newSet.delete(reminderId);
                return newSet;
            });
            Alert.alert('Error', 'Failed to mark medication as taken. Please try again.');
        }
    };

    const renderReminderCard = (reminder: Reminder) => {
        const isTaken = takenReminders.has(reminder.id);
        
        return (
            <View key={reminder.id} style={styles.reminderCard}>
                <View style={styles.reminderInfo}>
                    <Text style={styles.reminderName}>{reminder.medication_name}</Text>
                    <Text style={styles.reminderDosage}>{reminder.dosage}</Text>
                    <Text style={styles.reminderTime}>
                        {formatScheduleTime(reminder.schedule_time)}
                    </Text>
                </View>
                <TouchableOpacity 
                    style={[
                        styles.reminderActionButton,
                        isTaken && styles.takenButton
                    ]}
                    onPress={() => handleMarkAsTaken(reminder.id)}
                    disabled={isTaken}
                >
                    <MaterialCommunityIcons 
                        name={isTaken ? "check-circle" : "checkbox-blank-circle-outline"} 
                        size={28} 
                        color={isTaken ? "#4CAF50" : "#4A90E2"} 
                    />
                    <Text style={[
                        styles.actionButtonText,
                        isTaken && styles.takenButtonText
                    ]}>
                        {isTaken ? 'Taken' : 'Take'}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView}>
                <View style={styles.header}>
                    <Text style={styles.welcomeText}>{getGreeting()}, {firstName}!</Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <MaterialCommunityIcons name="fire" size={24} color="#4A90E2" />
                        </View>
                        <Text style={styles.statValue}>{userStats.streak}</Text>
                        <Text style={styles.statLabel}>Day Streak</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <MaterialCommunityIcons name="star" size={24} color="#4A90E2" />
                        </View>
                        <Text style={styles.statValue}>{userStats.current_points}</Text>
                        <Text style={styles.statLabel}>Points</Text>
                    </View>
                    <View style={styles.statCard}>
                        <View style={styles.statIconContainer}>
                            <MaterialCommunityIcons name="trophy" size={24} color="#4A90E2" />
                        </View>
                        <Text style={styles.statValue}>{userStats.rank}</Text>
                        <Text style={styles.statLabel}>Rank</Text>
                    </View>
                </View>

                <View style={styles.overallRankContainer}>
                    <MaterialCommunityIcons name="medal" size={24} color="#4A90E2" />
                    <Text style={styles.overallRankText}>Overall Rank: #{userStats.overall_rank}</Text>
                </View>

                {activeRewards.length > 0 && (
                    <View style={styles.activeRewardsContainer}>
                        <Text style={styles.sectionTitle}>Active Rewards</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.activeRewardsScroll}>
                            {activeRewards.map((reward) => (
                                <View key={reward.id} style={styles.activeRewardCard}>
                                    <MaterialCommunityIcons 
                                        name={
                                            reward?.name ? (
                                                reward.name.toLowerCase().includes('shield') ? 'shield-star' :
                                                reward.name.toLowerCase().includes('2x') ? 'numeric-2-circle' :
                                                reward.name.toLowerCase().includes('timer') ? 'timer' :
                                                reward.name.toLowerCase().includes('stats') ? 'chart-line' :
                                                'star-circle'
                                            ) : 'star-circle'
                                        } 
                                        size={32} 
                                        color="#4A90E2" 
                                    />
                                    <Text style={styles.activeRewardName}>{reward?.name || 'Unknown Reward'}</Text>
                                    <Text style={styles.activeRewardExpiry}>
                                        {calculateTimeLeft(reward.expiration_date)}
                                    </Text>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                <View style={styles.remindersContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Today's Reminders</Text>
                        <View style={styles.headerButtons}>
                            <TouchableOpacity 
                                style={[styles.headerButton, styles.viewAllButton]}
                                onPress={() => router.push('/medications')}
                            >
                                <MaterialCommunityIcons name="format-list-bulleted" size={20} color="#4A90E2" />
                                <Text style={styles.headerButtonText}>View All</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.headerButton, styles.addButton]}
                                onPress={handleAddMedication}
                            >
                                <MaterialCommunityIcons name="plus" size={20} color="#4A90E2" />
                                <Text style={styles.headerButtonText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#4A90E2" />
                        </View>
                    ) : todayReminders.length === 0 ? (
                        <View style={styles.emptyStateContainer}>
                            <MaterialCommunityIcons name="bell-off" size={48} color="#ccc" />
                            <Text style={styles.emptyStateText}>No reminders set for today</Text>
                            <TouchableOpacity 
                                style={styles.addFirstButton}
                                onPress={handleAddMedication}
                            >
                                <Text style={styles.addFirstButtonText}>Add Your First Medication</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.remindersList}>
                            {todayReminders.map(renderReminderCard)}
                        </View>
                    )}
                </View>
            </ScrollView>

            <TouchableOpacity 
                style={styles.fab}
                onPress={handleAddMedication}
            >
                <MaterialCommunityIcons name="pill" size={24} color="#fff" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scrollView: {
        flex: 1,
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    remindersContainer: {
        marginTop: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingHorizontal: 16,
    },
    headerButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    headerButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#4A90E2',
    },
    headerButtonText: {
        color: '#4A90E2',
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '500',
    },
    viewAllButton: {
        backgroundColor: '#fff',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#4A90E2',
    },
    reminderCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 8,
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#4A90E2',
    },
    reminderInfo: {
        flex: 1,
    },
    reminderName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    reminderDosage: {
        fontSize: 14,
        color: '#666',
        marginBottom: 4,
    },
    reminderTime: {
        fontSize: 14,
        color: '#4A90E2',
        fontWeight: '500',
    },
    reminderActions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    reminderActionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
    },
    emptyStateContainer: {
        padding: 32,
        alignItems: 'center',
    },
    emptyStateText: {
        color: '#666',
        marginVertical: 16,
        fontSize: 16,
    },
    addFirstButton: {
        backgroundColor: '#4A90E2',
        padding: 12,
        borderRadius: 20,
    },
    addFirstButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: '#4A90E2',
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    loadingContainer: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    takenButton: {
        backgroundColor: '#E8F5E9',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        width: '30%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statIconContainer: {
        marginBottom: 8,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    overallRankContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 16,
        marginHorizontal: 16,
        borderRadius: 12,
        marginBottom: 16,
    },
    overallRankText: {
        marginLeft: 8,
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    activeRewardsContainer: {
        marginTop: 16,
        paddingVertical: 16,
        backgroundColor: '#fff',
    },
    activeRewardsScroll: {
        paddingLeft: 16,
    },
    activeRewardCard: {
        backgroundColor: '#f8f9fa',
        borderRadius: 12,
        padding: 16,
        marginRight: 12,
        width: 120,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    activeRewardName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#333',
        textAlign: 'center',
        marginTop: 8,
        marginBottom: 4,
    },
    activeRewardExpiry: {
        fontSize: 12,
        color: '#666',
    },
    remindersList: {
        padding: 16,
    },
    actionButtonText: {
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '500',
        color: '#4A90E2',
    },
    takenButtonText: {
        color: '#4CAF50',
    },
});
