import { prisma } from './src/database/index.js';

async function main() {
  console.log('🌱 Iniciando seed de exercícios (Módulo 1 e Módulo 2)...');

  try {
    // 1. Limpar progresso e exercícios anteriores para evitar duplicatas e IDs erráticos
    await prisma.student_exercise.deleteMany();
    await prisma.exercise.deleteMany();

    // 2. Obter ou criar planos correspondentes
    let planBeginner = await prisma.plan.findFirst({ where: { level: 'Beginner' } });
    if (!planBeginner) {
      planBeginner = await prisma.plan.create({
        data: {
          name: 'English Basics',
          description: 'Curso de inglês para iniciantes',
          level: 'Beginner',
          price: 99.90,
          hours: 20
        }
      });
    }

    let planIntermediate = await prisma.plan.findFirst({ where: { level: 'Intermediate' } });
    if (!planIntermediate) {
      planIntermediate = await prisma.plan.create({
        data: {
          name: 'Intermediate English',
          description: 'Curso de inglês intermediário',
          level: 'Intermediate',
          price: 149.90,
          hours: 30
        }
      });
    }

    console.log(`Planos mapeados: Beginner (ID: ${planBeginner.id}), Intermediate (ID: ${planIntermediate.id})`);

    // 3. Definir as 10 Atividades do Módulo 1 (Beginner)
    const m1Exercises = [
      {
        title: 'M1.1: Greetings & Introductions',
        type: 'quiz',
        level: 'Beginner',
        planId: planBeginner.id,
        content: {
          text: 'Choose the correct greeting for each situation.',
          questions: [
            { question: "How do you greet someone in the morning?", options: ["Good evening", "Good morning", "Good night", "Goodbye"], correct: "Good morning" },
            { question: "What is the polite response to 'How are you?'", options: ["I am a teacher", "I am fine, thank you", "Nice to meet you", "I am ten years old"], correct: "I am fine, thank you" },
            { question: "How do you say goodbye to a friend?", options: ["Hello", "Nice to meet you", "See you later", "Welcome"], correct: "See you later" }
          ]
        }
      },
      {
        title: 'M1.2: Essential Subject Pronouns',
        type: 'matching',
        level: 'Beginner',
        planId: planBeginner.id,
        content: {
          instructions: 'Relacione os pronomes em inglês com sua tradução em português.',
          pairs: [
            { left: 'I', right: 'Eu' },
            { left: 'You', right: 'Você / Vocês' },
            { left: 'We', right: 'Nós' },
            { left: 'They', right: 'Eles / Elas' }
          ]
        }
      },
      {
        title: 'M1.3: Verb To Be - Singular',
        type: 'true-false',
        level: 'Beginner',
        planId: planBeginner.id,
        content: {
          text: 'Decida se as frases com o verbo To Be estão gramaticalmente corretas.',
          statements: [
            { statement: 'I am a student.', correct: true },
            { statement: 'She are my sister.', correct: false },
            { statement: 'He is very happy today.', correct: true },
            { statement: 'It is a beautiful dog.', correct: true }
          ]
        }
      },
      {
        title: 'M1.4: Common Classroom Objects',
        type: 'flashcards',
        level: 'Beginner',
        planId: planBeginner.id,
        content: {
          instructions: 'Estude o vocabulário de objetos de sala de aula comum.',
          cards: [
            { front: 'Book', back: 'Livro', example: 'Open your English book.' },
            { front: 'Pen', back: 'Caneta', example: 'Do you have a blue pen?' },
            { front: 'Pencil', back: 'Lápis', example: 'I write with a pencil.' },
            { front: 'Notebook', back: 'Caderno', example: 'Write the homework in your notebook.' }
          ]
        }
      },
      {
        title: 'M1.5: Simple Sentence Builder',
        type: 'sentence-order',
        level: 'Beginner',
        planId: planBeginner.id,
        content: {
          instructions: 'Ordene as palavras para formar frases corretas.',
          sentences: [
            { words: ['is', 'blue', 'sky', 'The'], correct: 'The sky is blue' },
            { words: ['apple', 'eating', 'am', 'I', 'an'], correct: 'I am eating an apple' },
            { words: ['have', 'dog', 'a', 'We'], correct: 'We have a dog' }
          ]
        }
      },
      {
        title: 'M1.6: What is this? (Articles a/an)',
        type: 'quiz',
        level: 'Beginner',
        planId: planBeginner.id,
        content: {
          text: 'Escolha o artigo correto (a ou an).',
          questions: [
            { question: "I want to buy ___ book.", options: ["a", "an"], correct: "a" },
            { question: "She is eating ___ orange.", options: ["a", "an"], correct: "an" },
            { question: "He saw ___ elephant yesterday.", options: ["a", "an"], correct: "an" }
          ]
        }
      },
      {
        title: 'M1.7: Numbers 1-10 Word Match',
        type: 'matching',
        level: 'Beginner',
        planId: planBeginner.id,
        content: {
          instructions: 'Relacione os números em algarismo com a palavra por extenso.',
          pairs: [
            { left: 'Three', right: '3' },
            { left: 'Seven', right: '7' },
            { left: 'Five', right: '5' },
            { left: 'Eight', right: '8' }
          ]
        }
      },
      {
        title: 'M1.8: Negative Sentences (don\'t / doesn\'t)',
        type: 'true-false',
        level: 'Beginner',
        planId: planBeginner.id,
        content: {
          text: 'Identifique se o uso de don\'t ou doesn\'t está correto nas seguintes frases.',
          statements: [
            { statement: 'I doesn\'t like tea.', correct: false },
            { statement: 'He doesn\'t speak Spanish.', correct: true },
            { statement: 'They don\'t live here.', correct: true },
            { statement: 'She don\'t play tennis.', correct: false }
          ]
        }
      },
      {
        title: 'M1.9: Meet Peter - Reading Comprehension',
        type: 'quiz',
        level: 'Beginner',
        planId: planBeginner.id,
        content: {
          text: 'Peter is 25 years old. He is a doctor. He lives in Toronto, Canada. He has a cat named Luna.',
          questions: [
            { question: "How old is Peter?", options: ["20", "25", "30", "35"], correct: "25" },
            { question: "What is Peter\'s job?", options: ["Teacher", "Engineer", "Doctor", "Pilot"], correct: "Doctor" },
            { question: "Where does he live?", options: ["Vancouver", "Montreal", "Toronto", "Ottawa"], correct: "Toronto" }
          ]
        }
      },
      {
        title: 'M1.10: Introduce Yourself!',
        type: 'writing',
        level: 'Beginner',
        planId: planBeginner.id,
        content: {
          prompt: 'Escreva um pequeno texto em inglês se apresentando. Inclua seu nome, idade, onde mora e o que gosta de fazer (mínimo de 30 palavras).',
          minWords: 30,
          tips: ['My name is...', 'I am X years old.', 'I live in...', 'I like to...']
        }
      }
    ];

    // 4. Definir as 10 Atividades do Módulo 2 (Intermediate)
    const m2Exercises = [
      {
        title: 'M2.1: Past Simple Irregular Verbs',
        type: 'quiz',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          text: 'Choose the correct past simple forms.',
          questions: [
            { question: "What is the past simple of 'Go'?", options: ["Goed", "Gone", "Went", "Goes"], correct: "Went" },
            { question: "What is the past simple of 'Buy'?", options: ["Buyed", "Bought", "Brought", "Bins"], correct: "Bought" },
            { question: "What is the past simple of 'Write'?", options: ["Writed", "Written", "Wrote", "Write"], correct: "Wrote" }
          ]
        }
      },
      {
        title: 'M2.2: Prepositions of Place & Time',
        type: 'matching',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          instructions: 'Relacione as preposições com suas regras de uso comuns.',
          pairs: [
            { left: 'At', right: 'Usada para horas específicas (Ex: at 5 PM)' },
            { left: 'On', right: 'Usada para dias da semana e datas (Ex: on Monday)' },
            { left: 'In', right: 'Usada para meses, anos e períodos (Ex: in 2026)' },
            { left: 'Under', right: 'Usada para posições diretamente abaixo (Ex: under the table)' }
          ]
        }
      },
      {
        title: 'M2.3: Present Perfect Form Check',
        type: 'true-false',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          text: 'Julgue se o uso do Present Perfect está correto.',
          statements: [
            { statement: 'I have visited France twice.', correct: true },
            { statement: 'She has saw that movie already.', correct: false },
            { statement: 'They have lived here since 2010.', correct: true },
            { statement: 'He have finished his work.', correct: false }
          ]
        }
      },
      {
        title: 'M2.4: Common Phrasal Verbs',
        type: 'flashcards',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          instructions: 'Estude o significado de verbos compostos comuns (Phrasal Verbs).',
          cards: [
            { front: 'Give up', back: 'Desistir / Entregar', example: 'Never give up on your dreams.' },
            { front: 'Look for', back: 'Procurar', example: 'I am looking for my keys.' },
            { front: 'Run out of', back: 'Ficar sem / Esgotar', example: 'We ran out of milk.' },
            { front: 'Wake up', back: 'Acordar', example: 'I wake up at 7 AM.' }
          ]
        }
      },
      {
        title: 'M2.5: Complex Sentence Builder',
        type: 'sentence-order',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          instructions: 'Organize as palavras para formar frases condicionais ou complexas.',
          sentences: [
            { words: ['it', 'rain', 'If', 'will', 'stay', 'I', 'rains,', 'home'], correct: 'If it rains, I will stay home' },
            { words: ['already', 'have', 'lunch', 'eaten', 'I'], correct: 'I have already eaten lunch' },
            { words: ['is', 'book', 'the', 'This', 'I', 'yesterday', 'bought'], correct: 'This is the book I bought yesterday' }
          ]
        }
      },
      {
        title: 'M2.6: Conditional Clauses (Type 1)',
        type: 'quiz',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          text: 'Complete a primeira condicional de forma correta.',
          questions: [
            { question: "If he studies hard, he ___ the exam.", options: ["pass", "passes", "will pass", "passed"], correct: "will pass" },
            { question: "We will go to the beach if the weather ___ good.", options: ["is", "will be", "are", "was"], correct: "is" },
            { question: "If you don't call me, I ___ come.", options: ["won't", "don't", "am not", "wouldn't"], correct: "won't" }
          ]
        }
      },
      {
        title: 'M2.7: Travel Vocabulary Match',
        type: 'matching',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          instructions: 'Relacione as palavras com o contexto de viagem correto.',
          pairs: [
            { left: 'Boarding pass', right: 'Cartão de embarque do avião' },
            { left: 'Luggage', right: 'Malas e pertences da viagem' },
            { left: 'Delay', right: 'Atraso no vôo ou partida' },
            { left: 'Gate', right: 'Portão de embarque no aeroporto' }
          ]
        }
      },
      {
        title: 'M2.8: Comparatives and Superlatives',
        type: 'true-false',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          text: 'Julgue a correção dos graus de comparação dos adjetivos.',
          statements: [
            { statement: 'This book is more interesting than that one.', correct: true },
            { statement: 'He is the most tallest boy in class.', correct: false },
            { statement: 'Gold is more expensive than silver.', correct: true },
            { statement: 'His car is gooder than mine.', correct: false }
          ]
        }
      },
      {
        title: 'M2.9: The Future of AI - Text Reading',
        type: 'quiz',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          text: 'Artificial Intelligence (AI) is transforming the way we work and learn. Many experts believe that AI will automate routine tasks, allowing humans to focus on creative and complex problems. However, education must adapt to prepare students for this new future.',
          questions: [
            { question: "What is AI transforming according to the text?", options: ["Only finance", "The way we work and learn", "Ancient histories", "Farming only"], correct: "The way we work and learn" },
            { question: "What will AI automate?", options: ["All jobs", "Routine tasks", "Nothing", "Creative problems"], correct: "Routine tasks" },
            { question: "What must adapt to prepare students?", options: ["Government", "AI models", "Education", "Companies"], correct: "Education" }
          ]
        }
      },
      {
        title: 'M2.10: Your Dream Vacation',
        type: 'writing',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          prompt: 'Descreva suas férias dos sonhos. Para onde você iria, o que faria e com quem iria? Escreva em inglês de forma detalhada (mínimo de 40 palavras).',
          minWords: 40,
          tips: ['My dream vacation is...', 'I would love to visit...', 'We would travel by...', 'I want to see...']
        }
      }
    ];

    // 5. Salvar exercícios no Banco de Dados
    console.log('Inserting Module 1 exercises...');
    const dbM1Exercises = [];
    for (const ex of m1Exercises) {
      const dbEx = await prisma.exercise.create({
        data: {
          title: ex.title,
          type: ex.type,
          level: ex.level,
          planId: ex.planId,
          content: ex.content
        }
      });
      dbM1Exercises.push(dbEx);
    }

    console.log('Inserting Module 2 exercises...');
    const dbM2Exercises = [];
    for (const ex of m2Exercises) {
      const dbEx = await prisma.exercise.create({
        data: {
          title: ex.title,
          type: ex.type,
          level: ex.level,
          planId: ex.planId,
          content: ex.content
        }
      });
      dbM2Exercises.push(dbEx);
    }

    console.log(`✅ ${dbM1Exercises.length} exercícios Módulo 1 cadastrados.`);
    console.log(`✅ ${dbM2Exercises.length} exercícios Módulo 2 cadastrados.`);

    // 6. Atribuir exercícios a TODOS os alunos
    const students = await prisma.user.findMany({ where: { role: 'student' } });
    console.log(`Atribuindo exercícios para ${students.length} estudantes cadastrados...`);

    for (const student of students) {
      // Checar se ele está matriculado em Beginner (Módulo 1) ou Intermediate (Módulo 2)
      const enrollments = await prisma.enrollment.findMany({ where: { userId: student.id } });
      const hasBeginner = enrollments.some(e => e.planId === planBeginner.id);
      const hasIntermediate = enrollments.some(e => e.planId === planIntermediate.id);

      // Se não tiver matrícula ativa, atribui Módulo 1 por padrão para povoar
      const assignM1 = hasBeginner || enrollments.length === 0;
      const assignM2 = hasIntermediate;

      if (assignM1) {
        for (const ex of dbM1Exercises) {
          await prisma.student_exercise.create({
            data: {
              userId: student.id,
              exerciseId: ex.id,
              status: 'assigned'
            }
          });
        }
        console.log(`✓ Módulo 1 atribuído para ${student.name}`);
      }

      if (assignM2) {
        for (const ex of dbM2Exercises) {
          await prisma.student_exercise.create({
            data: {
              userId: student.id,
              exerciseId: ex.id,
              status: 'assigned'
            }
          });
        }
        console.log(`✓ Módulo 2 atribuído para ${student.name}`);
      }
    }

    console.log('🎉 Seed de exercícios concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no seed de exercícios:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
