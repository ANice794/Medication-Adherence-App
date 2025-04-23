import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import HealthService from '../../../services/HealthService';
import WebHealthService from '../../../services/WebHealthService';
import { HealthData } from '../../../services/HealthService';

interface HealthMetric {
    id: string;
    title: string;
    value: string;
    unit: string;
    icon: string;
    color: string;
    change?: string;
    trend?: 'up' | 'down' | 'stable';
}

const Health = () => {
    const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>([
        {
            id: '1',
            title: 'Steps',
            value: '0',
            unit: 'steps',
            icon: 'footsteps',
            color: '#FF9500',
            change: '--',
            trend: 'stable',
        },
        {
            id: '2',
            title: 'Heart Rate',
            value: '0',
            unit: 'bpm',
            icon: 'heart',
            color: '#FF2D55',
            change: '--',
            trend: 'stable',
        },
        {
            id: '3',
            title: 'Sleep',
            value: '0',
            unit: 'hrs',
            icon: 'moon',
            color: '#5856D6',
            change: '--',
            trend: 'stable',
        },
        {
            id: '4',
            title: 'Oxygen',
            value: '0',
            unit: '%',
            icon: 'fitness',
            color: '#FF3B30',
            change: '--',
            trend: 'stable',
        },
        {
            id: '5',
            title: 'Meditation',
            value: '0',
            unit: 'min',
            icon: 'leaf',
            color: '#4CD964',
            change: '--',
            trend: 'stable',
        },
        {
            id: '6',
            title: 'Activity',
            value: '0',
            unit: 'min',
            icon: 'walk',
            color: '#007AFF',
            change: '--',
            trend: 'stable',
        },
    ]);

    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        if (isConnected) {
            updateHealthData();
            // Update health data every 5 minutes
            const interval = setInterval(updateHealthData, 5 * 60 * 1000);
            return () => clearInterval(interval);
        }
    }, [isConnected]);

    const updateHealthData = async () => {
        try {
            const service = Platform.OS === 'web' ? WebHealthService : HealthService;
            const data = await service.getHealthData();
            
            setHealthMetrics(prev => prev.map(metric => {
                let value = '0';
                let change = '--';
                let trend: 'up' | 'down' | 'stable' = 'stable';

                switch (metric.title.toLowerCase()) {
                    case 'steps':
                        const steps = data.steps ?? 0;
                        value = steps.toLocaleString();
                        change = steps > 7500 ? '+12%' : '-8%';
                        trend = steps > 7500 ? 'up' : 'down';
                        break;
                    case 'heart rate':
                        value = Math.round(data.heartRate ?? 0).toString();
                        change = 'Normal';
                        trend = 'stable';
                        break;
                    case 'sleep':
                        const sleep = data.sleep ?? 0;
                        value = sleep.toString();
                        change = sleep > 7 ? '+30min' : '-30min';
                        trend = sleep > 7 ? 'up' : 'down';
                        break;
                    case 'oxygen':
                        value = (data.oxygenSaturation ?? 0).toString();
                        change = 'Normal';
                        trend = 'stable';
                        break;
                    case 'meditation':
                        const meditation = data.meditation ?? 0;
                        value = meditation.toString();
                        change = meditation > 10 ? '+5min' : '--';
                        trend = meditation > 10 ? 'up' : 'stable';
                        break;
                    case 'activity':
                        const activity = data.activity ?? 0;
                        value = activity.toString();
                        change = activity > 30 ? '+5min' : '-5min';
                        trend = activity > 30 ? 'up' : 'down';
                        break;
                }

                return {
                    ...metric,
                    value,
                    change,
                    trend,
                };
            }));
        } catch (error) {
            console.error('Error updating health data:', error);
        }
    };

    const handleConnectHealth = async () => {
        try {
            const service = Platform.OS === 'web' ? WebHealthService : HealthService;
            const authorized = await service.requestPermissions();
            if (authorized) {
                setIsConnected(true);
                Alert.alert('Success', `Successfully connected to ${Platform.OS === 'web' ? 'Google Fit' : 'Apple Health'}!`);
            } else {
                Alert.alert('Error', `Failed to get permission for ${Platform.OS === 'web' ? 'Google Fit' : 'Apple Health'}`);
            }
        } catch (error) {
            console.error('Error connecting to health service:', error);
            Alert.alert('Error', `Failed to connect to ${Platform.OS === 'web' ? 'Google Fit' : 'Apple Health'}`);
        }
    };

    const renderTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
        switch (trend) {
            case 'up':
                return <Ionicons name="arrow-up" size={16} color="green" />;
            case 'down':
                return <Ionicons name="arrow-down" size={16} color="red" />;
            case 'stable':
                return <Ionicons name="remove" size={16} color="gray" />;
            default:
                return null;
        }
    };

    const renderMetricCard = (metric: HealthMetric) => (
        <TouchableOpacity
            key={metric.id}
            style={[styles.card, { borderLeftColor: metric.color }]}
            onPress={() => {
                // Handle metric detail view
                console.log(`Showing details for ${metric.title}`);
            }}
        >
            <View style={styles.cardHeader}>
                <Ionicons name={metric.icon as any} size={24} color={metric.color} />
                <Text style={styles.cardTitle}>{metric.title}</Text>
            </View>
            <View style={styles.cardBody}>
                <Text style={styles.valueText}>{metric.value}</Text>
                <Text style={styles.unitText}>{metric.unit}</Text>
            </View>
            <View style={styles.cardFooter}>
                {renderTrendIcon(metric.trend)}
                <Text style={[styles.changeText, { color: metric.trend === 'up' ? 'green' : metric.trend === 'down' ? 'red' : 'gray' }]}>
                    {metric.change}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Health Overview</Text>
                {!isConnected && (
                    <TouchableOpacity
                        style={styles.connectButton}
                        onPress={handleConnectHealth}
                    >
                        <Text style={styles.connectButtonText}>
                            Connect {Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit'}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView style={styles.scrollView}>
                <View style={styles.gridContainer}>
                    {healthMetrics.map(metric => renderMetricCard(metric))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    connectButton: {
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    connectButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    gridContainer: {
        padding: 8,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 4,
        width: Dimensions.get('window').width / 2 - 16,
        borderLeftWidth: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
        color: '#333',
    },
    cardBody: {
        marginBottom: 8,
    },
    valueText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
    },
    unitText: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    cardFooter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    changeText: {
        fontSize: 14,
        marginLeft: 4,
    },
});

export default Health;