import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MODULE_DEFINITIONS = {
  // ─────────────────────────────────────────────────────────────
  // MÓDULO 2: CEFR B1.1 – Narrative Foundations & Travel
  // Level in DB: 'Intermediate'
  // ─────────────────────────────────────────────────────────────
  2: {
    level: 'Intermediate',
    exercises: [
      {
        title: 'M2.1: Past Simple Irregular Verbs',
        type: 'quiz',
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
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // MÓDULO 3: CEFR B1.2 – Past Continuous, Narrative Connectors & Storytelling
  // Level in DB: 'Advanced' (mapped to Module 3 in frontend)
  // ─────────────────────────────────────────────────────────────
  3: {
    level: 'Advanced',
    exercises: [
      {
        title: 'M3.1: Past Continuous vs Past Simple',
        type: 'quiz',
        content: {
          text: 'Select the correct verb forms for simultaneous or interrupted past actions.',
          questions: [
            { question: "While I ___ to music, the doorbell rang.", options: ["listened", "was listening", "were listening", "listen"], correct: "was listening" },
            { question: "They ___ soccer when it suddenly started to hail.", options: ["played", "were playing", "was playing", "are playing"], correct: "were playing" },
            { question: "What were you doing at 9 PM yesterday?", options: ["I read a book", "I was reading a book", "I had read", "I am reading"], correct: "I was reading a book" },
            { question: "She broke her ankle while she ___ in the mountains.", options: ["skied", "was skiing", "is skiing", "skies"], correct: "was skiing" },
            { question: "The lights went out while we ___ dinner.", options: ["ate", "were eating", "was eating", "eat"], correct: "were eating" }
          ]
        }
      },
      {
        title: 'M3.2: Irregular Past Actions & Stories',
        type: 'true-false',
        content: {
          text: 'Decida se as frases narrativas em inglês estão gramaticalmente corretas.',
          statements: [
            { statement: "While she was cooking, he fell asleep on the sofa.", correct: true },
            { statement: "They were drive home when the police stopped them.", correct: false },
            { statement: "I heard a loud noise while I was working in the garage.", correct: true },
            { statement: "She didn't heard the phone because she was sleeping.", correct: false },
            { statement: "When the teacher entered the room, all the students were talking.", correct: true }
          ]
        }
      },
      {
        title: 'M3.3: Narrative Connectors Matching',
        type: 'matching',
        content: {
          instructions: 'Relacione os conectores narrativos de nível B1 com seu papel no texto.',
          pairs: [
            { left: 'While', right: 'Introduz uma ação contínua em progresso no passado' },
            { left: 'Suddenly', right: 'Indica um acontecimento rápido e inesperado' },
            { left: 'Although', right: 'Expressa contraste ou concessão entre duas ideias' },
            { left: 'As soon as', right: 'Indica que uma ação aconteceu imediatamente após outra' },
            { left: 'Meanwhile', right: 'Indica algo acontecendo ao mesmo tempo em outro lugar' }
          ]
        }
      },
      {
        title: 'M3.4: Past Sentence Word Order',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para criar frases narrativas bem estruturadas.',
          sentences: [
            { words: ['They', 'were', 'sleeping', 'when', 'the', 'alarm', 'went', 'off'], correct: 'They were sleeping when the alarm went off' },
            { words: ['While', 'I', 'was', 'studying', 'my', 'brother', 'called', 'me'], correct: 'While I was studying my brother called me' },
            { words: ['We', 'saw', 'a', 'shooting', 'star', 'last', 'night'], correct: 'We saw a shooting star last night' },
            { words: ['She', 'was', 'walking', 'home', 'when', 'it', 'began', 'to', 'rain'], correct: 'She was walking home when it began to rain' },
            { words: ['Suddenly', 'the', 'lights', 'in', 'the', 'house', 'flickered'], correct: 'Suddenly the lights in the house flickered' }
          ]
        }
      },
      {
        title: 'M3.5: Narrative Phrasal Verbs',
        type: 'flashcards',
        content: {
          instructions: 'Estude estes phrasal verbs frequentemente utilizados em narrações e histórias.',
          cards: [
            { front: 'Turn out', back: 'Resultar / Revelar-se no final', example: 'The weather was bad at first, but it turned out to be a sunny day.' },
            { front: 'End up', back: 'Acabar / Terminar em uma situação inesperada', example: 'We took the wrong bus and ended up in another town.' },
            { front: 'Come across', back: 'Deparar-se com algo ou alguém por acaso', example: 'I came across an old photograph inside the book.' },
            { front: 'Bump into', back: 'Encontrar alguém por coincidência na rua', example: 'I bumped into an old school friend at the café.' },
            { front: 'Break down', back: 'Quebrar / Parar de funcionar (veículo ou máquina)', example: 'Our car broke down on our way to the beach.' }
          ]
        }
      },
      {
        title: 'M3.6: Past Continuous Interrupted Actions',
        type: 'quiz',
        content: {
          text: 'Choose the best option to complete the interrupted action.',
          questions: [
            { question: "I ___ (walk) in the park when I found a gold coin.", options: ["walked", "was walking", "were walking", "am walking"], correct: "was walking" },
            { question: "While they ___ (prepare) dinner, the fire alarm sounded.", options: ["were preparing", "prepared", "was preparing", "prepare"], correct: "were preparing" },
            { question: "He hurt his back while he ___ (lift) heavy boxes.", options: ["lifted", "was lifting", "is lifting", "were lifting"], correct: "was lifting" },
            { question: "We ___ (drive) along the coast when the tire burst.", options: ["drove", "were driving", "was driving", "are driving"], correct: "were driving" },
            { question: "What ___ you ___ when the earthquake occurred?", options: ["were / doing", "did / do", "was / doing", "are / doing"], correct: "were / doing" }
          ]
        }
      },
      {
        title: 'M3.7: When vs While in Stories',
        type: 'true-false',
        content: {
          text: 'Verifique se o uso de WHEN (pontual) e WHILE (durativo) está correto nas narrativas.',
          statements: [
            { statement: "While the baby was sleeping, the mother cleaned the kitchen.", correct: true },
            { statement: "When I was walk to work, I met Mr. Silva.", correct: false },
            { statement: "He was typing an email when his laptop ran out of battery.", correct: true },
            { statement: "While the plane landed, everyone cheered loudly.", correct: false },
            { statement: "As soon as we arrived at the cabin, it started snowing.", correct: true }
          ]
        }
      },
      {
        title: 'M3.8: My Last Vacation - Reading Comprehension',
        type: 'quiz',
        content: {
          text: "Last year, Elena travelled to Edinburgh for the International Arts Festival. She was staying in a historic hostel near the Royal Mile. Every morning, while the fog was still covering the castle hills, she walked to local coffee shops to plan her day. One afternoon, while she was attending an acoustic concert inside St. Giles' Cathedral, she bumped into her former university professor. They ended up having dinner together and sharing memories of their student days.",
          questions: [
            { question: "Where did Elena travel for the festival?", options: ["Dublin", "London", "Edinburgh", "Glasgow"], correct: "Edinburgh" },
            { question: "Where was Elena staying during her trip?", options: ["In a luxury resort", "In a historic hostel near the Royal Mile", "At her professor's house", "Near the airport"], correct: "In a historic hostel near the Royal Mile" },
            { question: "Who did Elena bump into inside the cathedral?", options: ["Her brother", "A famous musician", "Her former university professor", "A tour guide"], correct: "Her former university professor" },
            { question: "What did Elena and her professor end up doing?", options: ["Buying souvenirs", "Having dinner together", "Attending another concert", "Visiting the castle"], correct: "Having dinner together" }
          ]
        }
      },
      {
        title: 'M3.9: Asking Past Questions',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para formular perguntas gramaticalmente perfeitas no passado.',
          sentences: [
            { words: ['What', 'were', 'you', 'doing', 'at', 'midnight'], correct: 'What were you doing at midnight' },
            { words: ['Did', 'she', 'remember', 'to', 'lock', 'the', 'door'], correct: 'Did she remember to lock the door' },
            { words: ['Why', 'was', 'he', 'running', 'down', 'the', 'street'], correct: 'Why was he running down the street' },
            { words: ['Where', 'did', 'they', 'go', 'after', 'the', 'concert'], correct: 'Where did they go after the concert' },
            { words: ['Who', 'were', 'you', 'talking', 'to', 'on', 'the', 'phone'], correct: 'Who were you talking to on the phone' }
          ]
        }
      },
      {
        title: 'M3.10: Object Pronouns in Narrative Contexts',
        type: 'quiz',
        content: {
          text: 'Select the correct object pronoun to complete each sentence in a narrative context.',
          questions: [
            { question: "I met Sarah yesterday and invited ___ to join our project.", options: ["she", "her", "hers", "herself"], correct: "her" },
            { question: "The tourists were lost, so the policeman helped ___ find the station.", options: ["they", "them", "their", "theirs"], correct: "them" },
            { question: "We baked fresh cookies and gave ___ to our neighbours.", options: ["it", "them", "they", "its"], correct: "them" },
            { question: "Carlos told me a secret, but I promised not to repeat ___ to anyone.", options: ["him", "it", "them", "its"], correct: "it" },
            { question: "Our guide was fantastic; we really enjoyed listening to ___.", options: ["he", "him", "his", "himself"], correct: "him" }
          ]
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // MÓDULO 4: CEFR B1.3 – Modals of Advice, Obligation & Polite Requests
  // Level in DB: 'Módulo 4'
  // ─────────────────────────────────────────────────────────────
  4: {
    level: 'Módulo 4',
    exercises: [
      {
        title: 'M4.1: Must vs Have to vs Should',
        type: 'quiz',
        content: {
          text: 'Choose the most appropriate modal verb for obligation, rules, or personal advice.',
          questions: [
            { question: "You ___ see a doctor if your fever doesn't go down.", options: ["should", "must to", "have", "ought"], correct: "should" },
            { question: "Passengers ___ show a valid boarding pass before entering the plane.", options: ["might", "must", "should to", "could"], correct: "must" },
            { question: "In the UK, drivers ___ drive on the left side of the road.", options: ["have to", "should", "may", "can to"], correct: "have to" },
            { question: "You ___ eat so much sugar; it is bad for your health.", options: ["shouldn't", "don't have to", "must to", "ought"], correct: "shouldn't" },
            { question: "Tomorrow is Sunday, so I ___ wake up early.", options: ["mustn't", "don't have to", "should to", "can't to"], correct: "don't have to" }
          ]
        }
      },
      {
        title: 'M4.2: Rules & Permissions (Mustn\'t vs Don\'t have to)',
        type: 'true-false',
        content: {
          text: 'Identifique se a diferença entre PROIBIÇÃO (mustn\'t) e FALTA DE OBRIGAÇÃO (don\'t have to) está correta.',
          statements: [
            { statement: "You mustn't smoke in hospitals; it is strictly illegal.", correct: true },
            { statement: "Museum admission is free; you must pay ten dollars.", correct: false },
            { statement: "You don't have to wear a suit, casual clothes are fine.", correct: true },
            { statement: "You don't have to touch that wire; it has high electrical current.", correct: false },
            { statement: "Employees have to follow safety regulations at all times.", correct: true }
          ]
        }
      },
      {
        title: 'M4.3: Modal Functions Matching',
        type: 'matching',
        content: {
          instructions: 'Relacione cada verbo modal com a função comunicativa correspondente.',
          pairs: [
            { left: 'Should / Ought to', right: 'Dar conselhos, sugestões e recomendações' },
            { left: 'Must', right: 'Expressar forte obrigação ou regra essencial' },
            { left: 'Mustn\'t', right: 'Expressar proibição estrita ou perigo' },
            { left: 'Don\'t have to', right: 'Indicar ausência de obrigação (opcional)' },
            { left: 'Could / Would you', right: 'Fazer pedidos educados e corteses' }
          ]
        }
      },
      {
        title: 'M4.4: Giving Advice Word Order',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para estruturar conselhos e recomendações educadas.',
          sentences: [
            { words: ['You', 'should', 'drink', 'more', 'water', 'every', 'day'], correct: 'You should drink more water every day' },
            { words: ['He', 'ought', 'to', 'apologize', 'for', 'his', 'mistake'], correct: 'He ought to apologize for his mistake' },
            { words: ['You', 'had', 'better', 'leave', 'now', 'to', 'catch', 'the', 'train'], correct: 'You had better leave now to catch the train' },
            { words: ['Would', 'you', 'mind', 'opening', 'the', 'window'], correct: 'Would you mind opening the window' },
            { words: ['We', 'do', 'not', 'have', 'to', 'work', 'on', 'holidays'], correct: 'We do not have to work on holidays' }
          ]
        }
      },
      {
        title: 'M4.5: Polite Requests & Modals Flashcards',
        type: 'flashcards',
        content: {
          instructions: 'Estude expressões polidas essenciais para situações do dia a dia no exterior.',
          cards: [
            { front: 'Could you please...?', back: 'Você poderia, por favor...?', example: 'Could you please repeat that more slowly?' },
            { front: 'Would you mind (+ verb-ing)?', back: 'Você se importaria de...?', example: 'Would you mind closing the door?' },
            { front: 'May I...?', back: 'Posso... / Dá licença para...?', example: 'May I borrow your pen for a moment?' },
            { front: 'Had better', back: 'É melhor que... (aviso com consequência)', example: 'You had better take an umbrella; it looks like rain.' },
            { front: 'Ought to', back: 'Deveria (sinônimo formal de should)', example: 'Citizens ought to respect the traffic laws.' }
          ]
        }
      },
      {
        title: 'M4.6: Ability & Possibility (Can, Could, May, Might)',
        type: 'quiz',
        content: {
          text: 'Choose the best modal verb to express ability or degrees of possibility.',
          questions: [
            { question: "When she was five, she ___ already swim very well.", options: ["could", "can", "might", "should"], correct: "could" },
            { question: "Take a jacket with you. It ___ get cold later tonight.", options: ["might", "must to", "can to", "ought"], correct: "might" },
            { question: "Excuse me, ___ I ask a quick question?", options: ["may", "must", "should", "ought"], correct: "may" },
            { question: "He isn't answering his phone; he ___ be in a meeting.", options: ["could", "should to", "has", "can to"], correct: "could" },
            { question: "___ you play any musical instruments?", options: ["Can", "May", "Must", "Might"], correct: "Can" }
          ]
        }
      },
      {
        title: 'M4.7: Workplace Rules & Obligations',
        type: 'true-false',
        content: {
          text: 'Avalie a adequação gramatical das regras de trabalho expressas por modais.',
          statements: [
            { statement: "All employees must wear safety helmets on construction sites.", correct: true },
            { statement: "You shouldn't to share your account password with strangers.", correct: false },
            { statement: "Visitors must sign in at the reception before entering.", correct: true },
            { statement: "You don't have to pay for parking; company provides free spots.", correct: true },
            { statement: "Doctors mustn't protect patient confidentiality.", correct: false }
          ]
        }
      },
      {
        title: 'M4.8: Situational Advice Matching',
        type: 'matching',
        content: {
          instructions: 'Relacione o problema da pessoa com o conselho mais adequado.',
          pairs: [
            { left: 'I have a terrible toothache.', right: 'You should make an appointment with the dentist.' },
            { left: 'My computer keeps freezing randomly.', right: 'You had better restart it and back up your files.' },
            { left: 'I always arrive late for my morning meeting.', right: 'You ought to set your alarm fifteen minutes earlier.' },
            { left: 'I don\'t understand this grammar topic.', right: 'You should ask the teacher for extra examples.' },
            { left: 'My passport expires next month.', right: 'You must renew it before booking international trips.' }
          ]
        }
      },
      {
        title: 'M4.9: Workplace Safety - Reading Comprehension',
        type: 'quiz',
        content: {
          text: "Welcome to Apex Logistics. As a new warehouse employee, your safety is our top priority. You must wear high-visibility vests and steel-toed boots at all times on the warehouse floor. You mustn't operate any forklifts unless you possess an accredited certified license. If you hear the fire alarm, you should immediately proceed to the nearest emergency exit without running. You don't have to carry heavy boxes alone; always ask a colleague for assistance.",
          questions: [
            { question: "What must warehouse workers wear at all times?", options: ["Normal sneakers", "High-visibility vests and steel-toed boots", "Suits and ties", "Gloves only"], correct: "High-visibility vests and steel-toed boots" },
            { question: "Under what condition may someone operate a forklift?", options: ["If they are over 18", "Only with an accredited certified license", "If they work fast", "If the manager is watching"], correct: "Only with an accredited certified license" },
            { question: "What should workers do when the fire alarm sounds?", options: ["Call their family", "Proceed immediately to the emergency exit", "Hide under desks", "Continue packing"], correct: "Proceed immediately to the emergency exit" },
            { question: "What rule applies to lifting heavy boxes?", options: ["Workers must lift them alone", "Workers don't have to carry them alone and should ask for help", "Heavy boxes are forbidden", "Boxes must be left on the floor"], correct: "Workers don't have to carry them alone and should ask for help" }
          ]
        }
      },
      {
        title: 'M4.10: Workplace Advice & Requests Word Order',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para estruturar solicitações e normas corporativas.',
          sentences: [
            { words: ['Could', 'you', 'send', 'me', 'the', 'report', 'by', 'email'], correct: 'Could you send me the report by email' },
            { words: ['Employees', 'must', 'wear', 'protective', 'glasses', 'here'], correct: 'Employees must wear protective glasses here' },
            { words: ['You', 'should', 'check', 'the', 'schedule', 'before', 'leaving'], correct: 'You should check the schedule before leaving' },
            { words: ['Would', 'you', 'like', 'a', 'cup', 'of', 'tea'], correct: 'Would you like a cup of tea' },
            { words: ['We', 'ought', 'to', 'schedule', 'a', 'follow', 'up', 'meeting'], correct: 'We ought to schedule a follow up meeting' }
          ]
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // MÓDULO 5: CEFR B1.4 – Future Intentions, Predictions & Real Conditions
  // Level in DB: 'Módulo 5'
  // ─────────────────────────────────────────────────────────────
  5: {
    level: 'Módulo 5',
    exercises: [
      {
        title: 'M5.1: Will vs Going to vs Present Continuous',
        type: 'quiz',
        content: {
          text: 'Choose the correct future form for spontaneous decisions, prior plans, or fixed arrangements.',
          questions: [
            { question: "'The phone is ringing!' - 'Don't worry, I ___ answer it.'", options: ["will", "am going to", "am answering", "answer"], correct: "will" },
            { question: "Look at those dark clouds! It ___ rain very soon.", options: ["is going to", "will", "rains", "is raining"], correct: "is going to" },
            { question: "We have already bought our tickets. We ___ to New York on Friday.", options: ["are flying", "will fly", "fly", "going to fly"], correct: "are flying" },
            { question: "I think that robots ___ perform most repetitive jobs in the future.", options: ["will", "are going to", "is", "have"], correct: "will" },
            { question: "She decided yesterday that she ___ start an online programming course.", options: ["is going to", "will", "shall", "is starting"], correct: "is going to" }
          ]
        }
      },
      {
        title: 'M5.2: Future Intentions & Real Conditions',
        type: 'true-false',
        content: {
          text: 'Avalie se a combinação de frases de futuro com orações temporais (when, as soon as, unless) está correta.',
          statements: [
            { statement: "As soon as I arrive at the airport, I will send you a message.", correct: true },
            { statement: "If it will rain tomorrow, we will cancel our picnic.", correct: false },
            { statement: "She will start her new job next Monday; everything is signed.", correct: true },
            { statement: "Unless you hurry up, you will miss the morning train.", correct: true },
            { statement: "I will call you when I will get home.", correct: false }
          ]
        }
      },
      {
        title: 'M5.3: Future Time Conjunctions Matching',
        type: 'matching',
        content: {
          instructions: 'Relacione as conjunções temporais de futuro com seus respectivos sentidos.',
          pairs: [
            { left: 'Unless', right: 'A não ser que / Se não (equivale a If... not)' },
            { left: 'As soon as', right: 'Assim que / Imediatamente no momento em que' },
            { left: 'Until', right: 'Até que (marca o limite final de uma ação futura)' },
            { left: 'In case', right: 'Caso / Por precaução de algo acontecer' },
            { left: 'By the time', right: 'No momento em que / Até quando algo ocorrer' }
          ]
        }
      },
      {
        title: 'M5.4: Future Plans Word Order',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para formar sentenças expressando planos e previsões futuras.',
          sentences: [
            { words: ['We', 'are', 'going', 'to', 'renovate', 'our', 'kitchen', 'soon'], correct: 'We are going to renovate our kitchen soon' },
            { words: ['I', 'will', 'help', 'you', 'with', 'your', 'bags'], correct: 'I will help you with your bags' },
            { words: ['They', 'are', 'moving', 'to', 'Canada', 'next', 'month'], correct: 'They are moving to Canada next month' },
            { words: ['It', 'will', 'probably', 'snow', 'in', 'the', 'mountains'], correct: 'It will probably snow in the mountains' },
            { words: ['Unless', 'you', 'practice', 'you', 'will', 'not', 'improve'], correct: 'Unless you practice you will not improve' }
          ]
        }
      },
      {
        title: 'M5.5: Future Time Expressions Flashcards',
        type: 'flashcards',
        content: {
          instructions: 'Domine as locuções e marcadores temporais de futuro mais frequentes no nível B1.',
          cards: [
            { front: 'In the near future', back: 'Em um futuro próximo', example: 'Electric vehicles will dominate in the near future.' },
            { front: 'Sooner or later', back: 'Mais cedo ou mais tarde', example: 'Sooner or later, you will have to speak English at work.' },
            { front: 'From now on', back: 'De agora em diante / A partir de agora', example: 'From now on, all meetings will be conducted in English.' },
            { front: 'In two weeks\' time', back: 'Daqui a duas semanas', example: 'Our final exam will take place in two weeks\' time.' },
            { front: 'By tomorrow afternoon', back: 'Até amanhã à tarde', example: 'I will deliver the completed translation by tomorrow afternoon.' }
          ]
        }
      },
      {
        title: 'M5.6: First Conditional with Time Clauses',
        type: 'quiz',
        content: {
          text: 'Select the correct verb forms in first conditional clauses with time connectors.',
          questions: [
            { question: "I will wait here until you ___ back.", options: ["come", "will come", "came", "coming"], correct: "come" },
            { question: "Unless he ___ an umbrella, he will get soaked.", options: ["takes", "will take", "took", "taking"], correct: "takes" },
            { question: "We will book the hotel as soon as we ___ our holiday dates.", options: ["confirm", "will confirm", "confirmed", "confirms"], correct: "confirm" },
            { question: "Take your coat in case the weather ___ cold.", options: ["gets", "will get", "got", "getting"], correct: "gets" },
            { question: "When the package arrives, I ___ you immediately.", options: ["will notify", "notify", "notified", "have notified"], correct: "will notify" }
          ]
        }
      },
      {
        title: 'M5.7: Predictions vs Intentions Review',
        type: 'true-false',
        content: {
          text: 'Julgue se a escolha entre WILL (decisão momentânea/previsão) e GOING TO (intenção prévia/evidência) é adequada.',
          statements: [
            { statement: "The chef bought all ingredients because he is going to make paella.", correct: true },
            { statement: "The ladder is shaking; the man will fall! (based on clear visual evidence)", correct: false },
            { statement: "Scientists predict temperatures will rise over the next decade.", correct: true },
            { statement: "I'm tired. I think I am going to go to sleep now.", correct: false },
            { statement: "We are meeting the marketing manager at 10 AM tomorrow.", correct: true }
          ]
        }
      },
      {
        title: 'M5.8: Cause and Effect Matches',
        type: 'matching',
        content: {
          instructions: 'Relacione as condições (If-clause) com os resultados prováveis de futuro.',
          pairs: [
            { left: 'If you invest in mutual funds,', right: 'you will probably earn dividends over time.' },
            { left: 'If we leave right now,', right: 'we will avoid rush-hour traffic.' },
            { left: 'Unless she submits the application today,', right: 'she will not be considered for the grant.' },
            { left: 'As soon as the semester finishes,', right: 'students will travel for their summer break.' },
            { left: 'If you drink warm milk before bed,', right: 'you will fall asleep much faster.' }
          ]
        }
      },
      {
        title: 'M5.9: Green Cities of the Future - Reading Comprehension',
        type: 'quiz',
        content: {
          text: "Urban planners predict that within the next twenty years, major metropolitan cities will undergo radical transformations. Several European capitals are already going to ban fossil-fuel cars from central districts by 2030. In their place, automated electric trams and extensive cycling networks will dominate public transit. Furthermore, architectural firms are going to build high-rise vertical gardens that generate clean solar energy and reduce atmospheric pollution.",
          questions: [
            { question: "What are several European capitals going to do by 2030?", options: ["Build bigger highways", "Ban fossil-fuel cars from central districts", "Close all parks", "Prohibit cycling"], correct: "Ban fossil-fuel cars from central districts" },
            { question: "What will dominate public transit in future green cities?", options: ["Diesel buses", "Automated electric trams and cycling networks", "Steam trains", "Private helicopters"], correct: "Automated electric trams and cycling networks" },
            { question: "What will vertical high-rise gardens generate?", options: ["Gasoline", "Clean solar energy", "Plastic waste", "Heavy smoke"], correct: "Clean solar energy" },
            { question: "What is the predicted timeframe for these radical urban transformations?", options: ["Next 20 years", "Next 100 years", "Next two centuries", "Next six months"], correct: "Next 20 years" }
          ]
        }
      },
      {
        title: 'M5.10: Future Promises & Projections Word Order',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para estruturar promessas e planos de futuro.',
          sentences: [
            { words: ['I', 'promise', 'I', 'will', 'not', 'forget', 'your', 'birthday'], correct: 'I promise I will not forget your birthday' },
            { words: ['We', 'will', 'contact', 'you', 'as', 'soon', 'as', 'possible'], correct: 'We will contact you as soon as possible' },
            { words: ['Technology', 'will', 'change', 'how', 'we', 'communicate'], correct: 'Technology will change how we communicate' },
            { words: ['They', 'are', 'going', 'to', 'launch', 'the', 'new', 'product'], correct: 'They are going to launch the new product' },
            { words: ['Will', 'you', 'join', 'us', 'for', 'dinner', 'tonight'], correct: 'Will you join us for dinner tonight' }
          ]
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // MÓDULO 6: Bridge B1 ➔ B2 – Unreal Conditions & Basic Passive Voice
  // Level in DB: 'Módulo 6'
  // ─────────────────────────────────────────────────────────────
  6: {
    level: 'Módulo 6',
    exercises: [
      {
        title: 'M6.1: Second Conditional - Unreal Scenarios',
        type: 'quiz',
        content: {
          text: 'Choose the correct form for hypothetical or imaginary situations (If + Past Simple, would + Verb).',
          questions: [
            { question: "If I ___ a million dollars, I would travel around the world.", options: ["win", "won", "have won", "would win"], correct: "won" },
            { question: "If she spoke fluent German, she ___ apply for the job in Berlin.", options: ["would", "will", "can", "shall"], correct: "would" },
            { question: "If I ___ you, I would consult a financial advisor immediately.", options: ["was", "were", "am", "be"], correct: "were" },
            { question: "What would you do if you ___ a wallet on the street?", options: ["found", "find", "have found", "finding"], correct: "found" },
            { question: "We ___ buy a bigger house if interest rates were lower.", options: ["would", "will", "can", "shall"], correct: "would" }
          ]
        }
      },
      {
        title: 'M6.2: Present & Past Passive Voice Check',
        type: 'true-false',
        content: {
          text: 'Identifique se o uso da Voz Passiva (Verb To Be + Past Participle) está correto.',
          statements: [
            { statement: "This castle was built in the fourteenth century.", correct: true },
            { statement: "Millions of smartphones are sell every single day.", correct: false },
            { statement: "The bridge was designed by a famous Scottish engineer.", correct: true },
            { statement: "English is spoken by millions of people across the globe.", correct: true },
            { statement: "Penicillin were discovered by Alexander Fleming.", correct: false }
          ]
        }
      },
      {
        title: 'M6.3: Active to Passive Voice Matching',
        type: 'matching',
        content: {
          instructions: 'Relacione as sentenças na voz ativa com sua forma correspondente na voz passiva.',
          pairs: [
            { left: 'The committee approved the new budget.', right: 'The new budget was approved by the committee.' },
            { left: 'Shakespeare wrote Hamlet.', right: 'Hamlet was written by Shakespeare.' },
            { left: 'Technicians maintain the servers regularly.', right: 'The servers are maintained regularly by technicians.' },
            { left: 'The artist painted the mural in three days.', right: 'The mural was painted in three days by the artist.' },
            { left: 'Farmers grow coffee beans in tropical highlands.', right: 'Coffee beans are grown in tropical highlands.' }
          ]
        }
      },
      {
        title: 'M6.4: Passive Sentence Word Order',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para formar sentenças passivas precisas e gramaticais.',
          sentences: [
            { words: ['The', 'monument', 'was', 'visited', 'by', 'thousands', 'of', 'tourists'], correct: 'The monument was visited by thousands of tourists' },
            { words: ['All', 'flights', 'were', 'grounded', 'due', 'to', 'heavy', 'fog'], correct: 'All flights were grounded due to heavy fog' },
            { words: ['Olive', 'oil', 'is', 'produced', 'in', 'Mediterranean', 'countries'], correct: 'Olive oil is produced in Mediterranean countries' },
            { words: ['The', 'stolen', 'jewellery', 'was', 'recovered', 'by', 'the', 'police'], correct: 'The stolen jewellery was recovered by the police' },
            { words: ['Renewable', 'energy', 'is', 'used', 'in', 'modern', 'factories'], correct: 'Renewable energy is used in modern factories' }
          ]
        }
      },
      {
        title: 'M6.5: Bridge Grammar Flashcards',
        type: 'flashcards',
        content: {
          instructions: 'Consolide as estruturas-ponte essenciais entre os níveis B1 e B2.',
          cards: [
            { front: 'If I were you...', back: 'Se eu estivesse no seu lugar... (conselho hipotético)', example: 'If I were you, I would accept their job offer.' },
            { front: 'Be supposed to', back: 'Dever / Ter a obrigação de acordo com expectativa', example: 'We are supposed to submit the project before 5 PM.' },
            { front: 'Used to vs Be used to', back: 'Costumava (passado) vs Estar acostumado a (presente)', example: 'I used to take the bus, but now I am used to cycling.' },
            { front: 'Made of vs Made from', back: 'Feito de (material visível) vs Feito a partir de (transformado)', example: 'The table is made of oak; paper is made from wood pulp.' },
            { front: 'By + Agent', back: 'Por / Pelo (indica o agente na voz passiva)', example: 'The theory was proven by international scientists.' }
          ]
        }
      },
      {
        title: 'M6.6: Second Conditional Nuances',
        type: 'quiz',
        content: {
          text: 'Choose the correct verb combination for hypothetical second conditional scenarios.',
          questions: [
            { question: "If he ___ more time, he would practice playing the violin.", options: ["had", "has", "would have", "having"], correct: "had" },
            { question: "Where ___ you live if you could choose any country?", options: ["would", "will", "did", "shall"], correct: "would" },
            { question: "If the internet ___ tomorrow, modern banking would stop.", options: ["disappeared", "disappears", "would disappear", "disappearing"], correct: "disappeared" },
            { question: "I wouldn't buy that second-hand car if I ___ you.", options: ["were", "am", "be", "would be"], correct: "were" },
            { question: "If citizens recycled more, less plastic waste ___ in the ocean.", options: ["would end up", "ended up", "ends up", "will end up"], correct: "would end up" }
          ]
        }
      },
      {
        title: 'M6.7: Passive with Modals & Times',
        type: 'true-false',
        content: {
          text: 'Julgue a correção gramatical da voz passiva com verbos modais (must be done, should be cleaned).',
          statements: [
            { statement: "This contract must be signed by both directors today.", correct: true },
            { statement: "The password should be change every three months.", correct: false },
            { statement: "Solar panels can be installed on almost any flat roof.", correct: true },
            { statement: "Historic landmarks ought to be protected by national law.", correct: true },
            { statement: "All dirty dishes must be wash before closing the restaurant.", correct: false }
          ]
        }
      },
      {
        title: 'M6.8: Hypothetical Dilemmas Matching',
        type: 'matching',
        content: {
          instructions: 'Relacione o dilema hipotético com a reação mais provável.',
          pairs: [
            { left: 'If you saw someone drop their wallet,', right: 'would you return it immediately to the owner?' },
            { left: 'If you had the power of invisibility,', right: 'how would you use it without hurting anyone?' },
            { left: 'If our company opened a branch in Tokyo,', right: 'would you be willing to relocate there?' },
            { left: 'If you could master any language overnight,', right: 'which one would you choose to learn?' },
            { left: 'If electricity suddenly failed worldwide,', right: 'society would face massive technological hurdles.' }
          ]
        }
      },
      {
        title: 'M6.9: The Invention of the Printing Press - Reading Comprehension',
        type: 'quiz',
        content: {
          text: "The movable type printing press was developed by Johannes Gutenberg in Mainz, Germany, around the year 1440. Before this technological breakthrough, books were meticulously copied by hand by monastic scribes, making them exceptionally scarce and expensive. With Gutenberg's invention, written knowledge was democratized; thousands of volumes could be printed rapidly, triggering the European Renaissance and the scientific revolution.",
          questions: [
            { question: "Who developed the movable type printing press?", options: ["Leonardo da Vinci", "Johannes Gutenberg", "Isaac Newton", "Martin Luther"], correct: "Johannes Gutenberg" },
            { question: "How were books produced prior to Gutenberg's invention?", options: ["Copied meticulously by hand by monastic scribes", "Carved on stone slabs", "Photocopied with lenses", "Recited from memory only"], correct: "Copied meticulously by hand by monastic scribes" },
            { question: "Around what year was Gutenberg's press created?", options: ["1440", "1540", "1340", "1640"], correct: "1440" },
            { question: "What major European period was triggered by the rapid spread of printed books?", options: ["The European Renaissance and scientific revolution", "The Bronze Age", "The Industrial Steam Age", "The Middle Ages fall"], correct: "The European Renaissance and scientific revolution" }
          ]
        }
      },
      {
        title: 'M6.10: Hypothetical & Passive Word Order',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para construir frases com voz passiva ou estruturas hipotéticas.',
          sentences: [
            { words: ['If', 'I', 'had', 'wings', 'I', 'would', 'fly', 'across', 'continents'], correct: 'If I had wings I would fly across continents' },
            { words: ['The', 'exhibition', 'was', 'organized', 'by', 'art', 'curators'], correct: 'The exhibition was organized by art curators' },
            { words: ['What', 'would', 'happen', 'if', 'we', 'missed', 'the', 'deadline'], correct: 'What would happen if we missed the deadline' },
            { words: ['Medicines', 'must', 'be', 'stored', 'in', 'a', 'cool', 'place'], correct: 'Medicines must be stored in a cool place' },
            { words: ['I', 'would', 'travel', 'more', 'if', 'tickets', 'were', 'cheaper'], correct: 'I would travel more if tickets were cheaper' }
          ]
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // MÓDULO 7: CEFR B2.1 – Hypothetical Situations, Regrets & Wishes
  // Level in DB: 'Módulo 7'
  // ─────────────────────────────────────────────────────────────
  7: {
    level: 'Módulo 7',
    exercises: [
      {
        title: 'M7.1: Third Conditional - Past Regrets',
        type: 'quiz',
        content: {
          text: 'Choose the correct form for past unreal conditionals (If + Past Perfect, would have + Past Participle).',
          questions: [
            { question: "If I ___ about the heavy traffic, I would have taken the subway.", options: ["had known", "knew", "have known", "would know"], correct: "had known" },
            { question: "She would have passed the exam if she ___ harder.", options: ["had studied", "studied", "would study", "studies"], correct: "had studied" },
            { question: "If they had left five minutes earlier, they ___ the flight.", options: ["wouldn't have missed", "won't miss", "didn't miss", "wouldn't miss"], correct: "wouldn't have missed" },
            { question: "What ___ if we had run out of fuel in the desert?", options: ["would have happened", "would happen", "happened", "will happen"], correct: "would have happened" },
            { question: "If the goalkeeper had caught the ball, our team ___ the match.", options: ["would have won", "will win", "won", "had won"], correct: "would have won" }
          ]
        }
      },
      {
        title: 'M7.2: Wishes & Regrets (Wish / If only)',
        type: 'true-false',
        content: {
          text: 'Verifique se as frases que expressam desejos presentes (wish + past) e arrependimentos passados (wish + past perfect) estão corretas.',
          statements: [
            { statement: "I wish I had brought an umbrella; it is pouring with rain now.", correct: true },
            { statement: "If only I knew the answer during yesterday's exam.", correct: false },
            { statement: "She wishes she could speak Japanese fluently.", correct: true },
            { statement: "I wish you wouldn't interrupt me while I am presenting.", correct: true },
            { statement: "If only he didn't spent all his savings on that sports car last year.", correct: false }
          ]
        }
      },
      {
        title: 'M7.3: Conditional Regrets Matching',
        type: 'matching',
        content: {
          instructions: 'Relacione as ações que aconteceram no passado com os lamentos hipotéticos correspondentes.',
          pairs: [
            { left: 'I stayed awake until 4 AM playing games.', right: 'If only I had gone to bed earlier last night.' },
            { left: 'He invested all his capital into a fraudulent startup.', right: 'If he had consulted a lawyer, he wouldn\'t have lost his money.' },
            { left: 'We forgot to set the GPS coordinates before driving.', right: 'If we had checked the map, we wouldn\'t have gotten lost.' },
            { left: 'She didn\'t apply for the scholarship on time.', right: 'If she had submitted her dossier, she might have won the grant.' },
            { left: 'I didn\'t wear sunscreen at the tropical beach.', right: 'I wish I had applied sun cream before swimming.' }
          ]
        }
      },
      {
        title: 'M7.4: Third Conditional Word Order',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para construir frases da 3ª condicional gramaticalmente perfeitas.',
          sentences: [
            { words: ['If', 'I', 'had', 'known', 'I', 'would', 'have', 'called', 'you'], correct: 'If I had known I would have called you' },
            { words: ['She', 'would', 'have', 'succeeded', 'if', 'she', 'had', 'tried', 'harder'], correct: 'She would have succeeded if she had tried harder' },
            { words: ['If', 'only', 'we', 'had', 'listened', 'to', 'their', 'advice'], correct: 'If only we had listened to their advice' },
            { words: ['They', 'would', 'not', 'have', 'arrived', 'late', 'with', 'a', 'taxi'], correct: 'They would not have arrived late with a taxi' },
            { words: ['I', 'wish', 'I', 'had', 'accepted', 'that', 'scholarship', 'offer'], correct: 'I wish I had accepted that scholarship offer' }
          ]
        }
      },
      {
        title: 'M7.5: Regrets & Wishes Idioms Flashcards',
        type: 'flashcards',
        content: {
          instructions: 'Estude expressões idiomáticas avançadas para formular hipóteses e lamentar decisões passadas.',
          cards: [
            { front: 'In hindsight', back: 'Em retrospecto / Olhando para trás', example: 'In hindsight, accepting that contract was a strategic blunder.' },
            { front: 'Cry over spilled milk', back: 'Chorar pelo leite derramado / Lamentar o inevitável', example: 'The deal collapsed, but there is no use crying over spilled milk.' },
            { front: 'Miss the boat', back: 'Perder a oportunidade / Deixar passar o momento', example: 'Prices skyrocketed, and we missed the boat on buying real estate.' },
            { front: 'If only...', back: 'Quem dera / Se ao menos... (desejo intenso)', example: 'If only we had reserved our flights before holiday prices spiked!' },
            { front: 'Second thoughts', back: 'Hesitações / Dúvidas após tomar uma decisão', example: 'After signing the contract, she began having second thoughts.' }
          ]
        }
      },
      {
        title: 'M7.6: Mixed Conditionals Practice',
        type: 'quiz',
        content: {
          text: 'Choose the correct combination for mixed conditionals (past cause having a present effect).',
          questions: [
            { question: "If I had accepted that job in London, I ___ living in the UK today.", options: ["would be", "would have been", "will be", "am"], correct: "would be" },
            { question: "If she weren't afraid of flying, she ___ with us to Sydney last week.", options: ["would have traveled", "would travel", "traveled", "will travel"], correct: "would have traveled" },
            { question: "If he had taken his medicine this morning, his fever ___ gone by now.", options: ["would be", "would have been", "is", "will be"], correct: "would be" },
            { question: "We wouldn't be lost now if you ___ the road signs earlier.", options: ["had followed", "followed", "follow", "would follow"], correct: "had followed" },
            { question: "If I spoke French, I ___ that foreign document yesterday.", options: ["would have translated", "would translate", "translated", "will translate"], correct: "would have translated" }
          ]
        }
      },
      {
        title: 'M7.7: Wish + Past Perfect Nuances',
        type: 'true-false',
        content: {
          text: 'Julgue se as frases formulando arrependimentos passados com WISH estão corretas.',
          statements: [
            { statement: "He wishes he hadn't sold his company shares so prematurely.", correct: true },
            { statement: "I wish I would have studied more for yesterday's test.", correct: false },
            { statement: "They wish they had bought insurance before the hurricane struck.", correct: true },
            { statement: "She wishes she didn't ate that entire seafood platter last night.", correct: false },
            { statement: "We wish we had booked a hotel closer to the conference venue.", correct: true }
          ]
        }
      },
      {
        title: 'M7.8: Historical Turning Points Matching',
        type: 'matching',
        content: {
          instructions: 'Relacione os acontecimentos históricos reais com as hipóteses alternativas formuladas no 3º condicional.',
          pairs: [
            { left: 'The Titanic ignored ice warnings.', right: 'If the crew had reduced speed, the collision might have been avoided.' },
            { left: 'Alexander Fleming left petri dishes uncovered.', right: 'If he had cleaned his lab, penicillin might never have been noticed.' },
            { left: 'NASA discovered the O-ring defect too late.', right: 'If the Challenger launch had been delayed, tragedy could have been averted.' },
            { left: 'A storm scattered the Spanish Armada in 1588.', right: 'If the weather had remained calm, English history might have differed.' },
            { left: 'Kodak shelved digital camera patents in 1975.', right: 'If executives had embraced digital tech, Kodak wouldn\'t have gone bankrupt.' }
          ]
        }
      },
      {
        title: 'M7.9: The Missed Flight - Reading Comprehension',
        type: 'quiz',
        content: {
          text: "Marcus had been preparing for his international fellowship interview in Zurich for over six months. However, on the morning of his flight, his phone alarm failed to ring due to an overnight software update. By the time he reached Charles de Gaulle Airport, the boarding gates had already closed. If Marcus had set a backup battery alarm clock, he would have boarded the plane on time. Fortunately, the Swiss academic committee agreed to reschedule the interview online via video conference.",
          questions: [
            { question: "Where was Marcus's fellowship interview scheduled to take place?", options: ["Paris", "Zurich", "Geneva", "London"], correct: "Zurich" },
            { question: "Why did his phone alarm fail to ring in the morning?", options: ["The battery died", "An overnight software update occurred", "He forgot to plug it in", "The phone was stolen"], correct: "An overnight software update occurred" },
            { question: "What would have happened if Marcus had set a backup alarm clock?", options: ["He would have bought souvenirs", "He would have boarded the plane on time", "He would have missed the flight anyway", "He would have called a taxi"], correct: "He would have boarded the plane on time" },
            { question: "How was Marcus's problem ultimately resolved?", options: ["He cancelled the interview", "The committee agreed to hold the interview online", "He took a night train", "He gave up on the fellowship"], correct: "The committee agreed to hold the interview online" }
          ]
        }
      },
      {
        title: 'M7.10: Hypothetical Sentences Word Order',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para estruturar hipóteses do passado e desfechos alternativos.',
          sentences: [
            { words: ['If', 'he', 'had', 'driven', 'slower', 'he', 'would', 'not', 'have', 'crashed'], correct: 'If he had driven slower he would not have crashed' },
            { words: ['I', 'would', 'have', 'sent', 'you', 'an', 'invitation'], correct: 'I would have sent you an invitation' },
            { words: ['If', 'only', 'they', 'had', 'checked', 'the', 'weather', 'forecast'], correct: 'If only they had checked the weather forecast' },
            { words: ['We', 'would', 'have', 'won', 'with', 'better', 'teamwork'], correct: 'We would have won with better teamwork' },
            { words: ['She', 'wishes', 'she', 'had', 'taken', 'that', 'career', 'opportunity'], correct: 'She wishes she had taken that career opportunity' }
          ]
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // MÓDULO 8: CEFR B2.2 – Past Modal Deductions & Complex Relative Clauses
  // Level in DB: 'Módulo 8'
  // ─────────────────────────────────────────────────────────────
  8: {
    level: 'Módulo 8',
    exercises: [
      {
        title: 'M8.1: Past Modals of Deduction',
        type: 'quiz',
        content: {
          text: 'Choose the correct modal deduction in the past (must have, can\'t have, might have).',
          questions: [
            { question: "The streets are completely soaked with puddles. It ___ heavily last night.", options: ["must have rained", "can't have rained", "should rain", "might rain"], correct: "must have rained" },
            { question: "She ___ stolen the necklace; she was with fifty witnesses in another city.", options: ["can't have", "must have", "should have", "might have"], correct: "can't have" },
            { question: "I can't find my keys anywhere. I ___ left them on the kitchen counter.", options: ["might have", "can't have", "must to", "should to"], correct: "might have" },
            { question: "Gabriel didn't show up for work today. He ___ fallen ill again.", options: ["must have", "can't have", "should", "will have"], correct: "must have" },
            { question: "They ___ arrived in Tokyo already; their flight took off only two hours ago!", options: ["can't have", "must have", "might have", "should have"], correct: "can't have" }
          ]
        }
      },
      {
        title: 'M8.2: Defining vs Non-Defining Relative Clauses',
        type: 'true-false',
        content: {
          text: 'Identifique se a pontuação com vírgulas e a escolha dos pronomes relativos (who, which, whose, that) estão corretas.',
          statements: [
            { statement: "My sister, who lives in Melbourne, is a renowned marine biologist.", correct: true },
            { statement: "The laptop, that I bought last week, stopped turning on yesterday.", correct: false },
            { statement: "The architect whose design won the international award gave a speech.", correct: true },
            { statement: "The company which manufactured this device has gone bankrupt.", correct: true },
            { statement: "Albert Einstein, which was born in Germany, revolutionized physics.", correct: false }
          ]
        }
      },
      {
        title: 'M8.3: Relative Pronoun Functions Matching',
        type: 'matching',
        content: {
          instructions: 'Relacione cada pronome relativo com o elemento que ele substitui na oração.',
          pairs: [
            { left: 'Who / Whom', right: 'Refere-se a pessoas (sujeito / objeto formal)' },
            { left: 'Which', right: 'Refere-se a coisas, animais ou orações completas (nunca pessoas)' },
            { left: 'Whose', right: 'Expressa posse e propriedade (cujo, cuja, de quem)' },
            { left: 'Where', right: 'Refere-se ao local ou ambiente em que uma ação ocorre' },
            { left: 'That', right: 'Usado em orações explicativas restritivas para pessoas e coisas' }
          ]
        }
      },
      {
        title: 'M8.4: Modal Deduction Word Order',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para estruturar deduções lógicas e orações relativas sofisticadas.',
          sentences: [
            { words: ['He', 'must', 'have', 'forgotten', 'his', 'house', 'keys', 'inside'], correct: 'He must have forgotten his house keys inside' },
            { words: ['She', 'cannot', 'have', 'made', 'such', 'a', 'serious', 'mistake'], correct: 'She cannot have made such a serious mistake' },
            { words: ['The', 'scientist', 'whose', 'research', 'was', 'published', 'received', 'praise'], correct: 'The scientist whose research was published received praise' },
            { words: ['They', 'might', 'have', 'taken', 'the', 'wrong', 'exit', 'ramp'], correct: 'They might have taken the wrong exit ramp' },
            { words: ['The', 'museum', 'which', 'we', 'visited', 'was', 'fascinating'], correct: 'The museum which we visited was fascinating' }
          ]
        }
      },
      {
        title: 'M8.5: Advanced Speculation Flashcards',
        type: 'flashcards',
        content: {
          instructions: 'Domine os graus de certeza e dedução lógica típicos do nível B2.',
          cards: [
            { front: 'Must have (+ participle)', back: 'Certamente / Com certeza fez (quase 100% de certeza positiva)', example: 'The lights are off; they must have gone to bed.' },
            { front: 'Can\'t / Couldn\'t have', back: 'É impossível que tenha feito (quase 100% de certeza negativa)', example: 'He couldn\'t have committed the crime; he was overseas.' },
            { front: 'May / Might / Could have', back: 'Pode ser que tenha feito (possibilidade aberta / dúvida)', example: 'She hasn\'t answered; she might have left her phone on silent.' },
            { front: 'Should have (+ participle)', back: 'Deveria ter feito (crítica ou obrigação não cumprida no passado)', example: 'You should have informed management before making changes.' },
            { front: 'Whom', back: 'A quem / O qual (objeto formal de verbos e preposições)', example: 'The candidate with whom I spoke was highly articulate.' }
          ]
        }
      },
      {
        title: 'M8.6: Relative Clauses with Prepositions',
        type: 'quiz',
        content: {
          text: 'Select the correct relative pronoun and preposition combination in formal B2 register.',
          questions: [
            { question: "The company for ___ she works is expanding across Latin America.", options: ["which", "who", "whom", "where"], correct: "which" },
            { question: "The professor to ___ you were speaking is the head of the laboratory.", options: ["whom", "who", "which", "whose"], correct: "whom" },
            { question: "This is the town ___ I spent most of my childhood summers.", options: ["where", "which", "whose", "whom"], correct: "where" },
            { question: "The author, ___ latest novel won the Pulitzer Prize, appeared on television.", options: ["whose", "who", "which", "whom"], correct: "whose" },
            { question: "He missed the train, ___ made him forty minutes late for the summit.", options: ["which", "that", "what", "where"], correct: "which" }
          ]
        }
      },
      {
        title: 'M8.7: Speculative Scenarios Check',
        type: 'true-false',
        content: {
          text: 'Julgue se a dedução modal ou uso da cláusula relativa está gramaticalmente correto.',
          statements: [
            { statement: "The door was unlocked; the intruder must have had a master key.", correct: true },
            { statement: "She must has been very exhausted after running a marathon.", correct: false },
            { statement: "The antique vase, which was imported from Venice, fell and shattered.", correct: true },
            { statement: "The student who score was the highest won a trip to Boston.", correct: false },
            { statement: "He couldn't have finished an eight-hundred-page book in one afternoon.", correct: true }
          ]
        }
      },
      {
        title: 'M8.8: Evidence to Deductions Matching',
        type: 'matching',
        content: {
          instructions: 'Relacione as evidências do mundo real com as deduções mais lógicas.',
          pairs: [
            { left: 'The bakery oven is still warm and smells of cinnamon.', right: 'The baker must have taken fresh bread out recently.' },
            { left: 'The car windshield was shattered from the inside.', right: 'An unrestrained heavy object must have hit the glass.' },
            { left: 'The employee arrived soaking wet without an umbrella.', right: 'He must have walked through the thunderous downpour.' },
            { left: 'The suspect\'s passport shows no stamps from Europe.', right: 'He cannot have attended the clandestine summit in Geneva.' },
            { left: 'Her phone has been disconnected for three consecutive days.', right: 'She might have cancelled her international network roaming.' }
          ]
        }
      },
      {
        title: 'M8.9: Archaeological Discovery - Reading Comprehension',
        type: 'quiz',
        content: {
          text: "In 2022, deep beneath the ruins of an ancient Roman villa in Pompeii, archaeologists unearthed a wooden chest that had been remarkably preserved by volcanic ash. The chest, which contained silver cosmetic spoons, bronze needles, and obsidian mirrors, must have belonged to a wealthy patrician woman. Historians speculate that the inhabitants couldn't have anticipated the sudden eruption of Mount Vesuvius in 79 AD, leaving behind priceless artifacts that offer unprecedented insights into Roman domestic life.",
          questions: [
            { question: "What was unearthed beneath the Roman villa in Pompeii?", options: ["A golden chariot", "A remarkably preserved wooden chest", "A bronze statue", "A stone tablet"], correct: "A remarkably preserved wooden chest" },
            { question: "Who must the items inside the chest have belonged to?", options: ["A gladiatorial trainer", "A Roman legionary", "A wealthy patrician woman", "A merchant from Alexandria"], correct: "A wealthy patrician woman" },
            { question: "What had kept the wooden chest in such remarkable preservation?", options: ["Subterranean water", "Volcanic ash", "A layer of concrete", "A glacier"], correct: "Volcanic ash" },
            { question: "What did historians deduce about the inhabitants?", options: ["They had built tunnels to escape", "They couldn't have anticipated the sudden eruption", "They caused the eruption intentionally", "They emigrated to Greece"], correct: "They couldn't have anticipated the sudden eruption" }
          ]
        }
      },
      {
        title: 'M8.10: Relative Clauses & Deductions Word Order',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para formar sentenças com orações relativas e deduções modais.',
          sentences: [
            { words: ['The', 'detective', 'who', 'investigated', 'the', 'case', 'found', 'clues'], correct: 'The detective who investigated the case found clues' },
            { words: ['He', 'could', 'not', 'have', 'known', 'the', 'exact', 'secret'], correct: 'He could not have known the exact secret' },
            { words: ['This', 'is', 'the', 'library', 'where', 'we', 'studied', 'together'], correct: 'This is the library where we studied together' },
            { words: ['She', 'must', 'have', 'been', 'delighted', 'with', 'the', 'promotion'], correct: 'She must have been delighted with the promotion' },
            { words: ['The', 'painting', 'which', 'hung', 'in', 'the', 'hall', 'was', 'valuable'], correct: 'The painting which hung in the hall was valuable' }
          ]
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // MÓDULO 9: CEFR B2.3 – Advanced Voice, Causatives & Inversion
  // Level in DB: 'Módulo 9'
  // ─────────────────────────────────────────────────────────────
  9: {
    level: 'Módulo 9',
    exercises: [
      {
        title: 'M9.1: Causative Structures (Have / Get something done)',
        type: 'quiz',
        content: {
          text: 'Choose the correct causative form when paying or asking someone else to perform a service.',
          questions: [
            { question: "My car was making strange noises, so I ___ at the mechanic's.", options: ["had it repaired", "repaired it", "got repair it", "have it repair"], correct: "had it repaired" },
            { question: "She is going to the salon tomorrow to ___.", options: ["have her hair cut", "cut her hair", "get her hair cutting", "have cut hair"], correct: "have her hair cut" },
            { question: "We need to ___ our passports renewed before the flight.", options: ["get", "make", "let", "do"], correct: "get" },
            { question: "The homeowner ___ the roof inspected after the fierce hailstorm.", options: ["had", "did", "made to", "letted"], correct: "had" },
            { question: "I will not paint the apartment myself; I will ___ by a professional.", options: ["have it painted", "paint it", "get painting", "have painted it"], correct: "have it painted" }
          ]
        }
      },
      {
        title: 'M9.2: Impersonal & Reporting Passive Voice',
        type: 'true-false',
        content: {
          text: 'Verifique se as estruturas de voz passiva impessoal (It is said that... / He is thought to be...) estão corretas.',
          statements: [
            { statement: "It is widely believed that exercise improves mental cognitive health.", correct: true },
            { statement: "The CEO is considered to having resigned yesterday.", correct: false },
            { statement: "The ancient temple is thought to date back to the Bronze Age.", correct: true },
            { statement: "It is reported that three hostages have been safely released.", correct: true },
            { statement: "He is presumed to being innocent until proven guilty.", correct: false }
          ]
        }
      },
      {
        title: 'M9.3: Gerund vs Infinitive Meaning Changes',
        type: 'matching',
        content: {
          instructions: 'Relacione o verbo com o significado que adquire ao ser seguido de Gerúndio ou Infinitivo.',
          pairs: [
            { left: 'Remember to lock the door.', right: 'Lembrar-se de realizar uma tarefa futura (obrigação)' },
            { left: 'Remember locking the door.', right: 'Lembrar-se de ter feito a ação no passado (memória vívida)' },
            { left: 'He stopped to smoke.', right: 'Interrompeu o que estava fazendo para poder fumar' },
            { left: 'He stopped smoking.', right: 'Abandonou o hábito de fumar definitivamente' },
            { left: 'Try to move the table.', right: 'Fazer um esforço físico difícil para mover a mesa' }
          ]
        }
      },
      {
        title: 'M9.4: Causative & Inversion Word Order',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para estruturar frases causativas e de inversão negativa avançada.',
          sentences: [
            { words: ['We', 'had', 'our', 'central', 'air', 'conditioning', 'serviced', 'yesterday'], correct: 'We had our central air conditioning serviced yesterday' },
            { words: ['Seldom', 'have', 'I', 'witnessed', 'such', 'a', 'remarkable', 'performance'], correct: 'Seldom have I witnessed such a remarkable performance' },
            { words: ['She', 'had', 'her', 'formal', 'wedding', 'dress', 'custom', 'made'], correct: 'She had her formal wedding dress custom made' },
            { words: ['Not', 'only', 'did', 'he', 'apologize', 'he', 'offered', 'compensation'], correct: 'Not only did he apologize he offered compensation' },
            { words: ['It', 'is', 'believed', 'that', 'the', 'artifacts', 'are', 'authentic'], correct: 'It is believed that the artifacts are authentic' }
          ]
        }
      },
      {
        title: 'M9.5: Inversion & Advanced Structures Flashcards',
        type: 'flashcards',
        content: {
          instructions: 'Estude as inversões enfáticas após advérbios negativos, marcas de alta proficiência em B2/C1.',
          cards: [
            { front: 'Hardly... when', back: 'Mal tinha... quando (inversão temporal rápida)', example: 'Hardly had I closed my eyes when the alarm began buzzing.' },
            { front: 'Not only... but also', back: 'Não apenas... mas também (inverte o 1º verbo)', example: 'Not only did she win the competition, but she also set a world record.' },
            { front: 'Under no circumstances', back: 'Sob nenhuma circunstância (proibição enfática)', example: 'Under no circumstances should you press this emergency switch.' },
            { front: 'Little did they know', back: 'Mal sabiam eles (fato oculto que seria revelado)', example: 'Little did they know that the surprise party was waiting next door.' },
            { front: 'Causative: Get someone to do', back: 'Persuadir ou convencer alguém a fazer algo', example: 'I finally got my colleague to proofread my research manuscript.' }
          ]
        }
      },
      {
        title: 'M9.6: Negative Inversion Mastery',
        type: 'quiz',
        content: {
          text: 'Select the correctly inverted sentence structure following negative adverbials.',
          questions: [
            { question: "Rarely ___ such sheer dedication in an apprentice.", options: ["have I seen", "I have seen", "did I saw", "I saw"], correct: "have I seen" },
            { question: "Scarcely had the plane taken off ___ severe turbulence began.", options: ["when", "than", "that", "while"], correct: "when" },
            { question: "No sooner had we reached the summit ___ it started to blizzard.", options: ["than", "when", "that", "then"], correct: "than" },
            { question: "Only after reading the contract carefully ___ the hidden fee.", options: ["did she notice", "she noticed", "she had noticed", "noticed she"], correct: "did she notice" },
            { question: "Under no circumstances ___ without an authorized badge.", options: ["are visitors permitted", "visitors are permitted", "permitted are visitors", "visitors permitted"], correct: "are visitors permitted" }
          ]
        }
      },
      {
        title: 'M9.7: Causative Verbs (Make, Let, Have, Get)',
        type: 'true-false',
        content: {
          text: 'Avalie a correção gramatical quanto ao uso de infinitivo com ou sem \'TO\' após verbos causativos.',
          statements: [
            { statement: "The director made us rewrite the executive summary twice.", correct: true },
            { statement: "Her parents let her to travel alone across Europe.", correct: false },
            { statement: "The coach got the team to run five extra laps.", correct: true },
            { statement: "He had the assistant to schedule the video conference.", correct: false },
            { statement: "Loud construction noise made it impossible to concentrate.", correct: true }
          ]
        }
      },
      {
        title: 'M9.8: Gerund vs Infinitive Nuance Pairs',
        type: 'matching',
        content: {
          instructions: 'Relacione as sentenças com o nuance exato gerado pela escolha gramatical.',
          pairs: [
            { left: 'I regret to inform you that your grant was rejected.', right: 'Comunicação formal de uma má notícia no momento presente' },
            { left: 'I regret saying those hurtful words during the argument.', right: 'Remorso por uma atitude cometida no passado' },
            { left: 'She stopped to drink water during her morning run.', right: 'Pausou a corrida para hidratar-se' },
            { left: 'She stopped drinking sugary sodas last winter.', right: 'Cessou o hábito de consumir refrigerantes' },
            { left: 'He tried resetting the router, but nothing changed.', right: 'Experimentou um método alternativo para testar se funcionava' }
          ]
        }
      },
      {
        title: 'M9.9: Architectural Restoration - Reading Comprehension',
        type: 'quiz',
        content: {
          text: "When the municipal government purchased the nineteenth-century Victorian theatre, the roof was leaking and dampness had severely degraded the decorative plasterwork. Rather than demolishing the structure, officials had the building completely restored by specialized conservation artisans. Not only was the original gold leaf detailing revitalized, but state-of-the-art acoustic panels were also discreetly integrated behind the balcony walls. Today, it is acknowledged to be one of the premier concert venues in northern Europe.",
          questions: [
            { question: "What was the initial state of the Victorian theatre?", options: ["It had just been built", "The roof was leaking and plasterwork had degraded", "It was fully operational", "It was completely burned down"], correct: "The roof was leaking and plasterwork had degraded" },
            { question: "What did officials choose to do rather than demolishing the theatre?", options: ["Sell it to a retail firm", "Have it completely restored by specialized artisans", "Turn it into a car park", "Abandon it"], correct: "Have it completely restored by specialized artisans" },
            { question: "What modern upgrade was discreetly integrated behind the balcony walls?", options: ["Neon light signs", "State-of-the-art acoustic panels", "Large cinema screens", "Elevators only"], correct: "State-of-the-art acoustic panels" },
            { question: "How is the restored theatre acknowledged today?", options: ["As an obsolete building", "As one of the premier concert venues in northern Europe", "As a private museum only", "As an office complex"], correct: "As one of the premier concert venues in northern Europe" }
          ]
        }
      },
      {
        title: 'M9.10: Inversion & Passive Mastery Word Order',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para criar orações com inversão e voz passiva avançada.',
          sentences: [
            { words: ['Hardly', 'had', 'the', 'meeting', 'started', 'when', 'tempers', 'flared'], correct: 'Hardly had the meeting started when tempers flared' },
            { words: ['The', 'diplomat', 'had', 'all', 'documents', 'translated', 'into', 'Spanish'], correct: 'The diplomat had all documents translated into Spanish' },
            { words: ['Never', 'before', 'had', 'she', 'encountered', 'such', 'generosity'], correct: 'Never before had she encountered such generosity' },
            { words: ['He', 'is', 'alleged', 'to', 'have', 'leaked', 'confidential', 'data'], correct: 'He is alleged to have leaked confidential data' },
            { words: ['Only', 'later', 'did', 'we', 'realize', 'the', 'full', 'truth'], correct: 'Only later did we realize the full truth' }
          ]
        }
      }
    ]
  },

  // ─────────────────────────────────────────────────────────────
  // MÓDULO 10: CEFR B2.4 – Upper-Intermediate Idioms, Collocations & Professional Fluency
  // Level in DB: 'Módulo 10'
  // ─────────────────────────────────────────────────────────────
  10: {
    level: 'Módulo 10',
    exercises: [
      {
        title: 'M10.1: Professional Collocations & Verbs',
        type: 'quiz',
        content: {
          text: 'Select the precise verb that naturally collocates with the noun in formal English.',
          questions: [
            { question: "Before signing the acquisition agreement, our auditors must ___ due diligence.", options: ["conduct", "make", "play", "bring"], correct: "conduct" },
            { question: "The board of directors convened yesterday to ___ a crucial decision.", options: ["make", "do", "execute", "put"], correct: "make" },
            { question: "Investors were warned not to ___ unnecessary financial risks.", options: ["take", "make", "create", "do"], correct: "take" },
            { question: "After analyzing the quarterly data, the researchers ___ valuable conclusions.", options: ["drew", "pulled", "built", "painted"], correct: "drew" },
            { question: "Both delegations agreed to ___ a compromise to resolve the tariff dispute.", options: ["reach", "arrive", "get", "do"], correct: "reach" }
          ]
        }
      },
      {
        title: 'M10.2: Discourse Markers & Connectors of Contrast',
        type: 'true-false',
        content: {
          text: 'Identifique se os conectores formais de contraste e adição (furthermore, nevertheless, despite, whereas) estão usados corretamente.',
          statements: [
            { statement: "Despite the relentless rain, the marathon was concluded without injuries.", correct: true },
            { statement: "Although he had ample experience, but he failed the technical interview.", correct: false },
            { statement: "The proposal was costly; nevertheless, the board unanimously approved it.", correct: true },
            { statement: "She enjoys team collaboration, whereas her partner prefers working in isolation.", correct: true },
            { statement: "In spite of he was exhausted, he completed the emergency project on time.", correct: false }
          ]
        }
      },
      {
        title: 'M10.3: Three-Part Phrasal Verbs Matching',
        type: 'matching',
        content: {
          instructions: 'Relacione os verbos frasais de três partes de nível B2 com seus significados equivalentes.',
          pairs: [
            { left: 'Come up with', right: 'Idear / Inventar uma solução criativa ou plano' },
            { left: 'Put up with', right: 'Tolerar / Suportar uma situação desconfortável' },
            { left: 'Look forward to', right: 'Aguardar com grande expectativa e entusiasmo' },
            { left: 'Cut down on', right: 'Reduzir o consumo ou frequência de algo' },
            { left: 'Run out of', right: 'Esgotar completamente o estoque de um recurso' }
          ]
        }
      },
      {
        title: 'M10.4: Nuanced Debating Word Order',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para estruturar argumentos formais de debate e persuasão.',
          sentences: [
            { words: ['From', 'my', 'perspective', 'remote', 'work', 'boosts', 'productivity'], correct: 'From my perspective remote work boosts productivity' },
            { words: ['On', 'the', 'other', 'hand', 'face', 'to', 'face', 'collaboration', 'matters'], correct: 'On the other hand face to face collaboration matters' },
            { words: ['We', 'must', 'take', 'these', 'crucial', 'factors', 'into', 'account'], correct: 'We must take these crucial factors into account' },
            { words: ['Taking', 'everything', 'into', 'consideration', 'the', 'plan', 'is', 'feasible'], correct: 'Taking everything into consideration the plan is feasible' },
            { words: ['The', 'evidence', 'strongly', 'suggests', 'an', 'imminent', 'market', 'shift'], correct: 'The evidence strongly suggests an imminent market shift' }
          ]
        }
      },
      {
        title: 'M10.5: Upper-Intermediate Idioms Flashcards',
        type: 'flashcards',
        content: {
          instructions: 'Domine expressões idiomáticas refinadas frequentemente ouvidas em ambientes acadêmicos e profissionais.',
          cards: [
            { front: 'Play devil\'s advocate', back: 'Advogar o ponto de vista contrário para testar o argumento', example: 'Let me play devil\'s advocate: what if sales plummet next quarter?' },
            { front: 'See eye to eye', back: 'Concordar plenamente sobre determinado assunto', example: 'The partners rarely see eye to eye on budgetary allocations.' },
            { front: 'Bite the bullet', back: 'Encarar uma decisão dolorosa ou inevitável com coragem', example: 'We must bite the bullet and shut down underperforming branches.' },
            { front: 'Read between the lines', back: 'Perceber o significado oculto ou implícito nas entrelinhas', example: 'Reading between the lines of his resignation, he was unhappy.' },
            { front: 'Hit the nail on the head', back: 'Acertar em cheio / Identificar exatamente o ponto central', example: 'Your analysis of our customer retention problem hit the nail on the head.' }
          ]
        }
      },
      {
        title: 'M10.6: Advanced Connectors & Nuance',
        type: 'quiz',
        content: {
          text: 'Choose the most coherent discourse marker to complete the formal argument.',
          questions: [
            { question: "Renewable energy costs have decreased significantly; ___, adoption rates are soaring.", options: ["consequently", "however", "nonetheless", "whereas"], correct: "consequently" },
            { question: "The marketing strategy was audacious; ___, it failed to engage younger consumers.", options: ["nonetheless", "furthermore", "moreover", "likewise"], correct: "nonetheless" },
            { question: "Online schooling offers immense flexibility; ___, classroom socialization develops empathy.", options: ["on the other hand", "furthermore", "as a result", "in addition"], correct: "on the other hand" },
            { question: "___ extensive lobbying by energy firms, the environmental bill passed parliament.", options: ["Despite", "Although", "Even though", "Whereas"], correct: "Despite" },
            { question: "The candidate has superb credentials; ___, her leadership style is highly adaptable.", options: ["moreover", "in contrast", "nevertheless", "yet"], correct: "moreover" }
          ]
        }
      },
      {
        title: 'M10.7: Collocation Precision Check',
        type: 'true-false',
        content: {
          text: 'Julgue se as colocações lexicais em inglês britânico/americano culto estão corretas.',
          statements: [
            { statement: "The managing director gave a keynote speech at the annual convention.", correct: true },
            { statement: "He made a huge mistake by losing the company's master credentials.", correct: true },
            { statement: "We need to do a decision before the market close today.", correct: false },
            { statement: "The clinical trial produced groundbreaking empirical evidence.", correct: true },
            { statement: "The committee has made research on marine ecosystem preservation.", correct: false }
          ]
        }
      },
      {
        title: 'M10.8: Idiom Scenarios Matching',
        type: 'matching',
        content: {
          instructions: 'Relacione cada metáfora idiomática com a situação descrita.',
          pairs: [
            { left: 'The candidate dodged every direct question during the televised debate.', right: 'He was clearly beating around the bush.' },
            { left: 'She uncovered a vital discrepancy that explained the missing ledger balances.', right: 'She hit the nail on the head.' },
            { left: 'Management decided to accept high restructuring costs to avoid liquidation.', right: 'They chose to bite the bullet.' },
            { left: 'The two co-founders agreed immediately on company equity percentages.', right: 'They saw eye to eye from day one.' },
            { left: 'The engineer defended the legacy architecture purely to stimulate debate.', right: 'He was playing devil\'s advocate.' }
          ]
        }
      },
      {
        title: 'M10.9: Remote Work and Corporate Culture - Reading Comprehension',
        type: 'quiz',
        content: {
          text: "The global transition toward hybrid and fully remote work models has prompted corporate executives to re-evaluate traditional workplace culture. Proponents argue that autonomy and geographic flexibility enhance worker morale, mitigate commute-induced stress, and enable international talent acquisition. Conversely, detractors contend that without casual water-cooler conversations and spontaneous hallway encounters, spontaneous cross-departmental innovation and cohesive mentorship suffer. Striking a pragmatic balance between decentralized autonomy and purposeful in-person collaboration remains the foremost organizational challenge of the decade.",
          questions: [
            { question: "What do proponents of remote work argue regarding its advantages?", options: ["It forces workers to work longer hours", "It enhances morale, reduces commute stress, and allows global hiring", "It eliminates the need for managers", "It reduces wages across industries"], correct: "It enhances morale, reduces commute stress, and allows global hiring" },
            { question: "What do critics fear may suffer in purely remote corporate environments?", options: ["Internet speeds", "Spontaneous innovation and cohesive mentorship", "Office furniture sales", "Tax compliance"], correct: "Spontaneous innovation and cohesive mentorship" },
            { question: "What is described as the foremost organizational challenge of the decade?", options: ["Banning all digital devices", "Finding a balance between decentralized autonomy and in-person collaboration", "Eliminating company retreats", "Mandating daily overtime"], correct: "Finding a balance between decentralized autonomy and in-person collaboration" },
            { question: "What types of encounters are credited with sparking unexpected workplace ideas?", options: ["Casual water-cooler conversations and spontaneous hallway encounters", "Annual formal board reviews", "Daily timesheet reviews", "Automated email surveys"], correct: "Casual water-cooler conversations and spontaneous hallway encounters" }
          ]
        }
      },
      {
        title: 'M10.10: Final B2 Synthesis & Nuance Word Order',
        type: 'sentence-order',
        content: {
          instructions: 'Ordene as palavras para estruturar a conclusão de uma reflexão profissional de nível B2.',
          sentences: [
            { words: ['To', 'sum', 'up', 'adaptability', 'is', 'vital', 'in', 'modern', 'careers'], correct: 'To sum up adaptability is vital in modern careers' },
            { words: ['Never', 'underestimate', 'the', 'power', 'of', 'clear', 'communication'], correct: 'Never underestimate the power of clear communication' },
            { words: ['She', 'managed', 'to', 'overcome', 'every', 'formidable', 'obstacle'], correct: 'She managed to overcome every formidable obstacle' },
            { words: ['In', 'conclusion', 'sustainable', 'growth', 'requires', 'long', 'term', 'vision'], correct: 'In conclusion sustainable growth requires long term vision' },
            { words: ['We', 'look', 'forward', 'to', 'collaborating', 'on', 'future', 'initiatives'], correct: 'We look forward to collaborating on future initiatives' }
          ]
        }
      }
    ]
  }
};

async function main() {
  console.log('🚀 Updating and standardizing CEFR B1 & B2 exercises across Modules 2 to 10...');

  try {
    let totalUpdated = 0;
    let totalCreated = 0;

    const students = await prisma.user.findMany({ where: { role: 'student' } });
    console.log(`Found ${students.length} students in the database.`);

    for (const [modNum, modData] of Object.entries(MODULE_DEFINITIONS)) {
      const { level, exercises } = modData;
      console.log(`\n📦 Processing Module ${modNum} (Level: "${level}")...`);

      for (const ex of exercises) {
        // Find existing exercise by title or level
        let existing = await prisma.exercise.findFirst({
          where: {
            title: ex.title,
            level: level
          }
        });

        // Also check if title matches with slight variation
        if (!existing) {
          const titlePrefix = ex.title.split(':')[0]; // e.g. "M2.1"
          existing = await prisma.exercise.findFirst({
            where: {
              title: { startsWith: titlePrefix },
              level: level
            }
          });
        }

        if (existing) {
          await prisma.exercise.update({
            where: { id: existing.id },
            data: {
              title: ex.title,
              type: ex.type,
              level: level,
              isRpg: true,
              content: ex.content
            }
          });
          console.log(`  ✓ Updated ID ${existing.id}: "${ex.title}" (${ex.type})`);
          totalUpdated++;

          // Auto-assign to students if not already assigned
          for (const student of students) {
            const assignment = await prisma.student_exercise.findUnique({
              where: {
                userId_exerciseId: {
                  userId: student.id,
                  exerciseId: existing.id
                }
              }
            });
            if (!assignment) {
              await prisma.student_exercise.create({
                data: {
                  userId: student.id,
                  exerciseId: existing.id,
                  status: 'assigned'
                }
              });
            }
          }
        } else {
          // If not found, resolve planId
          const plan = await prisma.plan.findFirst({ where: { level } }) || await prisma.plan.findFirst();
          const newEx = await prisma.exercise.create({
            data: {
              title: ex.title,
              type: ex.type,
              level: level,
              isRpg: true,
              planId: plan ? plan.id : 1,
              content: ex.content
            }
          });
          console.log(`  + Created ID ${newEx.id}: "${ex.title}" (${ex.type})`);
          totalCreated++;

          for (const student of students) {
            await prisma.student_exercise.create({
              data: {
                userId: student.id,
                exerciseId: newEx.id,
                status: 'assigned'
              }
            });
          }
        }
      }
    }

    console.log(`\n🎉 Success! Updated: ${totalUpdated}, Created: ${totalCreated}`);

  } catch (error) {
    console.error('❌ Error during update:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
