import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack initialRouteName="startup">
            <Stack.Screen name="startup" options={{ headerShown: false, title: 'Start Up' }} />
            <Stack.Screen name="login" options={{ headerShown: false, title: 'Login' }} />
            <Stack.Screen name='sign-up' options={{ headerShown: false, title: 'Sign Up' }} />
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen name='add-medication' options={{ headerShown: false, title: 'Add Medication' }} />
            <Stack.Screen name='messages' options={{ headerShown: false }} />
        </Stack>
    );
}
