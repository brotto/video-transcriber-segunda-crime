# 🔧 Troubleshooting - Deploy não atualizou

## ✅ Solução Aplicada

Forcei um novo deploy com commit vazio:
```bash
git commit --allow-empty -m "chore: Force Vercel redeploy"
git push
```

Isso vai triggerar um novo build no Vercel.

---

## 🔍 Como Verificar se Funcionou

### 1. Verificar Deployment no Vercel

1. Acesse: https://vercel.com/brotto-5229s-projects/video-transcriber-segunda-crime
2. Vá em: **Deployments**
3. Procure pelo deployment mais recente
4. Aguarde status: **"Ready"** ✓

**Status possíveis:**
- 🟡 **Building** - Está compilando (aguarde)
- 🟢 **Ready** - Deploy concluído com sucesso
- 🔴 **Error** - Erro no build (clique para ver logs)

### 2. Verificar no Site

Após deployment estar **Ready**:

1. Acesse: https://oj-virtual.app
2. **Pressione Ctrl+Shift+R** (ou Cmd+Shift+R no Mac) para limpar cache
3. Verifique a landing page

**Você deve ver:**
- ✅ Lista com checkmarks (em vez de parágrafo)
- ✅ 6 itens na lista
- ✅ Footer com créditos: "Alexandre Brotto Rangel da Silva - Técnico Judiciário - TJPR"

### 3. Se ainda não aparecer

**Limpar cache do navegador:**

**Chrome/Edge:**
1. F12 > Console
2. Clique com botão direito no ícone de reload
3. Selecione: **"Empty Cache and Hard Reload"**

**Firefox:**
1. Ctrl+Shift+Delete
2. Marque apenas "Cache"
3. Clique em "Clear Now"

**Safari:**
1. Cmd+Option+E (limpar cache)
2. Recarregar página

---

## 🐛 Problemas Comuns

### Problema 1: Cache do Vercel

**Sintoma:** Build passa mas mudanças não aparecem

**Solução:**
1. Acesse Vercel Dashboard
2. Settings > General
3. Role até: **Build & Development Settings**
4. Clique em: **Clear Cache**
5. Faça novo commit (ou empty commit)

### Problema 2: Build Error

**Sintoma:** Deployment fica vermelho (Error)

**Solução:**
1. Clique no deployment com erro
2. Veja os logs completos
3. Procure por:
   - TypeScript errors
   - Missing dependencies
   - Import errors

**Como corrigir localmente:**
```bash
# Limpar node_modules
rm -rf node_modules package-lock.json

# Reinstalar dependências
npm install

# Testar build local
npm run build

# Se passar, commitar e push
git add .
git commit -m "fix: Resolver erro de build"
git push
```

### Problema 3: Environment Variables

**Sintoma:** App carrega mas funcionalidades não funcionam

**Solução:**
1. Vercel Dashboard > Settings > Environment Variables
2. Verificar se todas estão configuradas:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_WEBHOOK_URL`
3. Se adicionar/alterar variável, fazer redeploy

### Problema 4: Deploy antigo em cache

**Sintoma:** Vercel mostra "Ready" mas site não atualiza

**Solução:**
1. Verificar se URL está correta: https://oj-virtual.app (não .vercel.app)
2. Aguardar 1-2 minutos (propagação CDN)
3. Limpar cache do navegador (Ctrl+Shift+R)
4. Testar em modo anônimo/incógnito

---

## 📊 Checklist de Verificação

Após fazer push:

- [ ] Vercel detectou o commit? (veja em Deployments)
- [ ] Build iniciou? (status: Building)
- [ ] Build completou? (status: Ready)
- [ ] Aguardou 1-2 minutos?
- [ ] Limpou cache do navegador? (Ctrl+Shift+R)
- [ ] Testou em aba anônima?
- [ ] Landing page mostra bullet list?
- [ ] Footer mostra créditos do desenvolvedor?

---

## 🔗 Links Úteis

- **Vercel Dashboard:** https://vercel.com/brotto-5229s-projects/video-transcriber-segunda-crime
- **Deployments:** https://vercel.com/brotto-5229s-projects/video-transcriber-segunda-crime/deployments
- **Site em Produção:** https://oj-virtual.app
- **GitHub:** https://github.com/brotto/video-transcriber-segunda-crime

---

## 🎯 Comandos Úteis

### Forçar redeploy
```bash
git commit --allow-empty -m "chore: Force redeploy"
git push
```

### Verificar último commit
```bash
git log --oneline -5
```

### Build local (testar antes de push)
```bash
npm run build
```

### Verificar se há erros TypeScript
```bash
npx tsc --noEmit
```

---

## ⏱️ Tempo Esperado

- **Build no Vercel:** 1-3 minutos
- **Propagação CDN:** 1-2 minutos
- **Total:** ~5 minutos máximo

Se após 5 minutos ainda não atualizou, há um problema real.

---

## 🆘 Se Nada Funcionar

1. **Verificar logs do Vercel** (procurar erros)
2. **Testar build local** (npm run build)
3. **Verificar se commit foi para main** (git log)
4. **Verificar se Vercel está conectado ao repo correto**
5. **Verificar se branch está configurado como "main" no Vercel**

**Como verificar branch no Vercel:**
1. Settings > Git
2. Production Branch: deve ser **"main"**

---

**Última atualização:** 24/11/2025

**Commit aplicado:** `bb562e4` - Force Vercel redeploy
