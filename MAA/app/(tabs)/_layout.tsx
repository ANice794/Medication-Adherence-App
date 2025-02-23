import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#4A90E2',
                headerShown: false,
            }}
        >
            <Tabs.Screen name="profile" options={{ 
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'person': 'person-outline'} color={color} size={24} />
                ),
                }} 
            />
            <Tabs.Screen name="health" options={{ 
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'heart-sharp': 'heart-outline'} color={color} size={24} />
                ),
                }} 
            />
            <Tabs.Screen name="index" options={{ 
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'home-sharp': 'home-outline'} color={color} size={24} />
                ),
                }} 
            />
            <Tabs.Screen name="messages" options={{ 
                title: '', 
                tabBarIcon: ({ color, focused}) => (
                    <MaterialCommunityIcons name={focused ? 'message-reply' : 'message-reply-outline'} color={color} size={24} />
                ),
            }} 
            />
            <Tabs.Screen name="shop" options={{ 
                title: '',
                tabBarIcon: ({ color, focused }) => (
                    <MaterialCommunityIcons name={focused ? 'shopping': 'shopping-outline'} color={color} size={24} />
                ),
                }} 
            />
        </Tabs>
    );
}
