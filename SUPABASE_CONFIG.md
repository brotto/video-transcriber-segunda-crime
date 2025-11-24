# Configuração do Supabase

## URL do Projeto
https://mshrfewsfyzrknkqwnxs.supabase.co

## Dashboard
https://app.supabase.com/project/mshrfewsfyzrknkqwnxs

---

## Configuração de Autenticação

### 1. URL Configuration

Acesse: **Authentication** > **URL Configuration**

#### Site URL (URL principal do app):
- **Desenvolvimento:** `http://localhost:5173`
- **Produção:** `https://seu-dominio.com` (ou URL da Vercel)

#### Redirect URLs (URLs permitidas para redirect após login):

**Para Desenvolvimento:**
```
http://localhost:5173/**
http://localhost:5173
http://127.0.0.1:5173/**
http://127.0.0.1:5173
```

**Para Produção (adicione quando fizer deploy):**
```
https://seu-projeto.vercel.app/**
https://seu-projeto.vercel.app
https://seudominio.com/**
https://seudominio.com
```

**IMPORTANTE:**
- Use `/**` no final para aceitar qualquer rota
- Adicione versões com e sem `/**` para garantir compatibilidade
- **NÃO remova** as URLs de desenvolvimento quando adicionar produção

---

### 2. Google OAuth Configuration

Acesse: **Authentication** > **Providers** > **Google**

1. Ative o toggle para habilitar o Google
2. Verifique se **Client ID** e **Client Secret** estão preenchidos
3. Clique em **Save**

**Authorized redirect URIs no Google Cloud Console:**
```
https://mshrfewsfyzrknkqwnxs.supabase.co/auth/v1/callback
```

---

### 3. Estrutura da Tabela Users

A tabela `users` deve existir com a seguinte estrutura:

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy para permitir que usuários leiam seu próprio perfil
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Policy para permitir que usuários atualizem seu próprio perfil
CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Policy para permitir inserção automática no signup
CREATE POLICY "Users can insert own profile" ON users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

**Verificar se a tabela existe:**
1. Vá em **Table Editor** no Supabase Dashboard
2. Procure pela tabela `users`
3. Se não existir, crie usando o SQL acima na aba **SQL Editor**

---

### 4. Trigger para Criar Usuário Automaticamente

Para criar automaticamente o registro na tabela `users` quando alguém faz signup:

```sql
-- Função para criar usuário na tabela users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', new.raw_user_meta_data->>'full_name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que executa após signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

Execute esse SQL no **SQL Editor** do Supabase.

---

## Verificação de Configuração

### Checklist:

- [ ] Site URL configurada corretamente
- [ ] Redirect URLs incluem localhost para desenvolvimento
- [ ] Redirect URLs incluem domínio de produção (após deploy)
- [ ] Google OAuth habilitado
- [ ] Tabela `users` existe
- [ ] Policies RLS configuradas
- [ ] Trigger de auto-inserção criado

---

## Solução de Problemas Comuns

### Erro: "ERR_CONNECTION_REFUSED" ao fazer login com Google

**Causa:** Redirect URLs não configuradas no Supabase

**Solução:** Adicione `http://localhost:5173/**` nas Redirect URLs (veja seção 1)

---

### Erro: "Invalid redirect URL"

**Causa:** URL não está na lista de Redirect URLs permitidas

**Solução:**
1. Verifique se a URL está exatamente como configurada no Supabase
2. Certifique-se de incluir `/**` no final
3. Adicione versões com HTTP e HTTPS se necessário

---

### Erro: "User not found in database"

**Causa:** Tabela `users` não existe ou trigger não está configurado

**Solução:**
1. Crie a tabela `users` (veja seção 3)
2. Configure o trigger de auto-inserção (veja seção 4)
3. Ou faça a inserção manual no código (já implementado no App.tsx)

---

### Login com Google não abre popup

**Causa:** Provider do Google não está habilitado

**Solução:** Vá em Authentication > Providers > Google e ative o toggle

---

## Configurações de Segurança

### Email Auth

Configurações recomendadas em **Authentication** > **Settings**:

- **Enable email confirmations:** Ativado (recomendado para produção)
- **Enable email change confirmations:** Ativado
- **Secure email change:** Ativado
- **Minimum password length:** 6 caracteres (ou mais)

### Rate Limiting

Configure em **Authentication** > **Rate Limits** para evitar abusos:

- **Email signups:** 4 por hora (padrão)
- **Email signins:** 30 por hora (padrão)
- **SMS signups:** 4 por hora (padrão)

---

## Links Úteis

- **Supabase Dashboard:** https://app.supabase.com
- **Documentação Auth:** https://supabase.com/docs/guides/auth
- **Documentação OAuth:** https://supabase.com/docs/guides/auth/social-login
- **Documentação RLS:** https://supabase.com/docs/guides/auth/row-level-security
