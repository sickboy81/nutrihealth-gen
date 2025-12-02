# 🚀 Como Executar o Setup no Supabase

## Passo a Passo

### 1. Acesse o Supabase Dashboard

1. Vá para [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Faça login na sua conta
3. Selecione o projeto do NutriHealth Gen

### 2. Abra o SQL Editor

1. No menu lateral esquerdo, clique em **"SQL Editor"**
2. Clique em **"New query"** para criar uma nova query

### 3. Execute o Script Completo

1. Abra o arquivo `supabase_complete_setup.sql` neste projeto
2. **Copie TODO o conteúdo** do arquivo
3. **Cole no SQL Editor** do Supabase
4. Clique em **"Run"** ou pressione `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

### 4. Verifique os Resultados

Após executar, você deve ver:

✅ **Mensagem de sucesso:**
```
Admin adicionado com sucesso: ngfilho@gmail.com (UUID: f89cb4bc-e017-489b-b50e-7b27a6ff5804)
```

✅ **Lista de admins ativos** (deve mostrar pelo menos 1 registro)

✅ **Contagem de tabelas:**
- admin_users: 1 ou mais
- banned_users: 0
- admin_logs: 0 ou mais

✅ **Lista de funções criadas** (deve mostrar 7 funções)

### 5. Teste no App

1. Faça **logout** do app (se estiver logado)
2. Faça **login** novamente com `ngfilho@gmail.com`
3. Você deve ver o link **"Admin"** no menu do Header (ícone de escudo)
4. Clique em "Admin" para acessar o painel administrativo

## ⚠️ Se Algo Der Errado

### Erro: "Usuário não encontrado"

Isso significa que o usuário `ngfilho@gmail.com` ainda não está cadastrado no Supabase.

**Solução:**
1. Faça login no app com `ngfilho@gmail.com` (crie a conta se necessário)
2. Execute o script novamente

### Erro: "relation already exists"

Algumas tabelas já existem. Isso é normal se você executou o script antes.

**Solução:**
- O script usa `CREATE TABLE IF NOT EXISTS`, então é seguro executar novamente
- Se houver erro em políticas, o script remove e recria automaticamente

### Erro: "permission denied"

Você não tem permissões de administrador no projeto Supabase.

**Solução:**
- Verifique se você é o dono do projeto
- Ou peça para o dono do projeto executar o script

## 📋 O Que o Script Faz

1. ✅ Cria 3 tabelas: `admin_users`, `banned_users`, `admin_logs`
2. ✅ Habilita Row Level Security (RLS) em todas as tabelas
3. ✅ Cria políticas de segurança para proteger os dados
4. ✅ Cria 7 funções RPC para gerenciar o sistema
5. ✅ Adiciona automaticamente `ngfilho@gmail.com` como admin
6. ✅ Cria índices para melhor performance
7. ✅ Verifica se tudo foi criado corretamente

## 🔍 Verificar Manualmente

Se quiser verificar manualmente se tudo está funcionando:

```sql
-- Ver todos os admins
SELECT * FROM admin_users WHERE is_active = true;

-- Verificar se as funções existem
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_schema = 'public' 
  AND routine_name IN ('get_all_users', 'ban_user', 'add_admin');

-- Testar a função is_admin (substitua o UUID)
SELECT is_admin('f89cb4bc-e017-489b-b50e-7b27a6ff5804');
```

## ✅ Pronto!

Após executar o script com sucesso, o sistema administrativo estará totalmente funcional!

