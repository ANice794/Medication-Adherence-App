import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert, Linking } from 'react-native';
import { Link, Redirect, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Constants from 'expo-constants';

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

    async function handleSubmit(event: { preventDefault: () => void; }) {
        event.preventDefault();
        console.log('Registration submitted with:', { email, password, firstName, lastName, dob });
        try {
            const response = await axios.post<User[]>(`${API_URL}/register`, {
                dob,
                email,
                firstName,
                lastName,
                password,
            });
            const array = response.data;
            console.log('Registration successful:', array);
            Alert.alert('Success', 'Registration successful!');
            await AsyncStorage.setItem('isLoggedIn', 'true');
            await AsyncStorage.setItem('email', array[0].email);
            await AsyncStorage.setItem('password', array[0].password);
            await AsyncStorage.setItem('firstName', array[0].firstName);
            await AsyncStorage.setItem('lastName', array[0].lastName);
            await AsyncStorage.setItem('dob', array[0].id.toString());
            await AsyncStorage.setItem('id', array[0].id.toString());
            await AsyncStorage.setItem('role', array[0].role);
            await AsyncStorage.setItem('profilePicture', array[0].profilePicture); // Placeholder URL
            setIsLoggedIn(true);
            router.replace('/(root)/(tabs)');
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert('Error', 'Registration failed. Please try again.');
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Sign Up</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    keyboardType="default"
                    autoComplete='given-name'
                    onChange={e => setFirstName(e.nativeEvent.text)}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    keyboardType="default"
                    autoComplete='family-name'
                    onChange={e => setLastName(e.nativeEvent.text)}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    autoComplete='email'
                    onChange={e => setEmail(e.nativeEvent.text)}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    onChange={e => setPassword(e.nativeEvent.text)}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Date of Birth (YYYY-MM-DD)"
                    keyboardType="default"
                    autoComplete='birthdate-full'
                    onChange={e => setDob(e.nativeEvent.text)}
                />
            </View>
            <TouchableOpacity
                style={styles.button}
                onPress={(e) => handleSubmit(e)}
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