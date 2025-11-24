# 🔗 Integração Webhook N8N - Guia Completo

## 📋 Visão Geral do Fluxo

O sistema agora funciona de forma **assíncrona**:

```
1. Frontend → Cria registro no Supabase (status: pending)
2. Frontend → Envia vídeo para webhook n8n (com transcriptionId)
3. Webhook → Retorna resposta imediata (202 Accepted)
4. Frontend → Inicia polling a cada 5s para verificar status
5. N8N → Processa vídeo em background
6. N8N → Quando completa, chama callback endpoint
7. Callback → Atualiza registro no Supabase
8. Frontend → Detecta mudança via polling e exibe resultado
```

---

## 🎯 Endpoints

### 1. Recebimento Inicial (n8n recebe do frontend)

**URL:** `https://webhook.lexai.cloud/webhook/oj-transcriber`

**Método:** `POST`

**Content-Type:** `multipart/form-data`

**Campos do FormData:**

| Campo | Tipo | Descrição | Obrigatório |
|-------|------|-----------|-------------|
| `transcriptionId` | string (UUID) | ID da transcrição no Supabase | ✅ Sim |
| `personName` | string | Nome da parte/testemunha | ✅ Sim |
| `lawsuitNumber` | string | Número do processo | ✅ Sim |
| `submittedByEmail` | string | Email do usuário | ✅ Sim |
| `submittedById` | string (UUID) | ID do usuário | ✅ Sim |
| `video` | File | Arquivo de vídeo | ✅ Sim |

**Resposta Esperada:**

```json
{
  "success": true,
  "message": "Vídeo recebido e processamento iniciado",
  "transcriptionId": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Status Code:** `202 Accepted` (processamento assíncrono)

---

### 2. Callback após Processamento (n8n chama o frontend)

**URL:** `https://oj-virtual.app/api/webhook-callback`

**Método:** `POST`

**Content-Type:** `application/json`

**Body:**

#### Quando processar com sucesso:

```json
{
  "transcriptionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "transcription": "Texto completo da transcrição aqui...",
  "processingStartedAt": "2025-11-24T15:30:00.000Z",
  "processingCompletedAt": "2025-11-24T15:35:00.000Z"
}
```

#### Quando iniciar processamento:

```json
{
  "transcriptionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "processingStartedAt": "2025-11-24T15:30:00.000Z"
}
```

#### Quando ocorrer erro:

```json
{
  "transcriptionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "error",
  "errorMessage": "Descrição do erro que ocorreu",
  "processingStartedAt": "2025-11-24T15:30:00.000Z"
}
```

**Resposta do Callback:**

```json
{
  "success": true,
  "message": "Transcrição atualizada com sucesso",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "updatedAt": "2025-11-24T15:35:01.000Z"
  }
}
```

---

## 🛠️ Configuração no N8N

### Nó 1: Webhook (Trigger)

**Tipo:** Webhook
**Método HTTP:** POST
**Path:** `/webhook/oj-transcriber`
**Resposta:** Imediata (não aguardar processamento)

**Dados recebidos:**
- FormData com vídeo e metadados
- Extrair `transcriptionId` do body

**Resposta imediata:**
```json
{
  "success": true,
  "message": "Vídeo recebido e processamento iniciado",
  "transcriptionId": "{{$json.transcriptionId}}"
}
```

---

### Nó 2: Notificar Início do Processamento (Opcional)

**Tipo:** HTTP Request
**URL:** `https://oj-virtual.app/api/webhook-callback`
**Método:** POST
**Body:**

```json
{
  "transcriptionId": "{{$node['Webhook'].json.transcriptionId}}",
  "status": "processing",
  "processingStartedAt": "{{$now.toISO()}}"
}
```

---

### Nó 3: Processar Vídeo

**Tipo:** Depende da sua ferramenta de transcrição
*Exemplos:* OpenAI Whisper, Google Speech-to-Text, Assembly AI, etc.

**Input:** Arquivo de vídeo
**Output:** Texto da transcrição

---

### Nó 4: Notificar Conclusão

**Tipo:** HTTP Request
**URL:** `https://oj-virtual.app/api/webhook-callback`
**Método:** POST

#### Em caso de sucesso:

```json
{
  "transcriptionId": "{{$node['Webhook'].json.transcriptionId}}",
  "status": "completed",
  "transcription": "{{$node['Processar Vídeo'].json.transcription}}",
  "processingStartedAt": "{{$node['Notificar Início'].json.processingStartedAt}}",
  "processingCompletedAt": "{{$now.toISO()}}"
}
```

#### Em caso de erro:

```json
{
  "transcriptionId": "{{$node['Webhook'].json.transcriptionId}}",
  "status": "error",
  "errorMessage": "{{$node['Processar Vídeo'].json.error.message}}",
  "processingStartedAt": "{{$node['Notificar Início'].json.processingStartedAt}}"
}
```

---

## 🗄️ Estrutura da Tabela no Supabase

```sql
Table: transcriptions

Colunas:
├─ id (UUID, PK) - ID único da transcrição
├─ person_name (TEXT) - Nome da parte/testemunha
├─ lawsuit_number (TEXT) - Número do processo
├─ video_filename (TEXT) - Nome do arquivo de vídeo
├─ video_size (INTEGER) - Tamanho do vídeo em bytes
├─ video_duration (INTEGER) - Duração em segundos (opcional)
├─ status (TEXT) - 'pending' | 'processing' | 'completed' | 'error'
├─ transcription (TEXT) - Texto da transcrição (quando completo)
├─ submitted_by_id (UUID, FK → auth.users) - ID do usuário
├─ submitted_by_email (TEXT) - Email do usuário
├─ error_message (TEXT) - Mensagem de erro (se houver)
├─ processing_started_at (TIMESTAMP) - Quando iniciou
├─ processing_completed_at (TIMESTAMP) - Quando completou
├─ created_at (TIMESTAMP) - Data de criação
└─ updated_at (TIMESTAMP) - Última atualização
```

**Status possíveis:**
- `pending` - Aguardando processamento
- `processing` - Em processamento
- `completed` - Concluído com sucesso
- `error` - Erro no processamento

---

## 🔐 Variáveis de Ambiente

### No Vercel (Frontend)

Adicione no **Vercel Dashboard** → **Settings** → **Environment Variables**:

```bash
# Supabase
VITE_SUPABASE_URL=https://mshrfewsfyzrknkqwnxs.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Supabase Service Role (para API endpoint)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Webhook
VITE_WEBHOOK_URL=https://webhook.lexai.cloud/webhook/oj-transcriber
```

**IMPORTANTE:** `SUPABASE_SERVICE_ROLE_KEY` é necessário para o endpoint de callback atualizar a tabela (bypass RLS).

**Onde encontrar:**
1. Acesse: **Supabase Dashboard** → **Settings** → **API**
2. Copie: **service_role key** (secret)

---

## 📊 Fluxo Detalhado com Exemplos

### 1️⃣ Frontend Envia Vídeo

```typescript
// 1. Criar registro no Supabase
const { data: transcriptionRecord } = await supabase
  .from('transcriptions')
  .insert({
    person_name: 'João da Silva',
    lawsuit_number: '0001234-56.2024.8.16.0001',
    video_filename: 'depoimento.mp4',
    video_size: 52428800, // 50MB
    status: 'pending',
    submitted_by_id: 'user-uuid',
    submitted_by_email: 'usuario@exemplo.com'
  })
  .select()
  .single();

// ID gerado: "550e8400-e29b-41d4-a716-446655440000"

// 2. Enviar para webhook
const formData = new FormData();
formData.append('transcriptionId', transcriptionRecord.id);
formData.append('personName', 'João da Silva');
formData.append('lawsuitNumber', '0001234-56.2024.8.16.0001');
formData.append('submittedByEmail', 'usuario@exemplo.com');
formData.append('submittedById', 'user-uuid');
formData.append('video', videoFile);

const response = await fetch('https://webhook.lexai.cloud/webhook/oj-transcriber', {
  method: 'POST',
  body: formData
});

// 3. Iniciar polling
startPolling(transcriptionRecord.id);
```

---

### 2️⃣ N8N Recebe e Responde

```
1. Webhook recebe FormData
2. Extrai transcriptionId: "550e8400-e29b-41d4-a716-446655440000"
3. Retorna 202 Accepted imediatamente:
   {
     "success": true,
     "message": "Vídeo recebido e processamento iniciado",
     "transcriptionId": "550e8400-e29b-41d4-a716-446655440000"
   }
4. Continua processamento em background
```

---

### 3️⃣ N8N Notifica Início (Opcional)

```http
POST https://oj-virtual.app/api/webhook-callback
Content-Type: application/json

{
  "transcriptionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "processing",
  "processingStartedAt": "2025-11-24T15:30:00.000Z"
}
```

**Resultado no Supabase:**
```sql
UPDATE transcriptions
SET status = 'processing',
    processing_started_at = '2025-11-24T15:30:00.000Z',
    updated_at = NOW()
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

---

### 4️⃣ Frontend Detecta via Polling

```typescript
// A cada 5 segundos
const { data } = await supabase
  .from('transcriptions')
  .select('*')
  .eq('id', '550e8400-e29b-41d4-a716-446655440000')
  .single();

// data.status = 'processing'
// UI exibe: "Processando transcrição..." com spinner
```

---

### 5️⃣ N8N Completa Processamento

```http
POST https://oj-virtual.app/api/webhook-callback
Content-Type: application/json

{
  "transcriptionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "completed",
  "transcription": "Este é o texto completo da transcrição do vídeo. Contém toda a fala transcrita com precisão...",
  "processingStartedAt": "2025-11-24T15:30:00.000Z",
  "processingCompletedAt": "2025-11-24T15:35:00.000Z"
}
```

**Resultado no Supabase:**
```sql
UPDATE transcriptions
SET status = 'completed',
    transcription = 'Este é o texto completo...',
    processing_completed_at = '2025-11-24T15:35:00.000Z',
    updated_at = NOW()
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

---

### 6️⃣ Frontend Detecta Conclusão

```typescript
// Polling detecta mudança
const { data } = await supabase
  .from('transcriptions')
  .select('*')
  .eq('id', '550e8400-e29b-41d4-a716-446655440000')
  .single();

// data.status = 'completed'
// data.transcription = 'Este é o texto completo...'

// Para polling
clearInterval(pollingInterval);

// Exibe resultado para o usuário
setTranscription(data.transcription);
setStatus('completed');
```

---

## 🧪 Testes

### Testar Callback Endpoint

```bash
curl -X POST https://oj-virtual.app/api/webhook-callback \
  -H "Content-Type: application/json" \
  -d '{
    "transcriptionId": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "transcription": "Teste de transcrição",
    "processingCompletedAt": "2025-11-24T15:35:00.000Z"
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Transcrição atualizada com sucesso",
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "status": "completed",
    "updatedAt": "2025-11-24T15:35:01.000Z"
  }
}
```

---

## ⚠️ Tratamento de Erros

### Erro na Transcrição

```http
POST https://oj-virtual.app/api/webhook-callback
Content-Type: application/json

{
  "transcriptionId": "550e8400-e29b-41d4-a716-446655440000",
  "status": "error",
  "errorMessage": "Falha ao processar áudio: arquivo corrompido",
  "processingStartedAt": "2025-11-24T15:30:00.000Z"
}
```

**Frontend detecta e exibe:**
```
❌ Erro no processamento
Falha ao processar áudio: arquivo corrompido
```

---

## 📋 Checklist de Implementação

### No Supabase
- [ ] Executar SQL para criar tabela `transcriptions`
- [ ] Verificar que RLS está habilitado
- [ ] Verificar policies de acesso
- [ ] Copiar `service_role key` para Vercel

### No Vercel
- [ ] Adicionar variável `SUPABASE_SERVICE_ROLE_KEY`
- [ ] Fazer deploy do código atualizado
- [ ] Testar endpoint `/api/webhook-callback` com curl

### No N8N
- [ ] Atualizar webhook para incluir `transcriptionId` no FormData
- [ ] Atualizar resposta imediata (202 Accepted)
- [ ] Adicionar chamada para callback endpoint quando processar
- [ ] Adicionar chamada para callback em caso de erro
- [ ] Testar fluxo completo

### No Frontend
- [ ] Código já atualizado e commitado ✅
- [ ] Polling implementado ✅
- [ ] UI de status implementada ✅
- [ ] Aguardar deploy do Vercel

---

## 🎯 Resumo dos Endpoints

| Endpoint | Direção | Método | Descrição |
|----------|---------|--------|-----------|
| `https://webhook.lexai.cloud/webhook/oj-transcriber` | Frontend → N8N | POST | Envio inicial do vídeo |
| `https://oj-virtual.app/api/webhook-callback` | N8N → Frontend | POST | Notificação de status/conclusão |

---

## 🔍 Debug e Logs

### Verificar logs no Vercel

```bash
vercel logs https://oj-virtual.app/api/webhook-callback --follow
```

### Verificar no Supabase

```sql
-- Ver todas as transcrições
SELECT id, status, person_name, lawsuit_number, created_at
FROM transcriptions
ORDER BY created_at DESC
LIMIT 10;

-- Ver transcrição específica
SELECT *
FROM transcriptions
WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

---

**Última atualização:** 24/11/2025
