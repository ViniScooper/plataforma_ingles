# ✅ PRÉ-LAUNCH CHECKLIST

Antes de usar a plataforma, verifique todos os items:

---

## 📋 Pré-requisitos

- [ ] Node.js instalado (versão 18+)
- [ ] npm ou yarn funcionando
- [ ] Conta MongoDB Atlas criada (gratuita)
- [ ] Acesso ao terminal/PowerShell

---

## 🔧 Setup Verificado

- [ ] `backend/` existe com package.json
- [ ] `backend/routes/` tem 5 arquivos (auth, plans, users, exercises, enrollments)
- [ ] `backend/models/` tem 4 arquivos (User, Plan, Exercise, Enrollment)
- [ ] `backend/.env` existe com MONGODB_URI, JWT_SECRET
- [ ] `src/pages/` tem 3 arquivos (LoginPage, AdminPage, StudentPage)
- [ ] `src/context/AuthContext.jsx` existe
- [ ] `src/components/PrivateRoute.jsx` existe
- [ ] `src/utils/apiClient.js` existe
- [ ] `package.json` raiz tem Material-UI, React Router, Axios
- [ ] `backend/package.json` tem Express, Mongoose, JWT, bcryptjs

---

## 🗄️ Database

- [ ] MongoDB Atlas account criada (https://www.mongodb.com/cloud/atlas)
- [ ] Cluster criado e esperando ~10 minutos
- [ ] Connection String copiada
- [ ] `backend/.env` atualizado com Connection String correcta
- [ ] Network Access permite 0.0.0.0/0 (ou seu IP)

---

## 🚀 Backend

- [ ] Terminal navegou para `backend/`
- [ ] `npm install` rodou com sucesso (sem erros)
- [ ] `npm start` roda sem erros
- [ ] Terminal mostra "✅ MongoDB Connected"
- [ ] Terminal mostra "🚀 Server running on http://localhost:5000"
- [ ] `npm run seed` rodou com sucesso
- [ ] Terminal mostra "✅ Database seeded successfully!"

---

## 🎨 Frontend

- [ ] Terminal na raiz (`template_react_login/`)
- [ ] `npm install` rodou com sucesso
- [ ] `npm run dev` iniciou Vite
- [ ] Terminal mostra "Local: http://localhost:5173/"
- [ ] Navegador abrir automaticamente em localhost:5173
- [ ] Página é renderizada (vê login ou página branca é OK)

---

## 🔐 Autenticação Testada

- [ ] Acessa http://localhost:5173 no navegador
- [ ] Vê página de Login
- [ ] Email field existe
- [ ] Password field existe
- [ ] Botão "Login" existe
- [ ] Consegue digitar email e senha
- [ ] Clica Login
- [ ] Recebe mensagem "Invalid email or password" (esperado - dados não seeded ainda)
- [ ] OU consegue fazer login com admin@test.com / password123

---

## 👨‍💼 Admin Testado

- [ ] Fez login como admin (admin@test.com)
- [ ] Redirecionado para `/admin`
- [ ] Vê "Admin Dashboard" no topo
- [ ] Vê 3 abas: "Plans", "Students", "Enrollments"
- [ ] Aba Plans: vê tabela com planos existentes
- [ ] Botão "+ New Plan" funciona
- [ ] Aba Students: vê tabela com alunos
- [ ] Botão "+ New Student" funciona
- [ ] Aba Enrollments: vê tabela de inscrições
- [ ] Botão "+ Assign Student to Plan" funciona
- [ ] Consegue fazer logout

---

## 👨‍🎓 Aluno Testado

- [ ] Vai para http://localhost:5173
- [ ] Clica em "Sign Up"
- [ ] Preenche: Name, Email, Password, Confirm Password
- [ ] Clica "Sign Up"
- [ ] Conta criada com sucesso
- [ ] Redirecionado para `/student`
- [ ] Vê "Learning Center" no topo
- [ ] Vê 3 botões de nível: Beginner, Intermediate, Advanced (ou desativado)
- [ ] Se não inscrito: vê mensagem "not enrolled in any plan"
- [ ] Se inscrito: consegue clicar em nível
- [ ] Exercício carrega
- [ ] Vê frase com lacunas
- [ ] Consegue preencher dropdown
- [ ] Clica "Check Answers"
- [ ] Recebe feedback (✅ ou ⚠️)

---

## 📊 Dados de Teste

- [ ] Após seed, existem 2 planos
- [ ] Após seed, existem 10 exercícios (5 Beginner, 5 Intermediate)
- [ ] Após seed, existem 1 admin user (admin@test.com)
- [ ] Exercícios têm formato correto (sentence com ___, gaps com options)

---

## 🛠️ API Endpoints Verificados

- [ ] GET http://localhost:5000/health → Returns { message: "Backend is running!" }
- [ ] POST http://localhost:5000/auth/register → Register novo user
- [ ] POST http://localhost:5000/auth/login → Login retorna JWT
- [ ] GET http://localhost:5000/api/plans → List planos
- [ ] Recebe erro 401/403 sem token (esperado)

---

## 📚 Documentação Presente

- [ ] START_HERE.md existe
- [ ] IMPLEMENTATION_COMPLETE.md existe
- [ ] GUIA_DE_USO_PT.md existe
- [ ] QUICK_START.md existe
- [ ] BACKEND_SETUP.md existe
- [ ] README.md atualizado
- [ ] VISUAL_SUMMARY.md existe
- [ ] TROUBLESHOOTING.md existe
- [ ] Todos os arquivos estão em português

---

## 🎯 Performance

- [ ] Frontend carrega em < 5 segundos
- [ ] Login responde em < 2 segundos
- [ ] Exercício carrega em < 1 segundo
- [ ] Validação de resposta é instantânea

---

## 🔒 Segurança Checada

- [ ] Passwords são hasheados (não plaintext no DB)
- [ ] JWT tokens são gerados no login
- [ ] Routes protegidas retornam 401 sem token
- [ ] Admin routes retornam 403 para student
- [ ] Student routes retornam 403 para admin (se tenta acessar)

---

## 🆘 Troubleshooting

Se algo não funcionar:

- [ ] Leia START_HERE.md
- [ ] Leia TROUBLESHOOTING.md
- [ ] Verifique terminal output (erros lá)
- [ ] Verifique console browser (F12) - erros ali
- [ ] Verifique .env tem valores corretos
- [ ] Verifique MongoDB está conectado
- [ ] Reinicie backend se mudou .env

---

## 📦 Deployment Ready

- [ ] Backend pronta para Render/Railway
- [ ] Frontend pronta para Vercel/Netlify
- [ ] MongoDB Atlas já é cloud
- [ ] Variáveis de ambiente configuradas
- [ ] Sem secrets em código (tudo em .env)

---

## ✨ Bônus: Melhorias Fáceis (v1.1)

Se quiser expandir rápido:

- [ ] Adicionar mais exercícios via seed.js
- [ ] Adicionar novo nível (Advanced exercícios)
- [ ] Customizar cores Material-UI theme
- [ ] Adicionar logo/favicon
- [ ] Adicionar tipo de exercício (multiple choice, true/false, etc)

---

## 🎉 Status Final

Se marcou tudo ✅, parabéns!

**SUA PLATAFORMA ESTÁ PRONTA PARA USAR!**

Próximos passos:
1. Teste tudo
2. Customize conforme necessário
3. Adicione mais dados
4. Convide usuários
5. Recolha feedback
6. Implemente melhorias (v2)

---

**Desenvolvido: 23/03/2026**  
**Status: ✅ MVP Completo e Funcionando**  
**Pronto para: Uso, Testes, Deploy**
