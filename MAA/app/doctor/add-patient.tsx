import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
    Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface Patient {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

const AddPatient = () => {
    const router = useRouter();
    const { id: doctorId } = useUser();
    const [allPatients, setAllPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        loadAllPatients();
    }, []);

    useEffect(() => {
        filterPatients();
    }, [searchQuery, allPatients]);

    const loadAllPatients = async () => {
        try {
            const response = await axios.get(`${API_URL}/patients`);
            setAllPatients(response.data);
            setError(null);
        } catch (err) {
            console.error('Error loading patients:', err);
            setError('Failed to load patients');
        } finally {
            setLoading(false);
        }
    };

    const filterPatients = () => {
        const query = searchQuery.toLowerCase();
        const filtered = allPatients.filter(patient => 
            patient.first_name.toLowerCase().includes(query) ||
            patient.last_name.toLowerCase().includes(query) ||
            patient.email.toLowerCase().includes(query)
        );
        setFilteredPatients(filtered);
    };

    const handleAddPatient = async (patientId: string) => {
        try {
            // First, add the patient to the doctor
            await axios.post(`${API_URL}/doctors/${doctorId}/patients/${patientId}`);
            
            // Then, create a chat between the doctor and patient
            await axios.post(`${API_URL}/chats/doctor/${doctorId}/patient/${patientId}`);
            
            setSuccessMessage('Patient added successfully!');
            setTimeout(() => {
                router.back();
            }, 2000);
        } catch (err) {
            console.error('Error adding patient:', err);
            setError('Failed to add patient');
        }
    };

    const renderPatientItem = ({ item }: { item: Patient }) => (
        <TouchableOpacity
            style={styles.patientCard}
            onPress={() => handleAddPatient(item.id)}
        >
            <View style={styles.patientInfo}>
                <Text style={styles.patientName}>
                    {item.first_name} {item.last_name}
                </Text>
                <Text style={styles.patientEmail}>{item.email}</Text>
            </View>
            <Ionicons name="add-circle-outline" size={24} color="#4A90E2" />
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
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#4A90E2" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Add Patient</Text>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            {successMessage && (
                <View style={styles.successContainer}>
                    <Text style={styles.successText}>{successMessage}</Text>
                </View>
            )}

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <FlatList
                data={filteredPatients}
                renderItem={renderPatientItem}
                keyExtractor={item => item.id}
                style={styles.listContainer}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No patients found</Text>
                    </View>
                }
            />
        </View>
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
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        margin: 10,
        paddingHorizontal: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 16,
    },
    listContainer: {
        padding: 10,
    },
    patientCard: {
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
    patientInfo: {
        flex: 1,
    },
    patientName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 4,
    },
    patientEmail: {
        fontSize: 14,
        color: '#666',
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
    successContainer: {
        margin: 20,
        padding: 10,
        backgroundColor: '#e8f5e9',
        borderRadius: 8,
    },
    successText: {
        color: '#2e7d32',
        textAlign: 'center',
    },
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
    },
});

export default AddPatient; 