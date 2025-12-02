import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Card from '../components/Card';
import { useI18n } from '../contexts/I18nContext';
import { useUserData } from '../contexts/UserDataContext';
import type { Recipe } from '../types';
import { generateImageForRecipe } from '../services/geminiService';
import { getRecipeImageUrl } from '../utils/imageHelper';

interface UserStats {
    id: string;
    email: string;
    name: string;
    created_at: string;
    last_sign_in_at?: string;
    is_banned: boolean;
    is_admin: boolean;
}

interface SystemStats {
    total_users: number;
    active_users: number;
    banned_users: number;
    admin_users: number;
    total_user_data: number;
    recent_signups: number;
}

const Admin = () => {
    const { user, isAdmin } = useAuth();
    const { recipes, updateRecipeImage, addRecipe, setRecipes } = useUserData();
    const { t, language } = useI18n();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'users' | 'recipes' | 'stats' | 'settings'>('users');
    const [users, setUsers] = useState<UserStats[]>([]);
    const [loading, setLoading] = useState(false);
    const [generatingImage, setGeneratingImage] = useState<number | null>(null);
    const [stats, setStats] = useState<SystemStats>({
        total_users: 0,
        active_users: 0,
        banned_users: 0,
        admin_users: 0,
        total_user_data: 0,
        recent_signups: 0
    });
    const [banReason, setBanReason] = useState('');
    const [banPermanent, setBanPermanent] = useState(false);
    const [showBanModal, setShowBanModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<UserStats | null>(null);
    const [exportLoading, setExportLoading] = useState(false);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [recipeForm, setRecipeForm] = useState({
        name: '',
        time: '',
        calories: '',
        difficulty: 'Fácil' as 'Fácil' | 'Médio' | 'Difícil',
        type: 'Prato Principal' as Recipe['type'],
        ingredients: '',
        steps: '',
        tags: '',
        image: ''
    });

    useEffect(() => {
        if (!user || !isAdmin) {
            navigate('/dashboard');
            return;
        }
        loadUsers();
        loadStats();
    }, [user, isAdmin, navigate]);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.rpc('get_all_users');
            if (error) {
                console.error('Error loading users:', error);
                // Se a função não existir ainda, mostrar mensagem
                if (error.message.includes('function') || error.message.includes('does not exist')) {
                    setUsers([]);
                } else {
                    alert('Erro ao carregar usuários: ' + error.message);
                }
            } else {
                setUsers(data || []);
            }
        } catch (error) {
            console.error('Error loading users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const { data, error } = await supabase.rpc('get_system_stats');
            if (error) {
                console.error('Error loading stats:', error);
                // Fallback para stats básicos
                setStats({
                    total_users: 0,
                    active_users: 0,
                    banned_users: 0,
                    admin_users: 0,
                    total_user_data: 0,
                    recent_signups: 0
                });
            } else {
                setStats(data || {
                    total_users: 0,
                    active_users: 0,
                    banned_users: 0,
                    admin_users: 0,
                    total_user_data: 0,
                    recent_signups: 0
                });
            }
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const handleCreateRecipe = () => {
        if (!recipeForm.name || !recipeForm.ingredients || !recipeForm.steps) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        const imageUrl = recipeForm.image.trim() || 
            `https://source.unsplash.com/800x600/?${encodeURIComponent(recipeForm.name)},food`;

        if (selectedRecipe) {
            // Atualizar receita existente
            const updatedRecipe: Recipe = {
                ...selectedRecipe,
                name: recipeForm.name,
                time: recipeForm.time || selectedRecipe.time,
                calories: parseInt(recipeForm.calories) || selectedRecipe.calories,
                difficulty: recipeForm.difficulty,
                type: recipeForm.type,
                image: imageUrl,
                ingredients: recipeForm.ingredients.split('\n').filter(i => i.trim()),
                steps: recipeForm.steps.split('\n').filter(s => s.trim()),
                tags: recipeForm.tags ? recipeForm.tags.split(',').map(t => t.trim()) : selectedRecipe.tags || []
            };

            // Atualizar na lista de receitas
            const updatedRecipes = recipes.map(r => r.id === selectedRecipe.id ? updatedRecipe : r);
            // Usar setRecipes se disponível, ou atualizar via contexto
            if (imageUrl !== selectedRecipe.image) {
                updateRecipeImage(selectedRecipe.id, imageUrl);
            }
            
            alert('Receita atualizada com sucesso!');
            setSelectedRecipe(null);
        } else {
            // Criar nova receita
            const newRecipe: Recipe = {
                id: Date.now(),
                name: recipeForm.name,
                time: recipeForm.time || '30 min',
                calories: parseInt(recipeForm.calories) || 0,
                difficulty: recipeForm.difficulty,
                type: recipeForm.type,
                image: imageUrl,
                ingredients: recipeForm.ingredients.split('\n').filter(i => i.trim()),
                steps: recipeForm.steps.split('\n').filter(s => s.trim()),
                tags: recipeForm.tags ? recipeForm.tags.split(',').map(t => t.trim()) : []
            };

            addRecipe(newRecipe);
            alert('Receita criada com sucesso!');
        }

        setRecipeForm({
            name: '',
            time: '',
            calories: '',
            difficulty: 'Fácil',
            type: 'Prato Principal',
            ingredients: '',
            steps: '',
            tags: '',
            image: ''
        });
    };

    const handleDeleteRecipe = (recipeId: number) => {
        if (confirm('Tem certeza que deseja deletar esta receita?')) {
            setRecipes(recipes.filter(r => r.id !== recipeId));
            if (selectedRecipe?.id === recipeId) {
                setSelectedRecipe(null);
                setRecipeForm({
                    name: '', time: '', calories: '', difficulty: 'Fácil', type: 'Prato Principal', ingredients: '', steps: '', tags: '', image: ''
                });
            }
            alert('Receita deletada com sucesso!');
        }
    };

    const handleGenerateImage = async (recipe: Recipe) => {
        if (generatingImage === recipe.id) return; // Evitar múltiplas chamadas
        
        setGeneratingImage(recipe.id);
        try {
            // Criar uma query descritiva para a imagem baseada na receita
            const imageQuery = `${recipe.name} ${recipe.type} ${recipe.ingredients.slice(0, 3).join(' ')} food photography professional`;
            
            const imageUrl = await generateImageForRecipe(imageQuery);
            
            if (imageUrl) {
                updateRecipeImage(recipe.id, imageUrl);
                // Atualizar também o form se a receita estiver selecionada
                if (selectedRecipe?.id === recipe.id) {
                    setRecipeForm({ ...recipeForm, image: imageUrl });
                    setSelectedRecipe({ ...selectedRecipe, image: imageUrl });
                }
                alert('Imagem gerada com sucesso!');
            } else {
                throw new Error('Não foi possível gerar a imagem');
            }
        } catch (error: any) {
            console.error('Erro ao gerar imagem:', error);
            alert('Erro ao gerar imagem: ' + (error.message || 'Erro desconhecido'));
        } finally {
            setGeneratingImage(null);
        }
    };

    const handleGenerateAllImages = async () => {
        if (!confirm(`Tem certeza que deseja gerar imagens para todas as ${recipes.length} receitas? Isso pode levar alguns minutos.`)) {
            return;
        }

        setGeneratingImage(-1); // -1 significa "gerando todas"
        
        let successCount = 0;
        let errorCount = 0;

        for (const recipe of recipes) {
            try {
                const imageQuery = `${recipe.name} ${recipe.type} ${recipe.ingredients.slice(0, 3).join(' ')} food photography professional`;
                const imageUrl = await generateImageForRecipe(imageQuery);
                
                if (imageUrl) {
                    updateRecipeImage(recipe.id, imageUrl);
                    successCount++;
                } else {
                    errorCount++;
                }
                
                // Pequeno delay para não sobrecarregar a API
                await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (error) {
                console.error(`Erro ao gerar imagem para ${recipe.name}:`, error);
                errorCount++;
            }
        }

        setGeneratingImage(null);
        alert(`Geração concluída! ${successCount} sucesso, ${errorCount} erros.`);
    };

    const handleBanUser = async (userId: string) => {
        setSelectedUser(users.find(u => u.id === userId) || null);
        setShowBanModal(true);
    };

    const confirmBanUser = async () => {
        if (!selectedUser) return;

        try {
            const { data, error } = await supabase.rpc('ban_user', {
                target_user_id: selectedUser.id,
                ban_reason: banReason || null,
                is_permanent_ban: banPermanent
            });

            if (error) {
                alert('Erro ao banir usuário: ' + error.message);
            } else {
                alert('Usuário banido com sucesso!');
                setShowBanModal(false);
                setBanReason('');
                setBanPermanent(false);
                setSelectedUser(null);
                loadUsers();
                loadStats();
            }
        } catch (error: any) {
            alert('Erro ao banir usuário: ' + error.message);
        }
    };

    const handleUnbanUser = async (userId: string) => {
        if (!confirm('Tem certeza que deseja desbanir este usuário?')) return;

        try {
            const { data, error } = await supabase.rpc('unban_user', {
                target_user_id: userId
            });

            if (error) {
                alert('Erro ao desbanir usuário: ' + error.message);
            } else {
                alert('Usuário desbanido com sucesso!');
                loadUsers();
                loadStats();
            }
        } catch (error: any) {
            alert('Erro ao desbanir usuário: ' + error.message);
        }
    };

    const handleAddAdmin = async (userId: string) => {
        if (!confirm('Tem certeza que deseja tornar este usuário um administrador?')) return;

        try {
            const { data, error } = await supabase.rpc('add_admin', {
                target_user_id: userId,
                admin_notes: null
            });

            if (error) {
                alert('Erro ao adicionar admin: ' + error.message);
            } else {
                alert('Usuário promovido a administrador com sucesso!');
                loadUsers();
                loadStats();
            }
        } catch (error: any) {
            alert('Erro ao adicionar admin: ' + error.message);
        }
    };

    const handleRemoveAdmin = async (userId: string) => {
        if (!confirm('Tem certeza que deseja remover os privilégios de administrador deste usuário?')) return;

        try {
            const { data, error } = await supabase.rpc('remove_admin', {
                target_user_id: userId
            });

            if (error) {
                alert('Erro ao remover admin: ' + error.message);
            } else {
                alert('Privilégios de administrador removidos com sucesso!');
                loadUsers();
                loadStats();
            }
        } catch (error: any) {
            alert('Erro ao remover admin: ' + error.message);
        }
    };

    const handleExportData = async () => {
        setExportLoading(true);
        try {
            // Exportar dados de usuários
            const { data: usersData, error: usersError } = await supabase.rpc('get_all_users');
            
            if (usersError) {
                throw usersError;
            }

            // Criar arquivo JSON
            const exportData = {
                export_date: new Date().toISOString(),
                users: usersData || [],
                stats: stats,
                total_recipes: recipes.length
            };

            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `nutrihealth-export-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            alert('Dados exportados com sucesso!');
        } catch (error: any) {
            alert('Erro ao exportar dados: ' + error.message);
        } finally {
            setExportLoading(false);
        }
    };

    if (!user || !isAdmin) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Painel Administrativo</h1>
                    <p className="text-gray-600">Gerencie usuários, receitas e configurações do sistema</p>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-2xl shadow-lg p-4">
                    <div className="flex flex-wrap gap-2 border-b border-gray-200">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
                                activeTab === 'users'
                                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Usuários
                        </button>
                        <button
                            onClick={() => setActiveTab('recipes')}
                            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
                                activeTab === 'recipes'
                                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Receitas
                        </button>
                        <button
                            onClick={() => setActiveTab('stats')}
                            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
                                activeTab === 'stats'
                                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Estatísticas
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`px-4 py-2 font-semibold rounded-t-lg transition-colors ${
                                activeTab === 'settings'
                                    ? 'text-emerald-600 border-b-2 border-emerald-600'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Configurações
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {activeTab === 'users' && (
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gerenciar Usuários</h2>
                            <div className="mb-4 flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-800">Lista de Usuários</h3>
                                <button
                                    onClick={loadUsers}
                                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                                >
                                    Atualizar
                                </button>
                            </div>
                            {loading ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">Carregando usuários...</p>
                                </div>
                            ) : users.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">
                                        {stats.total_users === 0 
                                            ? 'Execute o script SQL no Supabase para habilitar esta funcionalidade.'
                                            : 'Nenhum usuário encontrado.'}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Verifique se a função get_all_users foi criada no Supabase.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4 max-h-96 overflow-y-auto">
                                    {users.map((u) => (
                                        <div key={u.id} className={`border rounded-lg p-4 ${u.is_banned ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <p className="font-semibold text-gray-800">{u.name || u.email}</p>
                                                        {u.is_admin && (
                                                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded">
                                                                ADMIN
                                                            </span>
                                                        )}
                                                        {u.is_banned && (
                                                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-semibold rounded">
                                                                BANIDO
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500">{u.email}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Criado em: {new Date(u.created_at).toLocaleDateString('pt-BR')}
                                                    </p>
                                                    {u.last_sign_in_at && (
                                                        <p className="text-xs text-gray-400">
                                                            Último login: {new Date(u.last_sign_in_at).toLocaleDateString('pt-BR')}
                                                        </p>
                                                    )}
                                                </div>
                                                <div className="flex flex-col gap-2 ml-4">
                                                    {!u.is_admin && (
                                                        <button
                                                            onClick={() => handleAddAdmin(u.id)}
                                                            className="px-3 py-1.5 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors"
                                                        >
                                                            Tornar Admin
                                                        </button>
                                                    )}
                                                    {u.is_admin && u.id !== user?.id && (
                                                        <button
                                                            onClick={() => handleRemoveAdmin(u.id)}
                                                            className="px-3 py-1.5 bg-orange-500 text-white text-sm rounded-lg hover:bg-orange-600 transition-colors"
                                                        >
                                                            Remover Admin
                                                        </button>
                                                    )}
                                                    {!u.is_banned ? (
                                                        <button
                                                            onClick={() => handleBanUser(u.id)}
                                                            className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors"
                                                        >
                                                            Banir
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleUnbanUser(u.id)}
                                                            className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
                                                        >
                                                            Desbanir
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>
                    )}

                    {activeTab === 'recipes' && (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Lista de Receitas */}
                            <Card className="p-6">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-800">Todas as Receitas</h2>
                                    <button
                                        onClick={handleGenerateAllImages}
                                        disabled={generatingImage === -1 || recipes.length === 0}
                                        className="px-3 py-1.5 bg-purple-500 text-white text-sm rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        title="Gerar imagens para todas as receitas"
                                    >
                                        {generatingImage === -1 ? 'Gerando...' : 'Gerar Todas as Imagens'}
                                    </button>
                                </div>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {recipes.map((recipe) => (
                                        <div
                                            key={recipe.id}
                                            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-all"
                                            onClick={() => {
                                                setSelectedRecipe(recipe);
                                                setRecipeForm({
                                                    name: recipe.name,
                                                    time: recipe.time,
                                                    calories: recipe.calories.toString(),
                                                    difficulty: recipe.difficulty,
                                                    type: recipe.type,
                                                    ingredients: recipe.ingredients.join('\n'),
                                                    steps: recipe.steps.join('\n'),
                                                    tags: recipe.tags?.join(', ') || '',
                                                    image: recipe.image
                                                });
                                            }}
                                        >
                                            <div className="flex gap-3">
                                                {/* Imagem da Receita */}
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={recipe.image || getRecipeImageUrl(recipe.name, recipe.type)}
                                                        alt={recipe.name}
                                                        className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = getRecipeImageUrl(recipe.name, recipe.type);
                                                        }}
                                                    />
                                                </div>
                                                
                                                {/* Informações da Receita */}
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800 truncate">{recipe.name}</p>
                                                    <p className="text-sm text-gray-500">{recipe.type}</p>
                                                    <p className="text-xs text-gray-400">{recipe.calories} kcal</p>
                                                    
                                                    {/* Botões de Ação */}
                                                    <div className="flex gap-2 mt-2">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleGenerateImage(recipe);
                                                            }}
                                                            disabled={generatingImage === recipe.id || generatingImage === -1}
                                                            className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                            title="Gerar imagem para esta receita"
                                                        >
                                                            {generatingImage === recipe.id ? 'Gerando...' : '🖼️ Gerar Imagem'}
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteRecipe(recipe.id);
                                                            }}
                                                            className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                                                            title="Deletar receita"
                                                        >
                                                            🗑️ Deletar
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>

                            {/* Criar/Editar Receita */}
                            <Card className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    {selectedRecipe ? 'Editar Receita' : 'Criar Nova Receita'}
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Nome da Receita *
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedRecipe?.name || recipeForm.name}
                                            onChange={(e) => setRecipeForm({ ...recipeForm, name: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="Ex: Salada de Quinoa"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            URL da Imagem
                                        </label>
                                        <div className="space-y-2">
                                            <input
                                                type="text"
                                                value={selectedRecipe?.image || recipeForm.image}
                                                onChange={(e) => setRecipeForm({ ...recipeForm, image: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="https://images.unsplash.com/photo-... (deixe em branco para gerar automaticamente)"
                                            />
                                            {(selectedRecipe?.image || recipeForm.image) && (
                                                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-gray-200 bg-gray-100">
                                                    <img 
                                                        src={selectedRecipe?.image || recipeForm.image} 
                                                        alt="Preview da imagem"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = 'https://via.placeholder.com/800x600?text=Imagem+Inválida';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                            <p className="text-xs text-gray-500">
                                                Deixe em branco para gerar automaticamente. Cole uma URL de imagem válida.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tempo
                                            </label>
                                            <input
                                                type="text"
                                                value={selectedRecipe?.time || recipeForm.time}
                                                onChange={(e) => setRecipeForm({ ...recipeForm, time: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                                placeholder="30 min"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Calorias
                                            </label>
                                            <input
                                                type="number"
                                                value={selectedRecipe?.calories || recipeForm.calories}
                                                onChange={(e) => setRecipeForm({ ...recipeForm, calories: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                                placeholder="450"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Dificuldade
                                            </label>
                                            <select
                                                value={selectedRecipe?.difficulty || recipeForm.difficulty}
                                                onChange={(e) => setRecipeForm({ ...recipeForm, difficulty: e.target.value as any })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            >
                                                <option value="Fácil">Fácil</option>
                                                <option value="Médio">Médio</option>
                                                <option value="Difícil">Difícil</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tipo
                                            </label>
                                            <select
                                                value={selectedRecipe?.type || recipeForm.type}
                                                onChange={(e) => setRecipeForm({ ...recipeForm, type: e.target.value as any })}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            >
                                                <option value="Salada">Salada</option>
                                                <option value="Prato Principal">Prato Principal</option>
                                                <option value="Bebida">Bebida</option>
                                                <option value="Café da Manhã">Café da Manhã</option>
                                                <option value="Sopa">Sopa</option>
                                                <option value="Lanche">Lanche</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Ingredientes * (um por linha)
                                        </label>
                                        <textarea
                                            value={selectedRecipe?.ingredients.join('\n') || recipeForm.ingredients}
                                            onChange={(e) => setRecipeForm({ ...recipeForm, ingredients: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            placeholder="200g de peito de frango&#10;1 xícara de quinoa cozida"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Passos * (um por linha)
                                        </label>
                                        <textarea
                                            value={selectedRecipe?.steps.join('\n') || recipeForm.steps}
                                            onChange={(e) => setRecipeForm({ ...recipeForm, steps: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            placeholder="Grelhe o frango até dourar.&#10;Misture a quinoa com as folhas."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Tags (separadas por vírgula)
                                        </label>
                                        <input
                                            type="text"
                                            value={selectedRecipe?.tags?.join(', ') || recipeForm.tags}
                                            onChange={(e) => setRecipeForm({ ...recipeForm, tags: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                                            placeholder="Vegan, High-Protein"
                                        />
                                    </div>

                                    <button
                                        onClick={handleCreateRecipe}
                                        className="w-full px-6 py-3 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-600 transition-colors"
                                    >
                                        {selectedRecipe ? 'Atualizar Receita' : 'Criar Receita'}
                                    </button>

                                    {selectedRecipe && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setSelectedRecipe(null);
                                                    setRecipeForm({
                                                        name: '',
                                                        time: '',
                                                        calories: '',
                                                        difficulty: 'Fácil',
                                                        type: 'Prato Principal',
                                                        ingredients: '',
                                                        steps: '',
                                                        tags: '',
                                                        image: ''
                                                    });
                                                }}
                                                className="w-full px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                                            >
                                                Cancelar Edição
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (selectedRecipe && recipeForm.image && recipeForm.image !== selectedRecipe.image) {
                                                        updateRecipeImage(selectedRecipe.id, recipeForm.image);
                                                        alert('Imagem atualizada com sucesso!');
                                                    }
                                                }}
                                                disabled={!recipeForm.image || recipeForm.image === selectedRecipe.image}
                                                className="w-full px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                Apenas Atualizar Imagem
                                            </button>
                                        </>
                                    )}
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="p-6 text-center">
                                    <div className="text-4xl font-bold text-emerald-600 mb-2">{stats.total_users}</div>
                                    <div className="text-gray-600">Total de Usuários</div>
                                </Card>
                                <Card className="p-6 text-center">
                                    <div className="text-4xl font-bold text-blue-600 mb-2">{recipes.length}</div>
                                    <div className="text-gray-600">Total de Receitas</div>
                                </Card>
                                <Card className="p-6 text-center">
                                    <div className="text-4xl font-bold text-purple-600 mb-2">{stats.active_users}</div>
                                    <div className="text-gray-600">Usuários Ativos (30 dias)</div>
                                </Card>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="p-6 text-center">
                                    <div className="text-4xl font-bold text-red-600 mb-2">{stats.banned_users}</div>
                                    <div className="text-gray-600">Usuários Banidos</div>
                                </Card>
                                <Card className="p-6 text-center">
                                    <div className="text-4xl font-bold text-orange-600 mb-2">{stats.admin_users}</div>
                                    <div className="text-gray-600">Administradores</div>
                                </Card>
                                <Card className="p-6 text-center">
                                    <div className="text-4xl font-bold text-indigo-600 mb-2">{stats.recent_signups}</div>
                                    <div className="text-gray-600">Novos Usuários (7 dias)</div>
                                </Card>
                            </div>
                            <Card className="p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Dados do Sistema</h3>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Total de Dados de Usuários:</span>
                                        <span className="font-semibold">{stats.total_user_data}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <Card className="p-6">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configurações do Sistema</h2>
                            <div className="space-y-4">
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">Informações do Admin</h3>
                                    <p className="text-sm text-gray-600">Email: {user.email}</p>
                                    <p className="text-sm text-gray-600">Nome: {user.name}</p>
                                    <p className="text-sm text-gray-600">ID: {user.id}</p>
                                </div>
                                    <div className="border border-gray-200 rounded-lg p-4">
                                        <h3 className="font-semibold text-gray-800 mb-2">Ações Administrativas</h3>
                                        <div className="space-y-2">
                                            <button
                                                onClick={handleExportData}
                                                disabled={exportLoading}
                                                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                            >
                                                {exportLoading ? 'Exportando...' : 'Exportar Dados de Usuários'}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    loadUsers();
                                                    loadStats();
                                                    alert('Dados atualizados!');
                                                }}
                                                className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                            >
                                                Atualizar Estatísticas
                                            </button>
                                        </div>
                                    </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Modal de Banir Usuário */}
            {showBanModal && selectedUser && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Banir Usuário</h2>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-2">
                                    <strong>Usuário:</strong> {selectedUser.name || selectedUser.email}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <strong>Email:</strong> {selectedUser.email}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Motivo do Banimento (opcional)
                                </label>
                                <textarea
                                    value={banReason}
                                    onChange={(e) => setBanReason(e.target.value)}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                    placeholder="Digite o motivo do banimento..."
                                />
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    id="permanent"
                                    checked={banPermanent}
                                    onChange={(e) => setBanPermanent(e.target.checked)}
                                    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                                />
                                <label htmlFor="permanent" className="ml-2 text-sm text-gray-700">
                                    Banimento permanente
                                </label>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    onClick={() => {
                                        setShowBanModal(false);
                                        setBanReason('');
                                        setBanPermanent(false);
                                        setSelectedUser(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={confirmBanUser}
                                    className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    Confirmar Banimento
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Admin;

