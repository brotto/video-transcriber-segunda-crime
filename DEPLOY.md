# Guia de Deploy no Vercel

## Passo a Passo para Deploy

### 1. Acessar Vercel

Acesse [vercel.com](https://vercel.com) e faça login com sua conta.

### 2. Importar Projeto do GitHub

1. Clique em **"Add New Project"**
2. Clique em **"Import Git Repository"**
3. Autorize o Vercel a acessar sua conta do GitHub se necessário
4. Procure e selecione o repositório: **`brotto/video-transcriber-segunda-crime`**
5. Clique em **"Import"**

### 3. Configurar o Projeto

Na tela de configuração:

**Framework Preset:** Vite (deve detectar automaticamente)

**Build & Development Settings:**
- Build Command: `npm run build` (já configurado)
- Output Directory: `dist` (já configurado)
- Install Command: `npm install --production=false`

### 4. Configurar Variáveis de Ambiente

Na seção **"Environment Variables"**, adicione as seguintes variáveis:

| Name | Value |
|------|-------|
| `VITE_SUPABASE_URL` | `https://mshrfewsfyzrknkqwnxs.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1zaHJmZXdzZnl6cmtua3F3bnhzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM4NTA3ODQsImV4cCI6MjA3OTQyNjc4NH0.BmJz8bY35k9nedzyQByp4h2fGphbOz3AtWybdvGHQ1A` |
| `VITE_WEBHOOK_URL` | `https://webhook.lexai.cloud/webhook/oj-transcriber` |

**IMPORTANTE:** Marque todas as variáveis para todos os ambientes (Production, Preview, Development).

### 5. Fazer o Deploy

1. Clique em **"Deploy"**
2. Aguarde o build e deploy (geralmente leva 1-2 minutos)
3. Após concluir, você verá a mensagem de sucesso com o link do projeto

### 6. Configurar Domínio Personalizado

1. No dashboard do projeto na Vercel, vá em **"Settings"** > **"Domains"**
2. Clique em **"Add Domain"**
3. Digite seu domínio personalizado (ex: `transcriber.seudominio.com`)
4. Siga as instruções para configurar os registros DNS

**Tipos de registro DNS:**

- **A Record:** Aponte para o IP da Vercel (será fornecido)
- **CNAME:** Aponte para `cname.vercel-dns.com` (recomendado)

### 7. Configurar OAuth do Google no Supabase

**IMPORTANTE:** Após o deploy, você precisa adicionar o domínio da Vercel no Supabase:

1. Acesse o [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Authentication** > **URL Configuration**
3. Em **Redirect URLs**, adicione:
   - `https://seu-projeto.vercel.app/**` (URL da Vercel)
   - `https://seudominio.com/**` (se usar domínio personalizado)
4. Em **Site URL**, defina a URL principal do seu app
5. Salve as alterações

### 8. Testar o Deploy

1. Acesse a URL fornecida pela Vercel
2. Teste o login com email/senha
3. Teste o login com Google
4. Teste o upload de um vídeo pequeno
5. Verifique se o webhook recebe os dados corretamente

## Solução de Problemas Comuns

### Build falhou

- Verifique se o comando de instalação está correto: `npm install --production=false`
- Verifique os logs de build para erros específicos

### Login com Google não funciona

- Confirme que adicionou as URLs corretas no Supabase
- Verifique se o domínio está em **Redirect URLs**
- Limpe o cache do navegador e tente novamente

### Webhook não recebe dados

- Verifique se a variável `VITE_WEBHOOK_URL` está correta
- Teste o webhook diretamente com Postman ou curl
- Verifique os logs do N8N

### Variáveis de ambiente não funcionam

- Certifique-se que todas começam com `VITE_`
- Faça um **redeploy** após adicionar/alterar variáveis
- As variáveis só são aplicadas durante o build, não em runtime

## Comandos Úteis do Vercel CLI

Se preferir usar a CLI da Vercel:

```bash
# Instalar CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# Ver logs
vercel logs

# Ver domínios
vercel domains ls

# Adicionar domínio
vercel domains add seudominio.com
```

## Atualizações Futuras

Para fazer deploy de novas alterações:

1. Faça commit e push para o GitHub:
   ```bash
   git add .
   git commit -m "Sua mensagem"
   git push
   ```

2. A Vercel fará o deploy automático do branch `main`
3. Você pode acompanhar o progresso no dashboard da Vercel

## Links Úteis

- **GitHub Repo:** https://github.com/brotto/video-transcriber-segunda-crime
- **Supabase Dashboard:** https://app.supabase.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentação Vercel:** https://vercel.com/docs

---

**Projeto configurado e pronto para deploy!** 🚀
