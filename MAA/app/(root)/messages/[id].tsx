import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext';
import { chatService, Message } from '../../../services/chatService';
import axios from 'axios';
import { API_URL } from '../../../config';

interface ChatDetails {
    id: string;
    doctor: string;
    patient: string;
}

const ChatDetail = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { id: userId } = useUser();
    const [newMessage, setNewMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [doctorId, setDoctorId] = useState<string | null>(null);
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        console.log('[ChatDetail] Component mounted with chat ID:', id);
        loadChatDetails();
        loadMessages();
        // Set up polling for new messages
        console.log('[ChatDetail] Setting up message polling');
        const interval = setInterval(loadMessages, 5000); // Poll every 5 seconds
        return () => {
            console.log('[ChatDetail] Cleaning up polling interval');
            clearInterval(interval);
        };
    }, [id]);

    const loadChatDetails = async () => {
        console.log('[ChatDetail] Loading chat details for chat:', id);
        try {
            const response = await axios.get<ChatDetails>(`${API_URL}/chats/details/${id}`);
            if (!response.data.doctor) {
                console.error('[ChatDetail] No doctor found for chat:', id);
                throw new Error('No doctor found for this chat');
            }
            console.log('[ChatDetail] Successfully loaded chat details. Doctor ID:', response.data.doctor);
            setDoctorId(response.data.doctor);
            return response.data.doctor;
        } catch (err) {
            console.error('[ChatDetail] Error loading chat details:', err);
            setError('Failed to load chat details');
            return null;
        }
    };

    const loadMessages = async () => {
        console.log('[ChatDetail] Loading messages for chat:', id);
        try {
            const fetchedMessages = await chatService.getMessages(id as string);
            console.log('[ChatDetail] Successfully loaded messages:', fetchedMessages.length);
            setMessages(fetchedMessages);
            setError(null);
        } catch (err) {
            console.error('[ChatDetail] Error loading messages:', err);
            setError('Failed to load messages');
        } finally {
            setLoading(false);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender_id === userId.toString();
        return (
            <View style={[
                styles.messageContainer,
                isUser ? styles.userMessageContainer : styles.otherMessageContainer
            ]}>
                <View style={[
                    styles.messageBubble,
                    isUser ? styles.userMessageBubble : styles.otherMessageBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isUser ? styles.userMessageText : styles.otherMessageText
                    ]}>
                        {item.content}
                    </Text>
                </View>
                <Text style={styles.timestamp}>
                    {new Date(item.sent_at).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    })}
                </Text>
            </View>
        );
    };

    const handleSend = async () => {
        if (newMessage.trim().length === 0) return;
        
        try {
            let currentDoctorId = doctorId;
            if (!currentDoctorId) {
                console.log('[ChatDetail] Doctor ID not found, attempting to load chat details');
                currentDoctorId = await loadChatDetails();
                if (!currentDoctorId) {
                    console.error('[ChatDetail] Could not determine doctor for chat:', id);
                    throw new Error('Could not determine doctor for this chat');
                }
            }

            const message = {
                sender_id: userId.toString(),
                receiver_id: currentDoctorId,
                content: newMessage.trim(),
                parent_message_id: undefined
            };

            console.log('[ChatDetail] Attempting to send message:', message);
            await chatService.sendMessage(id as string, message);
            console.log('[ChatDetail] Message sent successfully');
            setNewMessage('');
            loadMessages(); // Reload messages to show the new one
        } catch (err) {
            console.error('[ChatDetail] Error sending message:', err);
            setError('Failed to send message');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4A90E2" />
            </View>
        );
    }

    return (
        <>
            <Stack.Screen options={{ headerShown: false }} />
            <KeyboardAvoidingView 
                style={styles.container} 
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.header}>
                    <TouchableOpacity 
                        style={styles.backButton} 
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        {messages[0]?.sender_id === userId.toString() 
                            ? 'Chat' 
                            : 'Chat'}
                    </Text>
                </View>

                {error && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    style={styles.messagesList}
                    inverted={false}
                    contentContainerStyle={styles.messagesContainer}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Type a message..."
                        multiline
                    />
                    <TouchableOpacity 
                        style={styles.sendButton} 
                        onPress={handleSend}
                    >
                        <Ionicons name="send" size={24} color="#4A90E2" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </>
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
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
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
    messagesList: {
        flex: 1,
    },
    messagesContainer: {
        padding: 16,
    },
    messageContainer: {
        marginBottom: 16,
        maxWidth: '80%',
    },
    userMessageContainer: {
        alignSelf: 'flex-end',
    },
    otherMessageContainer: {
        alignSelf: 'flex-start',
    },
    messageBubble: {
        borderRadius: 20,
        padding: 12,
    },
    userMessageBubble: {
        backgroundColor: '#4A90E2',
    },
    otherMessageBubble: {
        backgroundColor: '#E8E8E8',
    },
    messageText: {
        fontSize: 16,
    },
    userMessageText: {
        color: '#fff',
    },
    otherMessageText: {
        color: '#333',
    },
    timestamp: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        alignItems: 'center',
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
        maxHeight: 100,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default ChatDetail;
