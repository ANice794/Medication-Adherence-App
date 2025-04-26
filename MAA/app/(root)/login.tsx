import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../context/UserContext';
import Constants from 'expo-constants';
import axios from 'axios';

// Get API URL from environment variables
const API_URL = 'http://localhost:3000';

interface LoginResponse {
    success: boolean;
    message?: string;
    data?: {
        token: string;
        user: {
            id: number;
            email: string;
            firstName: string;
            lastName: string;
            role: string;
        }
    }
}

const defaultTheme = {
    primary: '#4A90E2',
    background: '#f5f5f5',
    text: '#333333',
    secondary: '#666666',
};

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const { setUser } = useUser();

    async function handleSubmit() {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        try {
            console.log('=== Login Process Started ===');
            console.log('Attempting login with email:', email);
            
            const response = await axios.post<LoginResponse>(`${API_URL}/auth/login`, {
                email,
                password,
            });

            console.log('Login response received:', JSON.stringify(response.data, null, 2));

            if (!response.data.success) {
                console.error('Login failed:', response.data.message);
                Alert.alert('Error', response.data.message || 'Invalid credentials');
                return;
            }

            if (!response.data.data) {
                console.error('No data received from server');
                throw new Error('No data received from server');
            }

            const { token, user } = response.data.data;
            
            console.log('Received user data:', {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            });

            if (!user.id) {
                console.error('No user ID received from server');
                throw new Error('No user ID received from server');
            }

            // Store token and user data in AsyncStorage
            console.log('Storing user data in AsyncStorage...');
            try {
                await AsyncStorage.multiSet([
                    ['token', token],
                    ['isLoggedIn', 'true'],
                    ['id', user.id.toString()],
                    ['email', user.email],
                    ['firstName', user.firstName],
                    ['lastName', user.lastName],
                    ['role', user.role]
                ]);
                
                // Verify the stored data
                const storedId = await AsyncStorage.getItem('id');
                console.log('Verified stored ID:', storedId);
                
                if (storedId !== user.id.toString()) {
                    console.error('Stored ID verification failed');
                    throw new Error('Failed to store user ID correctly');
                }
            } catch (storageError) {
                console.error('Error storing user data:', storageError);
                throw new Error('Failed to store user data');
            }

            console.log('Successfully stored user data');

            // Update user context with required fields
            console.log('Updating user context...');
            setUser({
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                password: '',
                dob: new Date().toISOString(),
                profilePicture: '',
                points: 0,
                streak: 0,
                activeItems: [],
                currentTheme: {
                    primary: '#4A90E2',
                    background: '#f5f5f5',
                    text: '#333333',
                    secondary: '#666666',
                },
                isLoggedIn: true,
                setId: () => {},
                setEmail: () => {},
                setPassword: () => {},
                setFirstName: () => {},
                setLastName: () => {},
                setDob: () => {},
                setRole: () => {},
                setProfilePicture: () => {},
                setPoints: () => {},
                addPoints: () => {},
                deductPoints: () => {},
                setStreak: () => {},
                incrementStreak: () => {},
                resetStreak: () => {},
                setActiveItems: () => {},
                addActiveItem: () => {},
                hasActiveItem: () => false,
                setTheme: () => {},
                setIsLoggedIn: () => {},
                setUser: () => {}
            });

            console.log('User context updated successfully');
            console.log('User role:', user.role);

            // Redirect based on role
            console.log('Redirecting user based on role...');
            if (user.role === 'admin') {
                router.replace('/admin/users');
            } else if (user.role === 'doctor') {
                router.replace('/doctor/dashboard');
            } else {
                router.replace('/(tabs)');
            }
            
            console.log('=== Login Process Completed Successfully ===');
        } catch (error) {
            console.error('=== Login Error ===');
            console.error('Error details:', error);
            
            if (error && typeof error === 'object' && 'response' in error) {
                const errorResponse = (error as any).response?.data;
                console.error('Server error response:', errorResponse);
                Alert.alert('Error', errorResponse?.message || 'Failed to login. Please try again.');
            } else {
                console.error('Unexpected error:', error);
                Alert.alert('Error', 'Failed to login. Please try again.');
            }
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Welcome Back</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('/sign-up')}>
                    <Text style={styles.linkText}>Don't have an account? Sign up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#333',
    },
    inputContainer: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 5,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    button: {
        backgroundColor: '#4A90E2',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    linkText: {
        color: '#4A90E2',
        textAlign: 'center',
        marginTop: 10,
    },
});

export default Login;


