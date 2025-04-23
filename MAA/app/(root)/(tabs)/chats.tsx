import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

interface ChatPreview {
    id: string;
    name: string;
    lastMessage: string;
    timestamp: string;
    profilePicture: string | null;
    unreadCount: number;
}

// Mock data for chat previews
const chatPreviews: ChatPreview[] = [
    {
        id: '1',
        name: 'Dr. Sarah Johnson',
        lastMessage: 'Your next appointment is scheduled for...',
        timestamp: '10:30 AM',
        profilePicture: null,
        unreadCount: 2,
    },
    {
        id: '2',
        name: 'Pharmacy Support',
        lastMessage: 'Your prescription is ready for pickup',
        timestamp: 'Yesterday',
        profilePicture: null,
        unreadCount: 0,
    },
    {
        id: '3',
        name: 'Health Coach Mike',
        lastMessage: 'Great progress on your medication adherence!',
        timestamp: 'Yesterday',
        profilePicture: null,
        unreadCount: 1,
    },
];

const Chats = () => {
    const router = useRouter();

    const renderChatPreview = ({ item }: { item: ChatPreview }) => (
        <TouchableOpacity 
            style={styles.chatPreview}
            onPress={() => {
                // Navigate to individual chat
                router.push(`/messages/${item.id}`);
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
                        <View style={styles.unreadDot} />
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Messages</Text>
            </View>
            <FlatList
                data={chatPreviews}
                renderItem={renderChatPreview}
                keyExtractor={item => item.id}
                style={styles.chatList}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    chatList: {
        flex: 1,
    },
    chatPreview: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        alignItems: 'center',
    },
    profilePictureContainer: {
        marginRight: 16,
    },
    profilePicture: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    defaultProfilePicture: {
        width: 60,
        height: 60,
        borderRadius: 30,
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
        fontSize: 14,
        color: '#666',
        flex: 1,
        marginRight: 8,
    },
    unreadMessage: {
        color: '#333',
        fontWeight: '500',
    },
    unreadDot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#4A90E2',
        marginLeft: 8,
    },
});

export default Chats;