import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface DashboardStats {
    totalPatients: number;
    unreadMessages: number;
    pendingAppointments: number;
    criticalAlerts: number;
}

interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

interface MessageCount {
    count: number;
}

interface Appointment {
    id: string;
    date: string;
    status: string;
}

interface Alert {
    id: string;
    type: string;
    severity: string;
}

const DoctorDashboard = () => {
    const router = useRouter();
    const { id: doctorId } = useUser();
    const [stats, setStats] = useState<DashboardStats>({
        totalPatients: 0,
        unreadMessages: 0,
        pendingAppointments: 0,
        criticalAlerts: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        if (!doctorId) {
            setLoading(false);
            return;
        }

        try {
            // Use individual try-catch blocks for each API call
            let patients: Patient[] = [];
            let messages: MessageCount = { count: 0 };
            let appointments: Appointment[] = [];
            let alerts: Alert[] = [];

            try {
                const patientsResponse = await axios.get<Patient[]>(`${API_URL}/doctors/${doctorId}/patients`);
                patients = patientsResponse.data;
            } catch (err) {
                console.error('Error loading patients:', err);
            }

            try {
                const messagesResponse = await axios.get<MessageCount>(`${API_URL}/doctors/${doctorId}/messages/unread`);
                messages = messagesResponse.data;
            } catch (err) {
                console.error('Error loading messages:', err);
            }

            try {
                const appointmentsResponse = await axios.get<Appointment[]>(`${API_URL}/doctors/${doctorId}/appointments/pending`);
                appointments = appointmentsResponse.data;
            } catch (err) {
                console.error('Error loading appointments:', err);
            }

            try {
                const alertsResponse = await axios.get<Alert[]>(`${API_URL}/doctors/${doctorId}/alerts/critical`);
                alerts = alertsResponse.data;
            } catch (err) {
                console.error('Error loading alerts:', err);
            }

            setStats({
                totalPatients: patients.length,
                unreadMessages: messages.count || 0,
                pendingAppointments: appointments.length,
                criticalAlerts: alerts.length
            });
            setError(null);
        } catch (err) {
            console.error('Error loading dashboard stats:', err);
            setError('Failed to load dashboard statistics');
            // Set default values in case of error
            setStats({
                totalPatients: 0,
                unreadMessages: 0,
                pendingAppointments: 0,
                criticalAlerts: 0
            });
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
                <Text style={styles.doctorName}>Dr. {useUser().lastName}</Text>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <View style={styles.statsContainer}>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.totalPatients}</Text>
                    <Text style={styles.statLabel}>Patients</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.unreadMessages}</Text>
                    <Text style={styles.statLabel}>Messages</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.pendingAppointments}</Text>
                    <Text style={styles.statLabel}>Pending</Text>
                </View>
                <View style={styles.statCard}>
                    <Text style={styles.statNumber}>{stats.criticalAlerts}</Text>
                    <Text style={styles.statLabel}>Alerts</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <QuickAction
                    icon="people"
                    title="View All Patients"
                    subtitle={`${stats.totalPatients} total patients`}
                    onPress={() => router.push('/doctor/patients')}
                />
                <QuickAction
                    icon="chatbubbles"
                    title="Messages"
                    subtitle={`${stats.unreadMessages} unread messages`}
                    onPress={() => router.push('/doctor/messages')}
                />
                <QuickAction
                    icon="alert-circle"
                    title="Critical Alerts"
                    subtitle={`${stats.criticalAlerts} alerts need attention`}
                    onPress={() => router.push('/doctor/alerts')}
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
    doctorName: {
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

export default DoctorDashboard; 