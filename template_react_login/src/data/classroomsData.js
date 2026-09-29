// src/data/classroomsData.js
// Dados de Aulas, Apostilas em PDF e Atividades específicas por aula

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
    title: 'Conditionals (Zero, First, Second) & Reading Comprehension',
    theme: 'Grammar & Textual Strategies',
    teacher: 'Prof. English Quest',
    room: 'Sala Virtual / Presencial - Turma Alpha',
    level: 'Intermediário (B1-B2)',
    summary: 'Aprenda e domine a estrutura das orações condicionais (Zero, First e Second Conditionals) e acelere sua interpretação de textos com Skimming, Scanning e Inferência Contextual.',
    
    // Conteúdo da Apostila em PDF para leitura in-app
    pdfDocument: {
      title: 'Apostila de Aula: Conditionals & Reading Comprehension',
      subtitle: 'Material Oficial da Aula das 16:30 · Quest English',
      version: 'Edição 2026.1',
      author: 'Quest English Academic Team',
      date: getTodayDateString(),
      sections: [
        {
          id: 'conditionals_intro',
          title: '1. Conditionals (Orações Condicionais)',
          type: 'theory',
          content: `As condicionais são usadas para mostrar que uma ação depende de outra (causa e consequência), utilizando frequentemente a palavra **If** (Se).

Elas conectam uma condição a um resultado em diferentes níveis de certeza temporal (fatos reais, previsões futuras e hipóteses imaginárias).`
        },
        {
          id: 'zero_conditional',
          title: 'Zero Conditional (Condicional Zero)',
          type: 'rule',
          badge: 'Fatos e Leis Científicas',
          formula: 'If + Present Simple, Present Simple',
          explanation: 'Utilizada para expressar fatos, regras e verdades universais ou científicas. O resultado é sempre garantido.',
          examples: [
            { en: 'If you heat ice, it melts.', pt: 'Se aqueceres gelo, ele derrete.' },
            { en: 'If people do not drink water, they get dehydrated.', pt: 'Se as pessoas não bebem água, ficam desidratadas.' },
            { en: 'If you press this button, the machine turns on.', pt: 'Se você apertar este botão, a máquina liga.' }
          ]
        },
        {
          id: 'first_conditional',
          title: 'First Conditional (Primeira Condicional)',
          type: 'rule',
          badge: 'Situações Reais / Prováveis no Futuro',
          formula: 'If + Present Simple, will + verbo no infinitivo',
          explanation: 'Serve para descrever situações reais ou altamente prováveis de acontecerem no futuro, dependendo de uma condição no presente.',
          examples: [
            { en: 'If it rains tomorrow, we will stay at home.', pt: 'Se chover amanhã, nós ficaremos em casa.' },
            { en: 'If you study hard, you will pass the English exam.', pt: 'Se você estudar bastante, passará no exame de inglês.' },
            { en: 'If we leave now, we will catch the 16:30 bus.', pt: 'Se sairmos agora, pegaremos o ônibus das 16:30.' }
          ]
        },
        {
          id: 'second_conditional',
          title: 'Second Conditional (Segunda Condicional)',
          type: 'rule',
          badge: 'Situações Hipotéticas ou Improváveis',
          formula: 'If + Past Simple, would + verbo no infinitivo',
          explanation: `Emprega-se para expressar situações hipotéticas, irreais ou altamente improváveis no presente ou no futuro.`,
          note: `⚠️ Nota Gramatical Importante: Com o verbo to be, é comum usar a forma WERE para todas as pessoas do singular e plural na linguagem culta/formal (ex: "If I were you", "If he were here").`,
          examples: [
            { en: 'If I won the lottery, I would travel the world.', pt: 'Se eu ganhasse a loteria, viajaria pelo mundo.' },
            { en: 'If I were you, I would take that opportunity.', pt: 'Se eu fosse você, aproveitaria essa oportunidade.' },
            { en: 'If they had more free time, they would learn Japanese.', pt: 'Se eles tivessem mais tempo livre, aprenderiam japonês.' }
          ]
        },
        {
          id: 'reading_comprehension',
          title: '2. Reading Comprehension (Compreensão Leitora)',
          type: 'theory',
          content: `Esta componente avalia a capacidade de entender, interpretar e extrair informações com agilidade de um texto em inglês sem depender de tradução palavra por palavra.`
        },
        {
          id: 'reading_techniques',
          title: 'Técnicas de Leitura Rápida e Eficiente',
          type: 'cards',
          techniques: [
            {
              icon: '🦅',
              name: 'Skimming (Visão Panorâmica)',
              desc: 'Leitura rápida e superficial do texto para captar o tema e a ideia principal, sem focar em palavras desconhecidas.',
              tip: 'Leia o título, subtítulos, primeira e última frase de cada parágrafo.'
            },
            {
              icon: '🔍',
              name: 'Scanning (Radar de Dados)',
              desc: 'Procurar informações específicas (datas, nomes próprios, números, porcentagens) percorrendo o texto com os olhos até encontrar o dado desejado.',
              tip: 'Mantenha em mente a palavra-chave antes de passar os olhos pelo texto.'
            },
            {
              icon: '🧠',
              name: 'Inferência e Contexto (Dedução Inteligente)',
              desc: 'Adivinhar o significado de palavras difíceis através do contexto das frases vizinhas, em vez de depender de dicionário ou traduções literais.',
              tip: 'Observe se o tom é positivo ou negativo e quais palavras acompanham o termo desconhecido.'
            }
          ]
        },
        {
          id: 'reading_sample_text',
          title: '3. Texto Oficial de Leitura para a Aula',
          type: 'text_box',
          textTitle: 'The Green Metropolises of 2030',
          textContent: `In the heart of modern urban design, visionary architects and engineers are transforming gray cities into sustainable havens. In EcoMetropolis, an innovative initiative launched in 2021, urban planners made a bold promise: the city will reach zero net carbon emissions by 2030.

If public authorities invest in solar infrastructure, urban pollution drops immediately. Last year alone, over 150,000 smart solar roofs were installed across public schools and residential towers. 

The local green economy is thriving after these green reforms. Small businesses and technology startups report record profits, proving that ecological preservation and financial prosperity can walk hand in hand.

Dr. Sarah Bennett, the lead environmental researcher on the project, stated: "If every major capital adopted these green practices today, we would reverse global climate risks much faster. If people understand the power of collective actions, our future will be secure."`
        }
      ]
    },

    // Atividades práticas interativas da aula de hoje
    activities: [
      {
        id: 'act_1_skimming',
        category: 'Reading Comprehension',
        type: 'skimming',
        title: 'Técnica de Skimming: Ideia Principal',
        question: 'Ao aplicar a técnica de Skimming (leitura rápida global) no texto "The Green Metropolises of 2030", qual é o tema central?',
        options: [
          'A história da construção de estradas no século XIX.',
          'Como projetos de sustentabilidade urbana e energia verde estão transformando uma metrópole moderna.',
          'Um guia passo a passo para consertar painéis solares danificados.',
          'A biografia da infância da pesquisadora Dr. Sarah Bennett.'
        ],
        correctIndex: 1,
        explanation: 'Excelente! O Skimming foca na essência do texto: uma cidade moderna implantando reformas ecológicas e energia limpa.',
        xp: 30,
        coins: 5
      },
      {
        id: 'act_2_scanning',
        category: 'Reading Comprehension',
        type: 'scanning',
        title: 'Técnica de Scanning: Localizando Dados',
        question: 'Aplicando Scanning (busca de número/ano específico), qual é o ano em que EcoMetropolis promete alcançar emissões líquidas zero?',
        options: [
          'Ano de 2021',
          'Ano de 2025',
          'Ano de 2030',
          'Ano de 2050'
        ],
        correctIndex: 2,
        explanation: 'Correto! Com Scanning você localizou rapidamente o número "2030" associado a "zero net carbon emissions".',
        xp: 30,
        coins: 5
      },
      {
        id: 'act_3_inference',
        category: 'Context Inference',
        type: 'inference',
        title: 'Inferência Contextual de Vocabulário',
        question: 'No terceiro parágrafo, a expressão "The local green economy is thriving after these green reforms" indica que a economia está:',
        options: [
          'Prosperando e crescendo com muito vigor',
          'Entrando em falência e demitindo funcionários',
          'Completamente parada e estagnada',
          'Cancelada pelas autoridades locais'
        ],
        correctIndex: 0,
        explanation: 'Muito bem! "Thriving" significa prosperar/florescer, confirmado pela frase seguinte que menciona "record profits".',
        xp: 30,
        coins: 5
      },
      {
        id: 'act_4_zero_cond',
        category: 'Grammar - Conditionals',
        type: 'zero_conditional',
        title: 'Zero Conditional: Fatos Universais',
        question: 'Complete a oração com a regra da Zero Conditional (If + Present Simple, Present Simple):\n"If you heat ice, it _______ (melt)."',
        options: [
          'melts',
          'will melt',
          'would melt',
          'melted'
        ],
        correctIndex: 0,
        explanation: 'Perfeito! Na Zero Conditional expressamos verdades universais e leis da física com os dois verbos no Present Simple: "it melts".',
        xp: 35,
        coins: 6
      },
      {
        id: 'act_5_first_cond',
        category: 'Grammar - Conditionals',
        type: 'first_conditional',
        title: 'First Conditional: Situação Real no Futuro',
        question: 'Qual alternativa completa corretamente a First Conditional?\n"If it _______ tomorrow, we will stay at home."',
        options: [
          'rains',
          'will rain',
          'rained',
          'would rain'
        ],
        correctIndex: 0,
        explanation: 'Exato! A estrutura da First Conditional é If + Present Simple (rains), will + infinitivo (we will stay).',
        xp: 35,
        coins: 6
      },
      {
        id: 'act_6_second_cond',
        category: 'Grammar - Conditionals',
        type: 'second_conditional',
        title: 'Second Conditional: Situação Hipotética',
        question: 'Complete a frase hipotética da Second Conditional:\n"If I won the lottery, I _______ around the world."',
        options: [
          'would travel',
          'will travel',
          'travel',
          'travelled'
        ],
        correctIndex: 0,
        explanation: 'Show! Na Second Conditional usamos If + Past Simple (won) seguido de would + verbo base (would travel).',
        xp: 35,
        coins: 6
      },
      {
        id: 'act_7_second_cond_were',
        category: 'Grammar - Conditionals',
        type: 'second_conditional',
        title: 'Second Conditional: Verbo "to be"',
        question: 'Na Second Conditional formal com o verbo "to be", qual é a forma padrão para expressar um conselho ou hipótese?\n"If I _______ you, I would accept the job offer."',
        options: [
          'were',
          'was',
          'am',
          'been'
        ],
        correctIndex: 0,
        explanation: 'Excelente! "If I were you" é a forma padrão formal da Second Conditional para conselhos e hipóteses!',
        xp: 40,
        coins: 8
      }
    ]
  },

  // Aulas Anteriores registradas no histórico
  {
    id: 'lesson_past_1',
    date: '2026-09-25',
    time: '16:30',
    duration: '50 min',
    isToday: false,
    title: 'Present Perfect vs Past Simple & Life Experiences',
    theme: 'Verb Tenses Mastery',
    teacher: 'Prof. English Quest',
    room: 'Sala Virtual - Turma Alpha',
    level: 'Intermediário (B1)',
    summary: 'Diferenciação clara entre ações concluídas no passado com tempo determinado (Past Simple) e experiências de vida sem tempo específico (Present Perfect com Have/Has).',
    pdfDocument: {
      title: 'Apostila de Aula: Present Perfect vs Past Simple',
      subtitle: 'Resumo da Aula de 25 de Setembro',
      version: 'Edição 2026.09',
      author: 'Quest English Academic Team',
      date: '2026-09-25',
      sections: [
        {
          id: 'past_simple_rule',
          title: '1. Past Simple (Tempo Definido)',
          type: 'rule',
          badge: 'Passado Concluído',
          formula: 'Subject + Past Verb + Time Expression (yesterday, last year, in 2020)',
          explanation: 'Usado quando o momento no passado é explicitamente dito ou conhecido.',
          examples: [
            { en: 'I visited London in 2022.', pt: 'Eu visitei Londres em 2022.' }
          ]
        },
        {
          id: 'present_perfect_rule',
          title: '2. Present Perfect (Experiência ou Conexão com o Presente)',
          type: 'rule',
          badge: 'Experiência de Vida',
          formula: 'Subject + have/has + Past Participle',
          explanation: 'Usado para falar sobre experiências sem importar quando ocorreram, ou ações que continuam até o presente.',
          examples: [
            { en: 'I have visited London three times.', pt: 'Eu já visitei Londres três vezes.' }
          ]
        }
      ]
    },
    activities: [
      {
        id: 'past_act_1',
        category: 'Grammar',
        title: 'Past Simple vs Present Perfect',
        question: 'Escolha a opção correta: "I _______ to Paris two years ago."',
        options: ['went', 'have gone', 'go', 'was going'],
        correctIndex: 0,
        explanation: 'Com marcador de tempo fixo ("two years ago"), usamos o Past Simple (went).',
        xp: 30,
        coins: 5
      }
    ]
  },

  {
    id: 'lesson_past_2',
    date: '2026-09-22',
    time: '16:30',
    duration: '50 min',
    isToday: false,
    title: 'Modal Verbs: Advice, Obligation & Deduction',
    theme: 'Modal Verbs (Should, Must, Could, Might)',
    teacher: 'Prof. English Quest',
    room: 'Sala Presencial - Turma Alpha',
    level: 'Intermediário (B1)',
    summary: 'Uso de verbos modais em contextos reais: conselhos (should/ought to), obrigações (must/have to) e deduções lógicas (can/might/could).',
    pdfDocument: {
      title: 'Apostila de Aula: Modal Verbs in Daily English',
      subtitle: 'Resumo da Aula de 22 de Setembro',
      version: 'Edição 2026.09',
      author: 'Quest English Academic Team',
      date: '2026-09-22',
      sections: [
        {
          id: 'modals_summary',
          title: '1. Principais Verbos Modais',
          type: 'cards',
          techniques: [
            { icon: '💡', name: 'Should', desc: 'Conselhos e recomendações ("You should drink more water").' },
            { icon: '🔒', name: 'Must', desc: 'Obrigação forte ou necessidade inadiável ("You must wear a seatbelt").' },
            { icon: '🔮', name: 'Might / Could', desc: 'Possibilidade no presente ou futuro ("It might rain later").' }
          ]
        }
      ]
    },
    activities: [
      {
        id: 'past_act_2',
        category: 'Grammar',
        title: 'Modal Verbs: Recomendações',
        question: 'Qual modal expressa conselho amigável? "You look tired, you _______ rest."',
        options: ['should', 'must', 'might', 'shall'],
        correctIndex: 0,
        explanation: '"Should" é o modal por excelência para dar conselhos e sugestões.',
        xp: 30,
        coins: 5
      }
    ]
  }
];
