# 🔗 Integração N8N - Fluxo Simplificado (Sem Banco de Dados)

## 🎯 Visão Geral

Sistema **stateless** (sem armazenamento):
- Frontend envia vídeo com `sessionId` único
- N8N processa e envia email para usuário
- N8N notifica frontend via HTTP request
- Frontend exibe resultado imediatamente
- **Nada é salvo no banco de dados**

---

## 📊 Fluxo Completo

```
1. Usuário → Preenche formulário e anexa vídeo
2. Frontend → Gera sessionId único (timestamp-random)
3. Frontend → Envia para webhook n8n
4. Frontend → Entra em modo "aguardando" com polling
5. N8N → Recebe vídeo e retorna 200 OK
6. N8N → Processa vídeo (extração de áudio + transcrição)
7. N8N → Envia email para usuário com transcrição
8. N8N → Notifica frontend via POST /api/transcription-status
9. Frontend → Detecta via polling e exibe resultado
10. Usuário → Vê transcrição na tela e copia se desejar
11. Sistema → Esquece tudo (sessão expira em 30 min)
```

---

## 🔌 Endpoints

### 1. Webhook N8N (Recebe do Frontend)

**URL:** `https://webhook.lexai.cloud/webhook/oj-transcriber`
**Método:** `POST`
**Content-Type:** `multipart/form-data`

**Campos recebidos:**

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `sessionId` | string | ID único da sessão (ex: "1732467890123-abc123xyz") |
| `personName` | string | Nome da parte/testemunha |
| `lawsuitNumber` | string | Número do processo |
| `submittedByEmail` | string | Email do usuário (para enviar transcrição) |
| `submittedById` | string | ID do usuário (UUID) |
| `video` | File | Arquivo de vídeo |

**Exemplo de sessionId:**
```
1732467890123-k3j2h4g5f6
```

**Resposta do webhook:**
```json
{
  "success": true,
  "message": "Vídeo recebido com sucesso"
}
```

**Status Code:** `200 OK`

---

### 2. Notificar Frontend (N8N chama após processar)

**URL:** `https://oj-virtual.app/api/transcription-status`
**Método:** `POST`
**Content-Type:** `application/json`

#### Quando transcrição estiver completa:

```json
{
  "sessionId": "1732467890123-k3j2h4g5f6",
  "status": "completed",
  "transcription": "Texto completo da transcrição aqui..."
}
```

#### Se ocorrer erro:

```json
{
  "sessionId": "1732467890123-k3j2h4g5f6",
  "status": "error",
  "errorMessage": "Descrição do erro"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Status atualizado com sucesso"
}
```

---

## 🛠️ Configuração do Workflow N8N

### Nó 1: Webhook (Trigger)

**Tipo:** Webhook
**Método:** POST
**Path:** `/webhook/oj-transcriber`
**Resposta:** Imediata

**Dados capturados:**
- FormData completo
- Extrair `sessionId` para usar nos próximos nós

**Resposta:**
```json
{
  "success": true,
  "message": "Vídeo recebido com sucesso"
}
```

---

### Nó 2: Processar Vídeo

**Tipo:** Depende da ferramenta (Whisper, AssemblyAI, etc.)

**Entrada:** Arquivo de vídeo
**Saída:** Texto da transcrição

**Exemplo com OpenAI Whisper:**
- Model: whisper-1
- File: `{{$binary.video}}`
- Language: pt (português)

---

### Nó 3: Enviar Email para Usuário

**Tipo:** Send Email (Gmail, SMTP, etc.)

**Para:** `{{$node['Webhook'].json.body.submittedByEmail}}`
**Assunto:** Transcrição - Processo `{{$node['Webhook'].json.body.lawsuitNumber}}`

**Corpo do email:**
```
Olá,

A transcrição do vídeo referente ao processo {{lawsuitNumber}} foi concluída.

Envolvido: {{personName}}
Processo: {{lawsuitNumber}}

=== TRANSCRIÇÃO ===

{{transcription}}

=================

Atenciosamente,
Sistema de Transcrições - Segunda Crime de Foz
```

---

### Nó 4: Notificar Frontend (Sucesso)

**Tipo:** HTTP Request
**URL:** `https://oj-virtual.app/api/transcription-status`
**Método:** POST
**Content-Type:** application/json

**Body:**
```json
{
  "sessionId": "{{$node['Webhook'].json.body.sessionId}}",
  "status": "completed",
  "transcription": "{{$node['Processar Vídeo'].json.transcription}}"
}
```

---

### Nó 5: Notificar Frontend (Erro) - On Error

**Tipo:** HTTP Request
**URL:** `https://oj-virtual.app/api/transcription-status`
**Método:** POST
**Content-Type:** application/json

**Body:**
```json
{
  "sessionId": "{{$node['Webhook'].json.body.sessionId}}",
  "status": "error",
  "errorMessage": "{{$json.error.message}}"
}
```

---

## 🔄 Como o Frontend Funciona

### Envio do Vídeo

```typescript
// 1. Gerar sessionId único
const sessionId = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;

// 2. Preparar FormData
const formData = new FormData();
formData.append('sessionId', sessionId);
formData.append('personName', 'João da Silva');
formData.append('lawsuitNumber', '0001234-56.2024.8.16.0001');
formData.append('submittedByEmail', 'usuario@exemplo.com');
formData.append('submittedById', 'user-uuid');
formData.append('video', videoFile);

// 3. Enviar para n8n
const response = await fetch('https://webhook.lexai.cloud/webhook/oj-transcriber', {
  method: 'POST',
  body: formData
});

// 4. Iniciar polling
startPolling(sessionId);
```

### Polling (Verificação de Status)

```typescript
// A cada 3 segundos
setInterval(async () => {
  const response = await fetch(`/api/transcription-status?sessionId=${sessionId}`);
  const data = await response.json();

  if (data.status === 'completed') {
    // Exibir transcrição
    setTranscription(data.transcription);
    stopPolling();
  } else if (data.status === 'error') {
    // Exibir erro
    setError(data.errorMessage);
    stopPolling();
  }
}, 3000);
```

---

## 💾 Armazenamento Temporário

### Sessões em Memória (Expira em 30 minutos)

O endpoint `/api/transcription-status` mantém sessões em memória:

```typescript
interface Session {
  sessionId: string;
  status: 'waiting' | 'completed' | 'error';
  transcription?: string;
  errorMessage?: string;
  createdAt: number;
  expiresAt: number; // 30 minutos
}
```

**IMPORTANTE:**
- ✅ Sessões são criadas quando n8n notifica
- ✅ Expiram automaticamente após 30 minutos
- ✅ Limpeza automática a cada 5 minutos
- ❌ **Não são persistidas** no banco de dados
- ❌ **Perdidas ao reiniciar** o servidor (comportamento desejado)

---

## 🧪 Testes

### Testar Notificação do N8N

```bash
curl -X POST https://oj-virtual.app/api/transcription-status \
  -H "Content-Type: application/json" \
  -d '{
    "sessionId": "test-123-abc",
    "status": "completed",
    "transcription": "Esta é uma transcrição de teste."
  }'
```

**Resposta esperada:**
```json
{
  "success": true,
  "message": "Status atualizado com sucesso"
}
```

### Testar Polling do Frontend

```bash
curl "https://oj-virtual.app/api/transcription-status?sessionId=test-123-abc"
```

**Resposta esperada:**
```json
{
  "success": true,
  "status": "completed",
  "transcription": "Esta é uma transcrição de teste.",
  "expiresIn": 1798
}
```

---

## 📋 Checklist de Implementação

### No N8N

- [ ] Nó 1: Webhook configurado para receber FormData
- [ ] Nó 1: Extrair `sessionId` do body
- [ ] Nó 1: Retornar resposta imediata (200 OK)
- [ ] Nó 2: Processar vídeo (Whisper, AssemblyAI, etc.)
- [ ] Nó 3: Enviar email com transcrição para `submittedByEmail`
- [ ] Nó 4: Notificar frontend (POST /api/transcription-status) em caso de sucesso
- [ ] Nó 5: Notificar frontend (POST /api/transcription-status) em caso de erro

### No Frontend

- [ ] Dashboard gera `sessionId` único ✅
- [ ] Envia `sessionId` no FormData ✅
- [ ] Inicia polling após envio ✅
- [ ] Exibe tela de aguardando com animações ✅
- [ ] Detecta quando transcrição está pronta ✅
- [ ] Exibe transcrição na tela ✅
- [ ] Botão copiar funcional ✅
- [ ] Botão "Nova Transcrição" reseta tudo ✅

---

## ⚠️ Importante

### Privacidade

✅ **Transcrições NÃO são armazenadas**
- Apenas mantidas em memória por 30 minutos
- Enviadas por email para o usuário
- Esquecidas após expiração da sessão

### Sessões Temporárias

✅ **Expiração automática em 30 minutos**
- Usuário deve permanecer na página durante processamento
- Se fechar a página, perde acesso à transcrição
- Pode acessar via email recebido

### Email

✅ **Cópia enviada sempre**
- Mesmo que usuário feche a página
- Mesmo se sessão expirar
- É o registro permanente da transcrição

---

## 🔍 Debug

### Ver logs no Vercel

```bash
vercel logs https://oj-virtual.app/api/transcription-status --follow
```

### Ver logs no N8N

- Verificar execuções do workflow
- Verificar se notificação para frontend foi enviada
- Verificar resposta do endpoint `/api/transcription-status`

### Console do navegador

```javascript
// No DevTools > Console
// Ver logs de polling
// [Polling] Iniciando para sessionId: ...
// [Polling] Status: ...
// [Polling] Transcrição recebida, parando polling
```

---

## 📄 Exemplo Completo

### 1. Usuário envia vídeo

```
FormData:
├─ sessionId: "1732467890123-k3j2h4g5f6"
├─ personName: "João da Silva"
├─ lawsuitNumber: "0001234-56.2024.8.16.0001"
├─ submittedByEmail: "usuario@exemplo.com"
├─ submittedById: "uuid-123"
└─ video: depoimento.mp4 (50MB)
```

### 2. Frontend aguarda

```
Tela exibe:
🔄 Processando Transcrição...
• Vídeo recebido pelo servidor
• Extraindo áudio do vídeo
• Transcrevendo fala em texto
📧 Uma cópia será enviada para: usuario@exemplo.com

Não feche esta página.
```

### 3. N8N processa (5-10 minutos)

```
1. Recebe vídeo
2. Extrai áudio
3. Whisper transcreve
4. Envia email para usuario@exemplo.com
5. POST /api/transcription-status com resultado
```

### 4. Frontend detecta via polling

```
GET /api/transcription-status?sessionId=1732467890123-k3j2h4g5f6

Resposta:
{
  "success": true,
  "status": "completed",
  "transcription": "Depoimento completo transcrito..."
}
```

### 5. Usuário vê resultado

```
✓ Transcrição Concluída

📧 Uma cópia foi enviada para: usuario@exemplo.com

[Transcrição exibida na tela]

[Botão: Copiar Transcrição]
[Botão: Nova Transcrição]
```

---

## 🎯 Resumo

| Aspecto | Solução |
|---------|---------|
| **Armazenamento** | ❌ Sem banco de dados |
| **Sessões** | Memória (30 min) |
| **Comunicação** | HTTP + Polling (3s) |
| **Email** | ✅ Sempre enviado |
| **Privacidade** | ✅ Dados não persistidos |
| **Frontend** | Aguarda na tela |
| **N8N** | Notifica via POST |

---

**Última atualização:** 24/11/2025
