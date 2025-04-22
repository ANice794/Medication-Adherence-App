import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from "expo-router";
import { useUser } from '../../../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
    const router = useRouter();
    /*const { firstName, setUser } = useUser();

    const handleLogout = async () => {
        // Clear AsyncStorage
        await AsyncStorage.multiRemove([
            'isLoggedIn',
            'email',
            'id',
            'firstName',
            'lastName',
            'dob',
            'role',
            'profilePicture'
        ]);

        // Reset user context
        setUser({
            id: 0,
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            dob: '',
            role: '',
            profilePicture: '',
            isLoggedIn: false,
            setId: () => {},
            setEmail: () => {},
            setPassword: () => {},
            setFirstName: () => {},
            setLastName: () => {},
            setDob: () => {},
            setRole: () => {},
            setProfilePicture: () => {},
            setIsLoggedIn: () => {},
            setUser: () => {},
        });

        // Navigate to login
        router.replace('/login');
    };*/

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome back!</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionGrid}>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => router.push('/health')}
                    >
                        <Text style={styles.actionText}>Health</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => router.push('/chats')}
                    >
                        <Text style={styles.actionText}>Messages</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => router.push('/profile')}
                    >
                        <Text style={styles.actionText}>Profile</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => router.push('/shop')}
                    >
                        <Text style={styles.actionText}>Shop</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <TouchableOpacity 
                style={styles.logoutButton}
            >
                <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
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
    section: {
        padding: 20,
        backgroundColor: '#fff',
        marginBottom: 20,
        borderRadius: 10,
        marginHorizontal: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionButton: {
        width: '48%',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    actionText: {
        marginTop: 8,
        color: '#333',
        fontSize: 14,
    },
    logoutButton: {
        margin: 20,
        padding: 15,
        backgroundColor: '#ff4444',
        borderRadius: 10,
        alignItems: 'center',
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
