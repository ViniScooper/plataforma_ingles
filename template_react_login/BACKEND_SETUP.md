# 📚 Plataforma de Inglês - Setup Guide

## Backend Setup

### Opção 1: MongoDB Atlas (Recomendado - Cloud)
1. Acesse [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crie uma conta gratuita
3. Crie um cluster (Free Tier)
4. Na seção "Security > Network Access", adicione IP `0.0.0.0/0` para permitir qualquer IP
5. Na seção "Databases", clique "Connect" e copie a Connection String
6. No arquivo `.env`, substitua:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/plataforma_ingles
   ```

### Opção 2: MongoDB Local
1. Instale [MongoDB Community Server](https://www.mongodb.com/try/download/community)
2. Inicie o MongoDB no seu sistema
3. Use a conexão padrão:
   ```
   MONGODB_URI=mongodb://localhost:27017/plataforma_ingles
   ```

### Iniciar Backend
```bash
cd backend
npm install
npm start
```

O servidor roda em `http://localhost:5000`

---

## Frontend Setup

### Instalar dependências
```bash
# Na raiz do projeto (template_react_login)
npm install @mui/material @emotion/react @emotion/styled react-router-dom axios
npm run dev
```

O frontend roda em `http://localhost:5173`

---

## Testing APIs

### 1. Registrar novo usuário
```bash
POST http://localhost:5000/auth/register
{
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "password123",
  "role": "admin"
}
```

### 2. Login
```bash
POST http://localhost:5000/auth/login
{
  "email": "admin@test.com",
  "password": "password123"
}
```

### 3. Seed Database (Popular com dados de exemplo)
```bash
cd backend
npm run seed
```

---

## Arquitetura

```
frontend/  (React + Material-UI + React Router)
  └─ Login → Role Detection → Admin Dashboard ou Student Panel

backend/   (Express + MongoDB)
  ├─ /auth          → Register, Login
  ├─ /api/plans     → CRUD Plans (Admin only)
  ├─ /api/users     → CRUD Users (Admin)
  ├─ /api/exercises → Get Exercises, Check Answers
  └─ /api/enrollments → Assign Student to Plan

database/ (MongoDB)
  ├─ users
  ├─ plans
  ├─ exercises
  └─ enrollments
```

---

## Próximos Passos

1. ✅ Backend estrutura criada
2. ❌ MongoDB conectado (aguardando sua config)
3. ⬜ Frontend integrado com backend
4. ⬜ Admin Dashboard UI pronta
5. ⬜ Student Panel UI pronta
6. ⬜ Validação exercícios funcionando
