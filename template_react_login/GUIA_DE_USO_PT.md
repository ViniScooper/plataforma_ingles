# 📖 Guia de Uso - Plataforma de Inglês

Bem-vindo! Este documento explica como usar a plataforma tanto como **ADMIN** quanto como **ALUNO**.

---

## 👨‍💼 GUIA DO ADMINISTRADOR

### Passo 1: Fazer Login
1. Acesse http://localhost:5173
2. Clique em **"Login"** na parte superior
3. Digite:
   - **Email**: `admin@test.com`
   - **Password**: `password123`
4. Clique em **"Login"**

**Resultado**: Você será redirecionado para `/admin` (Dashboard Admin)

---

### Passo 2: Dashboard Admin

Você verá 3 abas: **📚 Plans**, **👥 Students**, **📝 Enrollments**

#### ABA 1: 📚 PLANS (Planos)

**O que você vê:**
- Tabela com planos existentes
- Botão "+ New Plan"

**Como criar um plano:**
1. Clique em **"+ New Plan"**
2. Preencha:
   - **Plan Name**: ex "Advanced English"
   - **Description**: ex "Para quem já fala bem"
   - **Level**: Selecione "Beginner", "Intermediate" ou "Advanced"
   - **Price (R$)**: ex 199.99
   - **Hours**: ex 40
3. Clique **"Create"**

**Como deletar um plano:**
1. Na tabela, clique no botão "Delete" da linha
2. Confirme a exclusão

**Exemplo de Planos:**
| Nome | Nível | Preço | Horas |
|------|-------|-------|-------|
| English Basics | Beginner | R$ 99,90 | 20 |
| Intermediate | Intermediate | R$ 149,90 | 30 |
| Business Pro | Advanced | R$ 199,90 | 40 |

---

#### ABA 2: 👥 STUDENTS (Alunos)

**O que você vê:**
- Tabela com alunos cadastrados
- Botão "+ New Student"

**Como criar um aluno:**
1. Clique em **"+ New Student"**
2. Preencha:
   - **Name**: nome do aluno
   - **Email**: email único
   - **Password**: senha (mínimo 6 caracteres)
3. Clique **"Create"**

**Visualizar:**
- A tabela mostra: Nome, Email, Plano Atual
- Se o aluno ainda não tem plano, mostra "No Plan"

**Dica**: Depois de criar o aluno, vá para a aba de Inscrições para atribuir um plano

---

#### ABA 3: 📝 ENROLLMENTS (Inscrições)

**O que é:**
- Ligação entre Aluno + Plano
- Um aluno pode estar inscrito em apenas 1 plano por vez

**O que você vê:**
- Tabela com: Aluno | Plano | Data de Inscrição

**Como atribuir um aluno a um plano:**
1. Clique em **"+ Assign Student to Plan"**
2. Selecione:
   - **Student**: escolha o aluno na lista
   - **Plan**: escolha o plano
3. Clique **"Assign"**

**Resultado**:
- Aluno agora pode acessar os exercícios do plano atribuído
- Na aba Students, o aluno mostrará o novo plano

---

### Resumo - Fluxo Admin

```
1. Criar Plano
   ↓
2. Criar Aluno
   ↓
3. Atribuir Aluno ao Plano (Enrollment)
   ↓
4. Aluno agora pode acessar os exercícios!
```

---

## 👨‍🎓 GUIA DO ALUNO

### Passo 1: Criar Conta

1. Acesse http://localhost:5173
2. Clique em **"Sign Up"**
3. Preencha:
   - **Full Name**: seu nome completo
   - **Email**: seu email único
   - **Password**: sua senha
   - **Confirm Password**: repita a senha
4. Clique **"Sign Up"**

**O que acontece:**
- Sua conta é criada com role = "student" (automático)
- Um admin precisa atribuir você a um plano para você ver exercícios
- Você será redirecionado para `/student`

---

### Passo 2: Esperando o Admin

**Se seu admin ainda não atribuiu um plano:**
- Você verá na tela: "You are not enrolled in any plan"
- Aguarde o admin atribuir você a um plano

**Depois que atribui:**
- Atualize a página (F5)
- Você verá os botões de níveis

---

### Passo 3: Acessar Learning Center

1. Clique em um nível:
   - **🟢 Beginner** (Iniciante) - básico
   - **🟡 Intermediate** (Intermediário) - intermediário
   - **🔴 Advanced** (Avançado) - avançado

2. Você verá:
   - Exercício 1 de X
   - Frase com lacunas
   - Dropdowns para preencher

---

### Passo 4: Resolver um Exercício

**Exemplo de exercício:**
```
"I ___ a student"

Opções no dropdown: [am, is, are]
```

**Como fazer:**
1. Para cada lacuna (___), clique no dropdown
2. Selecione a resposta correta
3. Quando todas as lacunas estiverem preenchidas, clique **"Check Answers"**

**Feedback:**
- ✅ **Correto**: "Perfect! All answers are correct!"
- ⚠️ **Incorreto**: "Some answers are not correct. Try again!"
  - Mostra cada gap com verdadeira resposta
  - Você pode clicar "Try Again" para repetir

---

### Passo 5: Navegação

**Botões de navegação:**
- **← Previous**: Ir para exercício anterior (desativado no primeiro)
- **Next →**: Ir para próximo exercício (desativado no último)

**Mude de nível:**
- Clique em outro nível (Beginner/Intermediate/Advanced) para mudar

---

### Exemplo Completo

```
1. Criar conta: joao@email.com
   ↓
2. Admin cria plano "English Basics"
   ↓
3. Admin atribui joao ao plano
   ↓
4. João faz login em joao@email.com
   ↓
5. João clica em "🟢 Beginner"
   ↓
6. João vê: "I ___ a student"
   ↓
7. João seleciona "am" no dropdown
   ↓
8. João clica "Check Answers"
   ↓
9. Feedback: "✅ Perfect! All answers are correct!"
   ↓
10. João clica "Next →" para próximo exercício
```

---

## 🎯 Tipos de Exercícios

### Gap-Fill (Preencher Lacunas)

**O que é:**
- Frase com lacunas marcadas como `___`
- Você escolhe a resposta certa de um dropdown

**Exemplo:**
```
Frase: "She ___ to the store yesterday"
Opções: [goes, went, going, go]
Resposta correta: "went"
```

**Habilidades testadas:**
- Tempos verbais
- Phrasal verbs
- Palavras de vocabulário
- Gramática geral

---

## 📊 Progresso

**Contador no canto superior:**
- "Exercise 3 of 10"
- Mostra qual exercício você está e quantos tem no total

**Para acompanhar progresso:**
- Resolva exercício por exercício
- Use Next → para ir avançando
- Tente acertar todos antes de mudar de nível

---

## ❓ Dúvidas Frequentes

### P: O que fazer se errar um exercício?
**R**: Clique "Try Again" para tentar de novo. Você pode responder quantas vezes quiser.

### P: Posso mudar de nível no meio?
**R**: Sim! Clique em outro nível para mudar. Você recomeça do exercício 1 daquele nível.

### P: Meu progresso é salvo?
**R**: No MVP (versão 1), o progresso não é salvo. Na v2, será salvo um histórico completo.

### P: Quantos exercícios tem?
**R**: Beginner: 5 exercícios | Intermediate: 5 exercícios

### P: Posso fazer exercícios Advanced agora?
**R**: Advanced está preparado mas não tem exercícios de teste ainda. Uma vez adicionados, estará disponível.

### P: E se eu esquecer minha senha?
**R**: No MVP, não há recuperação de senha. Peça ao admin para criar uma nova conta para você.

---

## 🔐 Dicas de Segurança

- Nunca compartilhe sua senha
- Use email único (um por pessoa)
- Se encontrar um bug, avise o admin

---

## 🆘 Possíveis Problemas

### "You are not enrolled in any plan"
- **Causa**: Admin não atribuiu você a um plano
- **Solução**: Aguarde ou fale com o admin

### "403 Forbidden - Access denied"
- **Causa**: Você tentou acessar página de admin sendo aluno (ou vice-versa)
- **Solução**: Você só vê as páginas do seu role

### "Cannot find module" (no console)
- **Causa**: Alguma dependência não foi instalada
- **Solução**: Admin rode `npm install` novamente

### Exercício não carrega
- **Causa**: Problema de conexão com servidor
- **Solução**: Verifique se backend está rodando (terminal mostra "🚀 Server")

---

## 📱 Ambiente Responsivo

A plataforma funciona em:
- ✅ Desktop (Chrome, Firefox, Edge, Safari)
- ✅ Tablet (em construção para v2)
- ✅ Mobile (em construção para v2)

---

## 🎓 Dicas de Estudo

1. **Comece pelo Beginner**: Consolide o básico
2. **Faça todos os exercícios**: Pratique repetidamente
3. **Depois vá para Intermediate**: Complexidade aumenta
4. **Revise quando errar**: Leia a resposta correta
5. **Use o feedback**: O sistema te mostra o que errou

---

## 📞 Contato / Suporte

Se encontrar problemas ou bugs:
1. Verifique este guia
2. Verifique o arquivo QUICK_START.md
3. Avise o administrador

---

**Boa sorte nos seus estudos! 🚀📚**

*Última atualização: 23/03/2026*
