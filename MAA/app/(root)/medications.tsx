import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter, Stack } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useUser } from '../../context/UserContext';
import axios from 'axios';

interface Medication {
    id: number;
    name: string;
    dosage: string;
    frequency: string;
    taken: boolean;
    schedule_time: string;
}

export default function AllMedications() {
    const router = useRouter();
    const { id } = useUser();
    const [medications, setMedications] = useState<Medication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMedications();
    }, []);

    const fetchMedications = async () => {
        try {
            const response = await axios.get<Medication[]>(`http://localhost:3000/medications/patients/${id}`);
            setMedications(response.data);
        } catch (error) {
            console.error('Error fetching medications:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderMedication = ({ item }: { item: Medication }) => (
        <View style={styles.medicationCard}>
            <View style={styles.medicationHeader}>
                <Text style={styles.medicationName}>{item.name}</Text>
                <View style={[styles.statusIndicator, 
                    item.taken ? styles.takenIndicator : styles.notTakenIndicator]}>
                    <Text style={styles.statusText}>
                        {item.taken ? 'Taken' : 'Not Taken'}
                    </Text>
                </View>
            </View>
            <View style={styles.medicationDetails}>
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="pill" size={20} color="#666" />
                    <Text style={styles.detailText}>Dosage: {item.dosage}</Text>
                </View>
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
                    <Text style={styles.detailText}>
                        Schedule: {new Date(item.schedule_time).toLocaleTimeString()}
                    </Text>
                </View>
                <View style={styles.detailRow}>
                    <MaterialCommunityIcons name="calendar-clock" size={20} color="#666" />
                    <Text style={styles.detailText}>Frequency: {item.frequency}</Text>
                </View>
            </View>
        </View>
    );

    return (
        <>
            <Stack.Screen 
                options={{
                    title: 'All Medications',
                    headerLeft: () => (
                        <TouchableOpacity 
                            onPress={() => router.back()}
                            style={styles.backButton}
                        >
                            <MaterialCommunityIcons name="arrow-left" size={24} color="#333" />
                        </TouchableOpacity>
                    ),
                }} 
            />
            <View style={styles.container}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text>Loading medications...</Text>
                    </View>
                ) : (
                    <FlatList
                        data={medications}
                        renderItem={renderMedication}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={styles.listContainer}
                        showsVerticalScrollIndicator={false}
                    />
                )}
            </View>
        </>
    );
}

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
    listContainer: {
        padding: 16,
    },
    backButton: {
        marginLeft: 16,
    },
    medicationCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    medicationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    medicationName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
    },
    medicationDetails: {
        gap: 8,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#666',
    },
    statusIndicator: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        minWidth: 80,
        alignItems: 'center',
    },
    takenIndicator: {
        backgroundColor: '#4CAF50',
    },
    notTakenIndicator: {
        backgroundColor: '#FF5252',
    },
    statusText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
    },
}); 