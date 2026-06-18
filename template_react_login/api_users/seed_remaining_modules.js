import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🚀 Starting Seeding for Modules 3 through 10...');

    // 1. Resolve Plan mapping. If specific plans do not exist, use default plan to ensure constraints are met.
    let plan = await prisma.plan.findFirst();
    const defaultPlanId = plan ? plan.id : 1;

    // Check if we have an Advanced plan
    let planAdvanced = await prisma.plan.findFirst({ where: { level: 'Advanced' } });
    if (!planAdvanced) {
      planAdvanced = await prisma.plan.create({
        data: {
          name: 'Advanced English Plan',
          description: 'Curso de inglês avançado',
          level: 'Advanced',
          price: 199.90,
          hours: 40
        }
      });
      console.log(`Created new Advanced Plan (ID: ${planAdvanced.id})`);
    }

    const students = await prisma.user.findMany({ where: { role: 'student' } });
    console.log(`Found ${students.length} students to assign exercises to.`);

    // Helper to add exercises and assign to students
    const addExercises = async (moduleNum, levelLabel, exercises) => {
      console.log(`\n📦 Seeding Module ${moduleNum} (${levelLabel})...`);
      const dbExercises = [];
      
      for (const ex of exercises) {
        // Check if it already exists to prevent duplicate seeding
        let dbEx = await prisma.exercise.findFirst({
          where: { title: ex.title, level: levelLabel }
        });

        if (!dbEx) {
          dbEx = await prisma.exercise.create({
            data: {
              title: ex.title,
              type: ex.type,
              level: levelLabel,
              isRpg: true,
              planId: levelLabel === 'Advanced' ? planAdvanced.id : defaultPlanId,
              content: ex.content
            }
          });
          console.log(`  + Created: ${ex.title}`);
        } else {
          console.log(`  = Already exists: ${ex.title}`);
        }
        dbExercises.push(dbEx);
      }

      // Assign to all students
      for (const student of students) {
        for (const ex of dbExercises) {
          const exists = await prisma.student_exercise.findUnique({
            where: {
              userId_exerciseId: {
                userId: student.id,
                exerciseId: ex.id
              }
            }
          });

          if (!exists) {
            await prisma.student_exercise.create({
              data: {
                userId: student.id,
                exerciseId: ex.id,
                status: 'assigned'
              }
            });
          }
        }
      }
      console.log(`  ✓ Assigned all Module ${moduleNum} activities to all students.`);
    };

    // ─── MODULE 3: PAST SIMPLE & PAST CONTINUOUS ───────────────────────
    const m3Exercises = [
      {
        title: "M3.1: Regular Past Verbs",
        type: "quiz",
        content: {
          text: "Choose the correct past form of the regular verb.",
          questions: [
            { question: "Yesterday, she ___ (work) for eight hours.", options: ["worked", "works", "working", "workt"], correct: "worked" },
            { question: "They ___ (play) soccer last Sunday.", options: ["play", "played", "playing", "plaied"], correct: "played" },
            { question: "He ___ (cook) a delicious pasta dinner last night.", options: ["cook", "cooking", "cooked", "cookt"], correct: "cooked" }
          ]
        }
      },
      {
        title: "M3.2: Irregular Past Actions",
        type: "true-false",
        content: {
          text: "Decide if the past form of the irregular verb in the sentence is correct.",
          statements: [
            { statement: "She seed a movie last night.", correct: false },
            { statement: "We went to Paris last summer.", correct: true },
            { statement: "He bought a new car yesterday.", correct: true },
            { statement: "They runned home quickly.", correct: false }
          ]
        }
      },
      {
        title: "M3.3: Present and Past Tense Matching",
        type: "matching",
        content: {
          instructions: "Relacione o verbo no infinitivo com seu passado irregular correspondente.",
          pairs: [
            { left: "go", right: "went" },
            { left: "do", right: "did" },
            { left: "buy", right: "bought" },
            { left: "make", right: "made" }
          ]
        }
      },
      {
        title: "M3.4: Past Simple Word Order",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "They visited a museum last Friday.", words: ["They", "visited", "a", "museum", "last", "Friday."] },
            { correct: "Where did you go yesterday?", words: ["Where", "did", "you", "go", "yesterday?"] }
          ]
        }
      },
      {
        title: "M3.5: Irregular Past Verb Cards",
        type: "flashcards",
        content: {
          instructions: "Estude as formas do passado dos seguintes verbos irregulares.",
          cards: [
            { front: "Eat (Comer)", back: "Ate", example: "We ate pizza for lunch." },
            { front: "Sleep (Dormir)", back: "Slept", example: "He slept for nine hours." },
            { front: "Drink (Beber)", back: "Drank", example: "She drank water after the race." }
          ]
        }
      },
      {
        title: "M3.6: Past Continuous Tense",
        type: "quiz",
        content: {
          text: "Select the correct Past Continuous form.",
          questions: [
            { question: "At 8 PM last night, I ___ (watch) television.", options: ["am watching", "was watching", "were watching", "watched"], correct: "was watching" },
            { question: "They ___ (sleep) when the phone rang.", options: ["were sleeping", "was sleeping", "are sleeping", "slept"], correct: "were sleeping" },
            { question: "What ___ you doing yesterday at noon?", options: ["was", "were", "are", "did"], correct: "were" }
          ]
        }
      },
      {
        title: "M3.7: Past Simple vs Continuous Tense",
        type: "true-false",
        content: {
          text: "Check if the combination of simple past and past continuous is correct.",
          statements: [
            { statement: "While I was studying, my cat jumped on the table.", correct: true },
            { statement: "She was walking home when it was starting to rain.", correct: false },
            { statement: "I cooked dinner when she was arriving.", correct: false }
          ]
        }
      },
      {
        title: "M3.8: My Last Vacation Text",
        type: "text",
        content: {
          text: "Last year, I went to Brazil for my summer vacation. I was staying in a hotel near Copacabana beach in Rio de Janeiro. Every morning, I woke up early, ate fresh tropical fruits, and ran along the beach. One day, while I was walking through the streets of Santa Teresa, I met some friendly local artists. They showed me their paintings and invited me to drink fresh coconut water. It was an amazing experience and I want to return next year."
        }
      },
      {
        title: "M3.9: Asking Past Questions",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "Did you watch the match?", words: ["Did", "you", "watch", "the", "match?"] },
            { correct: "What did they eat for breakfast?", words: ["What", "did", "they", "eat", "for", "breakfast?"] }
          ]
        }
      },
      {
        title: "M3.10: Object Pronouns in Past Sentences",
        type: "quiz",
        content: {
          text: "Choose the correct object pronoun to complete the sentence in simple past.",
          questions: [
            { question: "I saw John yesterday and talked to ___.", options: ["him", "his", "he", "himself"], correct: "him" },
            { question: "My mother made a cake and gave ___ to us.", options: ["it", "its", "her", "them"], correct: "it" },
            { question: "We met our friends and invited ___ to the party.", options: ["them", "their", "they", "us"], correct: "them" }
          ]
        }
      }
    ];
    await addExercises(3, "Advanced", m3Exercises);

    // ─── MODULE 4: PRESENT PERFECT & COMPARISONS ───────────────────
    const m4Exercises = [
      {
        title: "M4.1: Present Perfect - Life Experience",
        type: "quiz",
        content: {
          text: "Choose the correct form of the Present Perfect.",
          questions: [
            { question: "___ you ever been to New York?", options: ["Have", "Has", "Did", "Are"], correct: "Have" },
            { question: "She ___ (visit) Paris three times.", options: ["visited", "has visited", "have visited", "visits"], correct: "has visited" },
            { question: "We ___ (not / study) this grammar yet.", options: ["haven't studied", "hasn't studied", "didn't study", "no studied"], correct: "haven't studied" }
          ]
        }
      },
      {
        title: "M4.2: Present Perfect Structure",
        type: "true-false",
        content: {
          text: "Decide if the sentence with Present Perfect is grammatically correct.",
          statements: [
            { statement: "He has lived in London for five years.", correct: true },
            { statement: "They have went to the supermarket.", correct: false },
            { statement: "I have seen that movie yesterday.", correct: false }
          ]
        }
      },
      {
        title: "M4.3: Participles Matching",
        type: "matching",
        content: {
          instructions: "Relacione o verbo com sua forma no particípio (Past Participle).",
          pairs: [
            { left: "be", right: "been" },
            { left: "eat", right: "eaten" },
            { left: "write", right: "written" },
            { left: "do", right: "done" }
          ]
        }
      },
      {
        title: "M4.4: Present Perfect Word Order",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "I have already finished my homework.", words: ["I", "have", "already", "finished", "my", "homework."] },
            { correct: "Have you read this book yet?", words: ["Have", "you", "read", "this", "book", "yet?"] }
          ]
        }
      },
      {
        title: "M4.5: Participles Vocabulary Cards",
        type: "flashcards",
        content: {
          instructions: "Estude o particípio dos seguintes verbos e seus exemplos.",
          cards: [
            { front: "Speak (Falar)", back: "Spoken", example: "She has spoken to the manager." },
            { front: "See (Ver)", back: "Seen", example: "I have never seen a whale." },
            { front: "Buy (Comprar)", back: "Bought", example: "He has bought a new phone." }
          ]
        }
      },
      {
        title: "M4.6: Adjective Comparisons - Short Adjectives",
        type: "quiz",
        content: {
          text: "Complete with the correct comparative form.",
          questions: [
            { question: "My car is ___ (fast) than yours.", options: ["faster", "more fast", "fastest", "as fast"], correct: "faster" },
            { question: "This house is ___ (big) than mine.", options: ["bigger", "more big", "biggest", "biger"], correct: "bigger" },
            { question: "Today is ___ (cold) than yesterday.", options: ["colder", "more cold", "coldest", "as cold"], correct: "colder" }
          ]
        }
      },
      {
        title: "M4.7: Adjective Comparisons - Long Adjectives",
        type: "true-false",
        content: {
          text: "Decide if the comparative or superlative form is correct.",
          statements: [
            { statement: "This book is more interesting than that one.", correct: true },
            { statement: "He is the most intelligent student in class.", correct: true },
            { statement: "Math is more easier than English.", correct: false }
          ]
        }
      },
      {
        title: "M4.8: Opposites Matching",
        type: "matching",
        content: {
          instructions: "Relacione os adjetivos comparativos com seus opostos.",
          pairs: [
            { left: "taller", right: "shorter" },
            { left: "better", right: "worse" },
            { left: "cheaper", right: "more expensive" },
            { left: "easier", right: "more difficult" }
          ]
        }
      },
      {
        title: "M4.9: Comparing Places",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "London is larger than Oxford.", words: ["London", "is", "larger", "than", "Oxford."] },
            { correct: "Is Brazil warmer than Canada?", words: ["Is", "Brazil", "warmer", "than", "Canada?"] }
          ]
        }
      },
      {
        title: "M4.10: Present Perfect vs Past Simple",
        type: "quiz",
        content: {
          text: "Select the correct tense (Present Perfect vs Past Simple) for the situation.",
          questions: [
            { question: "I ___ to the cinema last night.", options: ["went", "have gone", "has gone", "go"], correct: "went" },
            { question: "She ___ to Rome three times in her life.", options: ["has been", "was", "went", "is being"], correct: "has been" },
            { question: "They ___ soccer in 2020.", options: ["played", "have played", "has played", "play"], correct: "played" }
          ]
        }
      }
    ];
    await addExercises(4, "Módulo 4", m4Exercises);

    // ─── MODULE 5: MODAL VERBS (CAN, SHOULD, MUST) ─────────────────────
    const m5Exercises = [
      {
        title: "M5.1: Modals of Ability - Can vs Could",
        type: "quiz",
        content: {
          text: "Choose the correct modal of ability.",
          questions: [
            { question: "She ___ swim very fast now.", options: ["can", "could", "must", "should"], correct: "can" },
            { question: "When he was five, he ___ not speak English.", options: ["could", "can", "should", "must"], correct: "could" },
            { question: "___ you help me carry this bag, please?", options: ["Can", "Must", "Should", "May"], correct: "Can" }
          ]
        }
      },
      {
        title: "M5.2: Obligation - Must vs Have to",
        type: "true-false",
        content: {
          text: "Decide if the sentence about obligation is correct.",
          statements: [
            { statement: "You must to wear a seatbelt.", correct: false },
            { statement: "We have to pay taxes.", correct: true },
            { statement: "Students must listen to the teacher.", correct: true }
          ]
        }
      },
      {
        title: "M5.3: Modal Meanings Matching",
        type: "matching",
        content: {
          instructions: "Relacione o verbo modal com sua intenção principal.",
          pairs: [
            { left: "should", right: "conselho" },
            { left: "must", right: "obrigação forte" },
            { left: "can", right: "habilidade / permissão" },
            { left: "might", right: "possibilidade" }
          ]
        }
      },
      {
        title: "M5.4: Giving Advice with Should",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "You should see a doctor.", words: ["You", "should", "see", "a", "doctor."] },
            { correct: "What should I wear tonight?", words: ["What", "should", "I", "wear", "tonight?"] }
          ]
        }
      },
      {
        title: "M5.5: Modal Polite Requests Cards",
        type: "flashcards",
        content: {
          instructions: "Estude o uso de modais para fazer pedidos educados.",
          cards: [
            { front: "Could you pass the salt?", back: "Você poderia passar o sal? (Polido)" },
            { front: "Would you mind opening the door?", back: "Você se importaria de abrir a porta? (Muito polido)" },
            { front: "May I borrow your pen?", back: "Posso pegar sua caneta emprestada? (Formal)" }
          ]
        }
      },
      {
        title: "M5.6: Permissions: May vs Can",
        type: "quiz",
        content: {
          text: "Choose the correct permission modal.",
          questions: [
            { question: "___ I enter the office, Mr. Smith?", options: ["May", "Must", "Should", "Would"], correct: "May" },
            { question: "You ___ park your car here; it is allowed.", options: ["can", "mustn't", "shouldn't", "couldn't"], correct: "can" },
            { question: "___ I ask a question, please?", options: ["May", "Must", "Should", "Would"], correct: "May" }
          ]
        }
      },
      {
        title: "M5.7: Prohibition vs Lack of Obligation",
        type: "true-false",
        content: {
          text: "Decide if the distinction between prohibition and lack of obligation is correct.",
          statements: [
            { statement: "You mustn't smoke in the hospital (prohibited).", correct: true },
            { statement: "You don't have to pay; it is completely free (not necessary).", correct: true },
            { statement: "You don't have to wear shorts in winter (prohibited).", correct: false }
          ]
        }
      },
      {
        title: "M5.8: Advice Situations Matching",
        type: "matching",
        content: {
          instructions: "Relacione o problema com o melhor conselho.",
          pairs: [
            { left: "I am tired.", right: "You should sleep." },
            { left: "I have toothache.", right: "You should see a dentist." },
            { left: "I want to improve English.", right: "You should practice daily." },
            { left: "I lost my key.", right: "You should look inside your bag." }
          ]
        }
      },
      {
        title: "M5.9: Asking for Help",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "Could you help me carry this?", words: ["Could", "you", "help", "me", "carry", "this?"] },
            { correct: "Would you open the window?", words: ["Would", "you", "open", "the", "window?"] }
          ]
        }
      },
      {
        title: "M5.10: Modal Verbs Review",
        type: "quiz",
        content: {
          text: "Choose the best modal verb to complete the text.",
          questions: [
            { question: "To stay healthy, you ___ eat more vegetables.", options: ["should", "mustn't", "couldn't", "may"], correct: "should" },
            { question: "This is a secret. You ___ tell anyone.", options: ["mustn't", "don't have to", "can", "should"], correct: "mustn't" },
            { question: "I ___ speak Spanish when I was ten years old.", options: ["could", "can", "should", "must"], correct: "could" }
          ]
        }
      }
    ];
    await addExercises(5, "Módulo 5", m5Exercises);

    // ─── MODULE 6: FUTURE TENSES (WILL, GOING TO) ─────────────────────
    const m6Exercises = [
      {
        title: "M6.1: Spontaneous Decisions - Will",
        type: "quiz",
        content: {
          text: "Select the correct use of Will for decisions or offers.",
          questions: [
            { question: "A: 'The phone is ringing!' B: 'Don't worry, I ___ answer it.'", options: ["will", "going to", "am going to", "answering"], correct: "will" },
            { question: "I think it ___ rain tomorrow.", options: ["will", "is going to", "goes to", "shall"], correct: "will" },
            { question: "A: 'This suitcase is heavy.' B: 'I ___ help you.'", options: ["will", "am going to", "help", "shall"], correct: "will" }
          ]
        }
      },
      {
        title: "M6.2: Future Plans - Going to",
        type: "true-false",
        content: {
          text: "Decide if the sentence with 'going to' is grammatically correct.",
          statements: [
            { statement: "We are going to buy a house next year.", correct: true },
            { statement: "She is going travel to France.", correct: false },
            { statement: "They going to watch a film tonight.", correct: false }
          ]
        }
      },
      {
        title: "M6.3: Future Time Expressions Matching",
        type: "matching",
        content: {
          instructions: "Relacione o marcador temporal com sua tradução em português.",
          pairs: [
            { left: "tomorrow", right: "amanhã" },
            { left: "next week", right: "na próxima semana" },
            { left: "in three days", right: "em três dias" },
            { left: "tonight", right: "esta noite" }
          ]
        }
      },
      {
        title: "M6.4: Making Future Plans Word Order",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "We are going to visit my family.", words: ["We", "are", "going", "to", "visit", "my", "family."] },
            { correct: "What are you going to do tonight?", words: ["What", "are", "you", "going", "to", "do", "tonight?"] }
          ]
        }
      },
      {
        title: "M6.5: Future Expressions Cards",
        type: "flashcards",
        content: {
          instructions: "Estude as expressões e usos do futuro em inglês.",
          cards: [
            { front: "Will (Spontaneous Decision)", back: "I will call you back immediately." },
            { front: "Going to (Prior Plan)", back: "I am going to study English tonight." },
            { front: "Will (Prediction)", back: "I believe technology will change the world." }
          ]
        }
      },
      {
        title: "M6.6: Present Continuous for Future Plans",
        type: "quiz",
        content: {
          text: "Choose the correct Present Continuous form used for defined future arrangements.",
          questions: [
            { question: "I ___ (meet) the doctor tomorrow at ten.", options: ["am meeting", "will meet", "meet", "going to meet"], correct: "am meeting" },
            { question: "They ___ (fly) to London next Tuesday; they have the tickets.", options: ["are flying", "will fly", "fly", "flying"], correct: "are flying" },
            { question: "We ___ (have) a party this Saturday.", options: ["are having", "will have", "have", "shall have"], correct: "are having" }
          ]
        }
      },
      {
        title: "M6.7: Will vs Going to Predictions",
        type: "true-false",
        content: {
          text: "Identify if the choice of prediction is correct based on evidence.",
          statements: [
            { statement: "Look at the black clouds. It is going to rain. (Evidence)", correct: true },
            { statement: "I think people will live on Mars. (Opinion)", correct: true },
            { statement: "Look! He runs so fast. He will win the race. (Correct prediction type)", correct: false }
          ]
        }
      },
      {
        title: "M6.8: Future Dialogues Matching",
        type: "matching",
        content: {
          instructions: "Associe a fala A com a resposta futura B adequada.",
          pairs: [
            { left: "Are you free tomorrow?", right: "No, I am going to paint my room." },
            { left: "It is very hot here.", right: "I will open the window." },
            { left: "Have you got tickets?", right: "Yes, I am going to watch the match." },
            { left: "The coffee is cold.", right: "I will make another cup." }
          ]
        }
      },
      {
        title: "M6.9: Asking about Future Plans",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "Where are you going to stay?", words: ["Where", "are", "you", "going", "to", "stay?"] },
            { correct: "Will they travel next winter?", words: ["Will", "they", "travel", "next", "winter?"] }
          ]
        }
      },
      {
        title: "M6.10: Future Tenses Review",
        type: "quiz",
        content: {
          text: "Select the best future form to complete the text.",
          questions: [
            { question: "Next weekend, my family and I ___ buy a new television.", options: ["are going to", "will", "fly", "goes to"], correct: "are going to" },
            { question: "Oh, I forgot my wallet! B: 'Don't worry, I ___ lend you some money.'", options: ["will", "am going to", "shall", "lending"], correct: "will" },
            { question: "What time ___ you arriving tomorrow?", options: ["are", "will", "shall", "do"], correct: "are" }
          ]
        }
      }
    ];
    await addExercises(6, "Módulo 6", m6Exercises);

    // ─── MODULE 7: CONDITIONALS (ZERO & FIRST) ───────────────────────
    const m7Exercises = [
      {
        title: "M7.1: Zero Conditional - General Truths",
        type: "quiz",
        content: {
          text: "Choose the correct forms for the Zero Conditional.",
          questions: [
            { question: "If you heat ice, it ___.", options: ["melts", "will melt", "melted", "melting"], correct: "melts" },
            { question: "If children ___ hungry, they cry.", options: ["are", "will be", "were", "are being"], correct: "are" },
            { question: "If you mix red and yellow, you ___ orange.", options: ["get", "will get", "got", "gets"], correct: "get" }
          ]
        }
      },
      {
        title: "M7.2: First Conditional Structure",
        type: "true-false",
        content: {
          text: "Decide if the First Conditional sentence is grammatically correct.",
          statements: [
            { statement: "If it rains tomorrow, we will stay at home.", correct: true },
            { statement: "If I will study hard, I will pass the exam.", correct: false },
            { statement: "She will help you if you ask her politely.", correct: true }
          ]
        }
      },
      {
        title: "M7.3: Conditional Clause Matching",
        type: "matching",
        content: {
          instructions: "Conecte a cláusula condicional (IF) com o resultado correto.",
          pairs: [
            { left: "If you freeze water", right: "it becomes ice." },
            { left: "If it is sunny tomorrow", right: "we will go to the park." },
            { left: "If you don't water plants", right: "they die." },
            { left: "If she arrives late", right: "we will start without her." }
          ]
        }
      },
      {
        title: "M7.4: First Conditional Word Order",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "If she studies she will pass.", words: ["If", "she", "studies", "she", "will", "pass."] },
            { correct: "We will go if they invite us.", words: ["We", "will", "go", "if", "they", "invite", "us."] }
          ]
        }
      },
      {
        title: "M7.5: Conditionals Rules Cards",
        type: "flashcards",
        content: {
          instructions: "Revise a estrutura de condicionais básicas.",
          cards: [
            { front: "Zero Conditional (Truths)", back: "If + Present Simple, Present Simple" },
            { front: "First Conditional (Real Possibility)", back: "If + Present Simple, Will + Verb" },
            { front: "Pronunciation note", back: "Use a comma if the 'if' clause comes first." }
          ]
        }
      },
      {
        title: "M7.6: Unless vs If",
        type: "quiz",
        content: {
          text: "Choose between If or Unless (Unless = If not).",
          questions: [
            { question: "We will go to the park ___ it rains heavily.", options: ["unless", "if", "when", "whether"], correct: "unless" },
            { question: "___ you study hard, you will fail the exam.", options: ["Unless", "If", "When", "Whether"], correct: "Unless" },
            { question: "I will call you ___ I have any problem.", options: ["if", "unless", "until", "except"], correct: "if" }
          ]
        }
      },
      {
        title: "M7.7: Conditional Scenarios",
        type: "true-false",
        content: {
          text: "Determine if the use of Zero or First conditional matches the situation.",
          statements: [
            { statement: "If you heat water to 100 degrees, it boils. (Zero - always true)", correct: true },
            { statement: "If I win the lottery, I buy a house. (First - should use 'will buy')", correct: false },
            { statement: "If you touch fire, you get burned. (Zero - always true)", correct: true }
          ]
        }
      },
      {
        title: "M7.8: Cause and Effect Matches",
        type: "matching",
        content: {
          instructions: "Relacione a causa com o efeito provável.",
          pairs: [
            { left: "You eat too much junk food.", right: "You will gain weight." },
            { left: "You don't sleep enough.", right: "You feel tired." },
            { left: "You drop glass on the floor.", right: "It breaks." },
            { left: "You practice speaking English.", right: "You will improve." }
          ]
        }
      },
      {
        title: "M7.9: Making Conditional Promises",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "I will buy it if I have money.", words: ["I", "will", "buy", "it", "if", "I", "have", "money."] },
            { correct: "If you work hard you will succeed.", words: ["If", "you", "work", "hard", "you", "will", "succeed."] }
          ]
        }
      },
      {
        title: "M7.10: Conditionals Consolidation",
        type: "quiz",
        content: {
          text: "Select the correct option to complete the sentences.",
          questions: [
            { question: "If she ___ time, she will visit us tomorrow.", options: ["has", "will have", "had", "have"], correct: "has" },
            { question: "Water ___ if the temperature goes below zero.", options: ["freezes", "will freeze", "freeze", "freezing"], correct: "freezes" },
            { question: "We won't go to the beach ___ the weather gets better.", options: ["unless", "if", "when", "because"], correct: "unless" }
          ]
        }
      }
    ];
    await addExercises(7, "Módulo 7", m7Exercises);

    // ─── MODULE 8: PASSIVE VOICE & RELATIVE CLAUSES ────────────────────
    const m8Exercises = [
      {
        title: "M8.1: Present Passive Voice",
        type: "quiz",
        content: {
          text: "Choose the correct Present Passive form.",
          questions: [
            { question: "English ___ (speak) all over the world.", options: ["is spoken", "are spoken", "spoke", "speaks"], correct: "is spoken" },
            { question: "Many cars ___ (make) in Japan.", options: ["are made", "is made", "made", "makes"], correct: "are made" },
            { question: "This website ___ (update) daily by Paul.", options: ["is updated", "are updated", "updates", "updated"], correct: "is updated" }
          ]
        }
      },
      {
        title: "M8.2: Past Passive Sentences",
        type: "true-false",
        content: {
          text: "Decide if the sentence in Past Passive is grammatically correct.",
          statements: [
            { statement: "America was discovered in 1492.", correct: true },
            { statement: "This house were built fifty years ago.", correct: false },
            { statement: "The letters was written by Mary.", correct: false }
          ]
        }
      },
      {
        title: "M8.3: Active to Passive Voice Matching",
        type: "matching",
        content: {
          instructions: "Relacione a frase ativa com a sua correspondente passiva.",
          pairs: [
            { left: "Shakespeare wrote Hamlet.", right: "Hamlet was written by Shakespeare." },
            { left: "They clean the rooms daily.", right: "The rooms are cleaned daily." },
            { left: "Leonardo painted Mona Lisa.", right: "Mona Lisa was painted by Leonardo." },
            { left: "My mother cooks dinner.", right: "Dinner is cooked by my mother." }
          ]
        }
      },
      {
        title: "M8.4: Passive Sentence Word Order",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "The cake was eaten by the children.", words: ["The", "cake", "was", "eaten", "by", "the", "children."] },
            { correct: "Paper is made from wood.", words: ["Paper", "is", "made", "from", "wood."] }
          ]
        }
      },
      {
        title: "M8.5: Relative Pronouns - Who vs Which",
        type: "quiz",
        content: {
          text: "Choose the correct relative pronoun.",
          questions: [
            { question: "A teacher is a person ___ helps students learn.", options: ["who", "which", "whose", "where"], correct: "who" },
            { question: "A smartphone is a device ___ connects to internet.", options: ["which", "who", "whose", "where"], correct: "which" },
            { question: "The man ___ lives next door is very friendly.", options: ["who", "which", "whose", "whom"], correct: "who" }
          ]
        }
      },
      {
        title: "M8.6: Relative Pronouns: That, Where, Whose",
        type: "true-false",
        content: {
          text: "Check if the relative pronoun matches the context.",
          statements: [
            { statement: "A bakery is a place where you can buy bread.", correct: true },
            { statement: "I met a boy whose father is a famous actor.", correct: true },
            { statement: "This is the dog who bit my leg. (Use 'which' or 'that' for animals)", correct: false }
          ]
        }
      },
      {
        title: "M8.7: Definitions Matching",
        type: "matching",
        content: {
          instructions: "Relacione o substantivo com a sua definição relativa correta.",
          pairs: [
            { left: "A dentist", right: "is a person who treats teeth." },
            { left: "A school", right: "is a place where students study." },
            { left: "A clock", right: "is an object which shows the time." },
            { left: "An actor", right: "is a person who plays in films." }
          ]
        }
      },
      {
        title: "M8.8: Relative Clauses Practice",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "The boy who lives next door is nice.", words: ["The", "boy", "who", "lives", "next", "door", "is", "nice."] },
            { correct: "This is the car which I bought.", words: ["This", "is", "the", "car", "which", "I", "bought."] }
          ]
        }
      },
      {
        title: "M8.9: Relative Pronouns Cards",
        type: "flashcards",
        content: {
          instructions: "Estude o uso e as regras dos pronomes relativos em inglês.",
          cards: [
            { front: "Who", back: "Used for people (O menino que...)" },
            { front: "Which", back: "Used for objects / animals (O livro que...)" },
            { front: "Where", back: "Used for places (A cidade onde...)" }
          ]
        }
      },
      {
        title: "M8.10: Passive & Relative Review",
        type: "quiz",
        content: {
          text: "Select the correct option.",
          questions: [
            { question: "This book ___ in 2025 by a famous author.", options: ["was written", "is written", "wrote", "writes"], correct: "was written" },
            { question: "He is the engineer ___ designed this building.", options: ["who", "which", "whose", "where"], correct: "who" },
            { question: "The house ___ they live is very old.", options: ["where", "which", "who", "whose"], correct: "where" }
          ]
        }
      }
    ];
    await addExercises(8, "Módulo 8", m8Exercises);

    // ─── MODULE 9: GERUNDS, INFINITIVES & PHRASAL VERBS ────────────────
    const m9Exercises = [
      {
        title: "M9.1: Verbs Followed by Gerund (verb-ing)",
        type: "quiz",
        content: {
          text: "Select the correct verb form after specific verbs.",
          questions: [
            { question: "I enjoy ___ (listen) to music in the evening.", options: ["listening", "to listen", "listen", "listened"], correct: "listening" },
            { question: "She finished ___ (clean) her room.", options: ["cleaning", "to clean", "clean", "cleaned"], correct: "cleaning" },
            { question: "They avoid ___ (drive) during rush hour.", options: ["driving", "to drive", "drive", "drives"], correct: "driving" }
          ]
        }
      },
      {
        title: "M9.2: Verbs Followed by Infinitive (to + verb)",
        type: "true-false",
        content: {
          text: "Decide if the infinitive usage is grammatically correct.",
          statements: [
            { statement: "I decided to buy a new car.", correct: true },
            { statement: "She wants studying English in London.", correct: false },
            { statement: "They hoped to pass the final exam.", correct: true }
          ]
        }
      },
      {
        title: "M9.3: Gerund vs Infinitive Matching",
        type: "matching",
        content: {
          instructions: "Relacione o verbo principal com a estrutura recomendada que o segue.",
          pairs: [
            { left: "enjoy", right: "Gerund (-ing)" },
            { left: "agree", right: "Infinitive (to verb)" },
            { left: "avoid", right: "Gerund (-ing)" },
            { left: "decide", right: "Infinitive (to verb)" }
          ]
        }
      },
      {
        title: "M9.4: Gerund Sentences Word Order",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "I enjoy swimming in the pool.", words: ["I", "enjoy", "swimming", "in", "the", "pool."] },
            { correct: "He decided to study biology.", words: ["He", "decided", "to", "study", "biology."] }
          ]
        }
      },
      {
        title: "M9.5: Introduction to Phrasal Verbs",
        type: "flashcards",
        content: {
          instructions: "Estude alguns dos verbos frasais mais comuns em inglês.",
          cards: [
            { front: "Get up", back: "Levantar-se (da cama)" },
            { front: "Look for", back: "Procurar por algo/alguém" },
            { front: "Give up", back: "Desistir" }
          ]
        }
      },
      {
        title: "M9.6: Common Phrasal Verbs",
        type: "quiz",
        content: {
          text: "Choose the correct phrasal verb particle.",
          questions: [
            { question: "Don't forget to turn ___ the lights before sleeping.", options: ["off", "on", "up", "down"], correct: "off" },
            { question: "I need to look ___ my keys; I lost them.", options: ["for", "after", "up", "into"], correct: "for" },
            { question: "She woke ___ at seven o'clock.", options: ["up", "on", "in", "out"], correct: "up" }
          ]
        }
      },
      {
        title: "M9.7: Separable Phrasal Verbs",
        type: "true-false",
        content: {
          text: "Identify if the sentence with phrasal verb is correct.",
          statements: [
            { statement: "Please turn off it. (Incorrect - should be 'turn it off')", correct: false },
            { statement: "You should put on your jacket.", correct: true },
            { statement: "I will call you back later.", correct: true }
          ]
        }
      },
      {
        title: "M9.8: Phrasal Verbs Matching",
        type: "matching",
        content: {
          instructions: "Relacione o verbo frasal com a sua definição correspondente.",
          pairs: [
            { left: "look after", right: "cuidar de" },
            { left: "find out", right: "descobrir" },
            { left: "take off", right: "decolar / tirar (roupa)" },
            { left: "go on", right: "continuar" }
          ]
        }
      },
      {
        title: "M9.9: Phrasal Verbs Word Order",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "Turn off the radio please.", words: ["Turn", "off", "the", "radio", "please."] },
            { correct: "She is looking for her dog.", words: ["She", "is", "looking", "for", "her", "dog."] }
          ]
        }
      },
      {
        title: "M9.10: Gerunds & Phrasals Review",
        type: "quiz",
        content: {
          text: "Select the correct option to complete the dialogue.",
          questions: [
            { question: "I hate ___ (wait) in long lines.", options: ["waiting", "to wait", "wait", "waited"], correct: "waiting" },
            { question: "We must go ___ studying; don't stop.", options: ["on", "off", "up", "out"], correct: "on" },
            { question: "Would you mind ___ (open) the window?", options: ["opening", "to open", "open", "opened"], correct: "opening" }
          ]
        }
      }
    ];
    await addExercises(9, "Módulo 9", m9Exercises);

    // ─── MODULE 10: REPORTED SPEECH & ADVANCED TALK ───────────────────
    const m10Exercises = [
      {
        title: "M10.1: Reported Speech - Statements",
        type: "quiz",
        content: {
          text: "Convert direct statements to indirect reported speech.",
          questions: [
            { question: "Direct: 'I am tired,' John said. Reported: John said that he ___ tired.", options: ["was", "is", "am", "had been"], correct: "was" },
            { question: "Direct: 'We like pizza,' they said. Reported: They said that they ___ pizza.", options: ["liked", "likes", "like", "liking"], correct: "liked" },
            { question: "Direct: 'I will help you,' she told me. Reported: She told me she ___ help me.", options: ["would", "will", "shall", "won't"], correct: "would" }
          ]
        }
      },
      {
        title: "M10.2: Reported Questions",
        type: "true-false",
        content: {
          text: "Decide if the conversion to reported question is grammatically correct.",
          statements: [
            { statement: "Direct: 'Where do you live?' she asked. Reported: She asked me where I lived.", correct: true },
            { statement: "Direct: 'Are you cold?' he asked. Reported: He asked me if I was cold.", correct: true },
            { statement: "Direct: 'What is your name?' he asked. Reported: He asked me what was my name. (Incorrect word order - should be 'my name was')", correct: false }
          ]
        }
      },
      {
        title: "M10.3: Direct to Indirect Tense Matching",
        type: "matching",
        content: {
          instructions: "Relacione o tempo verbal original no discurso direto com seu tempo verbal correspondente no discurso indireto.",
          pairs: [
            { left: "Present Simple (is / does)", right: "Past Simple (was / did)" },
            { left: "Present Continuous (is working)", right: "Past Continuous (was working)" },
            { left: "Will", right: "Would" },
            { left: "Past Simple (went)", right: "Past Perfect (had gone)" }
          ]
        }
      },
      {
        title: "M10.4: Say vs Tell",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "He said that he was tired.", words: ["He", "said", "that", "he", "was", "tired."] },
            { correct: "She told me her name.", words: ["She", "told", "me", "her", "name."] }
          ]
        }
      },
      {
        title: "M10.5: Reporting Verbs Cards",
        type: "flashcards",
        content: {
          instructions: "Estude a diferença entre verbos comuns de fala e relato.",
          cards: [
            { front: "Say (Dizer)", back: "Does not require an indirect object. Ex: He said he loved books." },
            { front: "Tell (Contar/Falar para)", back: "Requires a person/pronoun directly after. Ex: He told me he loved books." },
            { front: "Ask (Perguntar/Pedir)", back: "Used for questions and requests. Ex: She asked where the station was." }
          ]
        }
      },
      {
        title: "M10.6: Expressing Opinions",
        type: "quiz",
        content: {
          text: "Choose the correct expression to express professional or advanced opinion.",
          questions: [
            { question: "___ my perspective, studying online is highly flexible.", options: ["From", "In", "On", "At"], correct: "From" },
            { question: "In my ___, reading books is better than playing games.", options: ["opinion", "viewpoint", "perspective", "thought"], correct: "opinion" },
            { question: "From where I stand, this is the best ___.", options: ["decision", "decide", "deciding", "decisive"], correct: "decision" }
          ]
        }
      },
      {
        title: "M10.7: Conjunctions for Contrast",
        type: "true-false",
        content: {
          text: "Decide if the linking word for contrast is used correctly.",
          statements: [
            { statement: "Studying online is flexible. On the other hand, it requires self-discipline.", correct: true },
            { statement: "Although it was raining, but we decided to go for a run. (Incorrect use of 'but' with 'although')", correct: false },
            { statement: "In spite of the rain, they played soccer outside.", correct: true }
          ]
        }
      },
      {
        title: "M10.8: Connecting Words Matching",
        type: "matching",
        content: {
          instructions: "Relacione o conectivo com sua função argumentativa.",
          pairs: [
            { left: "however", right: "contraste" },
            { left: "therefore", right: "consequência" },
            { left: "moreover", right: "adição de ideias" },
            { left: "to sum up", right: "conclusão / resumo" }
          ]
        }
      },
      {
        title: "M10.9: Opinion Phrases Word Order",
        type: "sentence-order",
        content: {
          sentences: [
            { correct: "From my perspective this is better.", words: ["From", "my", "perspective", "this", "is", "better."] },
            { correct: "On the other hand it is expensive.", words: ["On", "the", "other", "hand", "it", "is", "expensive."] }
          ]
        }
      },
      {
        title: "M10.10: Final Consolidation Quiz",
        type: "quiz",
        content: {
          text: "Answer the general grammar questions to finish the RPG path.",
          questions: [
            { question: "Direct: 'Where are you going?' Reported: He asked me where I ___.", options: ["was going", "am going", "went", "had gone"], correct: "was going" },
            { question: "Studying hard is good. ___, you must rest sometimes.", options: ["However", "Therefore", "Moreover", "Because"], correct: "However" },
            { question: "To sum ___ , learning English opens many doors.", options: ["up", "on", "in", "down"], correct: "up" }
          ]
        }
      }
    ];
    await addExercises(10, "Módulo 10", m10Exercises);

    console.log('🎉 RPG Path Seeding Completed Successfully for All Modules!');
  } catch (error) {
    console.error('Error seeding remaining modules:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
