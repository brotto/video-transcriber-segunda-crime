# Configuração do Google OAuth

Este guia explica como configurar o Google Cloud Console para habilitar o OAuth do Google no aplicativo.

## URLs das Páginas Legais

Após o deploy, você terá acesso às seguintes páginas que são necessárias para a configuração do Google OAuth:

### Desenvolvimento (localhost:5173)
- **Política de Privacidade:** http://localhost:5173 (clicar em "Política de Privacidade" no footer)
- **Termos de Serviço:** http://localhost:5173 (clicar em "Termos de Serviço" no footer)

### Produção (após deploy no Vercel)
- **Política de Privacidade:** https://seu-dominio.com/ (clicar em "Política de Privacidade")
- **Termos de Serviço:** https://seu-dominio.com/ (clicar em "Termos de Serviço")

---

## Passo a Passo para Configurar o Google Cloud Console

### 1. Acessar o Google Cloud Console

1. Acesse: https://console.cloud.google.com/
2. Faça login com sua conta Google
3. Selecione ou crie um projeto

### 2. Configurar a Tela de Consentimento OAuth

1. No menu lateral, vá em: **APIs e Serviços** > **Tela de consentimento OAuth**
2. Selecione o **Tipo de usuário**:
   - **Interno:** Apenas usuários da sua organização (requer Google Workspace)
   - **Externo:** Qualquer usuário com conta Google (recomendado para este caso)
3. Clique em **Criar**

### 3. Preencher Informações do App

#### **1. Informações do app**

- **Nome do app:** `Video Transcriber - Segunda Crime de Foz`
- **E-mail de suporte do usuário:** Seu e-mail
- **Logo do app:** (opcional) Faça upload de um logo 120x120px
- **Domínio do app:**
  - **Página inicial do aplicativo:** `https://seu-dominio.com` (ou URL da Vercel)
  - **Política de Privacidade:** `https://seu-dominio.com/` (navegar para página de privacidade via footer)
  - **Termos de Serviço:** `https://seu-dominio.com/` (navegar para página de termos via footer)
- **Domínios autorizados:**
  - Adicione: `seu-dominio.com`
  - Adicione: `seu-projeto.vercel.app` (se usar Vercel)
  - Adicione: `supabase.co`

#### **2. Escopos**

Clique em **Adicionar ou remover escopos** e selecione:
- `.../auth/userinfo.email` - Ver o endereço de e-mail principal da sua Conta do Google
- `.../auth/userinfo.profile` - Ver as informações pessoais, inclusive as que você disponibilizou publicamente

Esses escopos são suficientes para autenticação básica.

#### **3. Usuários de teste** (apenas se tipo Externo estiver em teste)

Se o app estiver em modo de teste, adicione os e-mails dos usuários que poderão testar:
- Adicione os e-mails dos usuários autorizados
- Clique em **Adicionar usuários**

> **Nota:** Para liberar para todos os usuários, você precisará publicar o app (próxima seção).

### 4. Criar Credenciais OAuth 2.0

1. No menu lateral, vá em: **APIs e Serviços** > **Credenciais**
2. Clique em **+ Criar credenciais** > **ID do cliente OAuth 2.0**
3. Selecione **Tipo de aplicativo:** `Aplicativo da Web`
4. **Nome:** `Video Transcriber Web Client`

#### **URIs de redirecionamento autorizados:**

Adicione as seguintes URLs (clique em **+ Adicionar URI**):

**Para desenvolvimento:**
```
http://localhost:5173
https://mshrfewsfyzrknkqwnxs.supabase.co/auth/v1/callback
```

**Para produção (adicione após o deploy):**
```
https://seu-dominio.com
https://seu-projeto.vercel.app
https://mshrfewsfyzrknkqwnxs.supabase.co/auth/v1/callback
```

5. Clique em **Criar**
6. **Copie o Client ID e Client Secret** exibidos

### 5. Configurar Credenciais no Supabase

1. Acesse: https://app.supabase.com/project/mshrfewsfyzrknkqwnxs
2. Vá em: **Authentication** > **Providers** > **Google**
3. Ative o toggle para habilitar o Google
4. Cole as credenciais:
   - **Client ID (for OAuth):** Cole o Client ID copiado
   - **Client Secret (for OAuth):** Cole o Client Secret copiado
5. Clique em **Save**

### 6. Publicar o App (Opcional, mas Recomendado)

Se você quer que qualquer usuário possa fazer login (não apenas usuários de teste):

1. Volte em: **APIs e Serviços** > **Tela de consentimento OAuth**
2. Clique em **Publicar app**
3. Revise as informações
4. Clique em **Confirmar**

> **Nota:** Se o app solicitar escopos sensíveis, pode ser necessário passar por verificação do Google. Para os escopos básicos (email e profile), geralmente não é necessário.

### 7. Testar o Login

#### Desenvolvimento (localhost:5173):
1. Certifique-se que o servidor dev está rodando: `npm run dev`
2. Acesse: http://localhost:5173
3. Clique em **Google**
4. Faça login com uma conta Google autorizada

#### Produção (após deploy):
1. Acesse sua URL de produção
2. Clique em **Google**
3. Faça login com qualquer conta Google (se o app estiver publicado)

---

## Solução de Problemas

### Erro: "Access blocked: This app's request is invalid"

**Causa:** URIs de redirecionamento não configurados corretamente

**Solução:**
1. Verifique se adicionou: `https://mshrfewsfyzrknkqwnxs.supabase.co/auth/v1/callback`
2. Certifique-se que não há espaços ou caracteres extras
3. Aguarde alguns minutos para as mudanças propagarem

### Erro: "redirect_uri_mismatch"

**Causa:** A URL de redirecionamento não está na lista de URIs autorizados

**Solução:**
1. Copie a URL exata que aparece no erro
2. Adicione-a aos URIs de redirecionamento autorizados no Google Console
3. Aguarde alguns minutos

### Erro: "This app is blocked"

**Causa:** App ainda está em modo de teste e o usuário não está na lista de testadores

**Solução:**
- **Opção 1:** Adicione o e-mail do usuário em "Usuários de teste"
- **Opção 2:** Publique o app

### Aviso: "Google hasn't verified this app"

**Isso é normal para apps não verificados!**

O usuário verá uma tela com:
- "Google hasn't verified this app"
- Link "Advanced" > "Go to [app name] (unsafe)"

Para remover esse aviso:
1. Publique o app
2. Se necessário, solicite verificação do Google (apenas para apps com escopos sensíveis)

Para este app (apenas email e profile), você pode:
- Clicar em **"Advanced"**
- Clicar em **"Go to Video Transcriber (unsafe)"**
- Prosseguir com o login normalmente

---

## URLs Importantes para o Google Console

Quando solicitado, use estas URLs:

| Campo | URL de Desenvolvimento | URL de Produção |
|-------|----------------------|-----------------|
| Página inicial | http://localhost:5173 | https://seu-dominio.com |
| Política de Privacidade | http://localhost:5173 (via footer) | https://seu-dominio.com/ (via footer) |
| Termos de Serviço | http://localhost:5173 (via footer) | https://seu-dominio.com/ (via footer) |
| URI de Redirecionamento | https://mshrfewsfyzrknkqwnxs.supabase.co/auth/v1/callback | (mesmo) |

---

## Checklist de Configuração

- [ ] Projeto criado no Google Cloud Console
- [ ] Tela de consentimento OAuth configurada
- [ ] Informações do app preenchidas (nome, e-mails, domínios)
- [ ] Política de Privacidade linkada
- [ ] Termos de Serviço linkados
- [ ] Escopos configurados (email e profile)
- [ ] Credenciais OAuth 2.0 criadas
- [ ] URIs de redirecionamento configurados
- [ ] Client ID e Secret copiados
- [ ] Credenciais adicionadas no Supabase
- [ ] Google Provider habilitado no Supabase
- [ ] Redirect URLs configuradas no Supabase
- [ ] App publicado (opcional, mas recomendado)
- [ ] Login testado

---

## Links Úteis

- **Google Cloud Console:** https://console.cloud.google.com/
- **Supabase Dashboard:** https://app.supabase.com/project/mshrfewsfyzrknkqwnxs
- **Documentação OAuth Google:** https://developers.google.com/identity/protocols/oauth2
- **Documentação Supabase OAuth:** https://supabase.com/docs/guides/auth/social-login/auth-google

---

## Notas Importantes

1. **As páginas de Política de Privacidade e Termos de Serviço já estão implementadas** no app e acessíveis via links no footer
2. **Não é necessário criar páginas HTML separadas** - use a URL base do app
3. **O aviso de cookies** aparecerá automaticamente para novos visitantes
4. **Após o deploy no Vercel**, lembre-se de atualizar todas as URLs no Google Console
5. **Aguarde alguns minutos** após salvar configurações para que as mudanças propaguem

---

**Última atualização:** ${new Date().toLocaleDateString('pt-BR')}
