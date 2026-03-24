# 🆘 Troubleshooting & FAQ

Respostas rápidas para problemas comuns.

---

## ❌ MongoDB Connection Error

**Erro:**
```
❌ MongoDB Connection Error: connect ECONNREFUSED ::1:27017
```

**Causa:**
- MongoDB não está rodando localmente, OU
- Você está usando MongoDB Atlas mas não configurou a URI

**Solução:**

### Opção A: Usar MongoDB Atlas (Recomendado)
1. Acesse https://www.mongodb.com/cloud/atlas
2. Crie uma conta gratuita
3. Crie um cluster (Free M0 - grátis)
4. Aguarde ~10 minutos
5. Clique em "Connect"
6. Copie a connection string (MongoDB+srv)
7. Edite `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://seu_usuario:sua_senha@cluster0.xxxxx.mongodb.net/plataforma_ingles?retryWrites=true&w=majority
   ```
8. Reinicie o backend: `npm start`

### Opção B: Instalar MongoDB Local
1. Download: https://www.mongodb.com/try/download/community
2. Instale
3. Inicie o MongoDB:
   - Windows: `mongod` (em PowerShell como admin)
4. Verifique `backend/.env`:
   ```
   MONGODB_URI=mongodb://localhost:27017/plataforma_ingles
   ```
5. Reinicie o backend

---

## ❌ "Cannot find module" Erro

**Erro:**
```
Error: Cannot find module 'express'
Error: Cannot find module '@mui/material'
```

**Solução:**
- Se em `backend/`: `cd backend && npm install`
- Se em root: `npm install`
- Depois reinicie o projeto

---

## ❌ Port já em uso

**Erro:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solução opção 1: Fechar programa usando porta**
- Procure outro programa usando 5000
- Feche-o
- Reinicie backend

**Solução opção 2: Usar porta diferente**
- Edite `backend/.env`:
  ```
  PORT=5001
  ```
- Reinicie backend
- Frontend ainda usa 5000? Não, axios conecta em localhost:5000 por default
- Ou edite `src/utils/apiClient.js`:
  ```javascript
  const API_BASE_URL = 'http://localhost:5001';
  ```

---

## ❌ Frontend não conecta ao Backend

**Erro no console do navegador:**
```
AxiosError: Network Error
Failed to fetch from http://localhost:5000
```

**Causas:**
1. Backend não está rodando
2. Nome da porta incorreta
3. Problema de CORS

**Solução:**
1. Verifique se backend está rodando:
   - Terminal deve mostrar: `🚀 Server running on http://localhost:5000`
2. Verifique se port é 5000 ou outra em `backend/.env`
3. Verifique CORS em `backend/server.js`:
   ```javascript
   app.use(cors()); // Deve estar lá
   ```

---

## ❌ Login falha

**Erro:**
```
Invalid email or password
```

**Causas:**
1. Dados de teste não foram seeded
2. Email/senha incorretos
3. Banco de dados vazio

**Solução:**
1. Rode seed:
   ```bash
   cd backend
   npm run seed
   ```
2. Tente login novamente:
   - Email: `admin@test.com`
   - Password: `password123`

---

## ❌ "You are not enrolled in any plan"

**Situação:**
- Aluno fez login
- Mas vê mensagem "not enrolled in any plan"

**Causa:**
- Admin ainda não atribuiu o aluno a um plano

**Solução:**
1. Admin faz login
2. Vai para aba "Enrollments"
3. Clica "+ Assign Student to Plan"
4. Seleciona o aluno
5. Seleciona um plano
6. Clica "Assign"
7. Aluno atualiza página (F5)
8. Agora vê os exercícios

---

## ❌ Exercício não carrega

**Sintoma:**
- Página de exercício fica em branco ou com loading infinito

**Causas:**
1. Backend não está rodando
2. Aluno não está inscrito em plano
3. Erro na conexão

**Solução:**
1. Verifique se backend está rodando
2. Verifique se aluno está inscrito em um plano
3. Abra console (F12) e procure por erro
4. Se houver erro de conexão, reinicie backend

---

## ❌ Material-UI icons não aparecem

**Erro:**
```
Cannot find module '@mui/icons-material/Delete'
```

**Solução:**
```bash
npm install @mui/icons-material
```

---

## ❌ Vite dev server não inicia

**Erro:**
```
Error scanning dependencies: Not found: /Users/...
```

**Solução:**
```bash
npm install
npm run dev
```

---

## ❓ Como criar admin?

**Problema:**
- Quero criar outro usuário como admin (não apenas student)

**Solução (v1):**
1. Crie usuário via SignUp (role=student automático)
2. Edite MongoDB diretamente:
   ```javascript
   db.users.updateOne({email: "novo@email.com"}, {$set: {role: "admin"}})
   ```
3. Usuário faz login novamente

**Solução futura (v2):**
- Admin terá opção para criar admin

---

## ❓ Como adicionar mais exercícios?

**Opção 1: Manualmente via Admin API**
```bash
# Via Postman/Thunder Client
POST http://localhost:5000/api/exercises
Authorization: Bearer <token>

{
  "title": "Question Tag",
  "level": "Intermediate",
  "sentence": "She speaks English, doesn't she? No, she ___",
  "gaps": [{
    "index": 0,
    "correctAnswer": "doesn't",
    "options": ["does", "doesn't", "do"]
  }],
  "plan_id": "65f7abbbb..."
}
```

**Opção 2: Editar seed.js**
1. Abra `backend/seed.js`
2. Adicione novo objeto ao array `beginnerExercises` ou `intermediateExercises`
3. Rode `npm run seed`

---

## ❓ Como editar um exercício?

**No MVP v1:**
- Não há edição de exercícios via UI
- Delete o antigo e crie um novo

**Solução alternativa:**
- Edit direto em MongoDB ou
- Aguarde v2 com CRUD completo

---

## ❓ Como salvar progresso do aluno?

**Status atual (v1):**
- Progresso NÃO é salvo
- Cada vez que aluno página, recomeça

**Próximo em v2:**
- Criar collection `Attempts`
- Salvar cada resposta
- Mostrar histórico
- Calcular score

---

## ❓ Qual navegador usar?

**Testado em:**
- ✅ Chrome (recomendado)
- ✅ Firefox
- ✅ Edge
- ✅ Safari

**Não testado em:**
- ⚠️ IE (não suportado)

---

## ❓ Mobile funciona?

**Status:**
- Frontend é responsivo (Material-UI)
- Mas não foi otimizado para mobile
- Pode ter problemas em telas pequenas

**v2 inclui:**
- Mobile optimization
- Touch gestures
- App nativo (React Native)

---

## ❓ Posso usar em produção?

**MVP (v1):**
- ⚠️ NÃO recomendado para produção
- Faltam features de segurança
- Sem analytics
- Sem backup automático

**Recomendação:**
- Use para testar/aprender
- Aguarde v2 com mais recursos
- Ou customize conforme necessário

---

## 🚀 Deploy Rápido

Se quiser colocar online:

### Backend
1. Hospede em: Render.com, Railway.app ou Heroku
2. Configure variáveis de ambiente
3. MongoDB Atlas já está em cloud

### Frontend
1. Build: `npm run build`
2. Hospede em: Vercel.com ou Netlify.com
3. Aponte API_BASE_URL para backend online

---

## 💬 Ainda com dúvida?

1. Leia START_HERE.md
2. Leia GUIA_DE_USO_PT.md
3. Verifique QUICK_START.md
4. Verifique logs no console (F12 no navegador, terminal no backend)

---

**Última atualização: 23/03/2026**
