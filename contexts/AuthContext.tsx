import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

export type UserRole = 'user' | 'admin';

interface User {
    id: string;
    name: string;
    email: string;
    role?: UserRole;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAdmin: boolean;
    login: (email: string, password: string) => Promise<string | null>;
    register: (name: string, email: string, password: string) => Promise<string | null>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Lista de emails admin (pode ser movido para variável de ambiente ou banco de dados)
const ADMIN_EMAILS = [
    'admin@nutrihealth.com',
    'sickboy81@gmail.com',
    'ngfilho@gmail.com'
];

const getUserRole = async (userId: string): Promise<UserRole> => {
    try {
        // Verificar no Supabase se o usuário tem role admin nos metadados
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            // Verificar nos metadados do usuário
            if (user.user_metadata?.role === 'admin') {
                return 'admin';
            }
            // Verificar se o email está na lista de admins
            if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
                return 'admin';
            }
        }
        return 'user';
    } catch (error) {
        console.error('Error getting user role:', error);
        return 'user';
    }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                const role = await getUserRole(session.user.id);
                const userData = {
                    id: session.user.id,
                    email: session.user.email!,
                    name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
                    role
                };
                setUser(userData);
                setIsAdmin(role === 'admin');
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                const role = await getUserRole(session.user.id);
                const userData = {
                    id: session.user.id,
                    email: session.user.email!,
                    name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
                    role
                };
                setUser(userData);
                setIsAdmin(role === 'admin');
            } else {
                setUser(null);
                setIsAdmin(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string): Promise<string | null> => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) return error.message;

            if (data.user) {
                const role = await getUserRole(data.user.id);
                const userData = {
                    id: data.user.id,
                    email: data.user.email!,
                    name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
                    role
                };
                setUser(userData);
                setIsAdmin(role === 'admin');
            }

            return null;
        } catch (error: any) {
            return error.message || 'Login failed';
        }
    };

    const register = async (name: string, email: string, password: string): Promise<string | null> => {
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name: name
                    }
                }
            });

            if (error) return error.message;

            // Auto-login after registration
            if (data.user) {
                setUser({
                    id: data.user.id,
                    email: data.user.email!,
                    name: name
                });
            }

            return null;
        } catch (error: any) {
            return error.message || 'Registration failed';
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, isAdmin, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
