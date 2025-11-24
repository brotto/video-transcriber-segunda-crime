# 🔧 Correção da Autenticação

## Problema Identificado

1. **Trigger desnecessário:** Usuários OAuth sendo forçados a ir para `public.users`
2. **Confirmação de email quebrada:** Sem SMTP configurado, cadastro manual não funciona

## Solução

### ✅ Passo 1: Remover Trigger e Função (SQL)

Acesse o **Supabase Dashboard** → **SQL Editor** e execute:

```sql
-- 1. Remover o trigger que insere automaticamente em public.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Remover a função associada
DROP FUNCTION IF EXISTS public.handle_new_user();

-- 3. Verificar se removeu (deve retornar 0 linhas)
SELECT * FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**Resultado esperado:** ✅ "Success. No rows returned"

---

### ✅ Passo 2: Desabilitar Confirmação de Email

No **Supabase Dashboard**:

1. Vá em: **Authentication** (ícone de cadeado) → **Providers**
2. Localize: **Email** na lista de providers
3. Clique em **Email** para expandir configurações
4. Encontre: **Confirm email**
5. **DESABILITE** a opção: ☐ Confirm email
6. Clique em: **Save**

**Configuração final:**
```
Email Provider
├─ Enable email provider: ✓ (habilitado)
├─ Confirm email: ☐ (DESABILITADO)
└─ Secure email change: ✓ (habilitado - opcional)
```

---

### ✅ Passo 3: Limpar Tabela public.users (Opcional)

Se quiser remover os registros duplicados em `public.users`:

```sql
-- ATENÇÃO: Isso vai APAGAR todos os registros de public.users
-- Só execute se tiver certeza de que não precisa desses dados

TRUNCATE TABLE public.users CASCADE;
```

**OU** se quiser remover a tabela completamente:

```sql
-- Remove a tabela inteiramente
DROP TABLE IF EXISTS public.users CASCADE;
```

---

## Como Funciona Agora

### Autenticação com Google OAuth
1. ✅ Usuário clica em "Entrar com Google"
2. ✅ Google redireciona para Supabase
3. ✅ Supabase cria registro em `auth.users`
4. ✅ **NÃO cria** registro em `public.users` (trigger removido)
5. ✅ Usuário é autenticado e vai para Dashboard

### Autenticação com Email/Senha
1. ✅ Usuário preenche email e senha
2. ✅ Supabase cria registro em `auth.users`
3. ✅ **NÃO envia email** de confirmação (desabilitado)
4. ✅ Conta é **ativada imediatamente**
5. ✅ Usuário é autenticado e vai para Dashboard

---

## Verificação

### Testar Google OAuth
1. Acesse: https://oj-virtual.app
2. Clique em: **"Entrar com Google"**
3. Complete o fluxo OAuth
4. Verifique que foi para Dashboard
5. No Supabase:
   - ✅ Deve aparecer em: **Authentication** → **Users**
   - ❌ Não deve aparecer em: **Table Editor** → **users**

### Testar Email/Senha
1. Acesse: https://oj-virtual.app
2. Clique em: **"Criar conta"**
3. Preencha: nome, email, senha
4. Clique em: **"Criar conta"**
5. ✅ Deve ir direto para Dashboard (sem email de confirmação)
6. No Supabase:
   - ✅ Deve aparecer em: **Authentication** → **Users**
   - ❌ Não deve aparecer em: **Table Editor** → **users**

---

## Impacto no Código

### O que precisa mudar no código

Atualmente, o código pode estar tentando acessar `public.users`, mas agora só precisamos de `auth.users`.

Vou verificar e corrigir todos os lugares onde isso acontece:

**Arquivos que podem precisar de ajuste:**
- `src/lib/supabase.ts` - configuração do cliente
- `src/views/Auth.tsx` - lógica de login/registro
- `src/views/Dashboard.tsx` - exibição de dados do usuário
- `src/App.tsx` - gerenciamento de sessão

**Mudanças necessárias:**
- ✅ Usar `user` do `auth.getUser()` em vez de query em `public.users`
- ✅ Dados do usuário vêm de `user.user_metadata` (nome, avatar)
- ✅ Email vem de `user.email`
- ✅ ID vem de `user.id`

---

## Estrutura de Dados

### auth.users (gerenciado pelo Supabase)

```typescript
interface User {
  id: string;                    // UUID único
  email: string;                 // Email do usuário
  user_metadata: {               // Dados adicionais
    name?: string;               // Nome (se fornecido)
    avatar_url?: string;         // Avatar do Google
    full_name?: string;          // Nome completo do Google
  };
  created_at: string;            // Data de criação
  last_sign_in_at: string;      // Último login
  provider: string;              // 'google' ou 'email'
}
```

### Como acessar no código

```typescript
// Obter usuário atual
const { data: { user } } = await supabase.auth.getUser();

// Dados disponíveis
const userId = user.id;
const userEmail = user.email;
const userName = user.user_metadata.name || user.user_metadata.full_name;
const userAvatar = user.user_metadata.avatar_url;
const provider = user.app_metadata.provider; // 'google' ou 'email'
```

---

## Rollback (se der problema)

Se precisar reverter as mudanças:

### Recriar o trigger

```sql
-- 1. Recriar a função
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', ''),
    NEW.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    name = COALESCE(EXCLUDED.name, public.users.name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.users.avatar_url),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Recriar o trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

### Reabilitar confirmação de email

1. Vá em: **Authentication** → **Providers** → **Email**
2. Marque: ✓ Confirm email
3. Clique em: **Save**

---

## Checklist

### No Supabase (SQL)
- [ ] Executar SQL para remover trigger
- [ ] Executar SQL para remover função
- [ ] Verificar que trigger foi removido (0 linhas)

### No Supabase (Interface)
- [ ] Desabilitar confirmação de email em Authentication > Providers > Email
- [ ] Salvar configurações

### Opcional
- [ ] Limpar tabela public.users (TRUNCATE ou DROP)

### Testes
- [ ] Testar login com Google
- [ ] Testar registro com email/senha
- [ ] Verificar que usuários não aparecem em public.users
- [ ] Verificar que Dashboard carrega corretamente

---

## Próximos Passos

Após executar essas correções no Supabase:

1. ✅ **Execute os SQLs** nos passos 1 e 3
2. ✅ **Desabilite confirmação de email** no passo 2
3. 🔄 **Aguarde** enquanto eu atualizo o código da aplicação
4. ✅ **Teste** os dois fluxos de autenticação

---

**Última atualização:** 24/11/2025
