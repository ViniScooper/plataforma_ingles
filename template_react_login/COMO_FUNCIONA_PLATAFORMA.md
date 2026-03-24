# 📘 GUIA COMPLETO: PLATAFORMA DE INGLÊS

Esta plataforma foi desenvolvida para gerenciar alunos, aulas (presença), cobranças (financeiro) e atividades pedagógicas (textos e quizzes).

---

## 1️⃣ CADASTRO DE ALUNO (ADMIN)

No dashboard administrativo, ao cadastrar um aluno, os seguintes campos são obrigatórios para um controle completo:

* **Nome, Email e Senha**: Credenciais de acesso.
* **Nível do Aluno**: Beginner, Intermediate ou Advanced.
* **Preço por Aula**: Valor cobrado por cada hora/sessão.
* **Aulas por Semana**: Frequência acordada.
* **Descrição**: Foco das aulas (ex: Gramática, Conversação).
* **Data de Início**: Quando o aluno começou o plano.

---

## 2️⃣ CONTROLE DE PRESENÇA (`✅ Presença`)

A aba **Presença** permite registrar cada encontro realizado:

1. **Selecionar Aluno**: Lista suspensa com todos os alunos ativos.
2. **Data e Hora**: Informe quando a aula ocorreu.
3. **Registrar**: Salva o histórico para conferência futura.

**Objetivo**: Controlar o total de aulas ministradas para fins de faturamento e pedagógicos.

---

## 3️⃣ ATIVIDADES E EXERCÍCIOS (`📚 Atividades`)

O administrador pode criar atividades manualmente ou importar via **JSON**.

### Tipos de Atividades:
* **Texto de Leitura**: Um conteúdo textual para o aluno estudar.
* **Quiz (Múltipla Escolha)**: Um texto de apoio seguido de perguntas (ex: 7 questões) com 4 opções e indicação da correta.
* **Preenchimento (Gap-fill)**: Completar frases com a opção correta.

### Como importar via JSON:
No dashboard, use o botão **"Importar JSON"**. O formato aceito é:
```json
{
  "title": "Minha Atividade",
  "text": "Texto de apoio ou leitura principal...",
  "questions": [
    {
      "question": "Pergunta 1?",
      "options": ["Opção A", "Opção B", "Opção C", "Opção D"],
      "correct": "Opção A"
    }
  ]
}
```

---

## 4️⃣ MONITORAMENTO E ACOMPANHAMENTO (`📊 Monitoramento`)

Nesta área, o Admin consegue ver o desempenho real de cada aluno:

* **Atividades Enviadas**: Total de tarefas que o professor atribuiu.
* **Atividades Finalizadas**: Quantas o aluno já concluiu.
* **Precisão (Acertos)**: O sistema mostra quantos itens o aluno acertou no total (ex: 14 acertos de 20 questões totais).
* **Aulas Realizadas**: Total de presenças marcadas para aquele aluno.
* **Histórico Detalhado**: Lista de cada atividade com status (Pendente/Concluída), data de envio e pontuação obtida.

---

## 5️⃣ PORTAL DO ALUNO

O aluno visualiza uma interface limpa com:
1. **Progresso Geral**: Atividades feitas vs. pendentes.
2. **Contador de Aulas**: Quantas aulas ele já assistiu (conforme registrado pelo professor).
3. **Área de Tarefas**: Onde ele resolve os Quizzes e leituras enviadas.

---
*Guia de referência para uso da plataforma v2.0*
