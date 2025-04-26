import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

const API_URL = 'http://localhost:3000';

interface PatientDetails {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    date_of_birth: string;
    gender: string;
    medical_history: {
        conditions: string[];
        allergies: string[];
        medications: Array<{
            name: string;
            dosage: string;
            frequency: string;
            start_date: string;
        }>;
    };
    appointments: Array<{
        id: string;
        date: string;
        status: 'scheduled' | 'completed' | 'cancelled';
        notes?: string;
    }>;
    vitals: Array<{
        date: string;
        type: string;
        value: number;
        unit: string;
    }>;
}

const PatientDetails = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const [patient, setPatient] = useState<PatientDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadPatientDetails();
    }, [id]);

    const loadPatientDetails = async () => {
        try {
            const response = await axios.get(`${API_URL}/patients/${id}`);
            setPatient(response.data);
            setError(null);
        } catch (err) {
            console.error('Error loading patient details:', err);
            setError('Failed to load patient details');
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    if (error || !patient) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error || 'Patient not found'}</Text>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Text style={styles.backButtonText}>Go Back</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => router.back()}
                >
                    <Ionicons name="arrow-back" size={24} color="#4A90E2" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {patient.first_name} {patient.last_name}
                </Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.infoCard}>
                    <Text style={styles.infoText}>Email: {patient.email}</Text>
                    <Text style={styles.infoText}>Phone: {patient.phone}</Text>
                    <Text style={styles.infoText}>
                        Date of Birth: {formatDate(patient.date_of_birth)}
                    </Text>
                    <Text style={styles.infoText}>Gender: {patient.gender}</Text>
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Medical History</Text>
                <View style={styles.infoCard}>
                    <Text style={styles.subTitle}>Conditions</Text>
                    {patient.medical_history.conditions.map((condition, index) => (
                        <Text key={index} style={styles.listItem}>• {condition}</Text>
                    ))}

                    <Text style={[styles.subTitle, styles.marginTop]}>Allergies</Text>
                    {patient.medical_history.allergies.map((allergy, index) => (
                        <Text key={index} style={styles.listItem}>• {allergy}</Text>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current Medications</Text>
                <View style={styles.infoCard}>
                    {patient.medical_history.medications.map((med, index) => (
                        <View key={index} style={styles.medicationItem}>
                            <Text style={styles.medName}>{med.name}</Text>
                            <Text style={styles.medDetails}>
                                {med.dosage} - {med.frequency}
                            </Text>
                            <Text style={styles.medDate}>
                                Started: {formatDate(med.start_date)}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Recent Vitals</Text>
                <View style={styles.infoCard}>
                    {patient.vitals.map((vital, index) => (
                        <View key={index} style={styles.vitalItem}>
                            <Text style={styles.vitalType}>{vital.type}</Text>
                            <Text style={styles.vitalValue}>
                                {vital.value} {vital.unit}
                            </Text>
                            <Text style={styles.vitalDate}>
                                {formatDate(vital.date)}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Appointments</Text>
                <View style={styles.infoCard}>
                    {patient.appointments.map((appointment, index) => (
                        <View key={index} style={styles.appointmentItem}>
                            <Text style={styles.appointmentDate}>
                                {formatDate(appointment.date)}
                            </Text>
                            <Text style={[
                                styles.appointmentStatus,
                                styles[`status${appointment.status}`]
                            ]}>
                                {appointment.status.charAt(0).toUpperCase() + 
                                 appointment.status.slice(1)}
                            </Text>
                            {appointment.notes && (
                                <Text style={styles.appointmentNotes}>
                                    {appointment.notes}
                                </Text>
                            )}
                        </View>
                    ))}
                </View>
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        color: '#c62828',
        fontSize: 16,
        marginBottom: 20,
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
        padding: 5,
    },
    backButtonText: {
        color: '#4A90E2',
        fontSize: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 15,
        color: '#333',
    },
    section: {
        marginVertical: 10,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    infoCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    infoText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 8,
    },
    subTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    marginTop: {
        marginTop: 15,
    },
    listItem: {
        fontSize: 14,
        color: '#666',
        marginLeft: 10,
        marginBottom: 5,
    },
    medicationItem: {
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    medName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    medDetails: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    medDate: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    vitalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    vitalType: {
        flex: 1,
        fontSize: 14,
        color: '#333',
    },
    vitalValue: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    vitalDate: {
        flex: 1,
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
    },
    appointmentItem: {
        marginBottom: 15,
        paddingBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    appointmentDate: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
    },
    appointmentStatus: {
        fontSize: 14,
        marginTop: 4,
    },
    statusscheduled: {
        color: '#4A90E2',
    },
    statuscompleted: {
        color: '#4CAF50',
    },
    statuscancelled: {
        color: '#F44336',
    },
    appointmentNotes: {
        fontSize: 14,
        color: '#666',
        marginTop: 8,
        fontStyle: 'italic',
    },
});

export default PatientDetails; 