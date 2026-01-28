/**
 * Auth Context - Replaces Supabase Auth
 * 
 * Provides authentication state and helpers to all components.
 */

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from './api-client';

type User = {
    id: string;
    email: string;
    role: string;
};

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string, role: 'admin' | 'customer' | 'superadmin', subdomain?: string) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check if user is logged in
        async function checkAuth() {
            try {
                if (apiClient.isAuthenticated()) {
                    const userData = await apiClient.getCurrentUser();
                    setUser(userData as unknown as User);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                // Don't block the app if auth check fails
                // Just clear the auth state
                setUser(null);
            } finally {
                // Always set loading to false, even if check fails
                setLoading(false);
            }
        }
        checkAuth();
    }, []);

    const login = async (email: string, password: string, role: 'admin' | 'customer' | 'superadmin', subdomain?: string) => {
        const data = await apiClient.login(email, password, role, subdomain);
        setUser({
            id: data.user_id,
            email,
            role: data.user_role,
        });
    };

    const logout = async () => {
        await apiClient.logout();
        setUser(null);
        router.push('/');
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
