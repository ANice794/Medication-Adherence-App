import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    TextInput,
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
    phone: string;
    date_of_birth: string;
    gender: string;
}

const PatientList = () => {
    const router = useRouter();
    const { id: doctorId } = useUser();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredPatients, setFilteredPatients] = useState<Patient[]>([]);

    useEffect(() => {
        loadPatients();
    }, []);

    useEffect(() => {
        filterPatients();
    }, [searchQuery, patients]);

    const loadPatients = async () => {
        if (!doctorId) return;

        try {
            const response = await axios.get(`${API_URL}/doctors/${doctorId}/patients`);
            setPatients(response.data);
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
        const filtered = patients.filter(patient => 
            patient.first_name.toLowerCase().includes(query) ||
            patient.last_name.toLowerCase().includes(query) ||
            patient.email.toLowerCase().includes(query)
        );
        setFilteredPatients(filtered);
    };

    const navigateToPatientDetails = (patientId: string) => {
        router.push(`/doctor/patient/${patientId}`);
    };

    const renderPatientItem = ({ item }: { item: Patient }) => (
        <TouchableOpacity
            style={styles.patientCard}
            onPress={() => navigateToPatientDetails(item.id)}
        >
            <View style={styles.patientInfo}>
                <Text style={styles.patientName}>
                    {item.first_name} {item.last_name}
                </Text>
                <Text style={styles.patientEmail}>{item.email}</Text>
                <Text style={styles.patientPhone}>{item.phone}</Text>
                <Text style={styles.patientMeta}>
                    {item.gender} • {new Date(item.date_of_birth).toLocaleDateString()}
                </Text>
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
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Patients</Text>
                <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => router.push('/doctor/add-patient')}
                >
                    <Ionicons name="add" size={24} color="#4A90E2" />
                </TouchableOpacity>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <View style={styles.searchContainer}>
                <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search patients..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    clearButtonMode="while-editing"
                />
            </View>

            <FlatList
                data={filteredPatients}
                renderItem={renderPatientItem}
                keyExtractor={item => item.id}
                style={styles.listContainer}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {searchQuery
                                ? 'No patients found matching your search'
                                : 'No patients found'}
                        </Text>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#333',
    },
    addButton: {
        padding: 5,
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
        marginBottom: 2,
    },
    patientPhone: {
        fontSize: 14,
        color: '#666',
    },
    patientMeta: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
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
    emptyContainer: {
        padding: 20,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
});

export default PatientList; 