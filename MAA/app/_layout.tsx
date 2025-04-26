import { Stack, useRouter } from "expo-router";
import { UserProvider, useUser } from '../context/UserContext';
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

function RootLayoutNav() {
    const router = useRouter();
    const { isLoggedIn, setUser } = useUser();

    useEffect(() => {
        const checkLoginStatus = async () => {
            console.log("=== Starting Authentication Check ===");
            try {
                // First, check if we have any stored data at all
                const allKeys = await AsyncStorage.getAllKeys();
                console.log("All stored keys:", allKeys);

                const storedIsLoggedIn = await AsyncStorage.getItem("isLoggedIn");
                console.log("Stored isLoggedIn value:", storedIsLoggedIn);

                // If isLoggedIn is not explicitly "true", clear everything and redirect
                if (storedIsLoggedIn !== "true") {
                    console.log("Not logged in, clearing any residual data...");
                    await AsyncStorage.multiRemove(allKeys);
                    setUser({
                        id: 0,
                        email: '',
                        password: '',
                        firstName: '',
                        lastName: '',
                        dob: '',
                        role: '',
                        profilePicture: '',
                        points: 0,
                        streak: 0,
                        activeItems: [],
                        currentTheme: {
                            primary: '#4A90E2',
                            background: '#f5f5f5',
                            text: '#333333',
                            secondary: '#666666',
                        },
                        isLoggedIn: false,
                        setId: () => {},
                        setEmail: () => {},
                        setPassword: () => {},
                        setFirstName: () => {},
                        setLastName: () => {},
                        setDob: () => {},
                        setRole: () => {},
                        setProfilePicture: () => {},
                        setPoints: () => {},
                        addPoints: () => {},
                        deductPoints: () => {},
                        setStreak: () => {},
                        incrementStreak: () => {},
                        resetStreak: () => {},
                        setActiveItems: () => {},
                        addActiveItem: () => {},
                        hasActiveItem: () => false,
                        setTheme: () => {},
                        setIsLoggedIn: () => {},
                        setUser: () => {},
                    });
                    console.log("Redirecting to startup page...");
                    router.replace("/startup");
                    return;
                }

                // Load all user data from AsyncStorage
                console.log("Loading user data from AsyncStorage...");
                const storedData = await Promise.all([
                    AsyncStorage.getItem("id"),
                    AsyncStorage.getItem("email"),
                    AsyncStorage.getItem("password"),
                    AsyncStorage.getItem("firstName"),
                    AsyncStorage.getItem("lastName"),
                    AsyncStorage.getItem("dob"),
                    AsyncStorage.getItem("role"),
                    AsyncStorage.getItem("profilePicture")
                ]);

                const [
                    storedId,
                    storedEmail,
                    storedPassword,
                    storedFirstName,
                    storedLastName,
                    storedDob,
                    storedRole,
                    storedProfilePicture
                ] = storedData;

                // Validate required fields
                if (!storedId || !storedEmail || !storedRole) {
                    console.error("Missing required user data:");
                    console.error({
                        id: storedId,
                        email: storedEmail,
                        role: storedRole
                    });
                    throw new Error("Missing required user data");
                }

                // Validate ID format
                const userId = parseInt(storedId);
                if (isNaN(userId) || userId <= 0) {
                    console.error("Invalid user ID:", storedId);
                    throw new Error("Invalid user ID");
                }

                console.log("Loaded user data:", {
                    id: userId,
                    email: storedEmail,
                    firstName: storedFirstName,
                    lastName: storedLastName,
                    role: storedRole
                });

                // Set all user data in the context
                setUser({
                    id: userId,
                    email: storedEmail,
                    password: storedPassword || '',
                    firstName: storedFirstName || '',
                    lastName: storedLastName || '',
                    dob: storedDob || '',
                    role: storedRole,
                    profilePicture: storedProfilePicture || '',
                    points: 0,
                    streak: 0,
                    activeItems: [],
                    currentTheme: {
                        primary: '#4A90E2',
                        background: '#f5f5f5',
                        text: '#333333',
                        secondary: '#666666',
                    },
                    isLoggedIn: true,
                    setId: () => {},
                    setEmail: () => {},
                    setPassword: () => {},
                    setFirstName: () => {},
                    setLastName: () => {},
                    setDob: () => {},
                    setRole: () => {},
                    setProfilePicture: () => {},
                    setPoints: () => {},
                    addPoints: () => {},
                    deductPoints: () => {},
                    setStreak: () => {},
                    incrementStreak: () => {},
                    resetStreak: () => {},
                    setActiveItems: () => {},
                    addActiveItem: () => {},
                    hasActiveItem: () => false,
                    setTheme: () => {},
                    setIsLoggedIn: () => {},
                    setUser: () => {},
                });

                console.log("User context updated successfully");
                console.log("Redirecting to tabs...");
                router.replace("/(root)/(tabs)");

            } catch (error) {
                console.error("=== Authentication Error ===");
                console.error("Error details:", error);
                
                // Clear all stored data on error
                console.log("Clearing all stored data due to error...");
                try {
                    const keys = await AsyncStorage.getAllKeys();
                    await AsyncStorage.multiRemove(keys);
                } catch (clearError) {
                    console.error("Error clearing storage:", clearError);
                }

                // Reset user context
                setUser({
                    id: 0,
                    email: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    dob: '',
                    role: '',
                    profilePicture: '',
                    points: 0,
                    streak: 0,
                    activeItems: [],
                    currentTheme: {
                        primary: '#4A90E2',
                        background: '#f5f5f5',
                        text: '#333333',
                        secondary: '#666666',
                    },
                    isLoggedIn: false,
                    setId: () => {},
                    setEmail: () => {},
                    setPassword: () => {},
                    setFirstName: () => {},
                    setLastName: () => {},
                    setDob: () => {},
                    setRole: () => {},
                    setProfilePicture: () => {},
                    setPoints: () => {},
                    addPoints: () => {},
                    deductPoints: () => {},
                    setStreak: () => {},
                    incrementStreak: () => {},
                    resetStreak: () => {},
                    setActiveItems: () => {},
                    addActiveItem: () => {},
                    hasActiveItem: () => false,
                    setTheme: () => {},
                    setIsLoggedIn: () => {},
                    setUser: () => {},
                });

                console.log("Redirecting to startup after error...");
                router.replace("/startup");
            }
        };

        checkLoginStatus();
    }, []);

    return (
        <Stack>
            <Stack.Screen name="(root)" options={{ headerShown: false }} />
        </Stack>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <UserProvider>
                <RootLayoutNav />
            </UserProvider>
        </SafeAreaProvider>
    );
}
