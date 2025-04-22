import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../../context/UserContext';
import Constants from 'expo-constants';
import axios from 'axios';

// Get API URL from environment variables
const API_URL = 'http://localhost:3000';

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
        console.log(email, password);
        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                password,
            });
            console.log(response.data);
            const currentUser = (response.data as Array<{
                id: number;
                email: string;
                password: string;
                firstName: string;
                lastName: string;
                dob: string;
                role: string;
                profilePicture?: string;
            }>)[0];

            // Store user details in AsyncStorage
            await AsyncStorage.setItem('isLoggedIn', 'true');
            await AsyncStorage.setItem('email', currentUser.email);
            await AsyncStorage.setItem('id', currentUser.id.toString());
            await AsyncStorage.setItem('firstName', currentUser.firstName);
            await AsyncStorage.setItem('lastName', currentUser.lastName);
            await AsyncStorage.setItem('dob', currentUser.dob);
            await AsyncStorage.setItem('role', currentUser.role);
            await AsyncStorage.setItem('profilePicture', currentUser.profilePicture || '');

            // Update context
            setUser({
                id: currentUser.id,
                email: currentUser.email,
                password: currentUser.password,
                firstName: currentUser.firstName,
                lastName: currentUser.lastName,
                dob: currentUser.dob,
                role: currentUser.role,
                profilePicture: currentUser.profilePicture || '',
                isLoggedIn: true,
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

            Alert.alert('Success', 'Login successful!');
            router.replace('/(root)/(tabs)');
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Error', 'Login failed. Please check your credentials and try again.');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>

            <View style={styles.inputWithIcon}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    value={email}
                    autoCapitalize="none"
                />
            </View>
            

            <View style={styles.inputWithIcon}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    onChangeText={setPassword}
                    value={password}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.linkText}>Don't have an account? Register here</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 15,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 50,
    },
    button: {
        backgroundColor: '#4A90E2',
        padding: 15,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    linkText: {
        color: '#4A90E2',
        textAlign: 'center',
        marginTop: 15,
    },
});

export default Login;


