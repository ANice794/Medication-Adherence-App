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

interface Alert {
    id: string;
    patient_id: string;
    patient_name: string;
    type: string;
    severity: string;
    message: string;
    created_at: string;
    status: 'new' | 'viewed' | 'resolved';
}

const Alerts = () => {
    const router = useRouter();
    const { id: doctorId } = useUser();
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<'all' | 'new' | 'viewed' | 'resolved'>('all');

    useEffect(() => {
        loadAlerts();
    }, []);

    const loadAlerts = async () => {
        if (!doctorId) return;

        try {
            const response = await axios.get(`${API_URL}/doctors/${doctorId}/alerts`);
            setAlerts(response.data);
            setError(null);
        } catch (err) {
            console.error('Error loading alerts:', err);
            setError('Failed to load alerts');
        } finally {
            setLoading(false);
        }
    };

    const filteredAlerts = alerts.filter(alert => {
        if (filter === 'all') return true;
        return alert.status === filter;
    });

    const navigateToPatient = (patientId: string) => {
        router.push(`/doctor/patient/${patientId}`);
    };

    const handleAlertAction = async (alertId: string, action: 'view' | 'resolve') => {
        try {
            if (action === 'view') {
                await axios.put(`${API_URL}/doctors/${doctorId}/alerts/${alertId}/view`);
            } else if (action === 'resolve') {
                await axios.put(`${API_URL}/doctors/${doctorId}/alerts/${alertId}/resolve`);
            }
            loadAlerts(); // Reload alerts after action
        } catch (err) {
            console.error(`Error ${action}ing alert:`, err);
            setError(`Failed to ${action} alert`);
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical':
                return '#e53935';
            case 'high':
                return '#f57c00';
            case 'medium':
                return '#ffb300';
            case 'low':
                return '#43a047';
            default:
                return '#757575';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    const renderAlertItem = ({ item }: { item: Alert }) => (
        <View style={styles.alertCard}>
            <View style={styles.alertHeader}>
                <View style={styles.alertMeta}>
                    <View style={[styles.severityBadge, { backgroundColor: getSeverityColor(item.severity) }]}>
                        <Text style={styles.severityText}>{item.severity}</Text>
                    </View>
                    <Text style={styles.alertType}>{item.type}</Text>
                </View>
                <Text style={styles.alertTime}>{formatDate(item.created_at)}</Text>
            </View>
            
            <Text style={styles.alertMessage}>{item.message}</Text>
            
            <View style={styles.alertFooter}>
                <TouchableOpacity 
                    style={styles.patientButton}
                    onPress={() => navigateToPatient(item.patient_id)}
                >
                    <Text style={styles.patientButtonText}>
                        {item.patient_name}
                    </Text>
                </TouchableOpacity>
                
                <View style={styles.actionButtons}>
                    {item.status === 'new' && (
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.viewButton]}
                            onPress={() => handleAlertAction(item.id, 'view')}
                        >
                            <Text style={styles.actionButtonText}>View</Text>
                        </TouchableOpacity>
                    )}
                    
                    {item.status !== 'resolved' && (
                        <TouchableOpacity 
                            style={[styles.actionButton, styles.resolveButton]}
                            onPress={() => handleAlertAction(item.id, 'resolve')}
                        >
                            <Text style={styles.actionButtonText}>Resolve</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>
        </View>
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
                <Text style={styles.title}>Alerts</Text>
            </View>

            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <View style={styles.filterContainer}>
                <TouchableOpacity 
                    style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
                    onPress={() => setFilter('all')}
                >
                    <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>All</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.filterButton, filter === 'new' && styles.activeFilter]}
                    onPress={() => setFilter('new')}
                >
                    <Text style={[styles.filterText, filter === 'new' && styles.activeFilterText]}>New</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.filterButton, filter === 'viewed' && styles.activeFilter]}
                    onPress={() => setFilter('viewed')}
                >
                    <Text style={[styles.filterText, filter === 'viewed' && styles.activeFilterText]}>Viewed</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.filterButton, filter === 'resolved' && styles.activeFilter]}
                    onPress={() => setFilter('resolved')}
                >
                    <Text style={[styles.filterText, filter === 'resolved' && styles.activeFilterText]}>Resolved</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredAlerts}
                renderItem={renderAlertItem}
                keyExtractor={item => item.id}
                style={styles.listContainer}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {filter === 'all' 
                                ? 'No alerts found' 
                                : `No ${filter} alerts found`}
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
    filterContainer: {
        flexDirection: 'row',
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 20,
        marginRight: 8,
        backgroundColor: '#f0f0f0',
    },
    activeFilter: {
        backgroundColor: '#4A90E2',
    },
    filterText: {
        fontSize: 14,
        color: '#666',
    },
    activeFilterText: {
        color: '#fff',
        fontWeight: '600',
    },
    listContainer: {
        padding: 10,
    },
    listContent: {
        paddingBottom: 20,
    },
    alertCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
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
    alertHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    alertMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    severityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
        marginRight: 8,
    },
    severityText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    alertType: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
    },
    alertTime: {
        fontSize: 12,
        color: '#999',
    },
    alertMessage: {
        fontSize: 14,
        color: '#333',
        marginBottom: 15,
        lineHeight: 20,
    },
    alertFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    patientButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#f0f0f0',
        borderRadius: 4,
    },
    patientButtonText: {
        fontSize: 12,
        color: '#4A90E2',
        fontWeight: '600',
    },
    actionButtons: {
        flexDirection: 'row',
    },
    actionButton: {
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 4,
        marginLeft: 8,
    },
    viewButton: {
        backgroundColor: '#e3f2fd',
    },
    resolveButton: {
        backgroundColor: '#e8f5e9',
    },
    actionButtonText: {
        fontSize: 12,
        fontWeight: '600',
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

export default Alerts; 