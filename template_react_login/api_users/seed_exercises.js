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

    // 4. Definir as 10 Atividades do Módulo 2 (Intermediate / CEFR B1.1)
    const m2Exercises = [
      {
        title: 'M2.1: Past Simple Irregular Verbs',
        type: 'quiz',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          text: 'Choose the correct past simple form for each irregular verb.',
          questions: [
            { question: "What is the past simple of 'Go'?", options: ["Goed", "Went", "Gone", "Going"], correct: "Went" },
            { question: "What is the past simple of 'Buy'?", options: ["Buyed", "Bought", "Brought", "Bins"], correct: "Bought" },
            { question: "What is the past simple of 'Write'?", options: ["Writed", "Wrote", "Written", "Writing"], correct: "Wrote" },
            { question: "What is the past simple of 'Choose'?", options: ["Choosed", "Chose", "Chosen", "Choosing"], correct: "Chose" },
            { question: "What is the past simple of 'Speak'?", options: ["Speaked", "Spoke", "Spoken", "Speaking"], correct: "Spoke" }
          ]
        }
      },
      {
        title: 'M2.2: Prepositions of Place & Time',
        type: 'matching',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          instructions: 'Relacione as preposições de tempo e lugar ao seu contexto correto.',
          pairs: [
            { left: 'At', right: 'Horas específicas e locais pontuais (Ex: at 7 PM, at school)' },
            { left: 'On', right: 'Dias da semana, datas e superfícies (Ex: on Friday, on the table)' },
            { left: 'In', right: 'Meses, anos, cidades e espaços fechados (Ex: in July, in Brazil)' },
            { left: 'Under', right: 'Diretamente abaixo de uma superfície (Ex: under the bed)' },
            { left: 'Between', right: 'No meio de dois pontos ou pessoas (Ex: between two trees)' }
          ]
        }
      },
      {
        title: 'M2.3: Present Perfect vs Past Simple',
        type: 'true-false',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          text: 'Julgue se o tempo verbal (Past Simple com tempo determinado vs Present Perfect para experiências) está correto.',
          statements: [
            {
              statement: "I have visited Rome in 2021.",
              translation: "Eu visitei Roma em 2021.",
              explanation: "Incorreto! Com datas ou anos definidos no passado (in 2021), usamos o Past Simple ('I visited Rome in 2021') e não o Present Perfect.",
              correct: false
            },
            {
              statement: "She has already finished her university degree.",
              translation: "Ela já concluiu sua graduação universitária.",
              explanation: "Correto! 'Already' (já) é usado com o Present Perfect para indicar que uma ação foi concluída antes do esperado.",
              correct: true
            },
            {
              statement: "They lived in London two years ago.",
              translation: "Eles moraram em Londres há dois anos.",
              explanation: "Correto! Expressões com 'ago' (two years ago) indicam tempo encerrado no passado e exigem o Past Simple ('lived').",
              correct: true
            },
            {
              statement: "He has saw that famous film last night.",
              translation: "Ele viu aquele filme famoso ontem à noite.",
              explanation: "Incorreto! Dois erros: 1) O particípio de 'see' é 'seen' (não 'saw'). 2) 'Last night' exige o Past Simple ('He saw that film last night').",
              correct: false
            },
            {
              statement: "We have known each other for ten years.",
              translation: "Nós nos conhecemos há dez anos.",
              explanation: "Correto! Expressa uma ação contínua que iniciou no passado e permanece verdadeira no presente ('for ten years').",
              correct: true
            }
          ]
        }
      },
      {
        title: 'M2.4: Essential B1 Phrasal Verbs',
        type: 'flashcards',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          instructions: 'Domine o significado e uso destes verbos compostos essenciais do nível B1.',
          cards: [
            { front: 'Give up', back: 'Desistir de algo / Abandonar um hábito', example: 'Never give up on learning English.' },
            { front: 'Look for', back: 'Procurar / Buscar algo ou alguém', example: 'I am looking for my passport right now.' },
            { front: 'Run out of', back: 'Esgotar / Ficar sem suprimento', example: 'We ran out of coffee this morning.' },
            { front: 'Find out', back: 'Descobrir / Obter uma informação', example: 'I need to find out what time the flight departs.' },
            { front: 'Set off', back: 'Partir / Iniciar uma viagem ou jornada', example: 'We set off early to avoid morning traffic.' }
          ]
        }
      },
      {
        title: 'M2.5: Complex Sentence Builder',
        type: 'sentence-order',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          instructions: 'Ordene as palavras para formar frases gramaticalmente corretas no nível B1.',
          sentences: [
            { words: ['If', 'it', 'rains', 'we', 'will', 'stay', 'home'], correct: 'If it rains we will stay home' },
            { words: ['I', 'have', 'already', 'packed', 'my', 'suitcase'], correct: 'I have already packed my suitcase' },
            { words: ['This', 'is', 'the', 'hotel', 'we', 'booked', 'yesterday'], correct: 'This is the hotel we booked yesterday' },
            { words: ['She', 'has', 'lived', 'here', 'since', 'last', 'year'], correct: 'She has lived here since last year' },
            { words: ['We', 'arrived', 'at', 'the', 'station', 'on', 'time'], correct: 'We arrived at the station on time' }
          ]
        }
      },
      {
        title: 'M2.6: First Conditional Clauses',
        type: 'quiz',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          text: 'Complete as sentenças com a estrutura correta da First Conditional (If + Present Simple, will + Verb).',
          questions: [
            { question: "If he studies hard, he ___ the exam.", options: ["pass", "passes", "will pass", "passed"], correct: "will pass" },
            { question: "We will go to the beach if the weather ___ good.", options: ["is", "will be", "are", "was"], correct: "is" },
            { question: "If you don't call me, I ___ know when to pick you up.", options: ["won't", "don't", "am not", "wouldn't"], correct: "won't" },
            { question: "What will you do if the flight ___ cancelled?", options: ["is", "will be", "be", "was"], correct: "is" },
            { question: "If they ___ tickets today, they will save money.", options: ["buy", "will buy", "bought", "buying"], correct: "buy" }
          ]
        }
      },
      {
        title: 'M2.7: Travel & Airport Vocabulary',
        type: 'matching',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          instructions: 'Relacione os termos essenciais de aeroporto e viagem com seus significados.',
          pairs: [
            { left: 'Boarding pass', right: 'Cartão de embarque oficial' },
            { left: 'Luggage allowance', right: 'Limite de peso e volume de bagagem' },
            { left: 'Departure gate', right: 'Portão de saída para o avião' },
            { left: 'Flight delay', right: 'Atraso na decolagem do voo' },
            { left: 'Customs declaration', right: 'Declaração alfandegária de bens' }
          ]
        }
      },
      {
        title: 'M2.8: Comparatives and Superlatives',
        type: 'true-false',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          text: 'Identifique se o uso dos comparativos e superlativos está correto.',
          statements: [
            { statement: "This international train is more faster than the bus.", correct: false },
            { statement: "Tokyo is one of the most expensive cities in the world.", correct: true },
            { statement: "My new apartment is further from the center than before.", correct: true },
            { statement: "She is the goodest student in our English class.", correct: false },
            { statement: "Travelling by plane is safer than travelling by car.", correct: true }
          ]
        }
      },
      {
        title: 'M2.9: Journey to London - Reading Comprehension',
        type: 'quiz',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          text: "Lucas travelled to London last autumn for an international design seminar. He arrived at Heathrow Airport early in the morning, but his luggage had been mistakenly transferred to Dublin. Fortunately, the airline staff tracked his suitcase within three hours and delivered it straight to his hotel in Westminster. Despite the initial stress, Lucas enjoyed walking along the Thames and visiting the British Museum.",
          questions: [
            { question: "Why did Lucas travel to London?", options: ["For a family holiday", "For a design seminar", "To visit a museum", "To buy a car"], correct: "For a design seminar" },
            { question: "What problem happened upon his arrival?", options: ["His flight was cancelled", "His luggage was sent to Dublin", "His hotel was closed", "He lost his passport"], correct: "His luggage was sent to Dublin" },
            { question: "How long did it take the airline staff to locate his suitcase?", options: ["One day", "Three hours", "Five hours", "A week"], correct: "Three hours" },
            { question: "Where was Lucas's hotel located?", options: ["Heathrow", "Dublin", "Westminster", "Kensington"], correct: "Westminster" }
          ]
        }
      },
      {
        title: 'M2.10: Travel Word Order & Expressions',
        type: 'sentence-order',
        level: 'Intermediate',
        planId: planIntermediate.id,
        content: {
          instructions: 'Ordene as palavras para formar perguntas e frases úteis para viagens.',
          sentences: [
            { words: ['Where', 'can', 'I', 'collect', 'my', 'luggage'], correct: 'Where can I collect my luggage' },
            { words: ['Could', 'you', 'please', 'check', 'my', 'reservation'], correct: 'Could you please check my reservation' },
            { words: ['The', 'flight', 'has', 'been', 'delayed', 'by', 'two', 'hours'], correct: 'The flight has been delayed by two hours' },
            { words: ['Do', 'I', 'need', 'to', 'show', 'my', 'passport'], correct: 'Do I need to show my passport' },
            { words: ['We', 'are', 'looking', 'for', 'the', 'information', 'desk'], correct: 'We are looking for the information desk' }
          ]
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
