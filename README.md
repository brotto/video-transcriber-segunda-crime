# Video Transcriber - Segunda Crime de Foz

Web app para transcrição de vídeos judiciais com integração ao Supabase e processamento via N8N.

## Funcionalidades

- **Autenticação Segura**: Login com email/senha ou OAuth Google via Supabase
- **Upload de Vídeos**: Interface drag-and-drop para upload de vídeos em qualquer formato
- **Processamento Automatizado**: Integração com webhook N8N para transcrição
- **Visualização de Transcrições**: Interface para visualizar e copiar transcrições
- **Gerenciamento de Processos**: Campos para nome da parte/testemunha e número do processo

## Tecnologias Utilizadas

- React 19
- TypeScript
- Vite
- Supabase (Auth + Database)
- Tailwind CSS
- Lucide Icons

## Pré-requisitos

- Node.js (versão 18 ou superior)
- Conta no Supabase
- Webhook N8N configurado

## Instalação Local

1. Clone o repositório:
```bash
git clone https://github.com/brotto/video-transcriber-segunda-crime.git
cd video-transcriber-segunda-crime
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
   - Copie `.env.local` e ajuste as credenciais se necessário
   - As variáveis já estão configuradas por padrão

4. Execute o app:
```bash
npm run dev
```

5. Acesse: http://localhost:5173

## Deploy no Vercel

### Método 1: Via Interface Web

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "New Project"
3. Importe o repositório: `brotto/video-transcriber-segunda-crime`
4. Configure as **Environment Variables**:
   - `VITE_SUPABASE_URL`: https://mshrfewsfyzrknkqwnxs.supabase.co
   - `VITE_SUPABASE_ANON_KEY`: (sua chave do Supabase)
   - `VITE_WEBHOOK_URL`: https://webhook.lexai.cloud/webhook/oj-transcriber
5. Clique em "Deploy"

### Método 2: Via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

Durante o processo, configure as variáveis de ambiente quando solicitado.

### Configurar Domínio Customizado no Vercel

1. Vá em "Settings" > "Domains"
2. Adicione seu domínio
3. Configure os DNS conforme instruído pela Vercel

## Configuração do Supabase

### Tabela de Usuários

A tabela `users` deve ter a seguinte estrutura:

```sql
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  name text,
  avatar_url text,
  created_at timestamp with time zone DEFAULT now()
);
```

### Configuração OAuth Google

1. No Supabase Dashboard, vá em "Authentication" > "Providers"
2. Ative o provider "Google"
3. As credenciais já estão configuradas

## Estrutura do Webhook N8N

O webhook deve receber os seguintes campos via FormData:

- `personName`: Nome da parte/testemunha
- `lawsuitNumber`: Número do processo
- `submittedByEmail`: Email do usuário
- `submittedById`: ID do usuário
- `video`: Arquivo de vídeo

**Resposta esperada do webhook:**

```json
{
  "transcription": "Texto da transcrição aqui..."
}
```

## Build para Produção

```bash
npm run build
```

Os arquivos otimizados estarão em `dist/`.

## Suporte

Para dúvidas ou problemas, abra uma issue no GitHub.

## Licença

Projeto desenvolvido para uso interno da Segunda Crime de Foz.
