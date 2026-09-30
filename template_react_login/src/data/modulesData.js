export const TYPE_LABELS = {
  quiz: '🧠 Quiz',
  text: '📖 Leitura',
  'gap-fill': '✏️ Lacunas',
  writing: '✍️ Escrita',
  'true-false': '✅ V/F',
  'sentence-order': '🧩 Frases',
  matching: '🔗 Relacionar',
  flashcards: '🎴 Flashcards',
  speaking: '🎙️ Fala',
};

export const MODULES = [
  { id: 1, key: 'Módulo 1', name: 'Módulo 1: Greetings & Foundations (A1)', levelValue: 'Beginner' },
  { id: 2, key: 'Módulo 2', name: 'Módulo 2: Narrative & Travel Foundations (B1.1)', levelValue: 'Intermediate' },
  { id: 3, key: 'Módulo 3', name: 'Módulo 3: Past Continuous & Storytelling (B1.2)', levelValue: 'Advanced' },
  { id: 4, key: 'Módulo 4', name: 'Módulo 4: Modals of Advice & Obligation (B1.3)', levelValue: 'Módulo 4' },
  { id: 5, key: 'Módulo 5', name: 'Módulo 5: Future & Real Conditions (B1.4)', levelValue: 'Módulo 5' },
  { id: 6, key: 'Módulo 6', name: 'Módulo 6: Unreal Conditions & Passive Basics (Bridge B1-B2)', levelValue: 'Módulo 6' },
  { id: 7, key: 'Módulo 7', name: 'Módulo 7: Hypotheticals & Past Regrets (B2.1)', levelValue: 'Módulo 7' },
  { id: 8, key: 'Módulo 8', name: 'Módulo 8: Past Deductions & Relative Clauses (B2.2)', levelValue: 'Módulo 8' },
  { id: 9, key: 'Módulo 9', name: 'Módulo 9: Advanced Voice & Causatives (B2.3)', levelValue: 'Módulo 9' },
  { id: 10, key: 'Módulo 10', name: 'Módulo 10: Idioms, Collocations & Fluency (B2.4)', levelValue: 'Módulo 10' }
];

export const MODULE_COLORS = [
  '#00b4d8', // Módulo 1 (Blue)
  '#b388ff', // Módulo 2 (Purple)
  '#48c78e', // Módulo 3 (Green)
  '#ffb74d', // Módulo 4 (Orange)
  '#ff8fa3', // Módulo 5 (Pink)
  '#00f5d4', // Módulo 6 (Teal)
  '#fee440', // Módulo 7 (Yellow)
  '#9b5de5', // Módulo 8 (Indigo)
  '#f15bb5', // Módulo 9 (Magenta)
  '#00b4d8'  // Módulo 10 (Blue)
];

export const MODULE_EXPLANATIONS = {
  1: {
    title: 'Greetings & Introductions (A1)',
    subtitle: 'Aprenda a cumprimentar, apresentar-se e usar o verbo To Be',
    content: `### 📖 Explicação
Em inglês, a forma como cumprimentamos as pessoas depende do nível de formalidade e da hora do dia.

**Cumprimentos Comuns (Greetings):**
*   **Hello / Hi:** Olá / Oi (Geral)
*   **Good morning:** Bom dia (até 12h)
*   **Good afternoon:** Boa tarde (das 12h às 18h)
*   **Good evening:** Boa noite (ao chegar ou encontrar alguém)
*   **Good night:** Boa noite (ao se despedir ou ir dormir)

**Verbo To Be (Ser/Estar):**
*   **I am** (Eu sou/estou)
*   **He / She / It is** (Ele/Ela é/está)
*   **We / You / They are** (Nós somos/Vocês são/Eles são)

### ✍️ Exemplos
*   *A: "Hello! My name is John. Nice to meet you."*
*   *B: "Hi John! I'm Mary. Nice to meet you too."*
*   *A: "How are you today?"*
*   *B: "I'm fine, thank you. And you?"*`
  },
  2: {
    title: 'Narrative & Travel Foundations (B1.1)',
    subtitle: 'Past Simple, Preposições, Vocabulário de Aeroporto e First Conditional',
    content: `### 📖 Guia Completo B1.1: Past Simple, Preposições e Viagens

Neste módulo do nível **CEFR B1**, focamos nas bases da narrativa e em situações reais de viagem e aeroporto.

### 📍 1. Preposições de Tempo e Lugar (In, On, At, Under)
*   **AT:** Horas exatas e pontos geográficos específicos (*at 7 PM*, *at the station*, *at school*).
*   **ON:** Dias da semana, datas completas e superfícies planas (*on Friday*, *on the table*, *on July 15th*).
*   **IN:** Meses, anos, estações do ano, cidades, países e espaços fechados (*in July*, *in 2026*, *in Brazil*, *in the room*).
*   **UNDER:** Diretamente abaixo de algo (*under the bed*, *under the desk*).

### 📝 2. Past Simple vs Present Perfect
*   **Past Simple:** Para ações finalizadas com tempo determinado no passado (*I went to London two years ago*).
*   **Present Perfect (have/has + particípio):** Para experiências de vida ou ações sem tempo definido (*She has already visited Paris*).

### ✈️ 3. Vocabulário de Aeroporto e Viagens
*   **Boarding pass:** Cartão de embarque oficial.
*   **Luggage allowance:** Limite de bagagem permitido.
*   **Departure gate:** Portão de embarque para o avião.
*   **Delay:** Atraso na partida ou chegada.
*   **Customs:** Alfândega e controle de fronteira.

### 🧩 4. First Conditional (Condição Real)
*   **Fórmula:** If + Present Simple, will + Verbo Base.
*   *Exemplo:* *If it rains, we will stay home.*`
  },
  3: {
    title: 'Past Continuous & Storytelling (B1.2)',
    subtitle: 'Ações contínuas no passado, quando/enquanto e narração de eventos',
    content: `### 📖 Guia Completo B1.2: Past Continuous e Narração

No nível B1.2, você desenvolve a habilidade de contar histórias e relatar incidentes combinando tempos verbais.

### ⏳ 1. Past Continuous (was/were + verb-ing)
Usado para ações em andamento em um determinado momento do passado:
*   *I was watching television at 8 PM yesterday.*
*   *They were driving to the beach when it started to rain.*

### 🔗 2. Conectores Narrativos: When vs While
*   **While (Enquanto):** Introduz uma ação contínua ou de maior duração.
    *   *While I was cooking, my friend called me.*
*   **When (Quando):** Introduz uma ação pontual que interrompe outra.
    *   *I was sleeping when the alarm went off.*
*   **Suddenly (De repente):** Marca uma mudança inesperada na narrativa.
*   **As soon as (Assim que):** Indica que uma ação aconteceu logo em seguida da outra.

### 🎴 3. Phrasal Verbs Narrativos
*   **Turn out:** Resultar / Revelar-se no final (*It turned out to be a great day*).
*   **End up:** Acabar / Ir parar em um lugar inesperado (*We ended up in another town*).
*   **Come across:** Encontrar algo por acaso (*I came across an old letter*).
*   **Bump into:** Esbarrar / Encontrar alguém conhecido sem planejar.`
  },
  4: {
    title: 'Modals of Advice & Obligation (B1.3)',
    subtitle: 'Should, Must, Have to, May/Might e solicitações polidas',
    content: `### 📖 Guia Completo B1.3: Verbos Modais e Recomendações

Os verbos modais alteram o sentido do verbo principal para expressar obrigação, conselho, permissão ou dedução.

### 📋 1. Obrigação: Must vs Have to
*   **Must:** Obrigação forte, frequentemente pessoal ou de segurança vital (*Passengers must wear seatbelts*).
*   **Have to:** Obrigação externa vinda de leis, contratos ou regras institucionais (*In the UK, you have to drive on the left*).
*   **Mustn't (Proibição):** Estritamente proibido (*You mustn't smoke inside the hospital*).
*   **Don't have to (Sem obrigação):** Opcional, não é necessário fazer (*Museum entry is free; you don't have to pay*).

### 💡 2. Conselho: Should, Ought to, Had better
*   **Should / Ought to:** Recomendações e conselhos amigos (*You should drink more water*).
*   **Had better:** Conselho enérgico com aviso de consequência negativa (*You had better hurry, or you will miss the train*).

### 🎩 3. Pedidos Polidos
*   *Could you please repeat that?* (Você poderia repetir?)
*   *Would you mind opening the window?* (Você se importaria de abrir a janela?)`
  },
  5: {
    title: 'Future & Real Conditions (B1.4)',
    subtitle: 'Will vs Going to vs Present Continuous, orações temporais com unless e as soon as',
    content: `### 📖 Guia Completo B1.4: O Futuro e Condições Reais

Dominar as diferentes formas de expressar o futuro é indispensável para a fluência intermediária.

### 🔮 1. Formas de Futuro
*   **Will:** Decisões tomadas no momento da fala (*"The phone is ringing!" - "I will answer it!"*) e previsões gerais sem evidência direta.
*   **Going to:** Intenções previamente decididas (*I am going to take a coding course*) ou previsões baseadas em evidências visuais claras (*Look at the dark clouds; it is going to rain!*).
*   **Present Continuous:** Compromissos confirmados com horário e local definidos (*We are flying to London next Friday*).

### ⏱️ 2. Conectivos de Tempo no Futuro
Nunca use "will" dentro da oração temporal:
*   *As soon as I arrive, I will call you.* (E não *As soon as I will arrive*).
*   **Unless (A não ser que / Se não):** *Unless you study, you will fail.*
*   **Until (Até que):** *Wait here until the doctor arrives.*
*   **In case (Caso / Por precaução):** *Take an umbrella in case it rains.*`
  },
  6: {
    title: 'Unreal Conditions & Passive Basics (Bridge B1-B2)',
    subtitle: 'Second Conditional, Hipóteses no presente e Voz Passiva essencial',
    content: `### 📖 Ponte B1 ➔ B2: Second Conditional e Voz Passiva

Esta etapa consolida a transição para o nível independente B2 com estruturas sofisticadas.

### 💭 1. Second Conditional (Situações Hipotéticas)
Trata de cenários imaginários ou improváveis no presente/futuro:
*   **Fórmula:** If + Past Simple, would + Verbo Base.
*   *Exemplo:* *If I won the lottery, I would travel around the world.*
*   **A Regra do "WERE":** Usa-se *were* para todas as pessoas em contexto formal/hipotético:
    *   *If I were you, I would accept the job offer.*

### 🏛️ 2. Voz Passiva Básica (Verb To Be + Past Participle)
Usada quando o foco está na ação ou no objeto que a recebeu, e não em quem a praticou:
*   **Present Passive:** *Smartphones are manufactured in modern factories.*
*   **Past Passive:** *The monument was built in 1889 by Gustave Eiffel.*
*   **Agente com "By":** *The novel was written by Jane Austen.*`
  },
  7: {
    title: 'Hypotheticals & Past Regrets (B2.1)',
    subtitle: 'Third Conditional, Mixed Conditionals, Desejos com Wish e If only',
    content: `### 📖 Guia Completo B2.1: Arrependimentos e Terceira Condicional

No nível B2.1, aprendemos a analisar o passado que não pode ser alterado e expressar remorso ou alívio.

### ⏳ 1. Third Conditional (O Passado Impossível)
*   **Fórmula:** If + Past Perfect (had + Particípio), would have + Particípio.
*   *Exemplo:* *If I had known about the traffic, I would have taken the subway.*
*   *(Significado: Eu não sabia do trânsito, por isso não peguei o metrô).*

### 💔 2. Wish e If Only para Arrependimentos
*   **Wish + Past Perfect:** Expressa arrependimento de algo que aconteceu no passado.
    *   *I wish I had brought my umbrella; now I am completely wet.*
    *   *If only we had reserved our tickets in advance!*

### 🔀 3. Mixed Conditionals (Causa no Passado com Efeito no Presente)
*   *If I had studied harder in college, I would have a better job today.*`
  },
  8: {
    title: 'Past Deductions & Relative Clauses (B2.2)',
    subtitle: 'Deduções com Must have / Can\'t have, orações relativas com who, which, whose, that',
    content: `### 📖 Guia Completo B2.2: Deduções Lógicas e Orações Relativas

O nível B2.2 exige precisão para fazer inferências lógicas sobre evidências e conectar ideias complexas.

### 🔍 1. Deduções no Passado (Past Modals of Deduction)
*   **Must have (+ Particípio):** Certeza quase total de que algo aconteceu (*The streets are wet; it must have rained heavily*).
*   **Can't have / Couldn't have (+ Particípio):** Certeza de que algo é impossível ter acontecido (*He can't have committed the crime; he was overseas with fifty witnesses*).
*   **Might have / May have (+ Particípio):** Possibilidade em aberto (*She might have forgotten her keys in the car*).

### 🔗 2. Orações Relativas (Relative Clauses)
*   **Who / Whom:** Para pessoas (Whom em contextos formais ou após preposições).
*   **Which:** Para objetos, animais ou orações inteiras.
*   **Whose:** Para indicar posse (*The author whose book won the prize*).
*   **Where:** Para lugares (*This is the library where we studied*).
*   **Defining vs Non-defining:** Orações com vírgula trazem informação extra e **nunca** usam "that".`
  },
  9: {
    title: 'Advanced Voice & Causatives (B2.3)',
    subtitle: 'Estruturas causativas (Have/Get done), passiva impessoal e inversão enfática',
    content: `### 📖 Guia Completo B2.3: Estruturas Causativas e Inversão

Nesta etapa, o estudante domina estruturas utilizadas em artigos acadêmicos, jornalismo e comunicação executiva.

### 🛠️ 1. Estruturas Causativas (Have / Get something done)
Usadas quando pagamos ou delegamos um serviço a um profissional:
*   *I had my car repaired by a certified mechanic.*
*   *She is going to have her hair cut tomorrow.*
*   *Get someone to do:* Persuadir alguém (*I got my colleague to proofread my report*).

### 📰 2. Voz Passiva Impessoal e de Relato
*   *It is widely believed that exercise improves cognitive function.*
*   *The ancient temple is thought to date back to 1200 BC.*

### ⚡ 3. Inversão após Advérbios Negativos (Ênfase B2/C1)
*   **Seldom / Rarely:** *Seldom have I seen such dedication.*
*   **Hardly... when:** *Hardly had I arrived when the meeting started.*
*   **Not only... but also:** *Not only did he apologize, but he also offered compensation.*`
  },
  10: {
    title: 'Idioms, Collocations & Fluency (B2.4)',
    subtitle: 'Colocações corporativas, marcadores de discurso, debate e expressões idiomáticas cultas',
    content: `### 📖 Guia Completo B2.4: Fluência Avançada, Colocações e Debates

A etapa de coroação do nível B2 consolida a naturalidade lexical e a capacidade de argumentação sofisticada.

### 💼 1. Colocações Naturais de Alto Nível
*   **Conduct due diligence:** Fazer auditoria e verificação minuciosa.
*   **Draw conclusions:** Chegar a conclusões fundamentadas (*not "make conclusions"*).
*   **Reach a compromise:** Alcançar um acordo ou meio-termo.
*   **Take into account / consideration:** Levar em consideração.

### ⚖️ 2. Marcadores de Discurso e Conectores de Contraste
*   **Nevertheless / Nonetheless:** Não obstante / Mesmo assim (*The deal was risky; nevertheless, we proceeded*).
*   **Whereas / While:** Enquanto que / Ao passo que (contraste direto entre duas ideias).
*   **Despite / In spite of (+ substantivo/gerúndio):** Apesar de (*Despite the storm, our flight landed safely*).

### 🎭 3. Expressões Idiomáticas Refinadas
*   **Play devil's advocate:** Defender o ponto de vista oposto para enriquecer o debate.
*   **See eye to eye:** Concordar plenamente em determinado assunto.
*   **Bite the bullet:** Tomar uma decisão difícil e inevitável com coragem.
*   **Read between the lines:** Perceber o significado implícito nas entrelinhas.`
  }
};

export const getModuleIdForExercise = (exercise) => {
  if (!exercise || !exercise.level) return 1;
  const lvl = exercise.level.toLowerCase();
  if (lvl === 'beginner' || lvl === 'módulo 1' || lvl === 'modulo 1') return 1;
  if (lvl === 'intermediate' || lvl === 'módulo 2' || lvl === 'modulo 2') return 2;
  if (lvl === 'advanced' || lvl === 'módulo 3' || lvl === 'modulo 3') return 3;
  if (lvl === 'módulo 4' || lvl === 'modulo 4') return 4;
  if (lvl === 'módulo 5' || lvl === 'modulo 5') return 5;
  if (lvl === 'módulo 6' || lvl === 'modulo 6') return 6;
  if (lvl === 'módulo 7' || lvl === 'modulo 7') return 7;
  if (lvl === 'módulo 8' || lvl === 'modulo 8') return 8;
  if (lvl === 'módulo 9' || lvl === 'modulo 9') return 9;
  if (lvl === 'módulo 10' || lvl === 'modulo 10') return 10;
  return 1;
};

export const isRpgExerciseCompleted = (p) => {
  if (!p) return false;
  if (p.status !== 'completed') return false;
  if (p.totalQuestions > 0 && p.score !== p.totalQuestions) {
    return false;
  }
  return true;
};

export const isModuleUnlocked = (assignedExercises, moduleId) => {
  if (moduleId === 1) return true;
  for (let m = 1; m < moduleId; m++) {
    const prevModuleExercises = assignedExercises.filter(p => p.exercise?.isRpg && getModuleIdForExercise(p.exercise) === m);
    if (prevModuleExercises.length > 0) {
      const allCompleted = prevModuleExercises.every(p => isRpgExerciseCompleted(p));
      if (!allCompleted) return false;
    }
  }
  return true;
};
