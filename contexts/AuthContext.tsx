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
        // Prioridade 1: Verificar na tabela admin_users do Supabase (se existir)
        try {
            const { data: adminData, error: adminError } = await supabase
                .from('admin_users')
                .select('id')
                .eq('user_id', userId)
                .eq('is_active', true)
                .maybeSingle(); // Use maybeSingle para não dar erro se não encontrar

            // Se não houver erro e encontrar dados, é admin
            if (!adminError && adminData) {
                return 'admin';
            }
        } catch (tableError: any) {
            // Se a tabela não existir, ignora e continua com outros métodos
            // Não loga erro para não poluir o console se a tabela ainda não foi criada
            if (!tableError.message?.includes('does not exist') && !tableError.message?.includes('relation')) {
                console.warn('Error checking admin_users table:', tableError);
            }
        }

        // Prioridade 2: Verificar nos metadados do usuário
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                if (user.user_metadata?.role === 'admin') {
                    return 'admin';
                }
                // Prioridade 3: Verificar se o email está na lista de admins (fallback)
                if (user.email && ADMIN_EMAILS.includes(user.email.toLowerCase())) {
                    return 'admin';
                }
            }
        } catch (userError) {
            console.warn('Error getting user metadata:', userError);
        }

        return 'user';
    } catch (error) {
        // Em caso de qualquer erro, sempre retorna 'user' para não bloquear o login
        console.warn('Error getting user role (non-blocking):', error);
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
                // Primeiro define o usuário básico
                const userData = {
                    id: session.user.id,
                    email: session.user.email!,
                    name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
                    role: 'user' as UserRole
                };
                setUser(userData);
                setIsAdmin(false);

                // Verifica role de forma assíncrona sem bloquear
                getUserRole(session.user.id).then(role => {
                    setUser(prev => prev ? { ...prev, role } : null);
                    setIsAdmin(role === 'admin');
                }).catch(err => {
                    console.warn('Error checking admin role on session (non-blocking):', err);
                });
            }
            setLoading(false);
        });

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                // Primeiro define o usuário básico
                const userData = {
                    id: session.user.id,
                    email: session.user.email!,
                    name: session.user.user_metadata?.name || session.user.email!.split('@')[0],
                    role: 'user' as UserRole
                };
                setUser(userData);
                setIsAdmin(false);

                // Verifica role de forma assíncrona sem bloquear
                getUserRole(session.user.id).then(role => {
                    setUser(prev => prev ? { ...prev, role } : null);
                    setIsAdmin(role === 'admin');
                }).catch(err => {
                    console.warn('Error checking admin role on auth change (non-blocking):', err);
                });
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
                // Primeiro define o usuário básico para não bloquear o login
                const userData = {
                    id: data.user.id,
                    email: data.user.email!,
                    name: data.user.user_metadata?.name || data.user.email!.split('@')[0],
                    role: 'user' as UserRole // Default, será atualizado depois
                };
                setUser(userData);
                setIsAdmin(false); // Default, será atualizado depois

                // Verifica role de forma assíncrona sem bloquear
                getUserRole(data.user.id).then(role => {
                    setUser(prev => prev ? { ...prev, role } : null);
                    setIsAdmin(role === 'admin');
                }).catch(err => {
                    // Se der erro, mantém como user normal
                    console.warn('Error checking admin role (non-blocking):', err);
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
