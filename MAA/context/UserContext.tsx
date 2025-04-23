import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ActiveItem {
    id: string;
    expiresAt?: number; // Unix timestamp for expiration
}

interface Theme {
    primary: string;
    background: string;
    text: string;
    secondary: string;
}

interface UserContextType {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dob: string;
    role: string;
    profilePicture: string;
    points: number;
    streak: number;
    activeItems: ActiveItem[];
    currentTheme: Theme;
    isLoggedIn: boolean;
    setId: (id: number) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setFirstName: (firstName: string) => void;
    setLastName: (lastName: string) => void;
    setDob: (dob: string) => void;
    setRole: (role: string) => void;
    setProfilePicture: (profilePicture: string) => void;
    setPoints: (points: number) => void;
    addPoints: (amount: number) => void;
    deductPoints: (amount: number) => void;
    setStreak: (streak: number) => void;
    incrementStreak: () => void;
    resetStreak: () => void;
    setActiveItems: (items: ActiveItem[]) => void;
    addActiveItem: (itemId: string, duration?: number) => void;
    hasActiveItem: (itemId: string) => boolean;
    setTheme: (themeId: string) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setUser: (user: UserContextType) => void;
}

const defaultTheme: Theme = {
    primary: '#4A90E2',
    background: '#f5f5f5',
    text: '#333333',
    secondary: '#666666',
};

const themes: { [key: string]: Theme } = {
    default: defaultTheme,
    night: {
        primary: '#BB86FC',
        background: '#121212',
        text: '#FFFFFF',
        secondary: '#BB86FC',
    },
    ocean: {
        primary: '#039BE5',
        background: '#E3F2FD',
        text: '#01579B',
        secondary: '#0277BD',
    },
    forest: {
        primary: '#43A047',
        background: '#E8F5E9',
        text: '#1B5E20',
        secondary: '#2E7D32',
    },
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [id, setId] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [role, setRole] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [points, setPoints] = useState(0);
    const [streak, setStreak] = useState(0);
    const [activeItems, setActiveItems] = useState<ActiveItem[]>([]);
    const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Load saved data on startup
    useEffect(() => {
        const loadSavedData = async () => {
            try {
                const savedPoints = await AsyncStorage.getItem('points');
                const savedStreak = await AsyncStorage.getItem('streak');
                const savedActiveItems = await AsyncStorage.getItem('activeItems');
                const savedTheme = await AsyncStorage.getItem('currentTheme');

                if (savedPoints) setPoints(parseInt(savedPoints));
                if (savedStreak) setStreak(parseInt(savedStreak));
                if (savedActiveItems) setActiveItems(JSON.parse(savedActiveItems));
                if (savedTheme) setCurrentTheme(themes[savedTheme] || defaultTheme);
            } catch (error) {
                console.error('Error loading saved data:', error);
            }
        };

        loadSavedData();
    }, []);

    // Check for expired items periodically
    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const updatedItems = activeItems.filter(item => !item.expiresAt || item.expiresAt > now);
            if (updatedItems.length !== activeItems.length) {
                setActiveItems(updatedItems);
                AsyncStorage.setItem('activeItems', JSON.stringify(updatedItems));
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [activeItems]);

    const addPoints = async (amount: number) => {
        const multiplier = hasActiveItem('2') ? 2 : 1; // 2x points if active
        const newPoints = points + (amount * multiplier);
        setPoints(newPoints);
        await AsyncStorage.setItem('points', newPoints.toString());
    };

    const deductPoints = async (amount: number) => {
        const newPoints = Math.max(0, points - amount);
        setPoints(newPoints);
        await AsyncStorage.setItem('points', newPoints.toString());
    };

    const incrementStreak = async () => {
        const newStreak = streak + 1;
        setStreak(newStreak);
        await AsyncStorage.setItem('streak', newStreak.toString());
    };

    const resetStreak = async () => {
        if (hasActiveItem('1')) { // Streak Shield
            return; // Don't reset if shield is active
        }
        setStreak(0);
        await AsyncStorage.setItem('streak', '0');
    };

    const addActiveItem = async (itemId: string, duration?: number) => {
        const newItem: ActiveItem = {
            id: itemId,
            expiresAt: duration ? Date.now() + duration : undefined,
        };
        const updatedItems = [...activeItems, newItem];
        setActiveItems(updatedItems);
        await AsyncStorage.setItem('activeItems', JSON.stringify(updatedItems));

        // Apply theme if it's a theme item
        if (['4', '5', '6'].includes(itemId)) {
            setTheme(itemId);
        }
    };

    const hasActiveItem = (itemId: string) => {
        const now = Date.now();
        return activeItems.some(item => 
            item.id === itemId && (!item.expiresAt || item.expiresAt > now)
        );
    };

    const setTheme = async (themeId: string) => {
        let newTheme: Theme;
        switch (themeId) {
            case '4':
                newTheme = themes.night;
                break;
            case '5':
                newTheme = themes.ocean;
                break;
            case '6':
                newTheme = themes.forest;
                break;
            default:
                newTheme = themes.default;
        }
        setCurrentTheme(newTheme);
        await AsyncStorage.setItem('currentTheme', themeId);
    };

    const setUser = (user: UserContextType) => {
        setId(user.id);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setPassword(user.password);
        setDob(user.dob);
        setRole(user.role);
        setProfilePicture(user.profilePicture);
        setPoints(user.points || 0);
        setStreak(user.streak || 0);
        setActiveItems(user.activeItems || []);
        setIsLoggedIn(user.isLoggedIn);
    };

    return (
        <UserContext.Provider
            value={{
                id,
                firstName,
                lastName,
                email,
                password,
                dob,
                role,
                profilePicture,
                points,
                streak,
                activeItems,
                currentTheme,
                isLoggedIn,
                setId,
                setEmail,
                setPassword,
                setFirstName,
                setLastName,
                setDob,
                setRole,
                setProfilePicture,
                setPoints,
                addPoints,
                deductPoints,
                setStreak,
                incrementStreak,
                resetStreak,
                setActiveItems,
                addActiveItem,
                hasActiveItem,
                setTheme,
                setIsLoggedIn,
                setUser,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};