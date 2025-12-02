-- ============================================
-- SCRIPT PARA VERIFICAR FUNÇÕES DO SUPABASE
-- Execute este script no SQL Editor do Supabase
-- ============================================

-- Verificar se a função get_all_users existe
SELECT 
    p.proname as function_name,
    pg_get_function_result(p.oid) as return_type,
    pg_get_function_arguments(p.oid) as arguments,
    CASE 
        WHEN p.prosecdef THEN 'SECURITY DEFINER'
        ELSE 'SECURITY INVOKER'
    END as security_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname = 'get_all_users';

-- Verificar TODAS as funções administrativas criadas
SELECT 
    p.proname as function_name,
    pg_get_function_result(p.oid) as return_type,
    pg_get_function_arguments(p.oid) as arguments,
    CASE 
        WHEN p.prosecdef THEN 'SECURITY DEFINER'
        ELSE 'SECURITY INVOKER'
    END as security_type
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname IN (
    'get_all_users',
    'ban_user',
    'unban_user',
    'add_admin',
    'remove_admin',
    'get_system_stats',
    'is_admin'
)
ORDER BY p.proname;

-- Verificar se as tabelas administrativas existem
SELECT 
    table_name,
    CASE 
        WHEN table_name IS NOT NULL THEN '✅ EXISTE'
        ELSE '❌ NÃO EXISTE'
    END as status
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('admin_users', 'banned_users', 'admin_logs')
ORDER BY table_name;

-- Verificar políticas RLS das tabelas administrativas
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'public'
AND tablename IN ('admin_users', 'banned_users', 'admin_logs')
ORDER BY tablename, policyname;

-- Verificar se RLS está habilitado nas tabelas
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('admin_users', 'banned_users', 'admin_logs')
ORDER BY tablename;

-- 6. Testar a função get_all_users (se existir)
-- IMPORTANTE: Execute apenas se você for admin!
-- SELECT * FROM get_all_users();

-- Verificar estrutura completa da função get_all_users
SELECT 
    p.proname as function_name,
    pg_get_functiondef(p.oid) as function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname = 'get_all_users';

-- ============================================
-- RESUMO DO QUE DEVERIA EXISTIR:
-- ============================================
-- Tabelas:
--   ✅ admin_users
--   ✅ banned_users
--   ✅ admin_logs
--
-- Funções:
--   ✅ get_all_users()
--   ✅ ban_user(user_id, reason, is_permanent)
--   ✅ unban_user(user_id)
--   ✅ add_admin(user_id, notes)
--   ✅ remove_admin(user_id)
--   ✅ get_system_stats()
--   ✅ is_admin(user_id)
--
-- Políticas RLS:
--   ✅ Políticas para admin_users (select, insert, update)
--   ✅ Políticas para banned_users (select, insert, update)
--   ✅ Políticas para admin_logs (select, insert)
-- ============================================

