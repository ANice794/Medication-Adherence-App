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
            try {
                const storedIsLoggedIn = await AsyncStorage.getItem("isLoggedIn");
                console.log("Stored isLoggedIn value:", storedIsLoggedIn);
                
                if (storedIsLoggedIn === "true") {
                    // Load all user data from AsyncStorage
                    console.log("Loading user data from AsyncStorage...");
                    const storedId = await AsyncStorage.getItem("id");
                    const storedEmail = await AsyncStorage.getItem("email");
                    const storedPassword = await AsyncStorage.getItem("password");
                    const storedFirstName = await AsyncStorage.getItem("firstName");
                    const storedLastName = await AsyncStorage.getItem("lastName");
                    const storedDob = await AsyncStorage.getItem("dob");
                    const storedRole = await AsyncStorage.getItem("role");
                    const storedProfilePicture = await AsyncStorage.getItem("profilePicture");
                    
                    console.log("Loaded user data from AsyncStorage:");
                    console.log("id:", storedId);
                    console.log("email:", storedEmail);
                    console.log("firstName:", storedFirstName);
                    console.log("lastName:", storedLastName);
                    console.log("dob:", storedDob);
                    console.log("role:", storedRole);
                    
                    // Set all user data in the context
                    setUser({
                        id: storedId ? parseInt(storedId) : 0,
                        email: storedEmail || '',
                        password: storedPassword || '',
                        firstName: storedFirstName || '',
                        lastName: storedLastName || '',
                        dob: storedDob || '',
                        role: storedRole || '',
                        profilePicture: storedProfilePicture || '',
                        isLoggedIn: true,
                        setId: () => {},
                        setEmail: () => {},
                        setPassword: () => {},
                        setFirstName: () => {},
                        setLastName: () => {},
                        setDob: () => {},
                        setRole: () => {},
                        setProfilePicture: () => {},
                        setIsLoggedIn: () => {},
                        setUser: () => {},
                    });
                    
                    console.log("User context updated with stored data");
                    router.replace("/(root)/(tabs)");
                } else {
                    console.log("User not logged in, redirecting to startup page");
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
                        isLoggedIn: false,
                        setId: () => {},
                        setEmail: () => {},
                        setPassword: () => {},
                        setFirstName: () => {},
                        setLastName: () => {},
                        setDob: () => {},
                        setRole: () => {},
                        setProfilePicture: () => {},
                        setIsLoggedIn: () => {},
                        setUser: () => {},
                    });
                    
                    router.replace("/startup");
                }
            } catch (error) {
                console.error("Error checking login status:", error);
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
