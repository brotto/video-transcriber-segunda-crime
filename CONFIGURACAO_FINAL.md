# 🎯 Configuração Final - Domínio oj-virtual.app

## ✅ Situação Atual

- **Domínio no Vercel:** `oj-virtual.app` (configurado e funcionando)
- **URL longa Vercel:** `https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app`
- **Problema:** Supabase tem redirects para a URL longa, não para o domínio personalizado

---

## 🔧 O Que Você Precisa Fazer AGORA

### **1️⃣ ATUALIZAR SUPABASE (URGENTE!)**

**Acesse:** https://app.supabase.com/project/mshrfewsfyzrknkqwnxs

**Vá em:** Authentication > URL Configuration

**Configure EXATAMENTE assim:**

```
Site URL (URL principal):
https://oj-virtual.app

Redirect URLs (adicione TODAS estas linhas):
https://oj-virtual.app/**
https://oj-virtual.app
https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app/**
https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app
http://localhost:5173/**
http://localhost:5173
```

**Por que manter a URL longa também?**
- Para garantir que funcione durante a propagação do DNS
- Ambas as URLs apontam para o mesmo projeto no Vercel
- Não há problema em ter ambas configuradas

**SALVE e aguarde 2-3 minutos!**

---

### **2️⃣ ATUALIZAR GOOGLE CLOUD CONSOLE**

Agora use o domínio personalizado `oj-virtual.app`:

#### **Parte A: Credenciais OAuth**

1. **Acesse:** https://console.cloud.google.com
2. **Vá em:** APIs e Serviços > Credenciais
3. **Clique no seu OAuth 2.0 Client ID**
4. **Em "URIs de redirecionamento autorizados", adicione/mantenha:**

```
https://oj-virtual.app
https://mshrfewsfyzrknkqwnxs.supabase.co/auth/v1/callback
```

**Você pode manter a URL longa do Vercel também por segurança:**
```
https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app
```

5. **SALVAR**

#### **Parte B: Tela de Consentimento OAuth**

1. **Vá em:** APIs e Serviços > Tela de consentimento OAuth
2. **Clique em:** EDITAR APP
3. **Atualize com o domínio personalizado:**

```
Nome do app: Video Transcriber - Segunda Crime de Foz
E-mail de suporte: seu-email@exemplo.com

Domínio do app:
├─ Página inicial: https://oj-virtual.app
├─ Política de Privacidade: https://oj-virtual.app/#privacy
└─ Termos de Serviço: https://oj-virtual.app/#terms

Domínios autorizados:
├─ oj-virtual.app
├─ vercel.app
└─ supabase.co
```

4. **SALVAR E CONTINUAR**
5. **Aguarde 2-3 minutos**

---

### **3️⃣ VERIFICAR VERCEL (Opcional mas Recomendado)**

1. **Acesse:** https://vercel.com (seu dashboard)
2. **Vá no projeto:** video-transcriber-segunda-crime
3. **Vá em:** Settings > Domains
4. **Verifique:**
   - ✅ `oj-virtual.app` deve estar como **Primary** (principal)
   - ✅ Status deve estar **Active** (ativo)

**Se não estiver como Primary:**
1. Clique nos 3 pontinhos ao lado de `oj-virtual.app`
2. Clique em **"Set as Primary"**
3. Isso fará com que seja o domínio padrão

---

## 🧪 TESTAR TUDO

Após configurar:

1. **Limpe cookies do navegador** (Ctrl+Shift+Del)
2. **Acesse:** https://oj-virtual.app
3. **Verifique:**
   - ✅ O site abre
   - ✅ Páginas legais funcionam:
     - https://oj-virtual.app/#privacy
     - https://oj-virtual.app/#terms
4. **Clique em "Google"**
5. **Faça login**

### Resultado Esperado:

- ✅ Login com Google funciona
- ✅ Redireciona de volta para `https://oj-virtual.app` (não para URL longa!)
- ✅ Dashboard abre corretamente
- ✅ Sem erro de localhost
- ✅ Usuário aparece em Table Editor > users no Supabase

---

## 🎯 URLs Finais para Usar

| Descrição | URL |
|-----------|-----|
| **Seu Site (use esta!)** | https://oj-virtual.app |
| **Política de Privacidade** | https://oj-virtual.app/#privacy |
| **Termos de Serviço** | https://oj-virtual.app/#terms |
| **URL Alternativa Vercel** | https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app |

---

## 💡 Entendendo o Setup

### Como Funciona o Domínio Personalizado:

```
Usuário acessa: https://oj-virtual.app
       ↓
Vercel recebe a requisição
       ↓
Vercel serve o app (mesmo que pela URL longa)
       ↓
URL permanece como oj-virtual.app no navegador
```

### Como Funciona o OAuth:

```
1. Usuário clica "Google" em: https://oj-virtual.app
       ↓
2. Redireciona para Google para login
       ↓
3. Google redireciona para: mshrfewsfyzrknkqwnxs.supabase.co/auth/v1/callback
       ↓
4. Supabase processa autenticação
       ↓
5. Supabase redireciona de volta para: https://oj-virtual.app (Site URL)
       ↓
6. Usuário está logado no dashboard
```

---

## ⚠️ IMPORTANTE: Ambas as URLs Funcionam

Tanto `oj-virtual.app` quanto a URL longa do Vercel apontam para o mesmo app.

**É SEGURO e RECOMENDADO manter ambas configuradas no Supabase:**
- Site URL = `oj-virtual.app` (principal)
- Redirect URLs = ambas as URLs

**Por quê?**
- Durante propagação DNS, uma pode funcionar enquanto a outra não
- Garante que sempre funcionará
- Não há conflito entre elas

---

## 🔍 Troubleshooting

### Problema: Ainda redireciona para URL longa do Vercel

**Solução:**
1. Verifique se `Site URL` no Supabase está como `https://oj-virtual.app`
2. Aguarde 2-3 minutos para propagar
3. Limpe cookies do navegador
4. Tente novamente

---

### Problema: "redirect_uri_mismatch" no Google

**Solução:**
1. Adicione `https://oj-virtual.app` nos URIs de redirecionamento do Google
2. Mantenha também `https://mshrfewsfyzrknkqwnxs.supabase.co/auth/v1/callback`
3. Aguarde 2-3 minutos

---

### Problema: Páginas legais não abrem (404)

**Solução:**
1. Teste diretamente:
   - https://oj-virtual.app/#privacy
   - https://oj-virtual.app/#terms
2. Se não funcionar, verifique se o deploy no Vercel está completo
3. Vá em Vercel > Deployments e veja se o último deploy está "Ready"

---

## ✅ Checklist Final

- [ ] Site URL no Supabase = `https://oj-virtual.app`
- [ ] Redirect URLs incluem `oj-virtual.app/**`
- [ ] Google Console atualizado com `oj-virtual.app`
- [ ] Política de Privacidade: `https://oj-virtual.app/#privacy`
- [ ] Termos de Serviço: `https://oj-virtual.app/#terms`
- [ ] Domínio está ativo no Vercel
- [ ] Domínio é Primary no Vercel (opcional)
- [ ] Tabela `users` existe no Supabase
- [ ] Trigger de auto-inserção está ativo
- [ ] Login testado e funcionando
- [ ] URL permanece como `oj-virtual.app` após login

---

## 📊 Resumo de URLs Corretas

**Para Supabase:**
```
Site URL: https://oj-virtual.app
Redirect: https://oj-virtual.app/**
Redirect: https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app/**
```

**Para Google Console:**
```
Página inicial: https://oj-virtual.app
Privacidade: https://oj-virtual.app/#privacy
Termos: https://oj-virtual.app/#terms
Redirect URI: https://mshrfewsfyzrknkqwnxs.supabase.co/auth/v1/callback
```

**Para compartilhar com usuários:**
```
https://oj-virtual.app
```

---

**Faça as atualizações nos passos 1 e 2, e seu OAuth funcionará perfeitamente com o domínio personalizado!** 🚀

A URL longa do Vercel continuará funcionando também, mas o Supabase redirecionará preferencialmente para `oj-virtual.app`.
