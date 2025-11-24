# ✅ Próximos Passos - Video Transcriber

**Data:** 24/11/2025
**Status:** Código atualizado e commitado ✓

---

## 📋 Resumo das Mudanças

### ✅ O que foi implementado:

1. **Fluxo assíncrono completo** - Sistema não aguarda mais transcrição em tempo real
2. **Tabela `transcriptions` no Supabase** - Armazena vídeos e status de processamento
3. **API Endpoint `/api/webhook-callback`** - Recebe notificação do n8n quando completar
4. **Polling no Dashboard** - Verifica status a cada 5 segundos
5. **Estados visuais** - pending, processing, completed, error com ícones animados
6. **Documentação completa** - `INTEGRACAO_WEBHOOK_N8N.md` com todos os detalhes

---

## 🎯 Ações Necessárias (em ordem)

### 1️⃣ No Supabase (URGENTE)

#### A. Executar SQLs de Autenticação

Acesse: **Supabase Dashboard** → **SQL Editor** → **New query**

**SQL 1: Remover trigger e função desnecessários**
```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
```

**SQL 2: Criar tabela de transcrições**

Cole todo o conteúdo do arquivo: **`CRIAR_TABELA_TRANSCRICOES.sql`**

Este SQL cria:
- Tabela `transcriptions` com todos os campos
- Índices para performance
- RLS (Row Level Security) com policies
- Trigger para `updated_at`

**Verificação:**
```sql
-- Verificar se a tabela foi criada
SELECT * FROM transcriptions LIMIT 1;

-- Deve retornar estrutura vazia (sem erro)
```

#### B. Desabilitar confirmação de email

Acesse: **Supabase Dashboard** → **Authentication** → **Providers** → **Email**

- Encontre: "Confirm email"
- **DESMARQUE** o checkbox
- Clique em: **Save**

#### C. Copiar Service Role Key

Acesse: **Supabase Dashboard** → **Settings** → **API**

1. Encontre seção: **Project API keys**
2. Copie: **`service_role`** (secret)
3. Guarde para adicionar no Vercel

---

### 2️⃣ No Vercel (URGENTE)

Acesse: **Vercel Dashboard** → **Settings** → **Environment Variables**

**Adicionar nova variável:**

```
Key: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (cole a key copiada)
Environment: Production, Preview, Development
```

**IMPORTANTE:** Esta key permite bypass do RLS - nunca exponha no frontend!

**Aguardar:** Deploy automático após adicionar variável (2-3 minutos)

---

### 3️⃣ No N8N (NECESSÁRIO)

Você precisa atualizar o workflow n8n para o novo fluxo assíncrono.

#### Mudanças necessárias:

**ANTES** (fluxo antigo - síncrono):
```
Webhook → Processar vídeo → Retornar transcrição
```

**DEPOIS** (fluxo novo - assíncrono):
```
1. Webhook → Receber dados (incluindo transcriptionId)
2. ↓
3. Retornar 202 Accepted IMEDIATAMENTE
4. ↓
5. [Background] Processar vídeo
6. ↓
7. Chamar callback endpoint com resultado
```

#### Campos adicionais que o webhook agora recebe:

```
FormData:
├─ transcriptionId (UUID) ← NOVO! ID para referenciar depois
├─ personName (string)
├─ lawsuitNumber (string)
├─ submittedByEmail (string)
├─ submittedById (UUID)
└─ video (File)
```

#### Resposta imediata do webhook:

```json
{
  "success": true,
  "message": "Vídeo recebido e processamento iniciado",
  "transcriptionId": "{{transcriptionId recebido}}"
}
```

**Status code:** `202 Accepted`

#### Quando processamento completar:

```http
POST https://oj-virtual.app/api/webhook-callback
Content-Type: application/json

{
  "transcriptionId": "UUID recebido no passo 1",
  "status": "completed",
  "transcription": "Texto completo da transcrição...",
  "processingStartedAt": "2025-11-24T15:30:00.000Z",
  "processingCompletedAt": "2025-11-24T15:35:00.000Z"
}
```

#### Se ocorrer erro:

```json
{
  "transcriptionId": "UUID recebido no passo 1",
  "status": "error",
  "errorMessage": "Descrição do erro"
}
```

**Documentação completa:** Ver arquivo `INTEGRACAO_WEBHOOK_N8N.md`

---

### 4️⃣ Testes (RECOMENDADO)

#### A. Testar Callback Endpoint

```bash
curl -X POST https://oj-virtual.app/api/webhook-callback \
  -H "Content-Type: application/json" \
  -d '{
    "transcriptionId": "test-uuid-12345",
    "status": "completed",
    "transcription": "Teste de transcrição",
    "processingCompletedAt": "2025-11-24T15:35:00.000Z"
  }'
```

**Resposta esperada:**
```json
{
  "success": false,
  "error": "Database error"
}
```

Isso é esperado porque `test-uuid-12345` não existe. Mas confirma que endpoint está acessível!

#### B. Testar Fluxo Completo

1. Acesse: https://oj-virtual.app
2. Faça login (Google OAuth ou Email/Senha)
3. Preencha formulário e envie vídeo pequeno (teste)
4. Observe:
   - ✅ Status "Aguardando processamento..."
   - ✅ Muda para "Processando transcrição..." (se n8n notificar)
   - ✅ Muda para "Transcrição concluída!" quando n8n chamar callback
   - ✅ Transcrição aparece na tela
   - ✅ Botão "Copiar" funciona

---

## 📊 Checklist de Verificação

### Supabase
- [ ] SQL 1 executado (remover trigger/função)
- [ ] SQL 2 executado (criar tabela transcriptions)
- [ ] Tabela `transcriptions` criada sem erros
- [ ] Confirmação de email desabilitada
- [ ] Service Role Key copiada

### Vercel
- [ ] Variável `SUPABASE_SERVICE_ROLE_KEY` adicionada
- [ ] Deploy completado após adicionar variável
- [ ] Site acessível em https://oj-virtual.app
- [ ] Endpoint `/api/webhook-callback` respondendo

### N8N
- [ ] Webhook atualizado para receber `transcriptionId`
- [ ] Resposta imediata configurada (202 Accepted)
- [ ] Processamento movido para background
- [ ] Callback endpoint configurado para sucesso
- [ ] Callback endpoint configurado para erro
- [ ] Testado com vídeo pequeno

### Frontend
- [ ] Login funcionando (Google OAuth)
- [ ] Login funcionando (Email/Senha)
- [ ] Upload de vídeo funcionando
- [ ] Polling detectando mudanças
- [ ] Estados visuais corretos
- [ ] Transcrição exibida quando completa
- [ ] Botão copiar funcionando

---

## 🔍 Verificação de Logs

### Ver logs do callback endpoint

```bash
# No terminal, com Vercel CLI instalado
vercel logs https://oj-virtual.app/api/webhook-callback --follow
```

**Ou:** Acesse **Vercel Dashboard** → **Deployments** → *[último deploy]* → **Functions** → `/api/webhook-callback`

### Ver registros no Supabase

```sql
-- Ver últimas transcrições
SELECT
  id,
  status,
  person_name,
  lawsuit_number,
  created_at,
  updated_at
FROM transcriptions
ORDER BY created_at DESC
LIMIT 10;

-- Ver transcrição específica
SELECT * FROM transcriptions
WHERE id = 'UUID-AQUI';
```

---

## ⚠️ Problemas Comuns

### ❌ Endpoint retorna 500

**Causa:** Service Role Key não configurada no Vercel

**Solução:**
1. Adicione variável no Vercel
2. Aguarde redeploy automático
3. Teste novamente

### ❌ Polling não detecta mudanças

**Causa:** N8N não está chamando callback endpoint

**Solução:**
1. Verifique logs do n8n
2. Confirme URL do callback está correta
3. Teste callback manualmente com curl

### ❌ "Database error" no callback

**Causa:** RLS bloqueando update ou transcriptionId inválido

**Solução:**
1. Verifique se Service Role Key está correta
2. Verifique se transcriptionId existe no banco
3. Verifique policies do RLS

### ❌ Usuários não conseguem criar transcrição

**Causa:** RLS bloqueando INSERT

**Solução:**
```sql
-- Verificar policies
SELECT * FROM pg_policies WHERE tablename = 'transcriptions';

-- Deve ter policy "Users can create transcriptions"
```

---

## 📚 Documentação de Referência

| Arquivo | Descrição |
|---------|-----------|
| **INTEGRACAO_WEBHOOK_N8N.md** | Guia completo de integração n8n |
| **CRIAR_TABELA_TRANSCRICOES.sql** | SQL para criar tabela |
| **CORRIGIR_AUTH.md** | Instruções de autenticação |
| **STATUS_ATUAL.md** | Status geral do projeto |
| **VERIFICAR_DOMINIO.md** | Verificação do Google |

---

## 🎯 Ordem de Execução Recomendada

```
1. Supabase → Executar SQLs (5 min)
2. Supabase → Desabilitar confirmação de email (1 min)
3. Supabase → Copiar Service Role Key (1 min)
4. Vercel → Adicionar variável de ambiente (2 min)
5. Vercel → Aguardar deploy (3 min)
6. Testar → Callback endpoint com curl (1 min)
7. N8N → Atualizar workflow (30 min)
8. Testar → Fluxo completo (10 min)

TOTAL ESTIMADO: ~50 minutos
```

---

## ✅ Status Atual

- ✅ Código atualizado e commitado
- ✅ Push para GitHub realizado
- ⏳ Deploy do Vercel em andamento
- ⏳ Aguardando configurações no Supabase
- ⏳ Aguardando configurações no Vercel
- ⏳ Aguardando atualização do N8N

**Próximo passo:** Executar SQLs no Supabase

---

**Última atualização:** 24/11/2025 - Commit 526982d
