import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Linking } from 'react-native';
import { Link, Redirect, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';
import { useUser } from '../../context/UserContext';

// Get API URL from environment variables
const API_URL = 'http://localhost:3000';

interface User {
    id: number;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    dob: string;
    role: string;
    profilePicture: string;
    first_name?: string;
    last_name?: string;
    roles?: string;
}

const SignUp = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();
    const { setUser: setContextUser } = useUser();

    const handleSubmit = async () => {
        console.log('Registration submitted with:', { email, password, firstName, lastName, dob });
        try {
            const response = await axios.post(`${API_URL}/register`, {
                dob,
                email,
                firstName,
                lastName,
                password,
            });
            
            console.log('Registration response:', response.data);
            
            // Handle single user object response
            const userData = response.data;
            if (!userData) {
                throw new Error('No user data received from server');
            }

            const firstNameValue = userData.firstName || userData.first_name || firstName;
            const lastNameValue = userData.lastName || userData.last_name || lastName;
            const roleValue = userData.role || userData.roles || 'patient';
            
            console.log('Processed user data:', {
                firstName: firstNameValue,
                lastName: lastNameValue,
                role: roleValue
            });
            
            // Store user details in AsyncStorage
            await AsyncStorage.setItem('isLoggedIn', 'true');
            await AsyncStorage.setItem('email', userData.email || email);
            await AsyncStorage.setItem('password', userData.password || password);
            await AsyncStorage.setItem('firstName', firstNameValue);
            await AsyncStorage.setItem('lastName', lastNameValue);
            await AsyncStorage.setItem('dob', userData.dob || dob);
            await AsyncStorage.setItem('id', userData.id?.toString() || '0');
            await AsyncStorage.setItem('role', roleValue);
            await AsyncStorage.setItem('profilePicture', userData.profilePicture || '');

            // Update the UserContext
            setContextUser({
                id: userData.id || 0,
                email: userData.email || email,
                password: userData.password || password,
                firstName: firstNameValue,
                lastName: lastNameValue,
                dob: userData.dob || dob,
                role: roleValue,
                profilePicture: userData.profilePicture || '',
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
            
            Alert.alert('Success', 'Registration successful!');
            setIsLoggedIn(true);
            router.replace('/(root)/(tabs)');
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert(
                'Error', 
                'Registration failed. Please check your information and try again.'
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={setFirstName}
                    keyboardType="default"
                    autoComplete='given-name'
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={setLastName}
                    keyboardType="default"
                    autoComplete='family-name'
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoComplete='email'
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Date of Birth (YYYY-MM-DD)"
                    value={dob}
                    onChangeText={setDob}
                    keyboardType="default"
                    autoComplete='birthdate-full'
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            <Text style={styles.signUp}>
                Already have an account? <Link style={styles.signUpLink} href='/login'>Login</Link>
            </Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 20,
    },
    logo: {
        height: 200,
        width: 200,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
        marginBottom: 40,
        fontWeight: 'bold',
        color: 'black',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 50,
        backgroundColor: '#f1f1f1',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: '100%',
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 20,
        color: '#000',
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#1E90FF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    signUp: {
        color: '#000',
    },
    signUpLink: {
        color: '#1E90FF',
    },
    errorText: {
        color: 'red',
        alignSelf: 'flex-start',
        marginBottom: 10,
    },
});

export default SignUp;