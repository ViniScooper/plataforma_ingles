# 🚀 Guia Rápido - Plataforma de Inglês

## ⚡ Setup em 5 Passos

### 1️⃣ Configurar MongoDB Atlas (Recomendado)
1. Acesse: https://www.mongodb.com/cloud/atlas
2. Crie uma conta gratuita
3. Crie um **Cluster** (escolha "Shared" - grátis)
4. Aguarde ~5-10 minutos para criar o cluster
5. Na seção **"Database Access"**:
   - Crie um usuário (ex: username=`admin`, password=`sua_senha`)
6. Na seção **"Network Access"**:
   - Adicione IP `0.0.0.0/0` (ou seu IP específico)
7. Clique **"Connect"** e copie a Connection String
8. Cole em `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://admin:sua_senha@cluster0.xxxxx.mongodb.net/plataforma_ingles?retryWrites=true&w=majority
   ```

### 2️⃣ Rodar Backend
```bash
cd backend
npm start
# Aguarde: "✅ MongoDB Connected" + "🚀 Server running on http://localhost:5000"
```

### 3️⃣ Seed Database (Popular com dados de teste)
```bash
# Em outro terminal
cd backend
npm run seed
```

### 4️⃣ Rodar Frontend
```bash
# Na raiz do projeto
npm run dev
# O navegador abrirá: http://localhost:5173
```

### 5️⃣ Testar Login
- **Email**: `admin@test.com`
- **Senha**: `password123`
- **Resultado**: Dashboard Admin com abas para Planos, Alunos e Inscrições

---

## 📋 O que você pode fazer agora

### 👨‍💼 Admin
- ✅ Criar Planos (nome, nível, preço)
- ✅ Criar Alunos
- ✅ Atribuir Alunos a Planos
- ✅ Visualizar todas as inscrições

### 👨‍🎓 Aluno
- ✅ Criar Conta (Sign Up)
- ✅ Ver Atividades por Nível (Iniciante/Intermediário)
- ✅ Resolver exercícios gap-fill
- ✅ Obter feedback imediato (correto/errado)

---

## 🆘 Troubleshooting

### Erro: "MongoDB Connection Error"
- Verifique se MongoDB Atlas está com o cluster iniciado
- Copie a connection string corretamente
- Coloque em `backend/.env` na variável `MONGODB_URI`

### Erro: "Cannot find module"
- Rode `npm install` na pasta `backend/`
- Rode `npm install` na raiz do projeto

### Frontend não conecta ao backend
- Verifique se backend está rodando em `http://localhost:5000`
- Verifique o log do terminal do backend

---

## 📚 API Endpoints

```
POST   /auth/register        - Registrar novo usuário
POST   /auth/login           - Fazer login

GET    /api/plans            - Listar planos
POST   /api/plans            - Criar plano (Admin)
DELETE /api/plans/:id        - Deletar plano (Admin)

GET    /api/users            - Listar usuários (Admin)
POST   /api/users            - Criar usuário (Admin)

GET    /api/exercises        - Listar exercícios por nível
POST   /api/exercises/check  - Validar respostas

GET    /api/enrollments      - Ver inscrições
POST   /api/enrollments      - Inscrever aluno (Admin)
```

---

## 🎯 Próximas Fases (v2)

- [ ] Histórico de respostas dos alunos
- [ ] Dashboard analytics para admin
- [ ] Sistema de pontos/ranking
- [ ] Certificado de conclusão
- [ ] Lições em vídeo
- [ ] Integração de pagamento

---

**Última atualização**: 23/03/2026
**Stack**: React 19 + Material-UI + Node.js + Express + MongoDB
