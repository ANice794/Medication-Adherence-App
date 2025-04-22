import { Stack, useRouter } from "expo-router";
import { UserProvider, useUser } from '../context/UserContext';
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View, ActivityIndicator } from "react-native";
import { SafeAreaProvider } from 'react-native-safe-area-context';

function RootLayoutNav() {
    const router = useRouter();
    const { isLoggedIn, setIsLoggedIn, setEmail, setFirstName } = useUser();

    useEffect(() => {
        const checkLoginStatus = async () => {
            const storedIsLoggedIn = await AsyncStorage.getItem("isLoggedIn");
            const storedEmail = await AsyncStorage.getItem("email");
            const storedFirstName = await AsyncStorage.getItem("firstName");

            if (storedIsLoggedIn === "true" && storedEmail && storedFirstName) {
                setIsLoggedIn(true);
                setEmail(storedEmail);
                setFirstName(storedFirstName);
                router.replace("/(root)/(tabs)");
            } else {
                setIsLoggedIn(false);
                setEmail("");
                setFirstName("");
                router.replace("/login");
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
