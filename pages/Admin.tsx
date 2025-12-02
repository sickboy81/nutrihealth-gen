import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import Card from '../components/Card';
import { useI18n } from '../contexts/I18nContext';
import { useUserData } from '../contexts/UserDataContext';
import type { Recipe } from '../types';

interface UserStats {
    id: string;
    email: string;
    name: string;
    created_at: string;
    last_login?: string;
}

const Admin = () => {
    const { user, isAdmin } = useAuth();
    const { recipes, updateRecipeImage, addRecipe } = useUserData();
    const { t } = useI18n();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'users' | 'recipes' | 'stats' | 'settings'>('users');
    const [users, setUsers] = useState<UserStats[]>([]);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalRecipes: 0,
        activeUsers: 0
    });
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
    const [recipeForm, setRecipeForm] = useState({
        name: '',
        time: '',
        calories: '',
        difficulty: 'Fácil' as 'Fácil' | 'Médio' | 'Difícil',
        type: 'Prato Principal' as Recipe['type'],
        ingredients: '',
        steps: '',
        tags: ''
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
            // Nota: Em produção, você precisaria criar uma função no Supabase Edge Function
            // ou uma tabela de usuários para listar todos os usuários
            // Por enquanto, vamos apenas mostrar uma mensagem
            setUsers([]);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadStats = () => {
        setStats({
            totalUsers: 0, // Seria carregado do banco
            totalRecipes: recipes.length,
            activeUsers: 0 // Seria carregado do banco
        });
    };

    const handleCreateRecipe = () => {
        if (!recipeForm.name || !recipeForm.ingredients || !recipeForm.steps) {
            alert('Preencha todos os campos obrigatórios');
            return;
        }

        const newRecipe: Recipe = {
            id: Date.now(),
            name: recipeForm.name,
            time: recipeForm.time || '30 min',
            calories: parseInt(recipeForm.calories) || 0,
            difficulty: recipeForm.difficulty,
            type: recipeForm.type,
            image: `https://source.unsplash.com/800x600/?${encodeURIComponent(recipeForm.name)},food`,
            ingredients: recipeForm.ingredients.split('\n').filter(i => i.trim()),
            steps: recipeForm.steps.split('\n').filter(s => s.trim()),
            tags: recipeForm.tags ? recipeForm.tags.split(',').map(t => t.trim()) : []
        };

        addRecipe(newRecipe);
        alert('Receita criada com sucesso!');
        setRecipeForm({
            name: '',
            time: '',
            calories: '',
            difficulty: 'Fácil',
            type: 'Prato Principal',
            ingredients: '',
            steps: '',
            tags: ''
        });
    };

    const handleDeleteRecipe = (recipeId: number) => {
        if (confirm('Tem certeza que deseja deletar esta receita?')) {
            // Implementar deleção de receita
            alert('Funcionalidade de deleção será implementada');
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
                            {loading ? (
                                <p className="text-gray-500">Carregando usuários...</p>
                            ) : users.length === 0 ? (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-4">
                                        Para listar usuários, é necessário configurar uma função no Supabase
                                        ou criar uma tabela de usuários.
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        Esta funcionalidade requer configuração adicional no backend.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {users.map((u) => (
                                        <div key={u.id} className="border border-gray-200 rounded-lg p-4">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-semibold text-gray-800">{u.name}</p>
                                                    <p className="text-sm text-gray-500">{u.email}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        Criado em: {new Date(u.created_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600">
                                                        Editar
                                                    </button>
                                                    <button className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                                                        Deletar
                                                    </button>
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
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">Todas as Receitas</h2>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {recipes.map((recipe) => (
                                        <div
                                            key={recipe.id}
                                            className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
                                            onClick={() => setSelectedRecipe(recipe)}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div className="flex-1">
                                                    <p className="font-semibold text-gray-800">{recipe.name}</p>
                                                    <p className="text-sm text-gray-500">{recipe.type}</p>
                                                    <p className="text-xs text-gray-400">{recipe.calories} kcal</p>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteRecipe(recipe.id);
                                                    }}
                                                    className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                                                >
                                                    Deletar
                                                </button>
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
                                        <button
                                            onClick={() => setSelectedRecipe(null)}
                                            className="w-full px-6 py-3 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            Cancelar Edição
                                        </button>
                                    )}
                                </div>
                            </Card>
                        </div>
                    )}

                    {activeTab === 'stats' && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card className="p-6 text-center">
                                <div className="text-4xl font-bold text-emerald-600 mb-2">{stats.totalUsers}</div>
                                <div className="text-gray-600">Total de Usuários</div>
                            </Card>
                            <Card className="p-6 text-center">
                                <div className="text-4xl font-bold text-blue-600 mb-2">{stats.totalRecipes}</div>
                                <div className="text-gray-600">Total de Receitas</div>
                            </Card>
                            <Card className="p-6 text-center">
                                <div className="text-4xl font-bold text-purple-600 mb-2">{stats.activeUsers}</div>
                                <div className="text-gray-600">Usuários Ativos</div>
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
                                        <button className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                                            Exportar Dados de Usuários
                                        </button>
                                        <button className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
                                            Limpar Cache do Sistema
                                        </button>
                                        <button className="w-full px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                                            Fazer Backup do Banco de Dados
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;

