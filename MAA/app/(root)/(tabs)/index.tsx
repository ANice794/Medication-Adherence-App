import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from "expo-router";
import { useUser } from '../../../context/UserContext';
import axios from 'axios';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Medication {
    id: number;
    name: string;
    dosage: string;
    frequency: string;
    taken: boolean;
    schedule_time: string;
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
    id: number;
    user_id: number;
    reminder_id: number;
    schedule_for: string;
    points_awarded: number;
}

export default function Home() {
    const router = useRouter();
    const { id, firstName } = useUser();
    const [medications, setMedications] = useState<Medication[]>([]);
    const [userStats, setUserStats] = useState<UserStats>({
        current_points: 0,
        overall_points: 0,
        streak: 0,
        rank: 'Beginner',
        overall_rank: 0
    });

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
        fetchMedications();
        fetchUserStats();
    }, []);

    const fetchMedications = async () => {
        try {
            const response = await axios.get<Medication[]>(`http://localhost:3000/medications/patients/${id}`);
            setMedications(response.data);
        } catch (error) {
            console.error('Error fetching medications:', error);
        }
    };

    const fetchUserStats = async () => {
        try {
            const pointsResponse = await axios.get<PointsResponse>(`http://localhost:3000/patients/${id}/points/current`);
            const adherenceResponse = await axios.get<AdherenceData[]>(`http://localhost:3000/patients/${id}/adherence`);
            
            // Calculate streak based on adherence data
            const streak = calculateStreak(adherenceResponse.data);
            
            // Calculate rank based on overall points
            const rank = calculateRank(pointsResponse.data.overall_points);
            
            // Fetch overall rank 
            const rankResponse = await axios.get<{ overall_rank: number }>(`http://localhost:3000/patients/${id}/points/all`);
            
            setUserStats({
                current_points: pointsResponse.data.current_points,
                overall_points: pointsResponse.data.overall_points,
                streak,
                rank,
                overall_rank: rankResponse.data.overall_rank
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
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

                <View style={styles.medicationsContainer}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Today's Medications</Text>
                    <TouchableOpacity 
                            style={styles.addButton}
                            onPress={handleAddMedication}
                    >
                            <MaterialCommunityIcons name="plus" size={20} color="#4A90E2" />
                            <Text style={styles.addButtonText}>Add</Text>
                    </TouchableOpacity>
                    </View>
                    {medications.map((medication) => (
                        <View key={medication.id} style={styles.medicationCard}>
                            <View style={styles.medicationInfo}>
                                <Text style={styles.medicationName}>{medication.name}</Text>
                                <Text style={styles.medicationDetails}>
                                    {medication.dosage} - {medication.frequency}
                                </Text>
                                <Text style={styles.medicationTime}>
                                    Schedule: {new Date(medication.schedule_time).toLocaleTimeString()}
                                </Text>
                            </View>
                            <View style={[styles.statusIndicator, 
                                medication.taken ? styles.takenIndicator : styles.notTakenIndicator]}>
                                <Text style={styles.statusText}>
                                    {medication.taken ? 'Taken' : 'Not Taken'}
                                </Text>
                            </View>
                        </View>
                    ))}
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
        backgroundColor: '#4A90E2',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        color: '#fff',
        fontWeight: 'bold',
        marginTop: 40,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        marginBottom: 20,
    },
    statCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '30%',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4A90E2',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    medicationsContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    medicationCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    medicationInfo: {
        flex: 1,
    },
    medicationName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    medicationDetails: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    medicationTime: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    statusIndicator: {
        padding: 8,
        borderRadius: 5,
        minWidth: 80,
        alignItems: 'center',
    },
    takenIndicator: {
        backgroundColor: '#4CAF50',
    },
    notTakenIndicator: {
        backgroundColor: '#FF5252',
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
    statIconContainer: {
        marginBottom: 8,
    },
    overallRankContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginHorizontal: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    overallRankText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginLeft: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
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
    addButtonText: {
        color: '#4A90E2',
        marginLeft: 4,
        fontSize: 14,
        fontWeight: '500',
    },
    fab: {
        position: 'absolute',
        right: 20,
        bottom: 20,
        backgroundColor: '#4A90E2',
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
