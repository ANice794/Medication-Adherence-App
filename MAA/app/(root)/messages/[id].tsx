import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext';

interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: string;
}

// Mock data - in a real app, this would come from your backend
const mockMessages: { [key: string]: Message[] } = {
    '1': [
        { id: '1', text: 'Hello! How are you feeling today?', sender: 'Dr. Sarah Johnson', timestamp: '10:30 AM' },
        { id: '2', text: 'I\'m doing well, thanks for asking!', sender: 'user', timestamp: '10:31 AM' },
        { id: '3', text: 'Have you been taking your medications as prescribed?', sender: 'Dr. Sarah Johnson', timestamp: '10:31 AM' },
        { id: '4', text: 'Yes, I\'ve been following the schedule exactly.', sender: 'user', timestamp: '10:32 AM' },
    ],
    '2': [
        { id: '1', text: 'Your prescription is ready for pickup at the pharmacy.', sender: 'Pharmacy Support', timestamp: '9:00 AM' },
        { id: '2', text: 'Thanks! I\'ll pick it up today.', sender: 'user', timestamp: '9:05 AM' },
    ],
    '3': [
        { id: '1', text: 'Great progress on your medication adherence!', sender: 'Health Coach Mike', timestamp: 'Yesterday' },
        { id: '2', text: 'Thank you! The reminders really help.', sender: 'user', timestamp: 'Yesterday' },
    ],
};

const ChatDetail = () => {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const { firstName } = useUser();
    const [newMessage, setNewMessage] = useState('');
    const messages = mockMessages[id as string] || [];

    const renderMessage = ({ item }: { item: Message }) => {
        const isUser = item.sender === 'user';
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
                        {item.text}
                    </Text>
                </View>
                <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
        );
    };

    const handleSend = () => {
        if (newMessage.trim().length === 0) return;
        
        // In a real app, you would send this to your backend
        console.log('Sending message:', newMessage);
        setNewMessage('');
    };

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
                        {messages[0]?.sender === 'user' ? messages[1]?.sender : messages[0]?.sender}
                    </Text>
                </View>

                <FlatList
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    style={styles.messagesList}
                    inverted={false}
                    contentContainerStyle={styles.messagesContainer}
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
