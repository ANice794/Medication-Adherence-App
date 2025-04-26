import { ExpoConfig } from 'expo/config';

const config: ExpoConfig = {
    name: 'Medication Adherence App',
    slug: 'maa',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
        image: './assets/splash.png',
        resizeMode: 'contain',
        backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
        supportsTablet: true,
        bundleIdentifier: 'com.maa.medicationadherenceapp'
    },
    android: {
        adaptiveIcon: {
            foregroundImage: './assets/adaptive-icon.png',
            backgroundColor: '#ffffff'
        },
        package: 'com.maa.medicationadherenceapp'
    },
    web: {
        favicon: './assets/favicon.png'
    },
    extra: {
        googleFit: {
            clientId: '165063434271-t863cqbhj01k2b7eaf7879buanus2qmn.apps.googleusercontent.com',
            apiKey: 'AIzaSyDu-EDXZw4a30QSbaLB7FaIyI0kj5Ek17'
        }
    }
};

export default config; 