import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Pressable } from 'react-native'
import React from 'react'
import { useUser } from '../../../context/UserContext'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Profile = () => {
    const { firstName, lastName, email, dob, profilePicture, setUser } = useUser();
    const router = useRouter();

    const handleLogout = async () => {
        // Clear AsyncStorage
        await AsyncStorage.multiRemove([
            'isLoggedIn',
            'email',
            'id',
            'firstName',
            'lastName',
            'dob',
            'role',
            'profilePicture'
        ]);

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

        // Navigate to login
        router.replace('/login');
    };

    const ProfileSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {children}
        </View>
    );

    const ProfileItem = ({ icon, label, value }: { icon: string, label: string, value: string }) => (
        <View style={styles.profileItem}>
            <View style={styles.profileItemLeft}>
                <Ionicons name={icon as any} size={24} color="#4A90E2" />
                <Text style={styles.profileItemLabel}>{label}</Text>
            </View>
            <Text style={styles.profileItemValue}>{value}</Text>
        </View>
    );

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.profileImageContainer}>
                    {profilePicture ? (
                        <Image 
                            source={{ uri: profilePicture }} 
                            style={styles.profileImage}
                        />
                    ) : (
                        <Ionicons name="person-circle-outline" size={200} color="black" />
                    )}
                    <TouchableOpacity 
                        style={styles.editImageButton}
                        onPress={() => {
                            // TODO: Implement image picker functionality
                            console.log('Edit profile picture pressed');
                        }}
                    >
                        <Ionicons name="camera" size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
                <Text style={styles.name}>{firstName} {lastName}</Text>
                <Text style={styles.email}>{email}</Text>
            </View>

            <ProfileSection title="Personal Information">
                <ProfileItem icon="person" label="Full Name" value={`${firstName} ${lastName}`} />
                <ProfileItem icon="mail" label="Email" value={email} />
                <ProfileItem 
                    icon="calendar" 
                    label="Date of Birth" 
                    value={new Date(dob).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })} 
                />
            </ProfileSection>

            <ProfileSection title="Settings">
                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingItemLeft}>
                        <Ionicons name="notifications" size={24} color="#4A90E2" />
                        <Text style={styles.settingItemLabel}>Notifications</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingItemLeft}>
                        <Ionicons name="lock-closed" size={24} color="#4A90E2" />
                        <Text style={styles.settingItemLabel}>Privacy</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.settingItemLeft}>
                        <Ionicons name="help-circle" size={24} color="#4A90E2" />
                        <Text style={styles.settingItemLabel}>Help & Support</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#666" />
                </TouchableOpacity>
            </ProfileSection>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Ionicons name="log-out" size={24} color="#fff" />
                <Text style={styles.logoutText}>Sign Out</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    profileImageContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#e0e0e0',
    },
    editImageButton: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: '#4A90E2',
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    email: {
        fontSize: 16,
        color: '#666',
    },
    section: {
        backgroundColor: '#fff',
        marginTop: 20,
        padding: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#e0e0e0',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    profileItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    profileItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileItemLabel: {
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
    },
    profileItemValue: {
        fontSize: 16,
        color: '#666',
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    settingItemLabel: {
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff4444',
        margin: 20,
        padding: 15,
        borderRadius: 12,
    },
    logoutText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
})

export default Profile;