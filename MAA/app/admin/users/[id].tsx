import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    Alert,
    SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:3000';

interface UserDetails {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    roles: string;
    created_at: string;
}

const UserEdit = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<UserDetails>({
        id: '',
        first_name: '',
        last_name: '',
        email: '',
        roles: 'patient',
        created_at: new Date().toISOString(),
    });

    useEffect(() => {
        if (id !== 'new') {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [id]);

    const loadUser = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.get(`${API_URL}/admin/users/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            if (response.data.success) {
                setUser(response.data.data);
                setError(null);
            } else {
                setError('Failed to load user');
            }
        } catch (err) {
            console.error('Error loading user:', err);
            setError('Failed to load user details');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!user.first_name || !user.last_name || !user.email || !user.roles) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        setSaving(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const endpoint = id === 'new' 
                ? `${API_URL}/admin/users` 
                : `${API_URL}/admin/users/${id}`;
            const method = id === 'new' ? 'post' : 'put';

            const response = await axios[method](endpoint, user, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (response.data.success) {
                Alert.alert('Success', 'User saved successfully');
                router.back();
            } else {
                setError('Failed to save user');
            }
        } catch (err) {
            console.error('Error saving user:', err);
            setError('Failed to save user');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <SafeAreaView style={styles.safeArea}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#4A90E2" />
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.title}>
                        {id === 'new' ? 'Add User' : 'Edit User'}
                    </Text>
                    <TouchableOpacity 
                        style={styles.saveButton}
                        onPress={handleSave}
                        disabled={saving}
                    >
                        {saving ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.saveButtonText}>Save</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <ScrollView style={styles.form}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        value={user.first_name}
                        onChangeText={(text) => setUser({ ...user, first_name: text })}
                        placeholder="Enter first name"
                    />

                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        value={user.last_name}
                        onChangeText={(text) => setUser({ ...user, last_name: text })}
                        placeholder="Enter last name"
                    />

                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        value={user.email}
                        onChangeText={(text) => setUser({ ...user, email: text })}
                        placeholder="Enter email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.label}>Role</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={user.roles}
                            onValueChange={(value) => setUser({ ...user, roles: value })}
                            style={styles.picker}
                        >
                            <Picker.Item label="Patient" value="patient" />
                            <Picker.Item label="Doctor" value="doctor" />
                            <Picker.Item label="Admin" value="admin" />
                        </Picker>
                    </View>
                </ScrollView>
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
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        padding: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    saveButton: {
        backgroundColor: '#4A90E2',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    form: {
        padding: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
    },
    pickerContainer: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        marginBottom: 16,
        overflow: 'hidden',
    },
    picker: {
        height: 50,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        padding: 16,
        backgroundColor: '#ffebee',
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 8,
    },
    errorText: {
        color: '#c62828',
        textAlign: 'center',
    },
});

export default UserEdit; 