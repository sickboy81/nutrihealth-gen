-- ============================================
-- CORREÇÃO RÁPIDA: Função get_all_users
-- Execute apenas esta função se já executou o script completo antes
-- ============================================

-- Corrigir a função get_all_users para compatibilidade de tipos
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE (
  id UUID,
  email TEXT,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE,
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  is_banned BOOLEAN,
  is_admin BOOLEAN
) AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem listar usuários';
  END IF;

  RETURN QUERY
  SELECT 
    u.id,
    u.email::TEXT,  -- Cast para TEXT para compatibilidade
    COALESCE(u.raw_user_meta_data->>'name', u.email)::TEXT as name,
    u.created_at,
    u.last_sign_in_at,
    COALESCE(bu.id IS NOT NULL, false) as is_banned,
    COALESCE(au.id IS NOT NULL, false) as is_admin
  FROM auth.users u
  LEFT JOIN banned_users bu ON bu.user_id = u.id
  LEFT JOIN admin_users au ON au.user_id = u.id AND au.is_active = true
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar se foi corrigida
SELECT 
  routine_name as funcao,
  routine_type as tipo
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'get_all_users';

