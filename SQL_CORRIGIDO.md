# 🔧 SQL Corrigido para Migrar Usuários

## Problema Comum

O SQL de migração pode dar erro se:
- A tabela `users` não existir ainda
- As policies RLS estiverem bloqueando
- Houver conflito de tipos de dados

---

## ✅ SQL Corrigido (Execute ESTE)

### Versão 1: SQL Simplificado (Tente Primeiro)

```sql
-- Desabilitar RLS temporariamente para inserção
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

-- Inserir usuários existentes
INSERT INTO public.users (id, email, name, avatar_url, created_at)
SELECT
  au.id,
  au.email,
  COALESCE(
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'full_name',
    split_part(au.email, '@', 1)
  ),
  au.raw_user_meta_data->>'avatar_url',
  au.created_at
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
);

-- Reabilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Verificar quantos usuários foram inseridos
SELECT COUNT(*) as total_usuarios FROM public.users;
```

---

### Versão 2: SQL Com Tratamento de Erros

Se a Versão 1 não funcionar, tente esta:

```sql
-- Função temporária para migração segura
DO $$
DECLARE
  user_record RECORD;
  inserted_count INTEGER := 0;
BEGIN
  -- Desabilitar RLS temporariamente
  ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;

  -- Loop através de cada usuário em auth.users
  FOR user_record IN
    SELECT
      id,
      email,
      COALESCE(
        raw_user_meta_data->>'name',
        raw_user_meta_data->>'full_name',
        split_part(email, '@', 1)
      ) as name,
      raw_user_meta_data->>'avatar_url' as avatar_url,
      created_at
    FROM auth.users
  LOOP
    -- Tentar inserir cada usuário
    BEGIN
      INSERT INTO public.users (id, email, name, avatar_url, created_at)
      VALUES (
        user_record.id,
        user_record.email,
        user_record.name,
        user_record.avatar_url,
        user_record.created_at
      )
      ON CONFLICT (id) DO NOTHING;

      inserted_count := inserted_count + 1;
    EXCEPTION WHEN OTHERS THEN
      -- Ignorar erros e continuar
      RAISE NOTICE 'Erro ao inserir usuário %: %', user_record.email, SQLERRM;
    END;
  END LOOP;

  -- Reabilitar RLS
  ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

  RAISE NOTICE 'Total de usuários processados: %', inserted_count;
END $$;

-- Verificar resultado
SELECT
  id,
  email,
  name,
  created_at
FROM public.users
ORDER BY created_at DESC;
```

---

### Versão 3: SQL Manual (Última Opção)

Se as versões acima não funcionarem, insira manualmente cada usuário:

**Primeiro, veja os usuários que precisam ser migrados:**

```sql
SELECT
  id,
  email,
  raw_user_meta_data->>'name' as name,
  raw_user_meta_data->>'avatar_url' as avatar_url,
  created_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);
```

**Depois, para cada usuário, execute:**

```sql
-- Substitua os valores abaixo pelos dados reais de cada usuário
INSERT INTO public.users (id, email, name, avatar_url, created_at)
VALUES (
  'uuid-do-usuario-aqui',
  'email@exemplo.com',
  'Nome do Usuario',
  'https://url-avatar.com/foto.jpg',
  '2024-01-01 00:00:00'
)
ON CONFLICT (id) DO NOTHING;
```

---

## 🔍 Diagnóstico: Identificar o Problema

Execute este SQL para ver o que está acontecendo:

```sql
-- 1. Verificar se a tabela users existe
SELECT EXISTS (
  SELECT FROM information_schema.tables
  WHERE table_schema = 'public'
  AND table_name = 'users'
) as tabela_existe;

-- 2. Ver quantos usuários existem em auth.users
SELECT COUNT(*) as usuarios_auth FROM auth.users;

-- 3. Ver quantos usuários existem em public.users
SELECT COUNT(*) as usuarios_public FROM public.users;

-- 4. Ver os usuários que estão em auth mas não em public
SELECT
  au.id,
  au.email,
  au.created_at,
  CASE
    WHEN pu.id IS NULL THEN 'Falta migrar'
    ELSE 'Já migrado'
  END as status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
ORDER BY au.created_at DESC;

-- 5. Verificar se RLS está ativo
SELECT
  tablename,
  rowsecurity as rls_ativo
FROM pg_tables
WHERE schemaname = 'public'
AND tablename = 'users';
```

---

## 🛠️ Soluções para Erros Comuns

### Erro: "relation 'public.users' does not exist"

**Solução:** A tabela não foi criada. Execute o SQL 1 (criar tabela) primeiro.

```sql
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);
```

---

### Erro: "permission denied for table users"

**Solução:** RLS está bloqueando. Desabilite temporariamente:

```sql
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
-- Execute a inserção
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

---

### Erro: "duplicate key value violates unique constraint"

**Solução:** Usuários já existem na tabela. Isso é OK! Use:

```sql
-- Ver quais usuários já estão migrados
SELECT email FROM public.users;

-- Contar usuários migrados
SELECT COUNT(*) FROM public.users;
```

---

### Erro: "invalid input syntax for type uuid"

**Solução:** Problema com conversão de tipos. Use casting explícito:

```sql
INSERT INTO public.users (id, email, name, avatar_url)
SELECT
  au.id::uuid,
  au.email::text,
  COALESCE(
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'full_name',
    split_part(au.email, '@', 1)
  )::text,
  NULLIF(au.raw_user_meta_data->>'avatar_url', '')::text
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.users pu WHERE pu.id = au.id
);
```

---

### Erro: "column 'avatar_url' cannot be null"

**Solução:** Use NULLIF para permitir valores NULL:

```sql
INSERT INTO public.users (id, email, name, avatar_url)
SELECT
  id,
  email,
  COALESCE(
    raw_user_meta_data->>'name',
    raw_user_meta_data->>'full_name',
    split_part(email, '@', 1)
  ),
  NULLIF(raw_user_meta_data->>'avatar_url', '')
FROM auth.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.users WHERE public.users.id = auth.users.id
);
```

---

## ✅ Verificação Final

Após executar o SQL, verifique se funcionou:

```sql
-- 1. Ver todos os usuários migrados
SELECT
  id,
  email,
  name,
  avatar_url,
  created_at
FROM public.users
ORDER BY created_at DESC;

-- 2. Comparar quantidades
SELECT
  (SELECT COUNT(*) FROM auth.users) as usuarios_auth,
  (SELECT COUNT(*) FROM public.users) as usuarios_public,
  (SELECT COUNT(*) FROM auth.users) - (SELECT COUNT(*) FROM public.users) as diferenca;
```

**Se `diferenca = 0`, todos foram migrados com sucesso!**

---

## 🎯 Ordem de Execução Recomendada

1. **Execute:** Versão 1 (SQL Simplificado)
2. **Se falhar:** Execute Diagnóstico para ver o erro
3. **Se ainda falhar:** Execute Versão 2 (Com Tratamento de Erros)
4. **Última opção:** Versão 3 (Manual)

---

## 💡 Dica Importante

**Se você já tem usuários fazendo login com Google:**
- Não se preocupe em migrar usuários antigos
- O **trigger** criado no SQL 2 vai inserir automaticamente novos usuários
- Você pode deixar os usuários antigos sem migrar
- Eles serão adicionados automaticamente no próximo login

---

**Tente a Versão 1 primeiro e me diga se funcionou!** 🚀
