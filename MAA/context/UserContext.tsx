import React, { createContext, useState, useContext, ReactNode } from 'react';

interface UserContextType {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dob: string;
    role: string;
    profilePicture: string;
    isLoggedIn: boolean;
    setId: (id: number) => void;
    setEmail: (email: string) => void;
    setPassword: (password: string) => void;
    setFirstName: (firstName: string) => void;
    setLastName: (lastName: string) => void;
    setDob: (dob: string) => void;
    setRole: (role: string) => void;
    setProfilePicture: (profilePicture: string) => void;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    setUser: (user: UserContextType) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children}: { children: ReactNode }) => {
    const [id, setId] = useState(0);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [dob, setDob] = useState('');
    const [role, setRole] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const setUser = (user: UserContextType) => {
        setId(user.id);
        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setPassword(user.password);
        setDob(user.dob);
        setRole(user.role);
        setProfilePicture(user.profilePicture);
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
                isLoggedIn,
                setId,
                setEmail,
                setPassword,
                setFirstName,
                setLastName,
                setDob,
                setRole,
                setProfilePicture,
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