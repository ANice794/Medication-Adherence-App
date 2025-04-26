import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  SafeAreaView,
  StatusBar,
  FlatList,
  Switch,
  Alert
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

// Import components
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Shop from './components/Shop/Shop';
import Profile from './components/Profile/Profile';
import Chat from './components/Chat/Chat';

// Mock data for the app
const mockMedications = [
  { id: '1', name: 'Aspirin', dosage: '100mg', frequency: 'Once daily', time: '08:00 AM' },
  { id: '2', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', time: '08:00 AM' },
  { id: '3', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', time: '08:00 AM, 08:00 PM' },
];

const mockRewards = [
  { id: '1', name: 'Gift Card', points: 500, image: 'https://via.placeholder.com/100' },
  { id: '2', name: 'Movie Ticket', points: 1000, image: 'https://via.placeholder.com/100' },
  { id: '3', name: 'Fitness Tracker', points: 2000, image: 'https://via.placeholder.com/100' },
];

const mockHealthData = {
  steps: 8432,
  calories: 456,
  heartRate: 72,
  sleep: '7h 23m',
};

const mockChats = [
  { id: '1', name: 'Dr. Smith', lastMessage: 'How are you feeling today?', time: '10:30 AM', unread: 2 },
  { id: '2', name: 'Dr. Johnson', lastMessage: 'Your test results are in', time: 'Yesterday', unread: 0 },
];

// Main App Component
export default function App() {
  // State variables
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [userPoints, setUserPoints] = useState(350);
  const [userStreak, setUserStreak] = useState(7);

  // Handle login
  const handleLogin = () => {
    if (email && password) {
      setIsLoggedIn(true);
      setCurrentScreen('home');
      setFirstName('John');
      setLastName('Doe');
    } else {
      Alert.alert('Error', 'Please enter both email and password');
    }
  };

  // Handle signup
  const handleSignup = () => {
    if (email && password && firstName && lastName && dob) {
      setIsLoggedIn(true);
      setCurrentScreen('home');
    } else {
      Alert.alert('Error', 'Please fill in all fields');
    }
  };

  // Handle logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentScreen('login');
    setEmail('');
    setPassword('');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return (
          <Login
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            setCurrentScreen={setCurrentScreen}
          />
        );
      case 'signup':
        return (
          <Signup
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            dob={dob}
            setDob={setDob}
            handleSignup={handleSignup}
            setCurrentScreen={setCurrentScreen}
          />
        );
      case 'home':
        return (
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>Welcome, {firstName}!</Text>
              <View style={styles.pointsContainer}>
                <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
                <Text style={styles.pointsText}>{userPoints} points</Text>
              </View>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <MaterialCommunityIcons name="fire" size={24} color="#4A90E2" />
                </View>
                <Text style={styles.statValue}>{userStreak}</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <MaterialCommunityIcons name="star" size={24} color="#4A90E2" />
                </View>
                <Text style={styles.statValue}>{userPoints}</Text>
                <Text style={styles.statLabel}>Points</Text>
              </View>
              <View style={styles.statCard}>
                <View style={styles.statIconContainer}>
                  <MaterialCommunityIcons name="trophy" size={24} color="#4A90E2" />
                </View>
                <Text style={styles.statValue}>#42</Text>
                <Text style={styles.statLabel}>Rank</Text>
              </View>
            </View>

            <View style={styles.overallRankContainer}>
              <MaterialCommunityIcons name="medal" size={24} color="#4A90E2" />
              <Text style={styles.overallRankText}>Overall Rank: #42</Text>
            </View>
            
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Today's Medications</Text>
              <FlatList
                data={mockMedications}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.medicationItem}>
                    <View style={styles.medicationInfo}>
                      <Text style={styles.medicationName}>{item.name}</Text>
                      <Text style={styles.medicationDetails}>{item.dosage} - {item.frequency}</Text>
                      <Text style={styles.medicationTime}>{item.time}</Text>
                    </View>
                    <TouchableOpacity style={styles.checkButton}>
                      <MaterialCommunityIcons name="check-circle-outline" size={30} color="#4A90E2" />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </View>
        );
      case 'shop':
        return <Shop userPoints={userPoints} setUserPoints={setUserPoints} />;
      case 'chat':
        return <Chat />;
      case 'profile':
        return (
          <Profile
            firstName={firstName}
            lastName={lastName}
            email={email}
            userPoints={userPoints}
            userStreak={userStreak}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            notifications={notifications}
            setNotifications={setNotifications}
            handleLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      {renderScreen()}
      {isLoggedIn && (
        <View style={styles.tabBar}>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentScreen('home')}
          >
            <MaterialCommunityIcons
              name="home"
              size={24}
              color={currentScreen === 'home' ? '#4A90E2' : '#666'}
            />
            <Text style={[styles.tabText, currentScreen === 'home' && styles.activeTabText]}>
              Home
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentScreen('shop')}
          >
            <MaterialCommunityIcons
              name="store"
              size={24}
              color={currentScreen === 'shop' ? '#4A90E2' : '#666'}
            />
            <Text style={[styles.tabText, currentScreen === 'shop' && styles.activeTabText]}>
              Shop
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentScreen('chat')}
          >
            <MaterialCommunityIcons
              name="chat"
              size={24}
              color={currentScreen === 'chat' ? '#4A90E2' : '#666'}
            />
            <Text style={[styles.tabText, currentScreen === 'chat' && styles.activeTabText]}>
              Chat
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabItem}
            onPress={() => setCurrentScreen('profile')}
          >
            <MaterialCommunityIcons
              name="account"
              size={24}
              color={currentScreen === 'profile' ? '#4A90E2' : '#666'}
            />
            <Text style={[styles.tabText, currentScreen === 'profile' && styles.activeTabText]}>
              Profile
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    padding: 8,
    borderRadius: 20,
  },
  pointsText: {
    marginLeft: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4A90E2',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  overallRankContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  overallRankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  medicationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  medicationDetails: {
    color: '#666',
    marginTop: 5,
  },
  medicationTime: {
    color: '#4A90E2',
    marginTop: 5,
  },
  checkButton: {
    marginLeft: 10,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingBottom: 20,
    paddingTop: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  activeTabText: {
    color: '#4A90E2',
  },
}); 