# 🔧 Guia para Corrigir OAuth do Google

## Problemas Identificados

1. ❌ Erro de redirecionamento para localhost após login com Google
2. ❌ Usuários aparecem em Authentication > Users mas não na tabela `users`
3. ❌ Não é possível excluir usuários do Supabase
4. ❌ Configurações apontam para localhost, mas o site está em produção (oj-virtual.app)

---

## ✅ Solução Completa

### PASSO 1: Configurar Redirect URLs no Supabase

Seu site está em **oj-virtual.app**. Você precisa configurar as URLs corretas:

1. **Acesse:** https://app.supabase.com/project/mshrfewsfyzrknkqwnxs
2. **Vá em:** Authentication > URL Configuration
3. **Configure:**

#### Site URL (URL principal):
```
https://oj-virtual.app
```

#### Redirect URLs (adicione TODAS estas URLs):
```
https://oj-virtual.app/**
https://oj-virtual.app
http://localhost:5173/**
http://localhost:5173
```

**IMPORTANTE:** Mantenha ambas (produção e desenvolvimento) para poder testar localmente também.

4. **Clique em SAVE**

---

### PASSO 2: Criar a Tabela `users` no Supabase

Os usuários estão sendo criados em `auth.users` mas não na tabela pública `users`.

1. **Acesse:** https://app.supabase.com/project/mshrfewsfyzrknkqwnxs
2. **Vá em:** SQL Editor
3. **Cole e execute este SQL:**

```sql
-- Criar tabela users se não existir
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Habilitar Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Usuários podem ver seu próprio perfil
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Policy: Usuários podem atualizar seu próprio perfil
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Sistema pode inserir novos usuários
DROP POLICY IF EXISTS "Enable insert for authentication" ON public.users;
CREATE POLICY "Enable insert for authentication" ON public.users
  FOR INSERT WITH CHECK (true);

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS users_email_idx ON public.users(email);
```

4. **Clique em RUN**

---

### PASSO 3: Criar Trigger para Auto-Inserção de Usuários

Este trigger criará automaticamente um registro na tabela `users` quando alguém fizer signup:

1. **No SQL Editor, cole e execute:**

```sql
-- Função para criar usuário automaticamente
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name',
      split_part(new.email, '@', 1)
    ),
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

2. **Clique em RUN**

---

### PASSO 4: Migrar Usuários Existentes para a Tabela `users`

Para os usuários que já fizeram login mas não aparecem na tabela:

1. **No SQL Editor, cole e execute:**

```sql
-- Inserir usuários existentes na tabela users
INSERT INTO public.users (id, email, name, avatar_url)
SELECT
  id,
  email,
  COALESCE(
    raw_user_meta_data->>'name',
    raw_user_meta_data->>'full_name',
    split_part(email, '@', 1)
  ) as name,
  raw_user_meta_data->>'avatar_url' as avatar_url
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;
```

2. **Clique em RUN**
3. **Verifique:** Vá em Table Editor > users e veja se os usuários aparecem

---

### PASSO 5: Limpar Usuários de Teste (Opcional)

Se quiser excluir os usuários de teste antigos:

1. **No SQL Editor, cole e execute:**

```sql
-- Ver todos os usuários
SELECT id, email, created_at FROM auth.users;

-- Excluir usuário específico (substitua o email)
DELETE FROM auth.users WHERE email = 'email-do-usuario-teste@gmail.com';
```

**IMPORTANTE:** Exclua apenas usuários de teste. O trigger CASCADE vai excluir automaticamente da tabela `users` também.

---

### PASSO 6: Atualizar Google Cloud Console

Agora que o site está em **oj-virtual.app**, atualize no Google Console:

1. **Acesse:** https://console.cloud.google.com
2. **Vá em:** APIs e Serviços > Credenciais
3. **Clique no seu OAuth 2.0 Client ID**
4. **Em "URIs de redirecionamento autorizados", adicione:**

```
https://oj-virtual.app
https://mshrfewsfyzrknkqwnxs.supabase.co/auth/v1/callback
```

5. **Clique em SALVAR**

6. **Vá em:** APIs e Serviços > Tela de consentimento OAuth
7. **Atualize:**
   - **Página inicial:** `https://oj-virtual.app`
   - **Política de Privacidade:** `https://oj-virtual.app/#privacy`
   - **Termos de Serviço:** `https://oj-virtual.app/#terms`

8. **Salve as alterações**

---

### PASSO 7: Testar o Login

1. **Limpe os cookies do navegador** (Ctrl+Shift+Del)
2. **Acesse:** https://oj-virtual.app
3. **Clique em "Google"**
4. **Faça login com sua conta Google**
5. **Verifique:**
   - ✅ Não deve mais dar erro de localhost
   - ✅ Você deve ser redirecionado para o dashboard
   - ✅ Seu usuário deve aparecer em Table Editor > users

---

## 🔍 Verificação Pós-Configuração

### Checklist:

- [ ] Site URL configurada: `https://oj-virtual.app`
- [ ] Redirect URLs incluem `https://oj-virtual.app/**`
- [ ] Tabela `users` criada no Supabase
- [ ] Policies RLS configuradas
- [ ] Trigger de auto-inserção criado e ativo
- [ ] Usuários existentes migrados para tabela `users`
- [ ] Google Console atualizado com URLs de produção
- [ ] Login testado e funcionando
- [ ] Usuário aparece na tabela `users` após login

---

## 🐛 Solução de Problemas

### Problema: "Fazer login no serviço mshrfewsfyzrknkqwnxs.supabase.co"

**Isso é NORMAL!** O Supabase usa seu próprio domínio para processar o OAuth. O fluxo é:

1. Usuário clica em "Google" no seu site (oj-virtual.app)
2. É redirecionado para o Google para fazer login
3. Google redireciona para `mshrfewsfyzrknkqwnxs.supabase.co/auth/v1/callback` (Supabase)
4. Supabase processa o login e redireciona de volta para `oj-virtual.app`

### Problema: "ERR_CONNECTION_REFUSED" em localhost

**Causa:** Site URL está configurada como `http://localhost:5173` mas você está acessando de `oj-virtual.app`

**Solução:** Altere Site URL para `https://oj-virtual.app` (PASSO 1)

### Problema: Usuário não aparece na tabela `users`

**Causa:** Trigger não existe ou não está funcionando

**Solução:** Execute os SQLs do PASSO 2 e PASSO 3

### Problema: Não consigo excluir usuários

**Causa:** Políticas RLS muito restritivas

**Solução:** Use SQL para excluir (PASSO 5) ou desabilite RLS temporariamente:

```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
-- Faça as exclusões
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

---

## 📱 Teste Local (Desenvolvimento)

Se quiser testar localmente depois:

1. No Supabase, mantenha ambas as URLs em Redirect URLs:
   - `http://localhost:5173/**`
   - `https://oj-virtual.app/**`

2. Rode localmente: `npm run dev`

3. Acesse: `http://localhost:5173`

4. O login com Google funcionará porque a URL está na lista

---

## ⚠️ IMPORTANTE

1. **Nunca remova** `https://mshrfewsfyzrknkqwnxs.supabase.co/auth/v1/callback` dos URIs de redirecionamento do Google - ele é necessário!

2. **Sempre use HTTPS** em produção, nunca HTTP

3. **Após qualquer mudança no Supabase ou Google Console**, aguarde 2-3 minutos para propagar

4. **Limpe cookies do navegador** antes de testar após mudanças

---

## 🎯 Resumo das URLs Corretas

| Configuração | URL |
|--------------|-----|
| **Supabase - Site URL** | `https://oj-virtual.app` |
| **Supabase - Redirect URL #1** | `https://oj-virtual.app/**` |
| **Supabase - Redirect URL #2** | `http://localhost:5173/**` (opcional, para dev) |
| **Google Console - Página inicial** | `https://oj-virtual.app` |
| **Google Console - Privacidade** | `https://oj-virtual.app/#privacy` |
| **Google Console - Termos** | `https://oj-virtual.app/#terms` |
| **Google Console - Redirect URI** | `https://mshrfewsfyzrknkqwnxs.supabase.co/auth/v1/callback` |

---

**Siga os passos na ordem e tudo funcionará!** 🚀
