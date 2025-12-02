# 🛡️ Guia de Configuração do Sistema Admin

Este guia explica como configurar e usar o sistema administrativo completo do NutriHealth Gen.

## 📋 Pré-requisitos

- Acesso ao Supabase Dashboard
- Permissões de administrador no projeto Supabase
- Um usuário já cadastrado no sistema

## 🚀 Passo 1: Configurar o Banco de Dados

1. Acesse o **Supabase Dashboard** do seu projeto
2. Vá em **SQL Editor**
3. Abra o arquivo `supabase_admin_setup.sql` e copie todo o conteúdo
4. Cole no SQL Editor e execute o script completo
5. Aguarde a confirmação de que todas as tabelas e funções foram criadas

### ✅ Verificar se foi criado corretamente

Após executar o script, execute o arquivo `supabase_check_functions.sql` para verificar se tudo foi criado corretamente:
- Tabelas: `admin_users`, `banned_users`, `admin_logs`
- Funções: `get_all_users`, `ban_user`, `unban_user`, `add_admin`, `remove_admin`, `get_system_stats`, `is_admin`
- Políticas RLS habilitadas

### O que o script cria:

- ✅ Tabela `admin_users` - Armazena usuários administradores
- ✅ Tabela `banned_users` - Armazena usuários banidos
- ✅ Tabela `admin_logs` - Registra todas as ações administrativas
- ✅ Funções RPC para gerenciar usuários, banir/desbanir, adicionar/remover admins
- ✅ Políticas de segurança (RLS) para proteger os dados

## 👤 Passo 2: Criar o Primeiro Admin

Após executar o script SQL, você precisa adicionar manualmente o primeiro administrador.

### Opção A: Via SQL Editor (RECOMENDADO)

**IMPORTANTE:** Você precisa encontrar o UUID real do usuário primeiro!

1. **Encontre o UUID do usuário:**
```sql
SELECT 
    id as user_id,
    email,
    created_at,
    raw_user_meta_data->>'name' as name
FROM auth.users 
WHERE email = 'ngfilho@gmail.com';  -- Substitua pelo email
```

2. **Copie o UUID retornado** (exemplo: `f89cb4bc-e017-489b-b50e-7b27a6ff5804`)

3. **Adicione o admin usando o UUID real:**
```sql
INSERT INTO admin_users (user_id, email, created_by, notes)
VALUES (
  'f89cb4bc-e017-489b-b50e-7b27a6ff5804',  -- UUID encontrado acima (SUBSTITUA!)
  'ngfilho@gmail.com',                      -- Email do usuário
  'f89cb4bc-e017-489b-b50e-7b27a6ff5804',  -- Mesmo UUID aqui
  'Admin inicial'
);
```

**OU use o arquivo `supabase_add_admin.sql` que contém queries prontas!**

### Opção B: Via Código (Fallback)

Se você ainda não executou o script SQL, o sistema usa uma lista de emails como fallback. Edite `contexts/AuthContext.tsx`:

```typescript
const ADMIN_EMAILS = [
    'admin@nutrihealth.com',
    'sickboy81@gmail.com',
    'ngfilho@gmail.com',
    'seu-email@exemplo.com' // Adicione seu email aqui
];
```

## 🔐 Passo 3: Verificar Acesso Admin

1. Faça login no sistema com uma conta admin
2. Você deve ver o link **"Admin"** no menu do Header
3. Clique em "Admin" para acessar o painel administrativo

## 📊 Funcionalidades do Painel Admin

### Aba Usuários

- **Listar todos os usuários** do sistema
- **Banir usuários** (com motivo e opção de banimento permanente)
- **Desbanir usuários**
- **Promover usuários a administrador**
- **Remover privilégios de administrador**

### Aba Receitas

- **Criar novas receitas**
- **Editar receitas existentes**
- **Deletar receitas**

### Aba Estatísticas

- **Total de usuários**
- **Usuários ativos** (últimos 30 dias)
- **Usuários banidos**
- **Total de administradores**
- **Novos cadastros** (últimos 7 dias)
- **Total de dados de usuários**

### Aba Configurações

- **Exportar dados** de todos os usuários em JSON
- **Atualizar estatísticas** do sistema
- **Informações do admin logado**

## 🔧 Funções RPC Disponíveis

O script SQL cria as seguintes funções que podem ser chamadas via Supabase:

### `get_all_users()`
Lista todos os usuários com informações de banimento e status de admin.

### `ban_user(user_id, reason, is_permanent)`
Bane um usuário do sistema.

**Parâmetros:**
- `target_user_id` (UUID): ID do usuário a ser banido
- `ban_reason` (TEXT, opcional): Motivo do banimento
- `is_permanent_ban` (BOOLEAN): Se o banimento é permanente

### `unban_user(user_id)`
Remove o banimento de um usuário.

### `add_admin(user_id, notes)`
Promove um usuário a administrador.

### `remove_admin(user_id)`
Remove os privilégios de administrador de um usuário.

### `get_system_stats()`
Retorna estatísticas completas do sistema.

### `is_admin(user_id)`
Verifica se um usuário é administrador.

## 🛡️ Segurança

- Todas as tabelas têm **Row Level Security (RLS)** habilitado
- Apenas administradores podem acessar dados administrativos
- Todas as ações são **logadas** na tabela `admin_logs`
- Admins não podem banir outros admins
- Admins não podem remover seus próprios privilégios

## 📝 Logs de Auditoria

Todas as ações administrativas são registradas automaticamente na tabela `admin_logs`:

- Quem executou a ação (`admin_id`)
- Tipo de ação (`action_type`)
- Usuário alvo (`target_user_id`)
- Detalhes da ação (`details` em JSONB)
- Data e hora (`created_at`)

## 🐛 Troubleshooting

### "Acesso negado" ao tentar listar usuários

- Verifique se você executou o script SQL completo
- Confirme que seu usuário está na tabela `admin_users` com `is_active = true`
- Verifique se as políticas RLS estão corretas

### Função não encontrada

- Execute novamente o script SQL
- Verifique se todas as funções foram criadas no Supabase
- Verifique os logs do SQL Editor para erros

### Não consigo ver o link Admin

- Faça logout e login novamente
- Verifique se seu email está na lista `ADMIN_EMAILS` ou na tabela `admin_users`
- Limpe o cache do navegador

## 📚 Próximos Passos

Para funcionalidades ainda mais avançadas, você pode:

1. **Criar Edge Functions** para operações mais complexas
2. **Adicionar notificações** por email quando usuários são banidos
3. **Implementar sistema de permissões** mais granular
4. **Adicionar dashboard de analytics** mais detalhado
5. **Criar relatórios automáticos** de uso do sistema

## 💡 Dicas

- Sempre verifique os logs antes de banir um usuário
- Use o sistema de exportação regularmente para backups
- Mantenha a lista de admins atualizada
- Revise os logs administrativos periodicamente

---

**Desenvolvido para NutriHealth Gen** 🥗

