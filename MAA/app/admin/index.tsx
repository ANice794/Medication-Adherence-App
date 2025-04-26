import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../context/UserContext';

const AdminDashboard = () => {
    const router = useRouter();
    const { setUser } = useUser();

    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            // Clear AsyncStorage
                            await AsyncStorage.multiRemove([
                                'isLoggedIn',
                                'email',
                                'id',
                                'firstName',
                                'lastName',
                                'role',
                                'token'
                            ]);

                            // Reset user context
                            setUser({
                                id: 0,
                                email: '',
                                firstName: '',
                                lastName: '',
                                role: '',
                                isLoggedIn: false
                            });

                            // Navigate to login
                            router.replace('/(root)/login');
                        } catch (error) {
                            console.error('Error during logout:', error);
                            Alert.alert('Error', 'Failed to logout. Please try again.');
                        }
                    }
                }
            ]
        );
    };

    const QuickAction = ({ icon, title, onPress }) => (
        <TouchableOpacity style={styles.actionCard} onPress={onPress}>
            <Ionicons name={icon} size={32} color="#4A90E2" />
            <Text style={styles.actionTitle}>{title}</Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>Admin Dashboard</Text>
                </View>

                <ScrollView style={styles.content}>
                    <Text style={styles.sectionTitle}>Quick Actions</Text>
                    <View style={styles.actionsGrid}>
                        <QuickAction
                            icon="people"
                            title="Manage Users"
                            onPress={() => router.push('/admin/users')}
                        />
                        <QuickAction
                            icon="medkit"
                            title="Medications"
                            onPress={() => router.push('/admin/medications')}
                        />
                        <QuickAction
                            icon="stats-chart"
                            title="Analytics"
                            onPress={() => router.push('/admin/analytics')}
                        />
                        <QuickAction
                            icon="settings"
                            title="Settings"
                            onPress={() => router.push('/admin/settings')}
                        />
                    </View>
                </ScrollView>

                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color="#fff" style={styles.logoutIcon} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    content: {
        flex: 1,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
        padding: 16,
    },
    actionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 8,
    },
    actionCard: {
        width: '45%',
        backgroundColor: '#fff',
        padding: 16,
        margin: 8,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    actionTitle: {
        marginTop: 8,
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        textAlign: 'center',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#dc3545',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    logoutIcon: {
        marginRight: 8,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default AdminDashboard; 