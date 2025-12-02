-- ============================================
-- SCRIPT COMPLETO DE CONFIGURAÇÃO DO SUPABASE
-- Execute este script completo no SQL Editor do Supabase
-- ============================================

-- ============================================
-- PARTE 1: CRIAR TABELAS E ESTRUTURAS
-- ============================================

-- 1. Criar tabela para armazenar usuários admin
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  created_by UUID REFERENCES auth.users(id),
  is_active BOOLEAN DEFAULT true NOT NULL,
  notes TEXT
);

-- 2. Criar tabela para usuários banidos
CREATE TABLE IF NOT EXISTS banned_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  banned_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  banned_by UUID REFERENCES auth.users(id),
  reason TEXT,
  is_permanent BOOLEAN DEFAULT false NOT NULL,
  unbanned_at TIMESTAMP WITH TIME ZONE
);

-- 3. Criar tabela para logs de ações administrativas
CREATE TABLE IF NOT EXISTS admin_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) NOT NULL,
  action_type TEXT NOT NULL,
  target_user_id UUID REFERENCES auth.users(id),
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE banned_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- 5. Remover políticas antigas se existirem (para evitar conflitos)
DROP POLICY IF EXISTS "Admins can view all admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can insert admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can update admin users" ON admin_users;
DROP POLICY IF EXISTS "Admins can view banned users" ON banned_users;
DROP POLICY IF EXISTS "Admins can ban users" ON banned_users;
DROP POLICY IF EXISTS "Admins can unban users" ON banned_users;
DROP POLICY IF EXISTS "Admins can view admin logs" ON admin_logs;
DROP POLICY IF EXISTS "Admins can create admin logs" ON admin_logs;

-- 6. Políticas de segurança para admin_users
CREATE POLICY "Admins can view all admin users" ON admin_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can insert admin users" ON admin_users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can update admin users" ON admin_users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- 7. Políticas de segurança para banned_users
CREATE POLICY "Admins can view banned users" ON banned_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can ban users" ON banned_users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can unban users" ON banned_users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- 8. Políticas de segurança para admin_logs
CREATE POLICY "Admins can view admin logs" ON admin_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

CREATE POLICY "Admins can create admin logs" ON admin_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid() AND is_active = true
    )
  );

-- ============================================
-- PARTE 2: CRIAR FUNÇÕES RPC
-- ============================================

-- 9. Função para verificar se um usuário é admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users
    WHERE user_id = user_uuid AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 10. Função para listar todos os usuários (apenas para admins)
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
    u.email,
    COALESCE(u.raw_user_meta_data->>'name', u.email) as name,
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

-- 11. Função para banir um usuário
CREATE OR REPLACE FUNCTION ban_user(
  target_user_id UUID,
  ban_reason TEXT DEFAULT NULL,
  is_permanent_ban BOOLEAN DEFAULT false
)
RETURNS BOOLEAN AS $$
DECLARE
  target_email TEXT;
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem banir usuários';
  END IF;

  -- Verificar se o usuário alvo não é admin
  IF is_admin(target_user_id) THEN
    RAISE EXCEPTION 'Não é possível banir um administrador';
  END IF;

  -- Obter email do usuário
  SELECT email INTO target_email FROM auth.users WHERE id = target_user_id;

  IF target_email IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  -- Inserir na tabela de banidos
  INSERT INTO banned_users (user_id, email, banned_by, reason, is_permanent)
  VALUES (target_user_id, target_email, auth.uid(), ban_reason, is_permanent_ban)
  ON CONFLICT (user_id) DO UPDATE
  SET 
    banned_at = timezone('utc'::text, now()),
    banned_by = auth.uid(),
    reason = ban_reason,
    is_permanent = is_permanent_ban,
    unbanned_at = NULL;

  -- Registrar log
  INSERT INTO admin_logs (admin_id, action_type, target_user_id, details)
  VALUES (
    auth.uid(),
    'ban_user',
    target_user_id,
    jsonb_build_object(
      'reason', ban_reason,
      'is_permanent', is_permanent_ban
    )
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 12. Função para desbanir um usuário
CREATE OR REPLACE FUNCTION unban_user(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem desbanir usuários';
  END IF;

  -- Remover da tabela de banidos
  DELETE FROM banned_users WHERE user_id = target_user_id;

  -- Registrar log
  INSERT INTO admin_logs (admin_id, action_type, target_user_id, details)
  VALUES (auth.uid(), 'unban_user', target_user_id, '{}'::jsonb);

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 13. Função para adicionar um admin
CREATE OR REPLACE FUNCTION add_admin(target_user_id UUID, admin_notes TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
DECLARE
  target_email TEXT;
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem adicionar admins';
  END IF;

  -- Obter email do usuário
  SELECT email INTO target_email FROM auth.users WHERE id = target_user_id;

  IF target_email IS NULL THEN
    RAISE EXCEPTION 'Usuário não encontrado';
  END IF;

  -- Inserir na tabela de admins
  INSERT INTO admin_users (user_id, email, created_by, notes, is_active)
  VALUES (target_user_id, target_email, auth.uid(), admin_notes, true)
  ON CONFLICT (user_id) DO UPDATE
  SET 
    is_active = true,
    notes = admin_notes;

  -- Registrar log
  INSERT INTO admin_logs (admin_id, action_type, target_user_id, details)
  VALUES (
    auth.uid(),
    'add_admin',
    target_user_id,
    jsonb_build_object('notes', admin_notes)
  );

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 14. Função para remover um admin
CREATE OR REPLACE FUNCTION remove_admin(target_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem remover admins';
  END IF;

  -- Não permitir remover a si mesmo
  IF target_user_id = auth.uid() THEN
    RAISE EXCEPTION 'Você não pode remover seus próprios privilégios de admin';
  END IF;

  -- Desativar admin
  UPDATE admin_users
  SET is_active = false
  WHERE user_id = target_user_id;

  -- Registrar log
  INSERT INTO admin_logs (admin_id, action_type, target_user_id, details)
  VALUES (auth.uid(), 'remove_admin', target_user_id, '{}'::jsonb);

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 15. Função para obter estatísticas do sistema
CREATE OR REPLACE FUNCTION get_system_stats()
RETURNS JSONB AS $$
DECLARE
  stats JSONB;
BEGIN
  -- Verificar se o usuário atual é admin
  IF NOT is_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Acesso negado: apenas administradores podem ver estatísticas';
  END IF;

  SELECT jsonb_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users),
    'active_users', (SELECT COUNT(*) FROM auth.users WHERE last_sign_in_at > NOW() - INTERVAL '30 days'),
    'banned_users', (SELECT COUNT(*) FROM banned_users),
    'admin_users', (SELECT COUNT(*) FROM admin_users WHERE is_active = true),
    'total_user_data', (SELECT COUNT(*) FROM user_data),
    'recent_signups', (SELECT COUNT(*) FROM auth.users WHERE created_at > NOW() - INTERVAL '7 days')
  ) INTO stats;

  RETURN stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 16. Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_banned_users_user_id ON banned_users(user_id);
CREATE INDEX IF NOT EXISTS idx_banned_users_email ON banned_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_logs_admin_id ON admin_logs(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_logs_created_at ON admin_logs(created_at);

-- ============================================
-- PARTE 3: ADICIONAR PRIMEIRO ADMIN
-- ============================================

-- 17. Primeiro, vamos encontrar o UUID do usuário ngfilho@gmail.com
-- Se o usuário não existir, este comando não fará nada
DO $$
DECLARE
  user_uuid UUID;
  user_email TEXT := 'ngfilho@gmail.com';
BEGIN
  -- Buscar o UUID do usuário
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = user_email
  LIMIT 1;

  -- Se encontrou o usuário, adicionar como admin
  IF user_uuid IS NOT NULL THEN
    -- Inserir ou atualizar o admin
    INSERT INTO admin_users (user_id, email, created_by, notes, is_active)
    VALUES (user_uuid, user_email, user_uuid, 'Admin inicial criado automaticamente', true)
    ON CONFLICT (user_id) DO UPDATE
    SET 
      is_active = true,
      notes = 'Admin inicial criado automaticamente',
      email = user_email;
    
    RAISE NOTICE 'Admin adicionado com sucesso: % (UUID: %)', user_email, user_uuid;
  ELSE
    RAISE NOTICE 'Usuário não encontrado: %. Execute o login primeiro ou adicione manualmente.', user_email;
  END IF;
END $$;

-- 18. Verificar se o admin foi criado
SELECT 
  au.id,
  au.user_id,
  au.email,
  au.is_active,
  au.created_at,
  u.email as user_email,
  u.raw_user_meta_data->>'name' as user_name
FROM admin_users au
LEFT JOIN auth.users u ON u.id = au.user_id
WHERE au.email = 'ngfilho@gmail.com' OR au.is_active = true
ORDER BY au.created_at DESC;

-- ============================================
-- VERIFICAÇÃO FINAL
-- ============================================

-- Verificar se todas as tabelas foram criadas
SELECT 
  'admin_users' as tabela,
  COUNT(*) as registros
FROM admin_users
UNION ALL
SELECT 
  'banned_users' as tabela,
  COUNT(*) as registros
FROM banned_users
UNION ALL
SELECT 
  'admin_logs' as tabela,
  COUNT(*) as registros
FROM admin_logs;

-- Verificar se todas as funções foram criadas
SELECT 
  routine_name as funcao,
  routine_type as tipo
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'is_admin',
    'get_all_users',
    'ban_user',
    'unban_user',
    'add_admin',
    'remove_admin',
    'get_system_stats'
  )
ORDER BY routine_name;

-- ============================================
-- FIM DO SCRIPT
-- ============================================
-- 
-- Se tudo foi executado com sucesso, você deve ver:
-- 1. Mensagem "Admin adicionado com sucesso" (se o usuário existir)
-- 2. Lista de admins ativos
-- 3. Contagem de registros nas tabelas
-- 4. Lista de funções criadas
--
-- Próximos passos:
-- 1. Faça login no app com ngfilho@gmail.com
-- 2. Você deve ver o link "Admin" no menu
-- 3. Acesse o painel administrativo
-- ============================================

