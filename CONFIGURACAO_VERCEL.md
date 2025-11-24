# 🚀 Configuração Após Integração Vercel + Supabase

## ✅ URLs Atualizadas

Após a integração do Vercel com o Supabase, sua URL é:

**URL do Vercel:**
```
https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app/
```

**URLs das Páginas Legais:**
- **Política de Privacidade:** `https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app/#privacy`
- **Termos de Serviço:** `https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app/#terms`

---

## 🔍 O que a Integração Vercel + Supabase Fez

Quando você integrou o Vercel ao Supabase:

1. ✅ **Variáveis de ambiente** foram configuradas automaticamente no Vercel
2. ✅ **Redirect URLs** foram adicionadas automaticamente no Supabase
3. ⚠️ **Site URL** pode ter sido atualizada (precisa verificar)
4. ❌ **Google Cloud Console** NÃO foi atualizado (você precisa fazer isso)

---

## 📋 PASSO A PASSO: O Que Você Precisa Fazer Agora

### **ETAPA 1: Verificar Configurações no Supabase**

1. **Acesse:** https://app.supabase.com/project/mshrfewsfyzrknkqwnxs
2. **Vá em:** Authentication > URL Configuration

#### Verifique se está assim:

**Site URL:**
```
https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app
```

**Redirect URLs (deve ter TODAS estas):**
```
https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app/**
https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app
http://localhost:5173/**
http://localhost:5173
```

3. **Se estiver diferente, corrija e clique em SAVE**

---

### **ETAPA 2: Verificar Tabela Users no Supabase**

A integração Vercel NÃO cria a tabela `users` automaticamente. Você ainda precisa:

1. **Vá em:** SQL Editor no Supabase
2. **Execute os SQLs do arquivo CORRIGIR_OAUTH.md:**
   - Criar tabela `users` (Passo 2)
   - Criar trigger (Passo 3)
   - Migrar usuários existentes (Passo 4)

**Se você já executou esses SQLs, pule esta etapa.**

---

### **ETAPA 3: Atualizar Google Cloud Console**

Agora você precisa atualizar as URLs no Google Console para usar a URL do Vercel:

#### **3.1 Atualizar Credenciais OAuth**

1. **Acesse:** https://console.cloud.google.com
2. **Vá em:** APIs e Serviços > Credenciais
3. **Clique no seu OAuth 2.0 Client ID**
4. **Em "URIs de redirecionamento autorizados", certifique-se que tem:**

```
https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app
https://mshrfewsfyzrknkqwnxs.supabase.co/auth/v1/callback
```

5. **Clique em SALVAR**

#### **3.2 Atualizar Tela de Consentimento OAuth**

1. **Vá em:** APIs e Serviços > Tela de consentimento OAuth
2. **Clique em EDITAR APP**
3. **Atualize os campos:**

```
Nome do app: Video Transcriber - Segunda Crime de Foz
E-mail de suporte: seu-email@exemplo.com

Domínio do app:
├─ Página inicial: https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app
├─ Política de Privacidade: https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app/#privacy
└─ Termos de Serviço: https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app/#terms

Domínios autorizados:
├─ vercel.app
└─ supabase.co
```

4. **Clique em SALVAR E CONTINUAR**
5. **Aguarde 2-3 minutos para as mudanças propagarem**

---

### **ETAPA 4: Configurar Domínio Personalizado (Opcional)**

Se você quiser usar **oj-virtual.app** ao invés da URL longa do Vercel:

#### **4.1 Adicionar Domínio no Vercel**

1. **Acesse:** https://vercel.com/brotto-5229s-projects/video-transcriber-segunda-crime
2. **Vá em:** Settings > Domains
3. **Clique em:** Add Domain
4. **Digite:** `oj-virtual.app`
5. **Configure os DNS** conforme instruído pela Vercel

#### **4.2 Atualizar Supabase para Domínio Personalizado**

Após o domínio estar ativo no Vercel:

1. **Supabase > Authentication > URL Configuration**
2. **Atualize:**

```
Site URL: https://oj-virtual.app

Redirect URLs (adicione):
https://oj-virtual.app/**
https://oj-virtual.app
https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app/**
```

**Mantenha ambas as URLs** (Vercel e domínio personalizado) para garantir funcionamento.

#### **4.3 Atualizar Google Console**

Repita a ETAPA 3, mas usando `https://oj-virtual.app` ao invés da URL do Vercel.

---

## 🧪 TESTAR O LOGIN

Após configurar tudo:

1. **Limpe os cookies do navegador** (Ctrl+Shift+Del)
2. **Acesse:** https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app
3. **Clique em "Google"**
4. **Faça login com sua conta Google**

### Resultado Esperado:

✅ Login bem-sucedido
✅ Redirecionado para o dashboard
✅ Usuário aparece em Table Editor > users no Supabase
✅ Não há erro de localhost

---

## ⚠️ Problemas Comuns

### Problema: Ainda dá erro de localhost

**Causa:** Site URL no Supabase ainda está como `http://localhost:5173`

**Solução:**
1. Supabase > Authentication > URL Configuration
2. Altere Site URL para: `https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app`
3. Salve e aguarde 2-3 minutos

---

### Problema: "redirect_uri_mismatch"

**Causa:** URL não está nos URIs de redirecionamento do Google Console

**Solução:**
1. Verifique se adicionou no Google Console (ETAPA 3.1):
   - `https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app`
   - `https://mshrfewsfyzrknkqwnxs.supabase.co/auth/v1/callback`

---

### Problema: Usuário não aparece na tabela `users`

**Causa:** Trigger não foi criado

**Solução:**
1. Execute os SQLs do CORRIGIR_OAUTH.md (ETAPA 2)
2. Verifique se o trigger está ativo:
```sql
SELECT * FROM pg_trigger WHERE tgname = 'on_auth_user_created';
```

---

## 📊 Checklist Final

- [ ] Site URL no Supabase = URL do Vercel
- [ ] Redirect URLs incluem URL do Vercel
- [ ] Tabela `users` criada no Supabase
- [ ] Trigger de auto-inserção criado
- [ ] Usuários existentes migrados
- [ ] Google Console atualizado com URL do Vercel
- [ ] Política de Privacidade acessível via `/#privacy`
- [ ] Termos de Serviço acessíveis via `/#terms`
- [ ] Login testado e funcionando
- [ ] Usuário aparece na tabela `users` após login

---

## 🎯 URLs de Referência Rápida

| Descrição | URL |
|-----------|-----|
| **App em Produção** | https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app |
| **Política de Privacidade** | https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app/#privacy |
| **Termos de Serviço** | https://video-transcriber-segunda-crime-brotto-5229s-projects.vercel.app/#terms |
| **Supabase Dashboard** | https://app.supabase.com/project/mshrfewsfyzrknkqwnxs |
| **Google Cloud Console** | https://console.cloud.google.com |
| **Vercel Dashboard** | https://vercel.com/brotto-5229s-projects/video-transcriber-segunda-crime |

---

## 💡 Dica: URL Mais Curta

A URL do Vercel é muito longa. Considere:

1. **Configurar domínio personalizado** (oj-virtual.app) - RECOMENDADO
2. **Ou criar um redirect** no Vercel para uma URL mais curta

---

**Siga as ETAPAS 1-4 e o OAuth funcionará perfeitamente!** 🚀
