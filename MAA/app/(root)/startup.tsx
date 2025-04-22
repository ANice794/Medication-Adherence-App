import { View, Text, ScrollView, Image, TouchableOpacity, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'

const StartPage = () => {
    const router = useRouter();

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.imageContainer}>
                    <Image 
                        source={require('../../assets/images/logo1000.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                <View style={styles.contentContainer}>
                    <Text style={styles.title}>Welcome to</Text>
                    <Text style={styles.appName}>MedAdhere</Text>
                    <Text style={styles.subtitle}>Your Personal Medication Companion</Text>

                    <View style={styles.buttonContainer}>
                        <Pressable 
                            style={styles.button}
                            onPress={() => router.push('/login')}
                        >
                            <Text style={styles.buttonText}>Login</Text>
                        </Pressable>
                        
                        <Pressable 
                            style={[styles.button, styles.secondaryButton, styles.topSpacing]}
                            onPress={() => router.push('/sign-up')}
                        >
                            <Text style={[styles.buttonText, styles.secondaryButtonText]}>Sign Up</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 300,
        height: 300,
    },
    contentContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        color: '#333',
        marginBottom: 8,
    },
    appName: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#2196F3',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 40,
    },
    buttonContainer: {
        width: '100%',
    },
    button: {
        backgroundColor: '#2196F3',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        width: '100%',
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 18,
        fontWeight: '600',
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#2196F3',
    },
    secondaryButtonText: {
        color: '#2196F3',
    },
    topSpacing: {
        marginTop: 16,
    }
})

export default StartPage;