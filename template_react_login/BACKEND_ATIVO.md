# 🎯 CONFIGURAÇÃO ATIVA - BACKEND PRISMA

## ✅ BACKEND ATUAL: API_USERS (Prisma + PostgreSQL)

**Status**: Rodando em http://localhost:3000

**Tipo**: Prisma + Express + PostgreSQL (Supabase)

**Credenciais de teste**:
- Admin: admin@test.com / admin123
- Aluno 1: aluno1@test.com / student123
- Aluno 2: aluno2@test.com / student123

**Como rodar**:
```bash
cd api_users
npm run dev
```

## ⚠️ BACKEND LEGADO: /backend (MongoDB)

**Status**: ❌ DESABILITADO - Não use

**Razão**: Usando Prisma + PostgreSQL como fonte única de verdade

**Se precisar acessar dados antigos**:
- Estão em `backend/` (renomeado para `backend.old`)
- Não modifique, é apenas referência

---

## 📡 API Endpoints (Prisma)

```
Auth:
  POST /api/auth/signup
  POST /api/auth/signin

Plans:
  GET /api/plans
  POST /api/plans (admin)
  PUT /api/plans/:id (admin)
  DELETE /api/plans/:id (admin)

Exercises:
  GET /api/exercises?level=Beginner
  POST /api/exercises (admin)

Enrollments:
  POST /api/enrollments (admin)
  GET /api/enrollments (admin)
  ...
```

## ✨ Próximos passos:

1. ✅ Backend Prisma rodando
2. ⏳ Conectar React frontend
3. ⏳ Testar fluxo completo (admin + aluno)

---

**Gerado**: 23/03/2026  
**Versão**: 1.0 - Prisma Only
