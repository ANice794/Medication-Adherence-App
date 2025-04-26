import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '../../context/UserContext';

export default function DoctorLayout() {
    const router = useRouter();
    const { logout } = useUser();

    const handleLogout = () => {
        logout();
        router.replace('/');
    };

    return (
        <Tabs screenOptions={{
            tabBarActiveTintColor: '#4A90E2',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: {
                borderTopWidth: 1,
                borderTopColor: '#e0e0e0',
                backgroundColor: '#fff',
            },
            headerStyle: {
                backgroundColor: '#fff',
            },
            headerTitleStyle: {
                color: '#333',
                fontWeight: 'bold',
            },
            headerRight: () => (
                <TouchableOpacity 
                    style={styles.logoutButton} 
                    onPress={handleLogout}
                >
                    <Ionicons name="log-out-outline" size={24} color="#4A90E2" />
                </TouchableOpacity>
            ),
        }}>
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="patients"
                options={{
                    title: 'Patients',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="people" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="messages"
                options={{
                    title: 'Messages',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="chatbubbles" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="alerts"
                options={{
                    title: 'Alerts',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="alert-circle" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    logoutButton: {
        marginRight: 15,
    },
}); 