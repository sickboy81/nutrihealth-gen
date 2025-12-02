import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useUserData } from '../contexts/UserDataContext';
import { supabase } from '../services/supabase';
import Card from '../components/Card';
import Spinner from '../components/Spinner';
import { useI18n } from '../contexts/I18nContext';
import { ArrowLeftIcon } from '../components/icons/ArrowLeftIcon';

const Login = () => {
    const { login, register, user } = useAuth();
    const { userProfile } = useUserData();
    const navigate = useNavigate();
    const { t } = useI18n();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmailSent, setResetEmailSent] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    // Check if user has completed onboarding (has profile data)
    const hasCompletedOnboarding = () => {
        return userProfile && 
               userProfile.age > 0 && 
               userProfile.height > 0 && 
               userProfile.weight > 0;
    };

    React.useEffect(() => {
        if (user) {
            // Check if user needs to complete onboarding
            if (!hasCompletedOnboarding()) {
                navigate('/onboarding');
            } else {
                navigate('/dashboard');
            }
        }
    }, [user, userProfile, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validate password confirmation for registration
        if (!isLogin) {
            if (formData.password !== formData.confirmPassword) {
                setError('As senhas não coincidem. Por favor, verifique.');
                setLoading(false);
                return;
            }
            if (formData.password.length < 6) {
                setError('A senha deve ter no mínimo 6 caracteres.');
                setLoading(false);
                return;
            }
        }

        console.log('Form submitted:', { isLogin, email: formData.email });

        try {
            let err;
            if (isLogin) {
                console.log('Attempting login...');
                err = await login(formData.email, formData.password);
                console.log('Login result:', err);
                if (err) {
                    // Provide more helpful error messages
                    if (err.includes('Invalid login credentials')) {
                        setError('Email ou senha incorretos. Certifique-se de que você já se registrou.');
                    } else if (err.includes('Email not confirmed')) {
                        setError('Por favor, confirme seu email antes de fazer login. Verifique sua caixa de entrada.');
                    } else {
                        setError(err);
                    }
                } else {
                    // Login successful - wait a bit for user state to update, then redirect
                    setTimeout(() => {
                        if (!hasCompletedOnboarding()) {
                            navigate('/onboarding');
                        } else {
                            navigate('/dashboard');
                        }
                    }, 500);
                }
            } else {
                console.log('Attempting registration...');
                err = await register(formData.name, formData.email, formData.password);
                console.log('Registration result:', err);
                if (err) {
                    // Provide more helpful registration error messages
                    if (err.includes('already registered') || err.includes('already been registered')) {
                        setError('Este email já está cadastrado. Tente fazer login.');
                    } else if (err.includes('invalid')) {
                        setError('Email inválido. Use um email real (não @example.com).');
                    } else {
                        setError(err);
                    }
                } else {
                    // Registration successful - user is auto-logged in by AuthContext
                    console.log('Registration successful!');
                    setError('Conta criada com sucesso! Redirecionando...');
                    // New users always go to onboarding
                    setTimeout(() => {
                        navigate('/onboarding');
                    }, 1500);
                }
            }
        } catch (e: any) {
            console.error('Unexpected error:', e);
            setError('Ocorreu um erro inesperado. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.email) {
            setError('Por favor, informe seu email.');
            setLoading(false);
            return;
        }

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
                redirectTo: `${window.location.origin}/#/reset-password`,
            });

            if (error) {
                setError('Erro ao enviar email de recuperação. Verifique se o email está correto.');
            } else {
                setResetEmailSent(true);
            }
        } catch (e: any) {
            console.error('Forgot password error:', e);
            setError('Ocorreu um erro inesperado. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-100 p-4">
            <Card className="w-full max-w-md p-8 space-y-6 shadow-xl">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                        <span className="text-3xl">🥗</span>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">NutriHealth Gen</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {isLogin ? 'Bem-vindo de volta!' : 'Crie sua conta grátis'}
                    </p>
                </div>

                {error && (
                    <div className={`text-center text-sm p-2 rounded-md border ${error.includes('sucesso') || error.includes('Redirecionando') ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-500 border-red-100'}`}>
                        {error}
                    </div>
                )}

                {resetEmailSent && (
                    <div className="text-center text-sm p-4 rounded-md border bg-green-50 text-green-600 border-green-200">
                        <p className="font-semibold mb-1">Email enviado com sucesso!</p>
                        <p className="text-xs">Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.</p>
                    </div>
                )}

                {showForgotPassword ? (
                    <form onSubmit={handleForgotPassword} className="space-y-4">
                        <button
                            type="button"
                            onClick={() => { setShowForgotPassword(false); setResetEmailSent(false); setError(null); }}
                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4"
                        >
                            <ArrowLeftIcon className="w-4 h-4" />
                            Voltar ao login
                        </button>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                required
                                placeholder="Digite seu email cadastrado"
                                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                            />
                            <p className="mt-2 text-xs text-gray-500">
                                Enviaremos um link para redefinir sua senha no email informado.
                            </p>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || resetEmailSent}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                        >
                            {loading ? <Spinner className="w-5 h-5" /> : resetEmailSent ? 'Email Enviado' : 'Enviar Link de Recuperação'}
                        </button>
                    </form>
                ) : (
                    <>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Nome</label>
                                    <input
                                        type="text"
                                        required
                                        autoComplete="name"
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                            )}
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Email</label>
                                <input
                                    type="email"
                                    required
                                    autoComplete="email"
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Senha</label>
                                <input
                                    type="password"
                                    required
                                    minLength={6}
                                    autoComplete={isLogin ? "current-password" : "new-password"}
                                    className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                />
                                {!isLogin && <p className="mt-1 text-xs text-gray-500">Mínimo 6 caracteres</p>}
                            </div>
                            {!isLogin && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Confirmar Senha</label>
                                    <input
                                        type="password"
                                        required
                                        minLength={6}
                                        autoComplete="new-password"
                                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                                        value={formData.confirmPassword}
                                        onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    />
                                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                        <p className="mt-1 text-xs text-red-500">As senhas não coincidem</p>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
                            >
                                {loading ? <Spinner className="w-5 h-5" /> : (isLogin ? 'Entrar' : 'Cadastrar')}
                            </button>
                        </form>

                        {isLogin && (
                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => { setShowForgotPassword(true); setError(null); setResetEmailSent(false); }}
                                    className="text-sm text-emerald-600 hover:text-emerald-500 font-medium"
                                >
                                    Esqueci minha senha
                                </button>
                            </div>
                        )}

                        <div className="text-center">
                            <button
                                type="button"
                                onClick={() => { 
                                    setIsLogin(!isLogin); 
                                    setError(null); 
                                    setShowForgotPassword(false);
                                    setResetEmailSent(false);
                                    setFormData({ ...formData, password: '', confirmPassword: '' });
                                }}
                                className="text-sm text-emerald-600 hover:text-emerald-500 font-medium"
                            >
                                {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
                            </button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default Login;
