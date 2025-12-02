-- ============================================
-- SCRIPT PARA VERIFICAR STATUS DOS ADMINS
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- 1. Verificar se a tabela admin_users existe
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'admin_users'
) AS table_exists;

-- 2. Listar TODOS os admins (ativos e inativos)
SELECT 
    au.id,
    au.user_id,
    au.email,
    au.is_active,
    au.created_at,
    au.created_by,
    au.notes,
    u.email as user_email,
    u.raw_user_meta_data->>'name' as user_name,
    u.last_sign_in_at,
    CASE 
        WHEN au.is_active = true THEN '✅ ATIVO'
        ELSE '❌ INATIVO'
    END as status
FROM admin_users au
LEFT JOIN auth.users u ON u.id = au.user_id
ORDER BY au.created_at DESC;

-- 3. Verificar apenas admins ATIVOS
SELECT 
    au.id,
    au.user_id,
    au.email,
    au.is_active,
    au.created_at,
    u.email as user_email,
    u.raw_user_meta_data->>'name' as user_name,
    u.last_sign_in_at
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE au.is_active = true
ORDER BY au.created_at DESC;

-- 4. Verificar um admin específico pelo email
SELECT 
    au.id,
    au.user_id,
    au.email,
    au.is_active,
    au.created_at,
    u.email as user_email,
    u.raw_user_meta_data->>'name' as user_name,
    u.last_sign_in_at,
    CASE 
        WHEN au.is_active = true THEN '✅ ATIVO - Pode acessar painel admin'
        ELSE '❌ INATIVO - Não pode acessar painel admin'
    END as status
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE au.email = 'ngfilho@gmail.com';  -- Substitua pelo email que quer verificar

-- 5. Verificar se um usuário específico (por UUID) é admin ativo
SELECT 
    au.id,
    au.user_id,
    au.email,
    au.is_active,
    CASE 
        WHEN au.is_active = true THEN '✅ É ADMIN ATIVO'
        WHEN au.id IS NOT NULL THEN '❌ É ADMIN MAS ESTÁ INATIVO'
        ELSE '❌ NÃO É ADMIN'
    END as status
FROM admin_users au
WHERE au.user_id = 'f89cb4bc-e017-489b-b50e-7b27a6ff5804'  -- Substitua pelo UUID do usuário
AND au.is_active = true;

-- 6. Ativar um admin que está inativo
-- IMPORTANTE: Substitua o UUID e email pelos valores corretos
UPDATE admin_users
SET is_active = true
WHERE user_id = 'f89cb4bc-e017-489b-b50e-7b27a6ff5804'  -- UUID do usuário
AND email = 'ngfilho@gmail.com';  -- Email do usuário

-- 7. Verificar função is_admin para um usuário específico
SELECT is_admin('f89cb4bc-e017-489b-b50e-7b27a6ff5804'::uuid) as is_admin_result;

-- 8. Contar total de admins ativos
SELECT 
    COUNT(*) as total_admins_ativos,
    COUNT(CASE WHEN is_active = false THEN 1 END) as total_admins_inativos
FROM admin_users;

-- ============================================
-- TROUBLESHOOTING
-- ============================================

-- Se a tabela não existir, você verá um erro
-- Nesse caso, execute primeiro o script: supabase_admin_setup.sql

-- Se o usuário não aparecer na lista, ele não foi adicionado como admin
-- Nesse caso, execute o script: supabase_add_admin.sql

-- Se is_active = false, o admin está inativo
-- Execute a query #6 acima para ativar

