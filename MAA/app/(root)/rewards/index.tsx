import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../../context/UserContext';
import { rewardsService, Reward, UserPoints } from '../../../services/rewardsService';
import { Stack } from 'expo-router';

const RewardsScreen = () => {
    const { id: userId } = useUser();
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [userPoints, setUserPoints] = useState<UserPoints>({ current_points: 0, overall_points: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [purchaseStatus, setPurchaseStatus] = useState<{ [key: number]: 'idle' | 'loading' | 'success' | 'error' }>({});

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [fetchedRewards, points] = await Promise.all([
                rewardsService.getAllRewards(),
                rewardsService.getUserPoints(userId.toString())
            ]);
            setRewards(fetchedRewards);
            setUserPoints(points);
            setError(null);
        } catch (err) {
            console.error('Error loading data:', err);
            setError('Failed to load rewards shop');
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (reward: Reward) => {
        if (!userId) {
            setError('User not logged in');
            return;
        }

        if (userPoints.current_points < reward.points_required) {
            setError('Not enough points to purchase this reward');
            return;
        }

        setPurchaseStatus(prev => ({ ...prev, [reward.id]: 'loading' }));
        try {
            await rewardsService.purchaseReward(userId.toString(), reward.id);
            setPurchaseStatus(prev => ({ ...prev, [reward.id]: 'success' }));
            // Update points after successful purchase
            const updatedPoints = await rewardsService.getUserPoints(userId.toString());
            setUserPoints(updatedPoints);
            // Reset status after 2 seconds
            setTimeout(() => {
                setPurchaseStatus(prev => ({ ...prev, [reward.id]: 'idle' }));
            }, 2000);
        } catch (err) {
            console.error('Error purchasing reward:', err);
            setPurchaseStatus(prev => ({ ...prev, [reward.id]: 'error' }));
            // Reset status after 2 seconds
            setTimeout(() => {
                setPurchaseStatus(prev => ({ ...prev, [reward.id]: 'idle' }));
            }, 2000);
        }
    };

    const renderReward = ({ item }: { item: Reward }) => {
        const status = purchaseStatus[item.id] || 'idle';
        const canPurchase = userPoints.current_points >= item.points_required;

        return (
            <View style={styles.rewardCard}>
                <Image 
                    source={{ uri: item.image_url }} 
                    style={styles.rewardImage}
                    resizeMode="contain"
                />
                <View style={styles.rewardInfo}>
                    <Text style={styles.rewardName}>{item.name}</Text>
                    <Text style={styles.rewardDescription}>{item.description}</Text>
                    <Text style={[
                        styles.pointsRequired,
                        !canPurchase && styles.pointsRequiredNotEnough
                    ]}>
                        {item.points_required} Points
                        {!canPurchase && ' (Need ' + (item.points_required - userPoints.current_points) + ' more)'}
                    </Text>
                    <TouchableOpacity 
                        style={[
                            styles.purchaseButton,
                            !canPurchase && styles.purchaseButtonDisabled,
                            status === 'loading' && styles.purchaseButtonLoading,
                            status === 'success' && styles.purchaseButtonSuccess,
                            status === 'error' && styles.purchaseButtonError,
                        ]}
                        onPress={() => handlePurchase(item)}
                        disabled={!canPurchase || status !== 'idle'}
                    >
                        {status === 'loading' ? (
                            <ActivityIndicator color="#fff" size="small" />
                        ) : (
                            <Text style={styles.purchaseButtonText}>
                                {status === 'success' ? 'Purchased!' : 
                                 status === 'error' ? 'Failed' : 
                                 canPurchase ? 'Purchase' : 'Not Enough Points'}
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    return (
        <>
            <Stack.Screen 
                options={{ 
                    title: 'Rewards Shop',
                    headerShown: true,
                }} 
            />
            <View style={styles.container}>
                <View style={styles.pointsHeader}>
                    <Text style={styles.pointsText}>
                        Your Points: <Text style={styles.pointsValue}>{userPoints.current_points}</Text>
                    </Text>
                </View>
                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}
                <FlatList
                    data={rewards}
                    renderItem={renderReward}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.rewardsList}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    pointsHeader: {
        backgroundColor: '#fff',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    pointsText: {
        fontSize: 16,
        color: '#333',
    },
    pointsValue: {
        fontWeight: '600',
        color: '#4A90E2',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        padding: 10,
        backgroundColor: '#ffebee',
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 8,
    },
    errorText: {
        color: '#c62828',
        textAlign: 'center',
    },
    rewardsList: {
        padding: 16,
    },
    rewardCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        marginBottom: 16,
        padding: 16,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    rewardImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
        marginRight: 16,
    },
    rewardInfo: {
        flex: 1,
        justifyContent: 'space-between',
    },
    rewardName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    rewardDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    pointsRequired: {
        fontSize: 16,
        fontWeight: '500',
        color: '#4A90E2',
        marginBottom: 8,
    },
    pointsRequiredNotEnough: {
        color: '#F44336',
    },
    purchaseButton: {
        backgroundColor: '#4A90E2',
        padding: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    purchaseButtonDisabled: {
        backgroundColor: '#ccc',
    },
    purchaseButtonLoading: {
        backgroundColor: '#90CAF9',
    },
    purchaseButtonSuccess: {
        backgroundColor: '#4CAF50',
    },
    purchaseButtonError: {
        backgroundColor: '#F44336',
    },
    purchaseButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
});

export default RewardsScreen; 