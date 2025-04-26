import axios from 'axios';
import { API_URL } from '../config';
import { mockMessages, mockChats } from './mockData';

// Configuration
const USE_MOCK_DATA = process.env.EXPO_PUBLIC_USE_MOCK_DATA === 'true';

// Error types
export class ChatError extends Error {
    constructor(message: string, public code?: string) {
        super(message);
        this.name = 'ChatError';
    }
}

export class NetworkError extends ChatError {
    constructor(message: string) {
        super(message, 'NETWORK_ERROR');
        this.name = 'NetworkError';
    }
}

export interface Message {
    id: string;
    chat_id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    sent_at: string;
    is_read: boolean;
    parent_message_id?: string;
}

export interface Chat {
    id: string;
    participants: string[];
    last_message?: Message;
    unread_count: number;
}

export class ChatService {
    private static instance: ChatService;
    private baseUrl: string;

    private constructor() {
        this.baseUrl = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/chats';
    }

    public static getInstance(): ChatService {
        if (!ChatService.instance) {
            ChatService.instance = new ChatService();
        }
        return ChatService.instance;
    }

    private async handleResponse<T>(response: Response): Promise<T> {
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new ChatError(error.message || 'An error occurred', error.code);
        }
        return response.json();
    }

    private async fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000): Promise<Response> {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            clearTimeout(id);
            return response;
        } catch (error: unknown) {
            clearTimeout(id);
            if (error instanceof Error && error.name === 'AbortError') {
                throw new NetworkError('Request timed out');
            }
            throw error;
        }
    }

    async getAllChats(userId: string): Promise<Chat[]> {
        console.log('[ChatService] Getting all chats for user:', userId);
        if (USE_MOCK_DATA) {
            console.log('[ChatService] Using mock data for getAllChats');
            return mockChats;
        }

        try {
            console.log('[ChatService] Fetching chats from API');
            const response = await this.fetchWithTimeout(`${this.baseUrl}/${userId}`);
            const chats = await this.handleResponse<Chat[]>(response);
            console.log('[ChatService] Successfully fetched chats:', chats.length);
            return chats;
        } catch (error) {
            console.error('[ChatService] Error fetching chats:', error);
            throw error instanceof ChatError ? error : new ChatError('Failed to fetch chats');
        }
    }

    async getMessages(chatId: string): Promise<Message[]> {
        console.log('[ChatService] Getting messages for chat:', chatId);
        if (USE_MOCK_DATA) {
            console.log('[ChatService] Using mock data for getMessages');
            return mockMessages[chatId] || [];
        }

        try {
            console.log('[ChatService] Fetching messages from API');
            const response = await this.fetchWithTimeout(`${this.baseUrl}/${chatId}/messages`);
            const messages = await this.handleResponse<Message[]>(response);
            console.log('[ChatService] Successfully fetched messages:', messages.length);
            return messages;
        } catch (error) {
            console.error('[ChatService] Error fetching messages:', error);
            throw error instanceof ChatError ? error : new ChatError('Failed to fetch messages');
        }
    }

    async sendMessage(chatId: string, message: {
        sender_id: string;
        receiver_id: string;
        content: string;
        parent_message_id?: string;
    }): Promise<Message> {
        console.log('[ChatService] Sending message in chat:', chatId, 'Message:', message);
        if (USE_MOCK_DATA) {
            console.log('[ChatService] Using mock data for sendMessage');
            const newMessage: Message = {
                ...message,
                id: Date.now().toString(),
                chat_id: chatId,
                sent_at: new Date().toISOString(),
                is_read: false
            };
            if (!mockMessages[chatId]) {
                mockMessages[chatId] = [];
            }
            mockMessages[chatId].push(newMessage);
            console.log('[ChatService] Successfully sent mock message:', newMessage);
            return newMessage;
        }

        try {
            console.log('[ChatService] Sending message to API');
            const response = await this.fetchWithTimeout(`${this.baseUrl}/${chatId}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    sender_id: message.sender_id,
                    receiver_id: message.receiver_id,
                    content: message.content,
                    parent_message_id: message.parent_message_id
                }),
            });
            const sentMessage = await this.handleResponse<Message>(response);
            console.log('[ChatService] Successfully sent message:', sentMessage);
            return sentMessage;
        } catch (error) {
            console.error('[ChatService] Error sending message:', error);
            throw error instanceof ChatError ? error : new ChatError('Failed to send message');
        }
    }

    async markMessageAsRead(messageId: string): Promise<void> {
        if (USE_MOCK_DATA) {
            // Find the message in all chats and mark it as read
            Object.keys(mockMessages).forEach(chatId => {
                const messageIndex = mockMessages[chatId].findIndex(msg => msg.id === messageId);
                if (messageIndex !== -1) {
                    mockMessages[chatId][messageIndex].is_read = true;
                }
            });
            return;
        }
        
        try {
            await axios.put(`${API_URL}/messages/read/${messageId}`);
        } catch (error) {
            console.error('Error marking message as read:', error);
            throw error;
        }
    }

    async getUnreadMessages(userId: string): Promise<Message[]> {
        if (USE_MOCK_DATA) {
            return Object.values(mockMessages)
                .flat()
                .filter((msg: Message) => !msg.is_read && msg.receiver_id === userId);
        }

        try {
            const response = await this.fetchWithTimeout(`${this.baseUrl}/messages/unread/${userId}`);
            return await this.handleResponse<Message[]>(response);
        } catch (error) {
            console.error('Error fetching unread messages:', error);
            throw error instanceof ChatError ? error : new ChatError('Failed to fetch unread messages');
        }
    }
}

export const chatService = ChatService.getInstance(); 