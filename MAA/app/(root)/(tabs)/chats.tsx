import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ActivityIndicator, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { useUser } from '../../../context/UserContext'
import { chatService } from '../../../services/chatService'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

interface ChatPreview {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    unreadCount: number;
    profilePicture?: string;
}

interface Doctor {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    specialty: string;
}

const Chats = () => {
    const router = useRouter();
    const { id: userId } = useUser();
    const [chatPreviews, setChatPreviews] = useState<ChatPreview[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [showDoctorModal, setShowDoctorModal] = useState(false);

    useEffect(() => {
        console.log('[ChatsList] Component mounted');
        loadChats();
        loadDoctors();
        // Set up polling for new chats
        console.log('[ChatsList] Setting up chat polling');
        const interval = setInterval(loadChats, 30000); // Poll every 30 seconds
        return () => {
            console.log('[ChatsList] Cleaning up polling interval');
            clearInterval(interval);
        };
    }, []);

    const loadChats = async () => {
        console.log('[ChatsList] Loading chats for user:', userId);
        if (!userId) return;
        
        try {
            const response = await chatService.getAllChats(userId.toString());
            console.log('[ChatsList] Successfully loaded chats:', response.length);
            const previews: ChatPreview[] = response.map(chat => ({
                id: chat.id,
                name: 'Chat', // You might want to fetch the other participant's name
                lastMessage: chat.last_message?.content || 'No messages yet',
                timestamp: chat.last_message 
                    ? new Date(chat.last_message.sent_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                    })
                    : '',
                unreadCount: chat.unread_count,
                profilePicture: undefined // You might want to fetch the other participant's profile picture
            }));
            
            setChatPreviews(previews);
            setError(null);
        } catch (err) {
            console.error('[ChatsList] Error loading chats:', err);
            setError('Failed to load chats');
        } finally {
            setLoading(false);
        }
    };

    const loadDoctors = async () => {
        if (!userId) return;
        
        try {
            const response = await axios.get(`${API_URL}/patients/${userId}/doctor`);
            setDoctors(response.data as Doctor[]);
        } catch (err) {
            console.error('Error loading doctors:', err);
            setError('Failed to load doctors');
        }
    };

    const handleCreateChat = async (doctorId: string) => {
        console.log('[ChatsList] Starting new chat with doctor:', doctorId);
        try {
            const response = await axios.post(`${API_URL}/doctor/${doctorId}/patient/${userId}`);
            const newChatId = (response.data as { id: string }).id;
            setShowDoctorModal(false);
            router.push(`/messages/${newChatId}`);
            loadChats(); // Refresh the chat list
        } catch (err) {
            console.error('[ChatsList] Error creating chat:', err);
            setError('Failed to create chat');
        }
    };

    const renderChatPreview = ({ item }: { item: ChatPreview }) => (
        <TouchableOpacity 
            style={styles.chatPreview}
            onPress={() => {
                console.log('[ChatsList] Navigating to chat:', item.id);
                router.push(`/chats/${item.id}`);
            }}
        >
            <View style={styles.profilePictureContainer}>
                {item.profilePicture ? (
                    <Image 
                        source={{ uri: item.profilePicture }} 
                        style={styles.profilePicture} 
                    />
                ) : (
                    <View style={styles.defaultProfilePicture}>
                        <Ionicons name="person" size={30} color="#fff" />
                    </View>
                )}
            </View>
            
            <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Text style={styles.timestamp}>{item.timestamp}</Text>
                </View>
                <View style={styles.messagePreview}>
                    <Text 
                        style={[
                            styles.lastMessage,
                            item.unreadCount > 0 && styles.unreadMessage
                        ]}
                        numberOfLines={1}
                    >
                        {item.lastMessage}
                    </Text>
                    {item.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                            <Text style={styles.unreadCount}>{item.unreadCount}</Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    const renderDoctorItem = ({ item }: { item: Doctor }) => (
        <TouchableOpacity 
            style={styles.doctorItem}
            onPress={() => handleCreateChat(item.id)}
        >
            <View style={styles.defaultProfilePicture}>
                <Ionicons name="person" size={30} color="#fff" />
            </View>
            <Text style={styles.doctorName}>Dr. {item.first_name} {item.last_name}</Text>
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
                <Text style={styles.title}>Messages</Text>
                <TouchableOpacity 
                    style={styles.newChatButton}
                    onPress={() => setShowDoctorModal(true)}
                >
                    <Ionicons name="create-outline" size={24} color="#4A90E2" />
                </TouchableOpacity>
            </View>
            
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <FlatList
                data={chatPreviews}
                renderItem={renderChatPreview}
                keyExtractor={item => item.id}
                style={styles.chatList}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No messages yet</Text>
                    </View>
                }
            />

            <Modal
                visible={showDoctorModal}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setShowDoctorModal(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select a Doctor</Text>
                            <TouchableOpacity 
                                onPress={() => setShowDoctorModal(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>
                        
                        <FlatList
                            data={doctors}
                            renderItem={renderDoctorItem}
                            keyExtractor={item => item.id}
                            ListEmptyComponent={
                                <View style={styles.emptyContainer}>
                                    <Text style={styles.emptyText}>No doctors found</Text>
                                </View>
                            }
                        />
                    </View>
                </View>
            </Modal>
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
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    errorContainer: {
        padding: 10,
        backgroundColor: '#ffebee',
        marginHorizontal: 16,
        marginTop: 8,
        borderRadius: 8,
    },
    errorText: {
        color: '#c62828',
        textAlign: 'center',
    },
    chatList: {
        flex: 1,
    },
    chatPreview: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    profilePictureContainer: {
        marginRight: 12,
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    defaultProfilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#4A90E2',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatInfo: {
        flex: 1,
    },
    chatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
    },
    messagePreview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    lastMessage: {
        flex: 1,
        fontSize: 14,
        color: '#666',
        marginRight: 8,
    },
    unreadMessage: {
        color: '#333',
        fontWeight: '500',
    },
    unreadBadge: {
        backgroundColor: '#4A90E2',
        borderRadius: 12,
        minWidth: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 6,
    },
    unreadCount: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '600',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    emptyText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    newChatButton: {
        padding: 8,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        minHeight: '50%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 8,
    },
    doctorItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    doctorName: {
        fontSize: 16,
        marginLeft: 15,
        color: '#333',
    },
});

export default Chats;