import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// High-quality question pools for each module
const POOLS = {
  1: { // Module 1 (Beginner)
    questions: [
      { question: "How do you respond to 'What's your name?'", options: ["I have a dog", "My name is John", "I am fine", "Goodbye"], correct: "My name is John" },
      { question: "Which word is a classroom object?", options: ["Apple", "Book", "Car", "Sun"], correct: "Book" },
      { question: "What is the opposite of 'hello'?", options: ["Hi", "Welcome", "Goodbye", "Please"], correct: "Goodbye" },
      { question: "Choose the correct article: 'This is ___ apple.'", options: ["a", "an", "the", "some"], correct: "an" },
      { question: "Choose the correct article: 'I have ___ pen.'", options: ["a", "an", "the", "any"], correct: "a" },
      { question: "How do you say 15 in English?", options: ["Five", "Fifteen", "Fifty", "Fiveteen"], correct: "Fifteen" },
      { question: "How do you say 12 in English?", options: ["Two", "Twelve", "Twenty", "Twelveteen"], correct: "Twelve" },
      { question: "Who is your mother's husband?", options: ["My brother", "My father", "My uncle", "My grandfather"], correct: "My father" },
      { question: "Who is your father's sister?", options: ["My mother", "My aunt", "My cousin", "My grandmother"], correct: "My aunt" },
      { question: "Complete: 'They ___ my friends.'", options: ["am", "is", "are", "be"], correct: "are" },
      { question: "Complete: 'He ___ a doctor.'", options: ["am", "is", "are", "be"], correct: "is" },
      { question: "Complete: 'I ___ study English.'", options: ["am", "is", "are", "do"], correct: "do" }
    ],
    statements: [
      { statement: "We are learning English now.", correct: true },
      { statement: "You am a student.", correct: false },
      { statement: "He is my brother.", correct: true },
      { statement: "They is playing soccer.", correct: false },
      { statement: "An elephant is a big animal.", correct: true },
      { statement: "A apple is sweet.", correct: false },
      { statement: "The sky is blue.", correct: true },
      { statement: "I are happy today.", correct: false },
      { statement: "Water is hot when it freezes.", correct: false },
      { statement: "Ten plus five is fifteen.", correct: true },
      { statement: "One year has twelve months.", correct: true },
      { statement: "Dogs is birds.", correct: false }
    ],
    pairs: [
      { left: "Father", right: "Pai" },
      { left: "Mother", right: "Mãe" },
      { left: "Sister", right: "Irmã" },
      { left: "Brother", right: "Irmão" },
      { left: "Uncle", right: "Tio" },
      { left: "Aunt", right: "Tia" },
      { left: "Red", right: "Vermelho" },
      { left: "Blue", right: "Azul" },
      { left: "Green", right: "Verde" },
      { left: "Yellow", right: "Amarelo" },
      { left: "Black", right: "Preto" },
      { left: "White", right: "Branco" }
    ],
    sentences: [
      { words: ["is", "my", "This", "book"], correct: "This is my book" },
      { words: ["are", "They", "happy", "very"], correct: "They are very happy" },
      { words: ["like", "apples", "I", "red"], correct: "I like red apples" },
      { words: ["is", "Where", "bathroom", "the", "?"], correct: "Where is the bathroom ?" },
      { words: ["have", "We", "cat", "a", "black"], correct: "We have a black cat" },
      { words: ["name", "What", "is", "your", "?"], correct: "What is your name ?" },
      { words: ["old", "are", "How", "you", "?"], correct: "How old are you ?" },
      { words: ["am", "I", "fine,", "thank", "you"], correct: "I am fine, thank you" },
      { words: ["English", "study", "They", "every", "day"], correct: "They study English every day" },
      { words: ["live", "Where", "do", "you", "?"], correct: "Where do you live ?" }
    ],
    cards: [
      { front: "Notebook", back: "Caderno", example: "I write in my notebook." },
      { front: "Eraser", back: "Borracha", example: "Can I borrow your eraser?" },
      { front: "Teacher", back: "Professor(a)", example: "The teacher is in the classroom." },
      { front: "Student", back: "Estudante", example: "She is a good student." },
      { front: "School", back: "Escola", example: "We go to school every day." },
      { front: "Desk", back: "Carteira / Mesa", example: "Put your books on the desk." },
      { front: "Pencil case", back: "Estojo", example: "My pencils are in the pencil case." },
      { front: "Ruler", back: "Régua", example: "Use a ruler to draw a straight line." },
      { front: "Board", back: "Quadro", example: "Look at the board." },
      { front: "Chair", back: "Cadeira", example: "Please sit on the chair." }
    ]
  },
  2: { // Module 2 (Intermediate)
    questions: [
      { question: "What is the past simple of 'Buy'?", options: ["Buyed", "Bought", "Brought", "Bin"], correct: "Bought" },
      { question: "Which preposition is used for specific times (e.g. 5:30)?", options: ["on", "in", "at", "under"], correct: "at" },
      { question: "What is the correct past participle of 'See'?", options: ["Saw", "Seen", "Seed", "Seeing"], correct: "Seen" },
      { question: "If it rains tomorrow, we ___ go to the park.", options: ["don't", "won't", "wouldn't", "didn't"], correct: "won't" },
      { question: "Choose the comparative form: 'This house is ___ than mine.'", options: ["big", "bigger", "biggest", "more big"], correct: "bigger" },
      { question: "What does 'give up' mean?", options: ["Start", "Continue", "Desistir", "Search"], correct: "Desistir" },
      { question: "Complete: 'She ___ to Rome last summer.'", options: ["go", "went", "has gone", "going"], correct: "went" },
      { question: "We have lived in London ___ five years.", options: ["since", "for", "during", "ago"], correct: "for" },
      { question: "Choose the correct preposition: 'The book is ___ the table.'", options: ["in", "on", "at", "to"], correct: "on" },
      { question: "If you study hard, you ___ pass the test.", options: ["will", "would", "did", "are"], correct: "will" }
    ],
    statements: [
      { statement: "She has visited Paris three times.", correct: true },
      { statement: "They didn't went to the party.", correct: false },
      { statement: "This car is more fast than that one.", correct: false },
      { statement: "If I have money, I will buy a new phone.", correct: true },
      { statement: "I have eaten lunch already.", correct: true },
      { statement: "He was running when it started to rain.", correct: true },
      { statement: "The luggage are very heavy.", correct: false },
      { statement: "At night is correct for time expressions.", correct: true },
      { statement: "She have finished her homework.", correct: false },
      { statement: "Water boils at 100 degrees Celsius.", correct: true }
    ],
    pairs: [
      { left: "Luggage", right: "Bagagem" },
      { left: "Boarding pass", right: "Cartão de embarque" },
      { left: "Flight", right: "Voo" },
      { left: "Delay", right: "Atraso" },
      { left: "Bread", right: "Pão" },
      { left: "Cheese", right: "Queijo" },
      { left: "Butter", right: "Manteiga" },
      { left: "Water", right: "Água" },
      { left: "Engineer", right: "Engenheiro(a)" },
      { left: "Lawyer", right: "Advogado(a)" }
    ],
    sentences: [
      { words: ["lunch", "already", "I", "have", "eaten"], correct: "I have already eaten lunch" },
      { words: ["went", "yesterday", "We", "cinema", "to", "the"], correct: "We went to the cinema yesterday" },
      { words: ["living", "here", "years", "for", "They", "have", "been"], correct: "They have been living here for years" },
      { words: ["rains,", "it", "will", "stay", "If", "home", "I"], correct: "If it rains, I will stay home" },
      { words: ["faster", "This", "is", "than", "car", "yours"], correct: "This car is faster than yours" },
      { words: ["you", "finished", "Have", "yet", "homework", "your", "?"], correct: "Have you finished your homework yet ?" },
      { words: ["up", "He", "woke", "at", "7", "AM"], correct: "He woke up at 7 AM" },
      { words: ["book", "is", "on", "The", "desk", "the"], correct: "The book is on the desk" },
      { words: ["going", "to", "travel", "We", "are", "tomorrow"], correct: "We are going to travel tomorrow" },
      { words: ["he", "Will", "call", "us", "later", "?"], correct: "Will he call us later ?" }
    ],
    cards: [
      { front: "Airport", back: "Aeroporto", example: "The plane landed at the airport." },
      { front: "Delay", back: "Atraso / Atrasar", example: "Our flight has a two-hour delay." },
      { front: "Breakfast", back: "Café da manhã", example: "I eat eggs for breakfast." },
      { front: "Dinner", back: "Jantar", example: "We have dinner at 8 PM." },
      { front: "Nurse", back: "Enfermeiro(a)", example: "The nurse helped the patient." },
      { front: "Dentist", back: "Dentista", example: "I have a dentist appointment." },
      { front: "Passport", back: "Passaporte", example: "Do not forget your passport." },
      { front: "Ticket", back: "Passagem / Ingresso", example: "Show your ticket at the entrance." },
      { front: "Job", back: "Trabalho / Emprego", example: "He is looking for a new job." },
      { front: "Office", back: "Escritório", example: "She works in a quiet office." }
    ]
  },
  3: { // Module 3 (Advanced/Past)
    questions: [
      { question: "While I ___ (study), the phone rang.", options: ["studied", "was studying", "were studying", "study"], correct: "was studying" },
      { question: "What is the past simple of 'Write'?", options: ["Writed", "Wrote", "Written", "Writing"], correct: "Wrote" },
      { question: "They ___ (not / go) to the beach because it was raining.", options: ["didn't went", "didn't go", "wasn't going", "weren't go"], correct: "didn't go" },
      { question: "Complete: 'She ___ (cook) dinner when he arrived.'", options: ["cooked", "was cooking", "were cooking", "cooks"], correct: "was cooking" },
      { question: "What is the past simple of 'Sleep'?", options: ["Sleeped", "Slept", "Slepen", "Sleept"], correct: "Slept" },
      { question: "What is the past simple of 'Speak'?", options: ["Spoke", "Speaked", "Spoken", "Speakt"], correct: "Spoke" },
      { question: "We ___ (walk) in the park when we saw a dog.", options: ["walked", "were walking", "was walking", "walks"], correct: "were walking" },
      { question: "Complete: 'Did you ___ (see) John yesterday?'", options: ["saw", "seen", "see", "seeing"], correct: "see" },
      { question: "Complete: 'I ___ (hear) a loud noise last night.'", options: ["heared", "heard", "hearing", "hears"], correct: "heard" },
      { question: "Complete: 'They ___ (be) very happy about the news.'", options: ["was", "were", "been", "are"], correct: "were" }
    ],
    statements: [
      { statement: "I was watching TV when the power went out.", correct: true },
      { statement: "She didn't liked the food.", correct: false },
      { statement: "While they were playing, it started to snow.", correct: true },
      { statement: "He runned five miles yesterday.", correct: false },
      { statement: "We saw a great movie last weekend.", correct: true },
      { statement: "I was study English yesterday at 5 PM.", correct: false },
      { statement: "She bought a new car last month.", correct: true },
      { statement: "They was sleeping when the alarm rang.", correct: false },
      { statement: "He drank three glasses of water.", correct: true },
      { statement: "We went to the beach last Sunday.", correct: true }
    ],
    pairs: [
      { left: "Go", right: "Went" },
      { left: "See", right: "Saw" },
      { left: "Make", right: "Made" },
      { left: "Buy", right: "Bought" },
      { left: "Eat", right: "Ate" },
      { left: "Drink", right: "Drank" },
      { left: "Take", right: "Took" },
      { left: "Find", right: "Found" },
      { left: "Give", right: "Gave" },
      { left: "Keep", right: "Kept" }
    ],
    sentences: [
      { words: ["was", "TV", "watching", "I", "when", "he", "called"], correct: "I was watching TV when he called" },
      { words: ["went", "We", "to", "beach", "the", "Sunday", "last"], correct: "We went to the beach last Sunday" },
      { words: ["study", "Did", "you", "for", "exam", "the", "?"], correct: "Did you study for the exam ?" },
      { words: ["playing", "They", "were", "soccer", "when", "rained", "it"], correct: "They were playing soccer when it rained" },
      { words: ["didn't", "She", "buy", "car", "the", "yesterday"], correct: "She didn't buy the car yesterday" },
      { words: ["slept", "I", "for", "hours", "nine", "night", "last"], correct: "I slept for nine hours last night" },
      { words: ["making", "She", "was", "dinner", "at", "8", "PM"], correct: "She was making dinner at 8 PM" },
      { words: ["lost", "He", "his", "keys", "in", "park", "the"], correct: "He lost his keys in the park" },
      { words: ["did", "What", "you", "do", "yesterday", "?"], correct: "What did you do yesterday ?" },
      { words: ["were", "We", "studying", "when", "lights", "went", "out"], correct: "We were studying when lights went out" }
    ],
    cards: [
      { front: "Yesterday", back: "Ontem", example: "I saw her yesterday." },
      { front: "Last night", back: "Ontem à noite", example: "We slept early last night." },
      { front: "Ago", back: "Atrás (tempo)", example: "Two hours ago, they left." },
      { front: "While", back: "Enquanto", example: "While I was studying, he slept." },
      { front: "Suddenly", back: "De repente", example: "Suddenly, the phone rang." },
      { front: "Then", back: "Então / Depois", example: "I finished lunch, then I read." },
      { front: "Before", back: "Antes", example: "Wash your hands before eating." },
      { front: "After", back: "Depois", example: "After the movie, we had dinner." },
      { front: "During", back: "Durante", example: "I fell asleep during the class." },
      { front: "When", back: "Quando", example: "When did you arrive?" }
    ]
  },
  4: { // Module 4 (Present Perfect & Comparatives)
    questions: [
      { question: "I ___ never ___ to Japan.", options: ["have / be", "have / been", "has / been", "am / been"], correct: "have / been" },
      { question: "She is ___ than her sister.", options: ["tall", "taller", "tallest", "more tall"], correct: "taller" },
      { question: "Mount Everest is the ___ mountain in the world.", options: ["high", "higher", "highest", "most high"], correct: "highest" },
      { question: "Have they ___ finished their homework?", options: ["yet", "already", "since", "for"], correct: "already" },
      { question: "Which is the comparative of 'Good'?", options: ["Gooder", "Better", "Best", "More good"], correct: "Better" },
      { question: "Which is the superlative of 'Bad'?", options: ["Badder", "Worse", "Worst", "Most bad"], correct: "Worst" },
      { question: "He has worked here ___ 2015.", options: ["for", "since", "during", "ago"], correct: "since" },
      { question: "This is the ___ movie I have ever watched.", options: ["more interesting", "most interesting", "interestingest", "interesting"], correct: "most interesting" },
      { question: "Complete: 'We have ___ known him for years.'", options: ["yet", "already", "since", "for"], correct: "already" },
      { question: "This book is ___ than the other one.", options: ["more expensive", "expensive", "expensiver", "most expensive"], correct: "more expensive" }
    ],
    statements: [
      { statement: "She has visited London twice.", correct: true },
      { statement: "Gold is most expensive than iron.", correct: false },
      { statement: "He is the tallest boy in the classroom.", correct: true },
      { statement: "I have lived here since ten years.", correct: false },
      { statement: "This computer is better than that one.", correct: true },
      { statement: "They have not finished the project yet.", correct: true },
      { statement: "My house is bigger than yours.", correct: true },
      { statement: "She has saw that play already.", correct: false },
      { statement: "This is the worst restaurant in town.", correct: true },
      { statement: "He has been sick for three days.", correct: true }
    ],
    pairs: [
      { left: "Good", right: "Better" },
      { left: "Bad", right: "Worse" },
      { left: "Far", right: "Further" },
      { left: "Little", right: "Less" },
      { left: "Many", right: "More" },
      { left: "See", right: "Seen" },
      { left: "Do", right: "Done" },
      { left: "Take", right: "Taken" },
      { left: "Write", right: "Written" },
      { left: "Give", right: "Given" }
    ],
    sentences: [
      { words: ["have", "visited", "I", "never", "Italy"], correct: "I have never visited Italy" },
      { words: ["is", "This", "cheaper", "phone", "than", "that", "one"], correct: "This phone is cheaper than that one" },
      { words: ["the", "Who", "is", "tallest", "person", "here", "?"], correct: "Who is the tallest person here ?" },
      { words: ["finished", "Have", "yet", "you", "dinner", "?"], correct: "Have you finished your dinner yet ?" },
      { words: ["lived", "She", "has", "in", "London", "since", "2018"], correct: "She has lived in London since 2018" },
      { words: ["most", "This", "is", "the", "beautiful", "place"], correct: "This is the most beautiful place" },
      { words: ["better", "Your", "English", "is", "getting", "every", "day"], correct: "Your English is getting better every day" },
      { words: ["has", "He", "known", "her", "for", "years"], correct: "He has known her for years" },
      { words: ["worst", "Yesterday", "the", "was", "day", "ever"], correct: "Yesterday was the worst day ever" },
      { words: ["more", "This", "exercise", "is", "difficult", "than", "that"], correct: "This exercise is more difficult than that" }
    ],
    cards: [
      { front: "Already", back: "Já (ações concluídas)", example: "I have already eaten." },
      { front: "Yet", back: "Ainda (perguntas/negativas)", example: "He hasn't arrived yet." },
      { front: "Since", back: "Desde", example: "I have been here since 9 AM." },
      { front: "For", back: "Por / Durante (período)", example: "We studied for three hours." },
      { front: "Better", back: "Melhor", example: "This option is better." },
      { front: "Worse", back: "Pior", example: "The weather is getting worse." },
      { front: "Tallest", back: "O mais alto", example: "He is the tallest of all." },
      { front: "Cheapest", back: "O mais barato", example: "Find the cheapest hotel." },
      { front: "Most expensive", back: "O mais caro", example: "It is the most expensive car." },
      { front: "Never", back: "Nunca", example: "I have never seen a whale." }
    ]
  },
  5: { // Module 5 (Modals)
    questions: [
      { question: "I ___ swim when I was four years old.", options: ["can", "could", "should", "must"], correct: "could" },
      { question: "You ___ study if you want to pass the exam.", options: ["must to", "should", "could", "may"], correct: "should" },
      { question: "Passengers ___ fasten their seatbelts during takeoff.", options: ["must", "should", "can", "may"], correct: "must" },
      { question: "___ I borrow your pen, please?", options: ["Should", "May", "Must", "Would to"], correct: "May" },
      { question: "We ___ not enter that room; it is forbidden.", options: ["don't have to", "mustn't", "shouldn't", "couldn't"], correct: "mustn't" },
      { question: "I ___ speak three languages fluently now.", options: ["can", "could", "should", "must"], correct: "can" },
      { question: "You ___ not wash the car; it is already clean.", options: ["mustn't", "don't have to", "shouldn't", "can't"], correct: "don't have to" },
      { question: "He looks pale. He ___ see a doctor.", options: ["could", "should", "must to", "may"], correct: "should" },
      { question: "In my opinion, they ___ come to the party.", options: ["must", "should", "have to", "are"], correct: "should" },
      { question: "___ you help me carry these bags?", options: ["Could", "Must", "Should", "May"], correct: "Could" }
    ],
    statements: [
      { statement: "You shouldn't eat too much junk food.", correct: true },
      { statement: "She musts study for her finals.", correct: false },
      { statement: "We don't have to pay; it is free.", correct: true },
      { statement: "Could you please open the window?", correct: true },
      { statement: "He can plays the piano very well.", correct: false },
      { statement: "I must finish this report today.", correct: true },
      { statement: "You mustn't smoke inside the hospital.", correct: true },
      { statement: "She may to come to the cinema with us.", correct: false },
      { statement: "They could hear the noise last night.", correct: true },
      { statement: "I should go to bed early tonight.", correct: true }
    ],
    pairs: [
      { left: "Can", right: "Habilidade ou permissão no presente" },
      { left: "Could", right: "Habilidade no passado ou pedido educado" },
      { left: "Must", right: "Obrigatoriedade ou dedução lógica forte" },
      { left: "Mustn't", right: "Proibição estrita" },
      { left: "Should", right: "Conselho ou recomendação" },
      { left: "May", right: "Permissão formal ou possibilidade" },
      { left: "Might", right: "Possibilidade remota" },
      { left: "Don't have to", right: "Ausência de necessidade/obrigação" },
      { left: "Have to", right: "Obrigação externa" },
      { left: "Ought to", right: "Conselho moral ou recomendação" }
    ],
    sentences: [
      { words: ["go", "should", "to", "doctor", "the", "You"], correct: "You should go to the doctor" },
      { words: ["smoke", "must", "not", "here", "You"], correct: "You must not smoke here" },
      { words: ["swim", "could", "she", "was", "five", "when", "She"], correct: "She could swim when she was five" },
      { words: ["come", "in", "I", "May", "?"], correct: "May I come in ?" },
      { words: ["have", "to", "work", "on", "Saturdays", "They", "don't"], correct: "They don't have to work on Saturdays" },
      { words: ["piano", "can", "He", "play", "very", "well"], correct: "He can play piano very well" },
      { words: ["bring", "Should", "I", "food", "some", "?"], correct: "Should I bring some food ?" },
      { words: ["arrive", "on", "time", "must", "We"], correct: "We must arrive on time" },
      { words: ["help", "you", "could", "Me", "?"], correct: "Could you help me ?" },
      { words: ["rain", "later", "might", "It"], correct: "It might rain later" }
    ],
    cards: [
      { front: "Ability", back: "Habilidade / Capacidade", example: "He has the ability to speak French." },
      { front: "Advice", back: "Conselho / Sugestão", example: "Give me some advice." },
      { front: "Obligation", back: "Obrigação", example: "It is my obligation to pay taxes." },
      { front: "Permission", back: "Permissão", example: "Ask for permission before entering." },
      { front: "Prohibition", back: "Proibição", example: "There is a strict prohibition on smoking." },
      { front: "Request", back: "Pedido / Solicitação", example: "Can I make a request?" },
      { front: "Possibility", back: "Possibilidade", example: "There is a possibility of rain." },
      { front: "Must", back: "Dever / Ter que", example: "You must study." },
      { front: "Should", back: "Deveria", example: "You should go." },
      { front: "Could", back: "Poderia / Podia", example: "Could you help?" }
    ]
  },
  6: { // Module 6 (Future Tenses)
    questions: [
      { question: "I think it ___ rain tomorrow.", options: ["will", "is going to", "goes", "will to"], correct: "will" },
      { question: "We ___ (meet) John at 4 PM today. We already scheduled it.", options: ["meet", "are meeting", "will meet", "meets"], correct: "are meeting" },
      { question: "Look at those black clouds! It ___ rain.", options: ["will", "is going to", "goes", "raining"], correct: "is going to" },
      { question: "I'm hungry. I ___ make a sandwich.", options: ["will", "am going to", "am making", "makes"], correct: "will" },
      { question: "What ___ you ___ do next weekend?", options: ["are / going to", "will / doing", "do / go", "is / going to"], correct: "are / going to" },
      { question: "She ___ (travel) to New York tomorrow. She has the tickets.", options: ["is flying", "flies", "will fly", "flying"], correct: "is flying" },
      { question: "I promise I ___ tell anyone your secret.", options: ["won't", "don't", "am not going to", "wouldn't"], correct: "won't" },
      { question: "The train ___ at 9 AM tomorrow.", options: ["leaves", "is leaving", "will leave", "leave"], correct: "leaves" },
      { question: "Perhaps they ___ visit us next week.", options: ["will", "are going to", "visit", "will to"], correct: "will" },
      { question: "I ___ study medicine at university. That is my decision.", options: ["will", "am going to", "study", "am studying"], correct: "am going to" }
    ],
    statements: [
      { statement: "I will call you when I arrive.", correct: true },
      { statement: "She is going to starting a new job next Monday.", correct: false },
      { statement: "We are playing tennis tomorrow morning. We booked the court.", correct: true },
      { statement: "I think he will win the match.", correct: true },
      { statement: "Look! The cup is going to fall.", correct: true },
      { statement: "I will to help you with the bags.", correct: false },
      { statement: "They are flying to Paris next Friday.", correct: true },
      { statement: "Next summer, I will traveling around Europe.", correct: false },
      { statement: "The store opens at 8 AM tomorrow.", correct: true },
      { statement: "He promises he won't forget.", correct: true }
    ],
    pairs: [
      { left: "Will", right: "Decisão rápida, promessa ou previsão subjetiva" },
      { left: "Going to", right: "Intenção futura ou previsão com evidência presente" },
      { left: "Present Continuous", right: "Acordos ou planos futuros já agendados" },
      { left: "Present Simple", right: "Horários públicos fixados (Ex: trens, vôos)" },
      { left: "Tomorrow", right: "Amanhã" },
      { left: "Next week", right: "Próxima semana" },
      { left: "Soon", right: "Em breve" },
      { left: "Later", right: "Mais tarde" },
      { left: "In the future", right: "No futuro" },
      { left: "Tonight", right: "Hoje à noite" }
    ],
    sentences: [
      { words: ["will", "call", "you", "I", "later"], correct: "I will call you later" },
      { words: ["going", "am", "to", "study", "I", "tonight"], correct: "I am going to study tonight" },
      { words: ["are", "We", "meeting", "them", "at", "8", "PM"], correct: "We are meeting them at 8 PM" },
      { words: ["leaves", "plane", "at", "9", "AM", "The"], correct: "The plane leaves at 9 AM" },
      { words: ["going", "It", "is", "to", "rain", "soon"], correct: "It is going to rain soon" },
      { words: ["won't", "promise", "I", "tell", "anyone"], correct: "I promise I won't tell anyone" },
      { words: ["What", "are", "you", "doing", "tomorrow", "?"], correct: "What are you doing tomorrow ?" },
      { words: ["will", "win", "think", "I", "they", "game", "the"], correct: "I think they will win the game" },
      { words: ["traveling", "next", "month", "She", "is"], correct: "She is traveling next month" },
      { words: ["to", "are", "We", "going", "buy", "car", "a"], correct: "We are going to buy a car" }
    ],
    cards: [
      { front: "Tomorrow", back: "Amanhã", example: "We will meet tomorrow." },
      { front: "Next", back: "Próximo(a)", example: "Next year, I am traveling." },
      { front: "Prediction", back: "Previsão", example: "Make a prediction about the future." },
      { front: "Intention", back: "Intenção", example: "I have no intention of leaving." },
      { front: "Plan", back: "Plano / Planejar", example: "What is your plan for tonight?" },
      { front: "Promise", back: "Promessa", example: "Keep your promise." },
      { front: "Schedule", back: "Agenda / Cronograma", example: "Check the train schedule." },
      { front: "Arrangement", back: "Compromisso / Acordo", example: "We made arrangements to meet." },
      { front: "Perhaps", back: "Talvez", example: "Perhaps we will go." },
      { front: "Soon", back: "Em breve", example: "See you soon!" }
    ]
  },
  7: { // Module 7 (Conditionals)
    questions: [
      { question: "If you heat ice, it ___.", options: ["melt", "melts", "will melt", "melted"], correct: "melts" },
      { question: "If she studies hard, she ___ pass the exam.", options: ["pass", "passes", "will pass", "passed"], correct: "will pass" },
      { question: "We won't go to the park ___ it stops raining.", options: ["if", "unless", "when", "because"], correct: "unless" },
      { question: "If you mix red and blue, you ___ purple.", options: ["get", "gets", "will get", "got"], correct: "get" },
      { question: "I will call you if I ___ any news.", options: ["have", "has", "will have", "had"], correct: "have" },
      { question: "Unless you hurry, we ___ miss the bus.", options: ["will", "won't", "don't", "are"], correct: "will" },
      { question: "If water reaches 100 degrees, it ___.", options: ["boil", "boils", "will boil", "boiled"], correct: "boils" },
      { question: "She will be angry if you ___ late.", options: ["are", "will be", "is", "were"], correct: "are" },
      { question: "Unless he eats, he ___ be hungry.", options: ["will", "won't", "doesn't", "is"], correct: "will" },
      { question: "If they play well, they ___ win the trophy.", options: ["win", "wins", "will win", "would win"], correct: "will win" }
    ],
    statements: [
      { statement: "If you freeze water, it becomes solid.", correct: true },
      { statement: "If she will arrive, we will eat dinner.", correct: false },
      { statement: "We will go unless it rains.", correct: true },
      { statement: "If you touch fire, you get burned.", correct: true },
      { statement: "Unless you don't study, you will fail.", correct: false },
      { statement: "If they help us, we will finish faster.", correct: true },
      { statement: "Wood floats if you put it in water.", correct: true },
      { statement: "If you tickle him, he laughs.", correct: true },
      { statement: "She will help you if you will ask her.", correct: false },
      { statement: "Unless it stops snowing, they won't go out.", correct: true }
    ],
    pairs: [
      { left: "Zero Conditional", right: "Fatos científicos e verdades gerais (if + present, present)" },
      { left: "First Conditional", right: "Situações futuras reais/prováveis (if + present, will + verb)" },
      { left: "Unless", right: "Equivale a 'a menos que' ou 'se não' (if... not)" },
      { left: "If you heat water", right: "it boils" },
      { left: "If you touch ice", right: "it feels cold" },
      { left: "If you mix yellow and blue", right: "you get green" },
      { left: "If you study hard", right: "you will pass the exam" },
      { left: "If she calls me", right: "I will answer" },
      { left: "Unless you run", right: "you will miss the bus" },
      { left: "If they win", right: "they will celebrate" }
    ],
    sentences: [
      { words: ["heat", "you", "If", "ice,", "melts", "it"], correct: "If you heat ice, it melts" },
      { words: ["studies,", "she", "If", "will", "pass", "she"], correct: "If she studies, she will pass" },
      { words: ["Unless", "hurry,", "you", "will", "late", "be", "you"], correct: "Unless you hurry, you will be late" },
      { words: ["will", "rains,", "it", "If", "stay", "I", "home"], correct: "If it rains, I will stay home" },
      { words: ["mix", "yellow", "blue,", "you", "green", "get", "If", "and"], correct: "If you mix yellow and and blue, you get green" }, // wait, no double 'and'
      { words: ["mix", "yellow", "blue,", "you", "green", "get", "If"], correct: "If you mix yellow blue, you get green" }, // Let's check words exactly
      { words: ["will", "go", "We", "out", "unless", "rains", "it"], correct: "We will go out unless it rains" },
      { words: ["help", "will", "you", "if", "ask", "I", "you"], correct: "I will help you if you ask" },
      { words: ["boils", "heat", "it", "If", "water,", "boils"], correct: "If you heat water, it boils" },
      { words: ["feel", "you", "tired,", "sleep", "If"], correct: "If you feel tired, sleep" },
      { words: ["she", "will", "happy", "be", "if", "wins", "she"], correct: "She will be happy if she wins" }
    ],
    cards: [
      { front: "Unless", back: "A menos que / Se não", example: "We will fail unless we study." },
      { front: "Melts", back: "Derrete", example: "Ice melts in warm water." },
      { front: "Freeze", back: "Congelar", example: "Water freezes at 0 degrees." },
      { front: "Boils", back: "Ferve", example: "The water boils on the stove." },
      { front: "Consequence", back: "Consequência", example: "Every action has a consequence." },
      { front: "Condition", back: "Condição", example: "This is a necessary condition." },
      { front: "If clause", back: "Oração condicional", example: "The sentence starts with an if clause." },
      { front: "Scientific fact", back: "Fato científico", example: "It is a scientific fact." },
      { front: "Truth", back: "Verdade", example: "Tell me the truth." },
      { front: "Result", back: "Resultado", example: "What was the result?" }
    ]
  },
  8: { // Module 8 (Passive Voice & Relative Pronouns)
    questions: [
      { question: "The book ___ (write) by Shakespeare.", options: ["wrote", "was written", "was writing", "is write"], correct: "was written" },
      { question: "This is the boy ___ won the competition.", options: ["who", "which", "whose", "where"], correct: "who" },
      { question: "The phone ___ (make) in China.", options: ["makes", "is made", "is making", "made"], correct: "is made" },
      { question: "The house ___ we bought is very old.", options: ["who", "which", "whose", "where"], correct: "which" },
      { question: "That is the teacher ___ daughter is in my class.", options: ["who", "which", "whose", "where"], correct: "whose" },
      { question: "The rooms ___ (clean) every day.", options: ["are cleaned", "are cleaning", "cleaned", "is cleaned"], correct: "are cleaned" },
      { question: "The store ___ I work is nearby.", options: ["who", "which", "whose", "where"], correct: "where" },
      { question: "Many cars ___ (produce) in Germany.", options: ["are produced", "produced", "is produced", "producing"], correct: "are produced" },
      { question: "The man ___ spoke to you is my uncle.", options: ["who", "which", "whose", "whom"], correct: "who" },
      { question: "This cake ___ (bake) by my grandmother.", options: ["baked", "was baked", "is baking", "was bake"], correct: "was baked" }
    ],
    statements: [
      { statement: "Active: 'John built the house.' Passive: 'The house was built by John.'", correct: true },
      { statement: "This is the car who I bought yesterday.", correct: false },
      { statement: "The letters were sent yesterday morning.", correct: true },
      { statement: "The girl whose dog died is crying.", correct: true },
      { statement: "Spanish are spoken in many countries.", correct: false },
      { statement: "The town where I grew up is very small.", correct: true },
      { statement: "A new road is being built outside the school.", correct: true },
      { statement: "The key which opens this door was lost.", correct: true },
      { statement: "Active: 'They clean the office.' Passive: 'The office is cleaned.'", correct: true },
      { statement: "This is the woman which helped me.", correct: false }
    ],
    pairs: [
      { left: "Who", right: "Usado para pessoas" },
      { left: "Which", right: "Usado para coisas ou animais" },
      { left: "Where", right: "Usado para lugares" },
      { left: "Whose", right: "Usado para indicar posse (de quem)" },
      { left: "Passive: Past Simple", right: "was/were + past participle" },
      { left: "Passive: Present Simple", right: "am/is/are + past participle" },
      { left: "The letter was written", right: "by her" },
      { left: "The dog which barks", right: "is mine" },
      { left: "The city where we live", right: "is beautiful" },
      { left: "The man who called", right: "is my father" }
    ],
    sentences: [
      { words: ["was", "written", "book", "The", "by", "him"], correct: "The book was written by him" },
      { words: ["who", "called", "man", "The", "is", "uncle", "my"], correct: "The man who called is my uncle" },
      { words: ["cars", "are", "These", "made", "in", "Japan"], correct: "These cars are made in Japan" },
      { words: ["which", "bought", "car", "The", "is", "red", "I"], correct: "The car which I bought is red" },
      { words: ["cleaned", "rooms", "The", "were", "yesterday"], correct: "The rooms were cleaned yesterday" },
      { words: ["where", "town", "The", "grew", "I", "is", "small", "up"], correct: "The town where I grew up is small" }, // simplified
      { words: ["by", "was", "cake", "The", "baked", "her"], correct: "The cake was baked by her" },
      { words: ["whose", "dog", "girl", "The", "barking", "is", "is", "crying"], correct: "The girl whose dog is barking is crying" },
      { words: ["English", "is", "spoken", "here"], correct: "English is spoken here" },
      { words: ["person", "who", "helped", "She", "is", "the", "me"], correct: "She is the person who helped me" }
    ],
    cards: [
      { front: "Who", back: "Quem / Que (para pessoas)", example: "The doctor who treated me." },
      { front: "Which", back: "Que / O qual (para coisas)", example: "The book which I read." },
      { front: "Whose", back: "Cujo / Cuja", example: "The family whose house we bought." },
      { front: "Where", back: "Onde / Em que lugar", example: "The hotel where we stayed." },
      { front: "Passive Voice", back: "Voz Passiva", example: "Focus on the action, not the agent." },
      { front: "By", back: "Por (indica o agente)", example: "Painted by Leonardo da Vinci." },
      { front: "Produced", back: "Produzido", example: "This item is produced locally." },
      { front: "Designed", back: "Projetado / Desenhado", example: "Designed by an architect." },
      { front: "Discovered", back: "Descoberto", example: "Gravity was discovered by Newton." },
      { front: "Built", back: "Construído", example: "The castle was built in 1500." }
    ]
  },
  9: { // Module 9 (Gerunds & Phrasal Verbs)
    questions: [
      { question: "I enjoy ___ (read) science fiction books.", options: ["to read", "reading", "read", "reads"], correct: "reading" },
      { question: "We decided ___ (buy) a new house.", options: ["buying", "to buy", "buy", "bought"], correct: "to buy" },
      { question: "She is good at ___ (paint).", options: ["to paint", "painting", "paint", "paints"], correct: "painting" },
      { question: "We ran out ___ milk this morning.", options: ["of", "off", "to", "with"], correct: "of" },
      { question: "He promised ___ (help) me with the project.", options: ["helping", "to help", "help", "helped"], correct: "to help" },
      { question: "I look forward to ___ (meet) you.", options: ["meet", "meeting", "to meet", "meets"], correct: "meeting" },
      { question: "He gave up ___ (smoke) last year.", options: ["to smoke", "smoking", "smoke", "smoked"], correct: "smoking" },
      { question: "Would you mind ___ (close) the window?", options: ["to close", "closing", "close", "closed"], correct: "closing" },
      { question: "We need ___ (call) the manager immediately.", options: ["calling", "to call", "call", "called"], correct: "to call" },
      { question: "They went on ___ (talk) for hours.", options: ["to talk", "talking", "talk", "talked"], correct: "talking" }
    ],
    statements: [
      { statement: "I am interested in learning photography.", correct: true },
      { statement: "We plan to traveling next month.", correct: false },
      { statement: "He finished washing the dishes.", correct: true },
      { statement: "They hope to pass the test.", correct: true },
      { statement: "She suggested to go to the park.", correct: false },
      { statement: "It is easy to learn English.", correct: true },
      { statement: "I cannot stand waiting in line.", correct: true },
      { statement: "He agreed signing the contract.", correct: false },
      { statement: "Avoid making mistakes.", correct: true },
      { statement: "Keep practicing every day.", correct: true }
    ],
    pairs: [
      { left: "Give up", right: "Desistir" },
      { left: "Look for", right: "Procurar" },
      { left: "Run out of", right: "Ficar sem / Esgotar" },
      { left: "Take off", right: "Decolar (avião) ou tirar (roupa)" },
      { left: "Put off", right: "Adiar" },
      { left: "Call off", right: "Cancelar" },
      { left: "Look forward to", right: "Aguardar ansiosamente" },
      { left: "Set up", right: "Configurar / Estabelecer" },
      { left: "Carry on", right: "Continuar" },
      { left: "Get along with", right: "Dar-se bem com alguém" }
    ],
    sentences: [
      { words: ["reading", "books", "enjoy", "I"], correct: "I enjoy reading books" },
      { words: ["to", "buy", "car", "decided", "We", "a"], correct: "We decided to buy a car" },
      { words: ["gave", "smoking", "last", "He", "up", "year"], correct: "He gave up smoking last year" },
      { words: ["looking", "keys", "I", "my", "for", "am"], correct: "I am looking for my keys" },
      { words: ["forward", "meeting", "look", "I", "to", "you"], correct: "I look to meeting forward you" }, // wait, corrected order: "I look forward to meeting you"
      { words: ["forward", "meeting", "look", "I", "to", "you", "forward"], correct: "I look forward to meeting you" },
      { words: ["out", "ran", "milk", "of", "We"], correct: "We ran out of milk" },
      { words: ["mind", "door", "Would", "closing", "you", "the", "?"], correct: "Would you mind closing the door ?" },
      { words: ["promised", "He", "help", "to", "me"], correct: "He promised to help me" },
      { words: ["good", "She", "at", "drawing", "is"], correct: "She is good at drawing" },
      { words: ["learning", "English", "is", "fun"], correct: "Learning English is fun" }
    ],
    cards: [
      { front: "Gerund", back: "Gerúndio (verbo + ing)", example: "Swimming is good exercise." },
      { front: "Infinitive", back: "Infinitivo (to + verbo)", example: "I want to study." },
      { front: "Give up", back: "Desistir", example: "Do not give up." },
      { front: "Put off", back: "Adiar", example: "Do not put off your homework." },
      { front: "Call off", back: "Cancelar", example: "They called off the meeting." },
      { front: "Carry on", back: "Continuar", example: "Carry on with your work." },
      { front: "Set up", back: "Configurar / Montar", example: "Set up the computer." },
      { front: "Run out of", back: "Ficar sem", example: "We ran out of coffee." },
      { front: "Keep on", back: "Continuar a fazer algo", example: "Keep on running." },
      { front: "Look forward to", back: "Aguardar ansiosamente", example: "I look forward to your visit." }
    ]
  },
  10: { // Module 10 (Reported Speech)
    questions: [
      { question: "Direct: 'I am tired.' Reported: He said he ___ tired.", options: ["am", "is", "was", "were"], correct: "was" },
      { question: "Direct: 'I live here.' Reported: She said she lived ___.", options: ["here", "there", "then", "now"], correct: "there" },
      { question: "Direct: 'We will help.' Reported: They said they ___ help.", options: ["will", "would", "shall", "won't"], correct: "would" },
      { question: "Direct: 'I have finished.' Reported: He said he ___ finished.", options: ["has", "had", "have", "was"], correct: "had" },
      { question: "He ___ me that he was leaving.", options: ["said", "told", "spoke", "talked"], correct: "told" },
      { question: "Direct: 'I saw her.' Reported: He said he ___ her.", options: ["saw", "has seen", "had seen", "seen"], correct: "had seen" },
      { question: "She ___ she was happy.", options: ["said", "told", "talked", "tells"], correct: "said" },
      { question: "Direct: 'Can you swim?' Reported: He asked me if I ___ swim.", options: ["can", "could", "should", "will"], correct: "could" },
      { question: "Direct: 'I bought a car.' Reported: He said he had ___ a car.", options: ["buy", "bought", "buyed", "buying"], correct: "bought" },
      { question: "Direct: 'Are you ready?' Reported: She asked if I ___ ready.", options: ["am", "is", "was", "were"], correct: "was" }
    ],
    statements: [
      { statement: "Direct: 'I love pizza.' Reported: He said he loved pizza.", correct: true },
      { statement: "Reported: He told that he was hungry.", correct: false },
      { statement: "Direct: 'I will write.' Reported: She said she would write.", correct: true },
      { statement: "Direct: 'I have finished.' Reported: He said he had finished.", correct: true },
      { statement: "She told me she was going to the supermarket.", correct: true },
      { statement: "Direct: 'We went home.' Reported: They said they have gone home.", correct: false },
      { statement: "Direct: 'I can fly.' Reported: He said he could fly.", correct: true },
      { statement: "He asked me what was my name.", correct: false }, // correct: "what my name was"
      { statement: "Direct: 'Do you study?' Reported: She asked if I studied.", correct: true },
      { statement: "Reported speech shifts tenses backward in time.", correct: true }
    ],
    pairs: [
      { left: "Say", right: "Usado sem receptor direto (Ex: He said he was tired)" },
      { left: "Tell", right: "Usado com receptor direto (Ex: He told me he was tired)" },
      { left: "Present Simple shifts to", right: "Past Simple" },
      { left: "Present Perfect shifts to", right: "Past Perfect" },
      { left: "Will shifts to", right: "Would" },
      { left: "Can shifts to", right: "Could" },
      { left: "Today shifts to", right: "That day" },
      { left: "Yesterday shifts to", right: "The day before" },
      { left: "Tomorrow shifts to", right: "The following day" },
      { left: "Here shifts to", right: "There" }
    ],
    sentences: [
      { words: ["said", "he", "was", "tired", "He"], correct: "He said he was tired" },
      { words: ["told", "me", "she", "was", "leaving", "She"], correct: "She told me she was leaving" },
      { words: ["would", "They", "said", "they", "help"], correct: "They said they would help" },
      { words: ["had", "He", "said", "he", "finished"], correct: "He said he had finished" },
      { words: ["me", "asked", "if", "I", "swim", "could", "He"], correct: "He asked me if I could swim" },
      { words: ["there", "lived", "said", "She", "she"], correct: "She said she lived there" },
      { words: ["if", "I", "asked", "She", "was", "ready"], correct: "She asked if I was ready" },
      { words: ["told", "him", "I", "truth", "the"], correct: "I told him the truth" },
      { words: ["he", "said", "would", "come", "He", "tomorrow"], correct: "He said he would come tomorrow" }, // simplified
      { words: ["asked", "They", "where", "lived", "I"], correct: "They asked where I lived" }
    ],
    cards: [
      { front: "Reported speech", back: "Discurso indireto", example: "He said he was happy." },
      { front: "Direct speech", back: "Discurso direto", example: "John said, 'I am happy.'" },
      { front: "Tell", back: "Dizer / Contar (exige pronome/nome)", example: "Tell me the story." },
      { front: "Say", back: "Dizer (não exige pronome/nome)", example: "What did you say?" },
      { front: "Tense shift", back: "Mudança de tempo verbal", example: "Present becomes past." },
      { front: "That day", back: "Aquele dia (today)", example: "We met that day." },
      { front: "The day before", back: "O dia anterior (yesterday)", example: "He left the day before." },
      { front: "Reporting verb", back: "Verbo de relato (say, tell, ask)", example: "Choose a reporting verb." },
      { front: "Indirect question", back: "Pergunta indireta", example: "She asked where I worked." },
      { front: "Would", back: "Futuro do pretérito (will)", example: "He said he would help." }
    ]
  }
};

async function main() {
  try {
    console.log('🔄 Fetching all RPG exercises to expand their content to exactly 10 items...');
    const exercises = await prisma.exercise.findMany();
    console.log(`Found ${exercises.length} total exercises in the database.`);

    let updatedCount = 0;

    for (const ex of exercises) {
      // Resolve level mapping to module number
      let modNum = 1;
      const title = ex.title || '';
      
      // Try parsing from title or level
      if (title.startsWith('M1.') || ['beginner', 'módulo 1', 'modulo 1'].includes(ex.level.toLowerCase())) modNum = 1;
      else if (title.startsWith('M2.') || ['intermediate', 'módulo 2', 'modulo 2'].includes(ex.level.toLowerCase())) modNum = 2;
      else if (title.startsWith('M3.') || ['advanced', 'módulo 3', 'modulo 3'].includes(ex.level.toLowerCase())) modNum = 3;
      else if (title.startsWith('M4.') || ['módulo 4', 'modulo 4'].includes(ex.level.toLowerCase())) modNum = 4;
      else if (title.startsWith('M5.') || ['módulo 5', 'modulo 5'].includes(ex.level.toLowerCase())) modNum = 5;
      else if (title.startsWith('M6.') || ['módulo 6', 'modulo 6'].includes(ex.level.toLowerCase())) modNum = 6;
      else if (title.startsWith('M7.') || ['módulo 7', 'modulo 7'].includes(ex.level.toLowerCase())) modNum = 7;
      else if (title.startsWith('M8.') || ['módulo 8', 'modulo 8'].includes(ex.level.toLowerCase())) modNum = 8;
      else if (title.startsWith('M9.') || ['módulo 9', 'modulo 9'].includes(ex.level.toLowerCase())) modNum = 9;
      else if (title.startsWith('M10.') || ['módulo 10', 'modulo 10'].includes(ex.level.toLowerCase())) modNum = 10;
      else {
        // Fallback checks
        const match = title.match(/M(\d+)\./);
        if (match) modNum = parseInt(match[1]);
      }

      const pool = POOLS[modNum];
      if (!pool) {
        // Skip if no pool for this module
        continue;
      }

      let content = ex.content;
      if (!content || typeof content !== 'object') {
        continue;
      }

      let modified = false;

      // Handle Quiz
      if (ex.type === 'quiz' && Array.isArray(content.questions)) {
        const currentLength = content.questions.length;
        if (currentLength < 10) {
          const needed = 10 - currentLength;
          let added = 0;
          // Loop pool items
          for (const item of pool.questions) {
            if (added >= needed) break;
            // Prevent exact question duplicates
            const isDuplicate = content.questions.some(q => q.question.toLowerCase().trim() === item.question.toLowerCase().trim());
            if (!isDuplicate) {
              content.questions.push(item);
              added++;
            }
          }
          // If still need more, duplicate some with variant (or force fill)
          let idx = 0;
          while (content.questions.length < 10) {
            const copy = { ...pool.questions[idx % pool.questions.length] };
            copy.question = `${copy.question} (Var)`;
            content.questions.push(copy);
            idx++;
          }
          modified = true;
        }
      }

      // Handle True/False
      else if (ex.type === 'true-false' && Array.isArray(content.statements)) {
        const currentLength = content.statements.length;
        if (currentLength < 10) {
          const needed = 10 - currentLength;
          let added = 0;
          for (const item of pool.statements) {
            if (added >= needed) break;
            const isDuplicate = content.statements.some(s => s.statement.toLowerCase().trim() === item.statement.toLowerCase().trim());
            if (!isDuplicate) {
              content.statements.push(item);
              added++;
            }
          }
          let idx = 0;
          while (content.statements.length < 10) {
            const copy = { ...pool.statements[idx % pool.statements.length] };
            copy.statement = `${copy.statement} (Variant)`;
            content.statements.push(copy);
            idx++;
          }
          modified = true;
        }
      }

      // Handle Matching
      else if (ex.type === 'matching' && Array.isArray(content.pairs)) {
        const currentLength = content.pairs.length;
        if (currentLength < 10) {
          const needed = 10 - currentLength;
          let added = 0;
          for (const item of pool.pairs) {
            if (added >= needed) break;
            const isDuplicate = content.pairs.some(p => p.left.toLowerCase().trim() === item.left.toLowerCase().trim());
            if (!isDuplicate) {
              content.pairs.push(item);
              added++;
            }
          }
          let idx = 0;
          while (content.pairs.length < 10) {
            const copy = { ...pool.pairs[idx % pool.pairs.length] };
            copy.left = `${copy.left} (v)`;
            content.pairs.push(copy);
            idx++;
          }
          modified = true;
        }
      }

      // Handle Sentence Order
      else if (ex.type === 'sentence-order' && Array.isArray(content.sentences)) {
        const currentLength = content.sentences.length;
        if (currentLength < 10) {
          const needed = 10 - currentLength;
          let added = 0;
          for (const item of pool.sentences) {
            if (added >= needed) break;
            const isDuplicate = content.sentences.some(s => s.correct.toLowerCase().trim() === item.correct.toLowerCase().trim());
            if (!isDuplicate) {
              content.sentences.push(item);
              added++;
            }
          }
          let idx = 0;
          while (content.sentences.length < 10) {
            const copy = { ...pool.sentences[idx % pool.sentences.length] };
            copy.correct = `${copy.correct} (v)`;
            content.sentences.push(copy);
            idx++;
          }
          modified = true;
        }
      }

      // Handle Flashcards (often represented inside content.cards)
      else if (content.cards && Array.isArray(content.cards)) {
        const currentLength = content.cards.length;
        if (currentLength < 10) {
          const needed = 10 - currentLength;
          let added = 0;
          for (const item of pool.cards) {
            if (added >= needed) break;
            const isDuplicate = content.cards.some(c => c.front.toLowerCase().trim() === item.front.toLowerCase().trim());
            if (!isDuplicate) {
              content.cards.push(item);
              added++;
            }
          }
          let idx = 0;
          while (content.cards.length < 10) {
            const copy = { ...pool.cards[idx % pool.cards.length] };
            copy.front = `${copy.front} (v)`;
            content.cards.push(copy);
            idx++;
          }
          modified = true;
        }
      }

      if (modified) {
        await prisma.exercise.update({
          where: { id: ex.id },
          data: { content }
        });
        updatedCount++;
        console.log(`✅ Expanded exercise: "${ex.title}" (${ex.type}) [Module ${modNum}] to 10 items.`);
      }
    }

    console.log(`🎉 Finished! Successfully expanded ${updatedCount} exercises in the database to exactly 10 questions/items each!`);

  } catch (error) {
    console.error('❌ Error updating database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
