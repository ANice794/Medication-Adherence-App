import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
    Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

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
    // Sample data - replace with actual health data from Apple Health/Google Fit
    const [healthMetrics] = useState<HealthMetric[]>([
        {
            id: '1',
            title: 'Steps',
            value: '7,543',
            unit: 'steps',
            icon: 'footsteps',
            color: '#FF9500',
            change: '+12%',
            trend: 'up',
        },
        {
            id: '2',
            title: 'Heart Rate',
            value: '72',
            unit: 'bpm',
            icon: 'heart',
            color: '#FF2D55',
            change: 'Normal',
            trend: 'stable',
        },
        {
            id: '3',
            title: 'Sleep',
            value: '7.5',
            unit: 'hours',
            icon: 'moon',
            color: '#5856D6',
            change: '+30min',
            trend: 'up',
        },
        {
            id: '4',
            title: 'Blood Pressure',
            value: '120/80',
            unit: 'mmHg',
            icon: 'fitness',
            color: '#FF3B30',
            change: 'Normal',
            trend: 'stable',
        },
        {
            id: '5',
            title: 'Weight',
            value: '68',
            unit: 'kg',
            icon: 'body',
            color: '#4CD964',
            change: '-0.5kg',
            trend: 'down',
        },
        {
            id: '6',
            title: 'Activity',
            value: '32',
            unit: 'min',
            icon: 'walk',
            color: '#007AFF',
            change: '+5min',
            trend: 'up',
        },
    ]);

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

    const handleConnectHealth = () => {
        if (Platform.OS === 'ios') {
            // Implement Apple Health connection
            console.log('Connecting to Apple Health...');
        } else {
            // Implement Google Fit connection
            console.log('Connecting to Google Fit...');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Health Overview</Text>
                <TouchableOpacity
                    style={styles.connectButton}
                    onPress={handleConnectHealth}
                >
                    <Text style={styles.connectButtonText}>
                        Connect {Platform.OS === 'ios' ? 'Apple Health' : 'Google Fit'}
                    </Text>
                </TouchableOpacity>
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