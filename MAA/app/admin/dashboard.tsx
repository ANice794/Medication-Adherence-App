import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface DashboardStats {
    totalUsers: number;
    totalDoctors: number;
    totalPatients: number;
    activeUsers: number;
}

const AdminDashboard = () => {
    const router = useRouter();
    const { firstName, lastName } = useUser();
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        totalDoctors: 0,
        totalPatients: 0,
        activeUsers: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            // In a real app, these would be actual API calls
            // Mock data for demonstration
            setStats({
                totalUsers: 150,
                totalDoctors: 20,
                totalPatients: 120,
                activeUsers: 85
            });
            setError(null);
        } catch (err) {
            console.error('Error loading dashboard stats:', err);
            setError('Failed to load dashboard statistics');
        } finally {
            setLoading(false);
        }
    };

    const QuickAction = ({ icon, title, subtitle, onPress }: {
        icon: string;
        title: string;
        subtitle: string;
        onPress: () => void;
    }) => (
        <TouchableOpacity style={styles.quickAction} onPress={onPress}>
            <View style={styles.quickActionIcon}>
                <Ionicons name={icon as any} size={24} color="#4A90E2" />
            </View>
            <View style={styles.quickActionText}>
                <Text style={styles.quickActionTitle}>{title}</Text>
                <Text style={styles.quickActionSubtitle}>{subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.adminName}>Admin {firstName} {lastName}</Text>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.totalUsers}</Text>
                    <Text style={styles.statLabel}>Total Users</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.totalDoctors}</Text>
                    <Text style={styles.statLabel}>Doctors</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.totalPatients}</Text>
                    <Text style={styles.statLabel}>Patients</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.activeUsers}</Text>
                    <Text style={styles.statLabel}>Active Users</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <QuickAction
                    icon="people"
                    title="Manage Users"
                    subtitle="View and edit user information"
                    onPress={() => router.push('/admin/users')}
                />
                <QuickAction
                    icon="person-add"
                    title="Add New User"
                    subtitle="Create a new user account"
                    onPress={() => router.push('/admin/users/new')}
                />
                <QuickAction
                    icon="settings"
                    title="System Settings"
                    subtitle="Configure application settings"
                    onPress={() => router.push('/admin/settings')}
                />
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        padding: 20,
        backgroundColor: '#fff',
    },
    welcomeText: {
        fontSize: 16,
        color: '#666',
    },
    adminName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 4,
    },
    errorContainer: {
        margin: 20,
        padding: 10,
        backgroundColor: '#ffebee',
        borderRadius: 8,
    },
    errorText: {
        color: '#c62828',
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 10,
        justifyContent: 'space-between',
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        width: '48%',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4A90E2',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    quickAction: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    quickActionIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f7ff',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    quickActionText: {
        flex: 1,
    },
    quickActionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
    },
    quickActionSubtitle: {
        fontSize: 14,
        color: '#666',
    },
});

export default AdminDashboard; 