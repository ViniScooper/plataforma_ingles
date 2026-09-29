// src/data/classroomsData.js
// Dados de Aulas, Apostilas em PDF, Apresentação de Slides (10 páginas com Quizzes Interativos) e Atividades Expandidas (Nível A2)
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

export const LESSON_VOCABULARY = {
  'friendly': { pt: 'amigável / simpático', example: 'Sparky is a friendly robot dog.', phonetic: '/ˈfrendli/' },
  'smart': { pt: 'inteligente / esperto', example: 'Lucas has a smart pet.', phonetic: '/smɑːrt/' },
  'robot': { pt: 'robô / autômato', example: 'The robot learns new tricks.', phonetic: '/ˈroʊbɑːt/' },
  'immediately': { pt: 'imediatamente / na mesma hora', example: 'Sparky sits immediately.', phonetic: '/ɪˈmiːdiətli/' },
  'science project': { pt: 'projeto de ciências escolar', example: 'Created for his school science project.', phonetic: '/ˈsaɪəns ˈprɑːdʒɛkt/' },
  'throws': { pt: 'arremessa / joga', example: 'If Lucas throws a small ball.', phonetic: '/θroʊz/' },
  'catch': { pt: 'pegar / apanhar', example: 'Sparky runs happily to catch it.', phonetic: '/kætʃ/' },
  'tricks': { pt: 'truques / habilidades', example: 'Learns new tricks every week.', phonetic: '/trɪks/' },
  'spaceship': { pt: 'nave espacial', example: 'If I had a spaceship, I would visit the stars.', phonetic: '/ˈspeɪsʃɪp/' },
  'stars': { pt: 'estrelas', example: 'Look at the beautiful stars.', phonetic: '/stɑːrz/' },
  'heat': { pt: 'aquecer / esquentar', example: 'If you heat ice, it melts.', phonetic: '/hiːt/' },
  'melts': { pt: 'derrete', example: 'The ice melts quickly.', phonetic: '/mɛlts/' },
  'freeze': { pt: 'congelar', example: 'If you freeze water, it turns into ice.', phonetic: '/friːz/' },
  'rains': { pt: 'chove', example: 'If it rains tomorrow, we will stay at home.', phonetic: '/reɪnz/' },
  'lottery': { pt: 'loteria', example: 'If I won the lottery, I would buy a house.', phonetic: '/ˈlɑːtəri/' },
  'engineer': { pt: 'engenheiro(a)', example: 'I will become a computer engineer.', phonetic: '/ˌɛndʒɪˈnɪr/' }
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

    // APRESENTAÇÃO DE SLIDES COM 10 PÁGINAS DETALHADAS E ATIVIDADES INTERATIVAS POR SLIDE
    slides: [
      {
        pageNumber: 1,
        title: 'Bem-vindo à Aula de Inglês A2!',
        subtitle: 'Aula das 16:30 · Quest English Academy',
        tag: 'Slide 1 de 10 · Introdução',
        color: '#00b4d8',
        bullets: [
          '🎯 **Objetivo de Hoje**: Dominar o Present Simple, as 3 Conditionals básicas e aprender a ler sem medo de dicionário.',
          '👨‍🏫 **Professor**: Prof. Vinicius Lourenço.',
          '🎒 **Nível**: A2 (Iniciante / Elementar) - com linguagem simples, sem termos difíceis!',
          '💡 **Dica Inicial**: Você não precisa traduzir tudo ao pé da letra. O segredo é entender o contexto!'
        ],
        highlight: 'Prepare seu caderno e vamos aprender passo a passo de forma leve e divertida!',
        quiz: {
          question: '⚡ Mini-Desafio do Slide 1: Qual é o principal objetivo desta aula com o Prof. Vinicius?',
          options: [
            'Aprender Present Simple, Conditionals e Leitura A2 sem complicações',
            'Decorar o dicionário de inglês inteiro de A a Z',
            'Traduzir textos técnicos de física quântica'
          ],
          correctIndex: 0,
          explanation: 'Isso aí! Nosso foco é aprender com calma e segurança as estruturas essenciais do inglês!'
        }
      },
      {
        pageNumber: 2,
        title: 'Cronograma 1: O que é o Present Simple?',
        subtitle: 'A base sólida de todas as frases em inglês',
        tag: 'Slide 2 de 10 · Present Simple',
        color: '#0284c7',
        bullets: [
          '⏰ **Quando usamos?**: Para falar de rotinas diárias, hábitos e fatos que acontecem com frequência.',
          '👤 **Sujeitos Normais (I, You, We, They)**: O verbo fica na forma normal, sem mudar nada!',
          '👉 *Exemplo 1*: "I drink water every day." (Eu bebo água todo dia).',
          '👉 *Exemplo 2*: "We live in Brazil." (Nós moramos no Brasil).'
        ],
        formula: 'Sujeito (I / You / We / They) + Verbo Normal',
        highlight: 'Muito fácil! Com I, You, We e They você não precisa mexer no verbo!',
        quiz: {
          question: '⚡ Mini-Desafio do Slide 2: No Present Simple, com os sujeitos I, You, We e They, como o verbo se comporta?',
          options: [
            'O verbo permanece na sua forma normal, sem alteração',
            'O verbo sempre precisa ganhar a terminação -ing',
            'O verbo deve ser colocado obrigatoriamente no passado'
          ],
          correctIndex: 0,
          explanation: 'Correto! Com I, You, We e They usamos o verbo base: "I live", "We study", "They speak".'
        }
      },
      {
        pageNumber: 3,
        title: 'Present Simple: A Regra do He / She / It',
        subtitle: 'A única pegadinha que você precisa dominar',
        tag: 'Slide 3 de 10 · Terceira Pessoa',
        color: '#0369a1',
        bullets: [
          '⭐ **Atenção**: Quando o sujeito for **He** (ele), **She** (ela) ou **It** (coisa/animal), o verbo ganha um **-S** ou **-ES** no final!',
          '👉 *Live* vira **lives**: "Lucas lives in a small city."',
          '👉 *Study* vira **studies**: "She studies English before breakfast."',
          '👉 *Verbo to be*: Usa-se **is** para he/she/it e **are** para you/we/they.'
        ],
        formula: 'He / She / It + Verbo com "-S" ou "-ES"',
        highlight: 'Guardou a regra do -S? Excelente! Ela vai ser fundamental para montar as condicionais!',
        quiz: {
          question: '⚡ Mini-Desafio do Slide 3: Quando falamos de He, She ou It no presente, qual é a regra do verbo?',
          options: [
            'O verbo ganha a letra -S ou -ES no final (ex: Lucas studies)',
            'O verbo precisa da palavra would',
            'O verbo nunca pode ser conjugado'
          ],
          correctIndex: 0,
          explanation: 'Exato! He, She e It recebem o -S no Present Simple: "She lives", "He studies", "It rains".'
        }
      },
      {
        pageNumber: 4,
        title: 'O que são as Conditionals? O Poder do "IF"',
        subtitle: 'Conectando causa e consequência em inglês',
        tag: 'Slide 4 de 10 · Conceito de IF',
        color: '#10b981',
        bullets: [
          '🔤 **A palavra mágica**: **IF** significa **SE** em português.',
          '🔗 **Como funciona?**: Mostra que uma ação depende diretamente de outra.',
          '👉 *Exemplo*: "SE você estudar, você passa no teste."',
          '⚖️ A primeira parte é a **Condição** (If...). A segunda parte é o **Resultado**!'
        ],
        formula: 'IF (Se) + [Condição], [Resultado]',
        highlight: 'Se você entender o "IF", você domina qualquer condicional em inglês!',
        quiz: {
          question: '⚡ Mini-Desafio do Slide 4: O que significa a palavra "IF" e qual é a sua função principal?',
          options: [
            'Significa "SE" e conecta uma condição a um resultado dependente',
            'Significa "QUANDO" e serve apenas para falar do passado',
            'Significa "PORQUE" e serve para pedir desculpas'
          ],
          correctIndex: 0,
          explanation: 'Perfeito! "IF" significa "SE" e introduz uma condição na frase.'
        }
      },
      {
        pageNumber: 5,
        title: 'Zero Conditional: Fatos Científicos e Certezas',
        subtitle: 'Coisas que SEMPRE acontecem 100% das vezes',
        tag: 'Slide 5 de 10 · Zero Conditional',
        color: '#059669',
        bullets: [
          '🔬 **Uso**: Leis da física, verdades da natureza e fatos garantidos.',
          '📐 **Estrutura**: Os DOIS lados da frase ficam no **Present Simple**!',
          '👉 *Exemplo 1*: "If you heat ice, it melts." (Se você esquenta o gelo, ele derrete).',
          '👉 *Exemplo 2*: "If babies are hungry, they cry." (Se bebês estão com fome, eles choram).',
          '👉 *No nosso texto*: "If Lucas says \'Sit\', Sparky sits immediately."'
        ],
        formula: 'If + Present Simple, Present Simple',
        highlight: 'Dica do Prof. Vinicius: Como é fato garantido, não usamos "will" nem "would" aqui!',
        quiz: {
          question: '⚡ Mini-Desafio do Slide 5: Na Zero Conditional ("If you heat ice, it melts"), como ficam os dois verbos?',
          options: [
            'Os dois verbos ficam no Present Simple (presente)',
            'O primeiro no passado e o segundo com will',
            'O primeiro no futuro e o segundo com would'
          ],
          correctIndex: 0,
          explanation: 'Correto! Fatos comprovados e verdades da natureza usam o Present Simple nos dois verbos!'
        }
      },
      {
        pageNumber: 6,
        title: 'First Conditional: Planos Reais e Futuro Provável',
        subtitle: 'Se eu fizer algo hoje, o que acontecerá amanhã?',
        tag: 'Slide 6 de 10 · First Conditional',
        color: '#f59e0b',
        bullets: [
          '🚀 **Uso**: Situações reais ou altamente prováveis de acontecerem no futuro.',
          '📐 **Estrutura**: A parte do If fica no **Presente**, e o resultado leva **WILL** (futuro)!',
          '👉 *Exemplo 1*: "If it rains tomorrow, we will stay at home." (Se chover amanhã, ficaremos em casa).',
          '👉 *Exemplo 2*: "If you practice, you will speak English." (Se você praticar, falará inglês).',
          '👉 *No nosso texto*: "If I study hard today, I will become an engineer."'
        ],
        formula: 'If + Present Simple, will + verbo normal',
        highlight: 'Lembre-se: O "will" NUNCA vai grudado com a palavra If! Ele vai no resultado!',
        quiz: {
          question: '⚡ Mini-Desafio do Slide 6: Onde colocamos a palavra "WILL" na First Conditional?',
          options: [
            'Na oração do resultado futuro (ex: "...we will stay at home")',
            'Diretamente colado na palavra If (ex: "If will rain...")',
            'No início de qualquer pergunta sem verbo'
          ],
          correctIndex: 0,
          explanation: 'Muito bem! "Will" vai na consequência futura: If + Presente, WILL + verbo base!'
        }
      },
      {
        pageNumber: 7,
        title: 'Second Conditional: Imaginação, Sonhos e Hipóteses',
        subtitle: 'Coisas que não são reais agora, mas que estamos sonhando',
        tag: 'Slide 7 de 10 · Second Conditional',
        color: '#8b5cf6',
        bullets: [
          '💭 **Uso**: Sonhos, imaginação e situações irreais no presente ou futuro.',
          '📐 **Estrutura**: A parte do If fica no **Past Simple** (passado), e o resultado leva **WOULD**!',
          '👉 *Exemplo 1*: "If I won the lottery, I would travel the world." (Se eu ganhasse a loteria, viajaria pelo mundo).',
          '👉 *Exemplo 2*: "If I had a car, I would drive to the beach." (Se eu tivesse um carro, dirigiria até a praia).',
          '👉 *No texto*: "If I had a spaceship, I would take Sparky to visit the stars!"'
        ],
        formula: 'If + Past Simple, would + verbo normal',
        highlight: 'O "would" serve para colocar o verbo no futuro do pretérito: would travel = viajaria!',
        quiz: {
          question: '⚡ Mini-Desafio do Slide 7: Para falar de imaginação e sonhos ("If I had a spaceship..."), qual palavra usamos no resultado?',
          options: [
            'WOULD (ex: "I would take Sparky to visit the stars")',
            'WILL (ex: "I will take Sparky")',
            'DO (ex: "I do take Sparky")'
          ],
          correctIndex: 0,
          explanation: 'Show! Na Second Conditional usamos WOULD para expressar sonhos e hipóteses (viajaria, compraria).'
        }
      },
      {
        pageNumber: 8,
        title: 'O Segredo de Ouro: "If I were you..."',
        subtitle: 'Como dar conselhos elegantes e corretos em inglês',
        tag: 'Slide 8 de 10 · Dica do Prof. Vinicius',
        color: '#7c3aed',
        bullets: [
          '👑 **Dica Especial do Prof. Vinicius Lourenço**: Na linguagem formal da Second Conditional, usamos a palavra **WERE** para todas as pessoas!',
          '👉 Em vez de falar "If I was", a regra culta pede: **"If I were you"** (Se eu fosse você).',
          '👉 *Exemplo de conselho*: "If I were you, I would study English every day."',
          '👉 *Outro exemplo*: "If he were here, he would help us."'
        ],
        formula: 'If I were you, I would + verbo...',
        highlight: 'Guardou essa dica? Nas provas e entrevistas de emprego isso demonstra um inglês muito bem preparado!',
        quiz: {
          question: '⚡ Mini-Desafio do Slide 8: Segundo o Prof. Vinicius Lourenço, qual é a forma padrão para dar conselhos?',
          options: [
            '"If I were you, I would..."',
            '"If I was you, I will..."',
            '"If I am you, I do..."'
          ],
          correctIndex: 0,
          explanation: 'Perfeito! "If I were you" é a forma padrão tradicional da língua inglesa para expressar "Se eu fosse você"!'
        }
      },
      {
        pageNumber: 9,
        title: 'Leitura A2: Skimming, Scanning e Inferência',
        subtitle: 'As 3 armas secretas para entender qualquer texto em inglês',
        tag: 'Slide 9 de 10 · Compreensão Leitora',
        color: '#06b6d4',
        bullets: [
          '🦅 **Skimming (Visão Panorâmica)**: Olhar rápido para o título e as primeiras frases para pegar a ideia principal. Não pare em palavras difíceis!',
          '🔍 **Scanning (Radar de Detetive)**: Correr os olhos pelo texto procurando um número, uma data ou um nome próprio (ex: achar "2024" ou "Sparky").',
          '🧠 **Inferência Contextual**: Deduzir o significado de uma palavra desconhecida olhando as palavras vizinhas e o sentido geral da frase.'
        ],
        formula: 'Skimming (Geral) + Scanning (Detalhes) = Leitura 100% Eficaz',
        highlight: 'Nunca tente traduzir palavra por palavra! Use essas 3 técnicas e você lerá com velocidade!',
        quiz: {
          question: '⚡ Mini-Desafio do Slide 9: Se você precisa encontrar a data "2024" no texto rapidamente, qual técnica você usa?',
          options: [
            'Scanning (correr os olhos buscando o número específico)',
            'Skimming (ler o texto inteiro devagar)',
            'Tradução com dicionário palavra por palavra'
          ],
          correctIndex: 0,
          explanation: 'Exato! Scanning é a busca visual rápida por dados específicos como números e nomes.'
        }
      },
      {
        pageNumber: 10,
        title: 'Quadro Resumo & Hora de Praticar!',
        subtitle: 'Tudo o que você precisa em uma única tabela de bolso',
        tag: 'Slide 10 de 10 · Resumo & Atividades',
        color: '#ec4899',
        bullets: [
          '1️⃣ **Present Simple**: Rotinas diárias (`He studies`, `We live`).',
          '2️⃣ **Zero Conditional**: `If + Presente, Presente` (Gelo derrete, fatos certos).',
          '3️⃣ **First Conditional**: `If + Presente, will + verbo` (Se eu estudar, passarei).',
          '4️⃣ **Second Conditional**: `If + Passado, would + verbo` (Se eu tivesse dinheiro, viajaria).',
          '5️⃣ **Conselho Elegante**: `If I were you, I would...`'
        ],
        highlight: '🎉 Parabéns! Você concluiu a apresentação. Agora faça os exercícios práticos abaixo para fixar tudo!',
        quiz: {
          question: '⚡ Mini-Desafio do Slide 10: Qual frase é um exemplo perfeito de First Conditional?',
          options: [
            'If you practice every day, you will speak English fluently.',
            'If you heated ice, it would melt.',
            'If I am you, I study.'
          ],
          correctIndex: 0,
          explanation: 'Sensacional! "If you practice (Presente), you will speak (Futuro com Will)" é a First Conditional perfeita!'
        }
      }
    ],

    // Apostila In-App
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

    // BANCO EXPANDIDO: 22 ATIVIDADES PRÁTICAS FOCADAS NOS SLIDES E CONDIÇÕES
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
        id: 'act_3_present_routine',
        category: 'Revisão: Present Simple',
        title: 'Atividade 3: Sujeitos no Plural (We / They)',
        question: 'Com os sujeitos I, You, We e They, o verbo NÃO muda.\nComplete:\n"We _______ (live) in a beautiful city."',
        options: [
          'live',
          'lives',
          'living',
          'lived'
        ],
        correctIndex: 0,
        explanation: 'Perfeito! Com "We", o verbo permanece na sua forma normal: "We live".',
        xp: 25,
        coins: 5
      },
      {
        id: 'act_4_skimming',
        category: 'Leitura A2 (Skimming)',
        title: 'Atividade 4: Ideia Principal do Texto',
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
        id: 'act_5_scanning_year',
        category: 'Leitura A2 (Scanning)',
        title: 'Atividade 5: Encontrando Números no Texto',
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
        id: 'act_6_scanning_age',
        category: 'Leitura A2 (Scanning)',
        title: 'Atividade 6: Localizando a Idade de Lucas',
        question: 'Usando Scanning no primeiro parágrafo do texto, quantos anos tem o Lucas?',
        options: [
          '14 anos (14 years old)',
          '18 anos (18 years old)',
          '10 anos (10 years old)',
          '20 anos (20 years old)'
        ],
        correctIndex: 0,
        explanation: 'Exato! A primeira frase do texto diz: "Lucas is 14 years old".',
        xp: 30,
        coins: 5
      },
      {
        id: 'act_7_inference_smart',
        category: 'Leitura A2 (Inferência)',
        title: 'Atividade 7: Inferência de Vocabulário',
        question: 'No texto, Sparky é chamado de "smart pet" e aprende truques rápido. A palavra "smart" significa:',
        options: [
          'Inteligente / Esperto',
          'Bravo / Agressivo',
          'Com sono / Cansado',
          'Perdido na rua'
        ],
        correctIndex: 0,
        explanation: 'Show! "Smart" significa inteligente e esperto (como em "smartphone").',
        xp: 30,
        coins: 5
      },
      {
        id: 'act_8_zero_conditional_text',
        category: 'Gramática: Zero Conditional',
        title: 'Atividade 8: Causa e Efeito no Presente',
        question: 'Complete a frase da Zero Conditional:\n"If Lucas says \'Sit\', Sparky _______ (sit) immediately."',
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
        id: 'act_9_zero_conditional_water',
        category: 'Gramática: Zero Conditional',
        title: 'Atividade 9: Verdade Científica Universal',
        question: 'Complete com a regra da Zero Conditional (fato comprovado):\n"If you freeze water, it _______ (turn) into ice."',
        options: [
          'turns',
          'turned',
          'will turn',
          'would turn'
        ],
        correctIndex: 0,
        explanation: 'Muito bem! Fatos da natureza usam o Present Simple nos dois verbos: "it turns into ice".',
        xp: 30,
        coins: 6
      },
      {
        id: 'act_10_first_conditional_study',
        category: 'Gramática: First Conditional',
        title: 'Atividade 10: Promessa para o Futuro Real',
        question: 'Qual palavra completa a First Conditional sobre o futuro de Lucas?\n"If I study hard today, I _______ become a computer engineer."',
        options: [
          'will',
          'would',
          'was',
          'did'
        ],
        correctIndex: 0,
        explanation: 'Correto! A First Conditional usa "will" para falar do futuro que vai acontecer se a condição for cumprida!',
        xp: 35,
        coins: 6
      },
      {
        id: 'act_11_first_conditional_rain',
        category: 'Gramática: First Conditional',
        title: 'Atividade 11: Condição do Clima no Futuro',
        question: 'Complete a frase de previsão real da First Conditional:\n"If it rains tomorrow, we _______ (stay) at home."',
        options: [
          'will stay',
          'stay',
          'stayed',
          'would stay'
        ],
        correctIndex: 0,
        explanation: 'Exato! If + Presente (rains) seguido de "will + verbo base" (will stay).',
        xp: 35,
        coins: 6
      },
      {
        id: 'act_12_first_conditional_pass',
        category: 'Gramática: First Conditional',
        title: 'Atividade 12: Consequência dos Estudos',
        question: 'Complete a First Conditional de incentivo do Prof. Vinicius:\n"If you practice every day, you _______ (speak) great English."',
        options: [
          'will speak',
          'spoke',
          'would speak',
          'speaking'
        ],
        correctIndex: 0,
        explanation: 'Perfeito! Se você praticar todo dia, você falará (will speak) um ótimo inglês!',
        xp: 35,
        coins: 6
      },
      {
        id: 'act_13_second_conditional_dream',
        category: 'Gramática: Second Conditional',
        title: 'Atividade 13: Imaginação e Sonho com Would',
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
        id: 'act_14_second_conditional_lottery',
        category: 'Gramática: Second Conditional',
        title: 'Atividade 14: Hipótese da Loteria',
        question: 'Complete a frase hipotética tradicional:\n"If I won the lottery, I _______ (buy) a big house for my family."',
        options: [
          'would buy',
          'will buy',
          'bought',
          'buy'
        ],
        correctIndex: 0,
        explanation: 'Excelente! If + Past (won) seguido de "would buy" (compraria).',
        xp: 35,
        coins: 7
      },
      {
        id: 'act_15_second_conditional_were',
        category: 'Gramática: Second Conditional',
        title: 'Atividade 15: Conselho com "If I were you"',
        question: 'Segundo o Prof. Vinicius Lourenço, qual palavra é usada na Second Conditional formal para dar conselhos?\n"If I _______ you, I would practice English every day."',
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
      },
      {
        id: 'act_16_superpower_imagination',
        category: 'Gramática: Second Conditional',
        title: 'Atividade 16: Imaginação de Superpoderes',
        question: 'Complete a oração imaginária:\n"If I could fly, I _______ (visit) every country in the world."',
        options: [
          'would visit',
          'will visit',
          'visited',
          'visit'
        ],
        correctIndex: 0,
        explanation: 'Sensacional! Situação 100% imaginária leva "would + verbo base": "I would visit"!',
        xp: 40,
        coins: 8
      },

      // NOVAS QUESTÕES ESPECÍFICAS SOBRE OS SLIDES E CONDIÇÕES
      {
        id: 'act_17_slide_conditionals_diff',
        category: 'Desafio dos Slides: Conditionals',
        title: 'Atividade 17: Diferença entre First e Second Conditional',
        question: 'Conforme explicado nos Slides 6 e 7 pelo Prof. Vinicius Lourenço:\nQual é a principal diferença entre a First Conditional e a Second Conditional?',
        options: [
          'A First fala de coisas reais e prováveis no futuro (will), enquanto a Second fala de sonhos e imaginação hipotética (would).',
          'A First fala do passado distante e a Second fala de animais.',
          'Não há nenhuma diferença, ambas significam exatamente a mesma coisa.',
          'A Second Conditional só pode ser usada em dias de chuva.'
        ],
        correctIndex: 0,
        explanation: 'Perfeito! Slide 6 = real e provável no futuro (will). Slide 7 = imaginação, sonho e hipótese (would)!',
        xp: 35,
        coins: 7
      },
      {
        id: 'act_18_slide_zero_button',
        category: 'Desafio dos Slides: Zero Conditional',
        title: 'Atividade 18: Zero Conditional - Causa Imediata',
        question: 'No Slide 5, vimos que a Zero Conditional expressa resultados certos e imediatos.\nComplete:\n"If you press this green button, the robot _______ (start)."',
        options: [
          'starts',
          'would start',
          'started',
          'will to start'
        ],
        correctIndex: 0,
        explanation: 'Correto! Fatos mecânicos e certezas imediatas usam a Zero Conditional: "the robot starts".',
        xp: 35,
        coins: 7
      },
      {
        id: 'act_19_slide_first_schedule',
        category: 'Desafio dos Slides: First Conditional',
        title: 'Atividade 19: First Conditional - Horário da Aula',
        question: 'No Slide 6, vimos que "If + Presente" leva "will + verbo" no resultado.\nComplete:\n"If we leave now at 16:15, we _______ (arrive) on time for the English class."',
        options: [
          'will arrive',
          'would arrive',
          'arrived',
          'arrives'
        ],
        correctIndex: 0,
        explanation: 'Muito bem! Situação real e provável: If + presente (leave) -> will arrive (chegaremos a tempo)!',
        xp: 35,
        coins: 7
      },
      {
        id: 'act_20_slide_second_freetime',
        category: 'Desafio dos Slides: Second Conditional',
        title: 'Atividade 20: Second Conditional - Se eu tivesse mais tempo',
        question: 'No Slide 7, praticamos situações hipotéticas com "If + Past Simple, would + verbo".\nComplete a oração:\n"If I had more free time, I _______ (read) more books in English."',
        options: [
          'would read',
          'will read',
          'reads',
          'readed'
        ],
        correctIndex: 0,
        explanation: 'Sensacional! Como é uma situação hipotética no presente ("se eu tivesse"), usamos "would read" (eu leria)!',
        xp: 40,
        coins: 8
      },
      {
        id: 'act_21_slide_were_advice',
        category: 'Desafio dos Slides: Dica de Ouro do Prof. Vinicius',
        title: 'Atividade 21: Conselho Perfeito com "If I were you"',
        question: 'No Slide 8, o Prof. Vinicius Lourenço ensinou o segredo do "If I were you".\nQual frase está 100% correta de acordo com a norma culta?',
        options: [
          'If I were you, I would drink more water during the day.',
          'If I was you, I will drink more water.',
          'If I am you, I would drank water.',
          'If I be you, I drink water.'
        ],
        correctIndex: 0,
        explanation: 'Show! "If I were you, I would..." é a estrutura padrão formal para expressar conselhos com elegância.',
        xp: 40,
        coins: 8
      },
      {
        id: 'act_22_slide_master_choice',
        category: 'Desafio dos Slides: Escolha da Condicional',
        title: 'Atividade 22: Desafio Mestre dos Slides',
        question: 'Lucas quer dizer ao seu amigo: "Se chover amanhã, nós não iremos ao parque."\nQual condicional ele deve usar de acordo com a apresentação?',
        options: [
          'First Conditional: "If it rains tomorrow, we will not go to the park."',
          'Zero Conditional: "If it rains, we went to park."',
          'Second Conditional: "If it rained tomorrow, we go."',
          'Nenhuma das anteriores.'
        ],
        correctIndex: 0,
        explanation: 'Parabéns! Como é uma situação real e altamente provável no futuro (amanhã), usamos a First Conditional!',
        xp: 45,
        coins: 10
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
    slides: [],
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
