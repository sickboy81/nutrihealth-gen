-- ============================================
-- SCRIPT PARA ADICIONAR ADMINISTRADOR
-- Execute este script APÓS executar supabase_admin_setup.sql
-- ============================================

-- PASSO 1: Encontrar o UUID do usuário pelo email
-- Execute esta query primeiro para encontrar o UUID:
SELECT 
    id as user_id,
    email,
    created_at,
    raw_user_meta_data->>'name' as name
FROM auth.users 
WHERE email = 'ngfilho@gmail.com';  -- Substitua pelo email do usuário

-- PASSO 2: Após encontrar o UUID acima, execute este INSERT
-- IMPORTANTE: Substitua 'SEU_UUID_AQUI' pelo UUID retornado na query acima!
-- 
-- Exemplo (com o UUID que você já tem):
INSERT INTO admin_users (user_id, email, created_by, notes)
VALUES (
    'f89cb4bc-e017-489b-b50e-7b27a6ff5804',  -- UUID do usuário
    'ngfilho@gmail.com',                      -- Email do usuário
    'f89cb4bc-e017-489b-b50e-7b27a6ff5804',  -- UUID de quem está criando (mesmo usuário)
    'Admin inicial'
)
ON CONFLICT (user_id) DO UPDATE
SET 
    is_active = true,
    notes = 'Admin inicial';

-- PASSO 3: Verificar se foi adicionado corretamente
SELECT 
    au.id,
    au.user_id,
    au.email,
    au.is_active,
    au.created_at,
    u.email as user_email,
    u.raw_user_meta_data->>'name' as user_name
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE au.email = 'ngfilho@gmail.com';

-- ============================================
-- ADICIONAR MÚLTIPLOS ADMINS
-- ============================================

-- Para adicionar outro admin (exemplo com sickboy81@gmail.com):
-- Primeiro encontre o UUID:
-- SELECT id, email FROM auth.users WHERE email = 'sickboy81@gmail.com';

-- Depois adicione (substitua o UUID):
-- INSERT INTO admin_users (user_id, email, created_by, notes)
-- VALUES (
--     'UUID_DO_SICKBOY81',  -- UUID encontrado acima
--     'sickboy81@gmail.com',
--     'f89cb4bc-e017-489b-b50e-7b27a6ff5804',  -- UUID do admin que está criando
--     'Admin'
-- );

-- ============================================
-- LISTAR TODOS OS ADMINS
-- ============================================
SELECT 
    au.id,
    au.user_id,
    au.email,
    au.is_active,
    au.created_at,
    u.raw_user_meta_data->>'name' as name,
    u.last_sign_in_at
FROM admin_users au
JOIN auth.users u ON u.id = au.user_id
WHERE au.is_active = true
ORDER BY au.created_at DESC;

