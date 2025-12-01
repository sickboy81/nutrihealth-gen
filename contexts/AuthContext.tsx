import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<string | null>;
    register: (name: string, email: string, password: string) => Promise<string | null>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email!,
                    name: session.user.user_metadata?.name || session.user.email!.split('@')[0]
                });
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email!,
                    name: session.user.user_metadata?.name || session.user.email!.split('@')[0]
                });
            } else {
                setUser(null);
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
                setUser({
                    id: data.user.id,
                    email: data.user.email!,
                    name: data.user.user_metadata?.name || data.user.email!.split('@')[0]
                });
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
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
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
