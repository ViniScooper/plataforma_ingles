// src/data/classroomsData.js
// Dados de Aulas, Apostilas em PDF e Atividades - Adaptado para Nível Iniciante (A2)
// Professor: Prof. Vinicius Lourenço

export const getTodayDateString = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getFormattedDate = (dateStr) => {
  try {
    const [year, month, day] = dateStr.split('-');
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  } catch (e) {
    return dateStr;
  }
};

export const CLASSROOM_LESSONS = [
  {
    id: 'lesson_today_1630',
    date: getTodayDateString(),
    time: '16:30',
    duration: '50 min',
    isToday: true,
    title: 'Present Simple + Conditionals & Leitura Fácil (A2)',
    theme: 'Gramática Passo a Passo & Leitura Iniciante',
    teacher: 'Prof. Vinicius Lourenço',
    room: 'Sala Virtual / Presencial - Turma A2',
    level: 'Iniciante / Elementar (Nível A2)',
    summary: 'Começamos revisando o Present Simple para dar total segurança aos alunos iniciantes, e em seguida aprendemos como montar as orações condicionais (Zero, First e Second) de forma simples e direta, com leitura guiada passo a passo.',
    
    // Apostila In-App adaptada para Nível A2
    pdfDocument: {
      title: 'Apostila de Inglês: Present Simple & Conditionals (Nível A2)',
      subtitle: 'Material Oficial da Aula das 16:30 · Quest English',
      version: 'Edição Especial para Alunos Iniciantes A2',
      author: 'Prof. Vinicius Lourenço',
      date: getTodayDateString(),
      sections: [
        {
          id: 'intro_welcome',
          title: 'Bem-vindo à Aula!',
          type: 'theory',
          content: `Olá, aluno! Nesta aula com o **Prof. Vinicius Lourenço**, vamos construir seu inglês com calma e sem palavras difíceis. 

Para falar sobre condições em inglês (usando a palavra **IF**, que significa "SE"), primeiro precisamos revisar um tempo verbal muito fácil que você usa todos os dias: o **Present Simple**!`
        },
        {
          id: 'present_simple_revision',
          title: '1. Cronograma 1: Revisão Essencial do Present Simple',
          type: 'rule',
          badge: 'Base de Tudo (Rotina & Fatos)',
          formula: 'Sujeito + Verbo no Presente (He/She/It ganha -s)',
          explanation: 'O Present Simple serve para falar do que acontece sempre, das suas rotinas e de fatos reais do dia a dia.',
          examples: [
            { en: 'I live in Brazil.', pt: 'Eu moro no Brasil.' },
            { en: 'She drinks water every morning.', pt: 'Ela bebe água toda manhã. (com -s)' },
            { en: 'We do not eat fast food every day.', pt: 'Nós não comemos fast food todo dia.' },
            { en: 'If the weather is good, we smile.', pt: 'Se o tempo está bom, nós sorrimos.' }
          ]
        },
        {
          id: 'conditionals_intro',
          title: '2. O que são as Conditionals (Orações com "IF")?',
          type: 'theory',
          content: `Conditionals são frases que mostram uma **causa e uma consequência**. Quase sempre começam com a palavra **IF** (Se).
Exemplo em português: *"Se você estudar, você aprende."* Viu como uma coisa depende da outra?`
        },
        {
          id: 'zero_conditional',
          title: 'Zero Conditional (Verdades e Fatos Simples)',
          type: 'rule',
          badge: 'Fatos e Certezas',
          formula: 'If + Present Simple, Present Simple',
          explanation: 'Usamos quando o resultado é 100% garantido e natural.',
          examples: [
            { en: 'If you heat ice, it melts.', pt: 'Se você esquenta o gelo, ele derrete.' },
            { en: 'If I am tired, I go to sleep.', pt: 'Se eu estou cansado, eu vou dormir.' },
            { en: 'If babies are hungry, they cry.', pt: 'Se os bebês estão com fome, eles choram.' }
          ]
        },
        {
          id: 'first_conditional',
          title: 'First Conditional (Coisas Prováveis no Futuro)',
          type: 'rule',
          badge: 'Futuro com "WILL"',
          formula: 'If + Present Simple, will + verbo normal',
          explanation: 'Usamos para falar de planos e coisas reais que provavelmente vão acontecer se a condição for cumprida.',
          examples: [
            { en: 'If it rains tomorrow, we will stay at home.', pt: 'Se chover amanhã, nós ficaremos em casa.' },
            { en: 'If you practice English, you will speak well.', pt: 'Se você praticar inglês, você falará bem.' },
            { en: 'If she has time, she will call you.', pt: 'Se ela tiver tempo, ela vai te ligar.' }
          ]
        },
        {
          id: 'second_conditional',
          title: 'Second Conditional (Imaginação e Sonhos)',
          type: 'rule',
          badge: 'Sonhos com "WOULD"',
          formula: 'If + Past Simple, would + verbo normal',
          explanation: 'Usamos para situações de imaginação ou conselhos: coisas que não são reais agora, mas estamos sonhando.',
          note: '💡 Dica do Prof. Vinicius: Para dar conselhos, usamos "If I were you..." (Se eu fosse você). Usamos WERE para soar bem educado e formal!',
          examples: [
            { en: 'If I had money, I would travel to Miami.', pt: 'Se eu tivesse dinheiro, viajaria para Miami.' },
            { en: 'If I were you, I would drink more water.', pt: 'Se eu fosse você, beberia mais água.' }
          ]
        },
        {
          id: 'reading_techniques',
          title: '3. Como Ler Textos em Inglês Sem Medo (Nível A2)',
          type: 'cards',
          techniques: [
            {
              icon: '🦅',
              name: 'Skimming (Olhar Rápido)',
              desc: 'Dar uma olhada rápida no título e na primeira frase para descobrir sobre o que o texto está falando.',
              tip: 'Não precisa traduzir tudo! Apenas descubra o assunto geral.'
            },
            {
              icon: '🔍',
              name: 'Scanning (Caça-Palavras)',
              desc: 'Procurar uma data, um número ou um nome sem ler o texto inteiro.',
              tip: 'Mantenha o número ou nome em mente e passe os olhos rápido pelo texto.'
            },
            {
              icon: '💡',
              name: 'Inferência (Dedução Fácil)',
              desc: 'Adivinhar o significado de uma palavra pelo que vem antes e depois dela.',
              tip: 'Palavras parecidas com o português ajudam muito (ex: music = música, family = família).'
            }
          ]
        },
        {
          id: 'reading_text_easy',
          title: '4. Texto de Leitura: "Lucas and His Smart Pet"',
          type: 'text_box',
          textTitle: 'Lucas and His Smart Pet',
          textContent: `Lucas is 14 years old and lives in a friendly small city. Every day, Lucas wakes up at 7:00 AM and studies English before breakfast.

Lucas has a very special pet: a friendly robot dog named Sparky. Lucas created Sparky in 2024 for his school science project.

If Lucas says "Sit", Sparky sits immediately. If Lucas throws a small ball, Sparky runs happily to catch it. Sparky is very intelligent and learns new tricks every week.

Lucas loves technology and often says to his friends: 
"If I study hard today, I will become a computer engineer in the future. And if I had a spaceship, I would take Sparky to visit the stars!"`
        }
      ]
    },

    // Atividades práticas simplificadas para Nível A2 com gabarito revisado
    activities: [
      {
        id: 'act_1_present_simple',
        category: 'Revisão: Present Simple',
        title: 'Atividade 1: Rotina com He/She/It',
        question: 'No Present Simple, quando falamos de He, She ou It, o verbo ganha a letra "S".\nComplete a frase:\n"Lucas _______ (study) English every day."',
        options: [
          'studies',
          'study',
          'studying',
          'studied'
        ],
        correctIndex: 0,
        explanation: 'Excelente! Com He/She/It no Present Simple, o verbo termina em -s ou -ies: "Lucas studies English every day".',
        xp: 25,
        coins: 5
      },
      {
        id: 'act_2_present_tobe',
        category: 'Revisão: Verbo to be',
        title: 'Atividade 2: Verbo to be no Presente',
        question: 'Qual é o verbo "to be" correto para a frase:\n"If the weather _______ (be) sunny today, Lucas is happy."',
        options: [
          'is',
          'are',
          'am',
          'be'
        ],
        correctIndex: 0,
        explanation: 'Muito bem! "The weather" corresponde a "It", por isso usamos "is".',
        xp: 25,
        coins: 5
      },
      {
        id: 'act_3_skimming',
        category: 'Leitura A2 (Skimming)',
        title: 'Atividade 3: Ideia Principal do Texto',
        question: 'Fazendo um Skimming (leitura rápida) no texto "Lucas and His Smart Pet", qual é o assunto principal?',
        options: [
          'Um garoto de 14 anos chamado Lucas e seu cachorro-robô inteligente Sparky.',
          'Uma receita de bolo de chocolate para o café da manhã.',
          'A história das pirâmides antigas do Egito.',
          'Um manual de conserto de carros velhos.'
        ],
        correctIndex: 0,
        explanation: 'Correto! O texto fala sobre a rotina de Lucas e de seu robozinho amigo Sparky.',
        xp: 30,
        coins: 5
      },
      {
        id: 'act_4_scanning',
        category: 'Leitura A2 (Scanning)',
        title: 'Atividade 4: Encontrando Números no Texto',
        question: 'Usando a técnica de Scanning (buscar números com os olhos), em que ano Lucas criou o Sparky no projeto da escola?',
        options: [
          'No ano de 2024',
          'No ano de 2018',
          'No ano de 2020',
          'No ano de 2010'
        ],
        correctIndex: 0,
        explanation: 'Perfeito! No segundo parágrafo encontramos facilmente o número "2024"!',
        xp: 30,
        coins: 5
      },
      {
        id: 'act_5_zero_conditional',
        category: 'Gramática: Zero Conditional',
        title: 'Atividade 5: Causa e Efeito Simples',
        question: 'Complete a frase da Zero Conditional (verdade simples do texto):\n"If Lucas says \'Sit\', Sparky _______ (sit) immediately."',
        options: [
          'sits',
          'will sit',
          'would sit',
          'sat'
        ],
        correctIndex: 0,
        explanation: 'Show de bola! Na Zero Conditional usamos o verbo no presente em ambos os lados: "If Lucas says... Sparky sits".',
        xp: 30,
        coins: 6
      },
      {
        id: 'act_6_first_conditional',
        category: 'Gramática: First Conditional',
        title: 'Atividade 6: Plano Futuro Real',
        question: 'Qual palavra completa a First Conditional sobre o futuro de Lucas?\n"If I study hard today, I _______ become a computer engineer."',
        options: [
          'will',
          'would',
          'was',
          'did'
        ],
        correctIndex: 0,
        explanation: 'Correto! A First Conditional usa "will" para falar do futuro que vai acontecer se você estudar!',
        xp: 35,
        coins: 6
      },
      {
        id: 'act_7_second_cond_were',
        category: 'Gramática: Second Conditional',
        title: 'Atividade 7: Imaginação e Sonho',
        question: 'Complete a frase imaginária de Lucas na Second Conditional:\n"If I had a spaceship, I _______ (travel) to the stars!"',
        options: [
          'would travel',
          'will travel',
          'travels',
          'travel'
        ],
        correctIndex: 0,
        explanation: 'Acertou em cheio! Na Second Conditional (sonhos e imaginação) usamos "would + verbo": "I would travel"!',
        xp: 35,
        coins: 7
      },
      {
        id: 'act_8_were_rule',
        category: 'Gramática: Second Conditional',
        title: 'Atividade 8: Dica do Prof. Vinicius Lourenço',
        question: 'Segundo o Prof. Vinicius Lourenço, qual palavra é usada na Second Conditional para dar conselhos?\n"If I _______ you, I would practice English every day."',
        options: [
          'were',
          'was',
          'am',
          'be'
        ],
        correctIndex: 0,
        explanation: 'Parabéns! "If I were you" é a forma padrão tradicional da língua inglesa para expressar "Se eu fosse você"!',
        xp: 40,
        coins: 8
      }
    ]
  },

  // Aula Passada
  {
    id: 'lesson_past_1',
    date: '2026-09-25',
    time: '16:30',
    duration: '50 min',
    isToday: false,
    title: 'Daily Routine & Common Action Verbs (A2)',
    theme: 'Rotina e Vocabulário Prático',
    teacher: 'Prof. Vinicius Lourenço',
    room: 'Sala Presencial - Turma A2',
    level: 'Iniciante / A2',
    summary: 'Revisão dos verbos de rotina mais usados: wake up, take a shower, have breakfast, study, work, go to bed.',
    pdfDocument: {
      title: 'Apostila de Aula: Daily Routine Verbs',
      subtitle: 'Resumo da Aula de 25 de Setembro',
      version: 'Edição A2',
      author: 'Prof. Vinicius Lourenço',
      date: '2026-09-25',
      sections: [
        {
          id: 'routine_verbs',
          title: 'Verbos Mais Usados do Dia a Dia',
          type: 'theory',
          content: 'Aprenda os verbos essenciais para descrever seu dia em inglês de forma natural.'
        }
      ]
    },
    activities: [
      {
        id: 'past_act_1',
        category: 'Vocabulário A2',
        title: 'Verbo de Manhã',
        question: 'Como se diz "tomar café da manhã" em inglês?',
        options: ['have breakfast', 'drink breakfast', 'make bed', 'take lunch'],
        correctIndex: 0,
        explanation: 'Em inglês a expressão natural é "have breakfast".',
        xp: 25,
        coins: 5
      }
    ]
  }
];
