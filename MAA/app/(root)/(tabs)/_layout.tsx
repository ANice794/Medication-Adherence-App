import { useRouter, Tabs } from "expo-router";
import { useEffect } from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useUser } from "../../../context/UserContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";

export default function TabsLayout() {
    const router = useRouter();
    const { isLoggedIn } = useUser();

    useEffect(() => {
        const checkAuth = async () => {
            const storedIsLoggedIn = await AsyncStorage.getItem("isLoggedIn");
            if (storedIsLoggedIn !== "true") {
                router.replace("/login");
            }
        };

        checkAuth();
    }, [isLoggedIn]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: '#4A90E2',
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#ffffff',
                        borderTopWidth: 1,
                        borderTopColor: '#e0e0e0',
                    },
                }}
            >
                <Tabs.Screen 
                    name="index" 
                    options={{
                        title: 'Home',
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons 
                                name={focused ? 'home' : 'home-outline'} 
                                color={color} 
                                size={24} 
                            />
                        ),
                    }}
                />
                <Tabs.Screen 
                    name="health" 
                    options={{
                        title: 'Health',
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons 
                                name={focused ? 'heart' : 'heart-outline'} 
                                color={color} 
                                size={24} 
                            />
                        ),
                    }}
                />
                <Tabs.Screen 
                    name="profile" 
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color, focused }) => (
                            <Ionicons 
                                name={focused ? 'person' : 'person-outline'} 
                                color={color} 
                                size={24} 
                            />
                        ),
                    }}
                />
                <Tabs.Screen 
                    name="chats" 
                    options={{
                        title: 'Chats',
                        tabBarIcon: ({ color, focused }) => (
                            <MaterialCommunityIcons 
                                name={focused ? 'message-text' : 'message-text-outline'} 
                                color={color} 
                                size={24} 
                            />
                        ),
                    }}
                />
                <Tabs.Screen 
                    name="shop" 
                    options={{
                        title: 'Shop',
                        tabBarIcon: ({ color, focused }) => (
                            <MaterialCommunityIcons 
                                name={focused ? 'shopping' : 'shopping-outline'} 
                                color={color} 
                                size={24} 
                            />
                        ),
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
}