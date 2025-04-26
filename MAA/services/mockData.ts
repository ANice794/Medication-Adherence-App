import { Message, Chat } from './chatService';

// Mock messages for testing
export const mockMessages: { [key: string]: Message[] } = {
    '1': [
        { 
            id: '1', 
            chat_id: '1', 
            sender_id: '2', 
            receiver_id: '1', 
            content: 'Hello! How are you feeling today?', 
            sent_at: new Date(Date.now() - 3600000).toISOString(), 
            is_read: true 
        },
        { 
            id: '2', 
            chat_id: '1', 
            sender_id: '1', 
            receiver_id: '2', 
            content: 'I\'m doing well, thanks for asking!', 
            sent_at: new Date(Date.now() - 3500000).toISOString(), 
            is_read: true 
        },
        { 
            id: '3', 
            chat_id: '1', 
            sender_id: '2', 
            receiver_id: '1', 
            content: 'Have you been taking your medications as prescribed?', 
            sent_at: new Date(Date.now() - 3400000).toISOString(), 
            is_read: true 
        },
        { 
            id: '4', 
            chat_id: '1', 
            sender_id: '1', 
            receiver_id: '2', 
            content: 'Yes, I\'ve been following the schedule exactly.', 
            sent_at: new Date(Date.now() - 3300000).toISOString(), 
            is_read: true 
        },
    ],
    '2': [
        { 
            id: '1', 
            chat_id: '2', 
            sender_id: '3', 
            receiver_id: '1', 
            content: 'Your prescription is ready for pickup at the pharmacy.', 
            sent_at: new Date(Date.now() - 7200000).toISOString(), 
            is_read: true 
        },
        { 
            id: '2', 
            chat_id: '2', 
            sender_id: '1', 
            receiver_id: '3', 
            content: 'Thanks! I\'ll pick it up today.', 
            sent_at: new Date(Date.now() - 7100000).toISOString(), 
            is_read: true 
        },
    ],
    '3': [
        { 
            id: '1', 
            chat_id: '3', 
            sender_id: '4', 
            receiver_id: '1', 
            content: 'Great progress on your medication adherence!', 
            sent_at: new Date(Date.now() - 86400000).toISOString(), 
            is_read: false 
        },
        { 
            id: '2', 
            chat_id: '3', 
            sender_id: '1', 
            receiver_id: '4', 
            content: 'Thank you! The reminders really help.', 
            sent_at: new Date(Date.now() - 86300000).toISOString(), 
            is_read: true 
        },
    ],
};

// Mock chats for testing
export const mockChats: Chat[] = [
    {
        id: '1',
        participants: ['1', '2'],
        last_message: mockMessages['1'][mockMessages['1'].length - 1],
        unread_count: 0
    },
    {
        id: '2',
        participants: ['1', '3'],
        last_message: mockMessages['2'][mockMessages['2'].length - 1],
        unread_count: 0
    },
    {
        id: '3',
        participants: ['1', '4'],
        last_message: mockMessages['3'][mockMessages['3'].length - 1],
        unread_count: 1
    }
]; 