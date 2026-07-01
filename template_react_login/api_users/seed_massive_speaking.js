import { prisma } from './src/database/index.js';

async function main() {
  console.log('🌱 Starting seeding of 120 organized speaking exercises (20 per module)...');
  try {
    const firstPlan = await prisma.plan.findFirst();
    const planId = firstPlan ? firstPlan.id : 1;

    console.log(`Using plan ID: ${planId}`);

    const speakingData = [
      // 🌟 Frases Básicas
      {
        title: 'Básicas 1: Greetings',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Good morning! How are you doing today?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 2: Introducing Yourself',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Nice to meet you, my name is John.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 3: Origins',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Where are you from?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 4: Study Habits',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I study English every single day.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 5: Politeness',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Yes, please. Thank you very much.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 6: Spelling Name',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'How do you spell your last name?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 7: Phone Number',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'What is your phone number?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 8: Request Repeat',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Can you repeat that, please?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 9: Wishing Nice Day',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Have a nice day!',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 10: Asking Meaning',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Excuse me, what does this word mean?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 11: Slow Down',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: "I don't understand, can you speak slower?",
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 12: Kind Response',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Thank you, you are very kind.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 13: Farewell',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'See you later, goodbye!',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 14: Free Time',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'What do you like to do in your free time?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 15: Speaking Ability',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I speak a little bit of English.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 16: Age',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'How old are you?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 17: Living Location',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Where do you live?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 18: Email Address',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'What is your email address?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 19: You Are Welcome',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'No problem, you are welcome.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Básicas 20: How is it going',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'How is it going?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },

      // 📅 Frases do Dia a Dia
      {
        title: 'Dia a Dia 1: Clima',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'It looks like it is going to rain this afternoon.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 2: Agradecimento',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Thank you so much for your help, I really appreciate it.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 3: Compras',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'How much does this item cost, and is there a discount?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 4: Despedida',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Have a wonderful evening and I hope to see you soon.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 5: Supermercado',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I am going to the supermarket, do you need anything?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 6: Wake Up Early',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I need to wake up early tomorrow morning.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 7: Lunch Time',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'What time do you usually have lunch?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 8: Sleep Time',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I am really tired, I think I will go to sleep.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 9: Lights Out',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Can you turn off the lights when you leave?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 10: Call Back',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I will call you back in a few minutes.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 11: Weekend Plan',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Let\'s meet up this weekend.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 12: Tonight Activities',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'What are you doing tonight?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 13: Traffic Jam',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I am stuck in traffic right now.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 14: Hot Weather',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'It is really hot today, isn\'t it?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 15: Cleaning House',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I have to clean the house this afternoon.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 16: Wash Dishes',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Can you help me wash the dishes?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 17: Forgot Keys',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I forgot my keys inside the car.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 18: Take Care',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Take care and call me when you arrive.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 19: Great Idea',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'That sounds like a great idea!',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 20: Running Late',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I am running a bit late, sorry.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },

      // 🍔 Restaurante
      {
        title: 'Restaurante 1: Reserva',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I would like to book a table for two people at seven p.m.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 2: Menu',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Could we please see the menu and the wine list?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 3: Recomendação',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'What do you recommend as the main course today?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 4: Alergias',
        type: 'speaking',
        level: 'Intermediate',
        isRpg: false,
        content: {
          sentence: 'Does this dish contain any nuts or dairy products?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 5: Conta',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Could we have the check, please? We are ready to pay.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 6: Extra Water',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Is water included or do we have to pay extra?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 7: Steak Order',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I would like my steak medium rare, please.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 8: Bill Mistake',
        type: 'speaking',
        level: 'Intermediate',
        isRpg: false,
        content: {
          sentence: 'Excuse me, I think there is a mistake in our bill.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 9: Napkins Ice',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Can we get some extra napkins and a glass of ice?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 10: Server Ask',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Are you ready to order or do you need a few more minutes?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 11: Seafood Pasta',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I will have the seafood pasta, please.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 12: Vegetarian option',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Is there a vegetarian option on the menu?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 13: Seat window',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Can we sit near the window, please?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 14: Compliment',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'The food was delicious, thank you!',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 15: Food to go',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Can we get this to go, please?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 16: Reservation name',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'We have a reservation under the name of Smith.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 17: Soup of the day',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'What is the soup of the day?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 18: More bread',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Could I get some more bread, please?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 19: Cards acceptance',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Do you accept credit cards?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 20: Keep change',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Keep the change, thank you.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },

      // ☕ Cafeteria
      {
        title: 'Cafeteria 1: Pedido simples',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I would like a hot cup of coffee, please.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 2: Doce e Bebida',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Can I get a slice of chocolate cake and an iced tea?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 3: Leite vegetal',
        type: 'speaking',
        level: 'Intermediate',
        isRpg: false,
        content: {
          sentence: 'Do you have any vegan milk options like oat or almond milk?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 4: Para levar',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Is that to go or for here?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 5: Espresso',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Just a double espresso, please.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 6: Chocolate Croissant',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Can I have a chocolate croissant, please?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 7: Caramel Macchiato',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I would like a medium caramel macchiato.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 8: Whipped Cream',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Could you put some extra whipped cream on top?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 9: Freshly baked',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Is this muffin freshly baked today?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 10: Still Water',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Can I get a bottle of still water, please?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 11: Guest Wi-Fi',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'What is the password for the guest Wi-Fi?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 12: Hot Chocolate',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I\'d like a hot chocolate with marshmallows.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 13: Decaf coffee',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Do you have decaf coffee?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 14: Green tea',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I will take a green tea with lemon, please.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 15: Heat up',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Can you heat up this cheese bread for me?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 16: Sugar cinnamon',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Is there any sugar or cinnamon at the counter?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 17: Cup sleeve',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Can I get a cup sleeve and a napkin?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 18: Cold brew price',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'How much is a large cold brew?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 19: Iced Latte Oat',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I would like an iced latte with oat milk, please.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Cafeteria 20: Straws lids',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Where can I find the straws and lids?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },

      // ✈️ Aeroporto
      {
        title: 'Aeroporto 1: Check-in',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Excuse me, where is the check-in desk for this flight?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 2: Documentos',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Here is my passport and my boarding pass.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 3: Bagagem',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Is my baggage within the weight limit?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 4: Portão',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Which gate does the flight to London depart from?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 5: Atraso',
        type: 'speaking',
        level: 'Intermediate',
        isRpg: false,
        content: {
          sentence: 'My flight was delayed, where can I get more information?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 6: Bags carry-on',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I need to check in two bags and I have one carry-on.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 7: Security check',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Is this the line for security check?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 8: Duty-free shop',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Where can I find the duty-free shop?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 9: Window seat',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Could I get a window seat, please?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 10: Lost luggage',
        type: 'speaking',
        level: 'Intermediate',
        isRpg: false,
        content: {
          sentence: 'My luggage did not arrive, where is the baggage claim office?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 11: Shoes belt',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Do I need to take off my shoes and belt?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 12: Boarding time',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'What time does boarding for flight one two three start?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 13: Layover direct',
        type: 'speaking',
        level: 'Intermediate',
        isRpg: false,
        content: {
          sentence: 'Is there a layover on this flight or is it direct?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 14: Departure hall',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Where is the departure hall, please?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 15: Security liquid',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Can I bring this liquid bottle through security?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 16: Flight refund',
        type: 'speaking',
        level: 'Intermediate',
        isRpg: false,
        content: {
          sentence: 'My flight was cancelled, can I get a refund or reschedule?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 17: Gate distance',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Where is gate number fifteen, is it far from here?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 18: Conveyor belt',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Please place your bags flat on the conveyor belt.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 19: Connection visa',
        type: 'speaking',
        level: 'Intermediate',
        isRpg: false,
        content: {
          sentence: 'Do I need a transit visa for my connection?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Aeroporto 20: Boarding rows',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'We are boarding row numbers ten to twenty-five.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },

      // 🗺️ Pedindo Informações
      {
        title: 'Informações 1: Direção Biblioteca',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Excuse me, could you tell me where the library is?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 2: Estação de Metrô',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Excuse me, is there a subway station near here?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 3: Museu',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'How do I get to the nearest museum from here?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 4: Mostrar no Mapa',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Can you show me on the map, please?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 5: Banheiro',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Excuse me, where is the restroom?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 6: Walk or taxi',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Is it far if I walk, or should I take a taxi?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 7: Bus center',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Excuse me, which bus goes to the city center?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 8: Tourist info',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Is there a tourist information office around here?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 9: Drugstore',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Where is the nearest pharmacy or drugstore?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 10: Train station',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'How long does it take to get to the train station?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 11: Park direction',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Excuse me, am I going in the right direction for the park?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 12: Recommend place',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Can you recommend a good place to visit nearby?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 13: Tour tickets',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Where can I buy tickets for the sightseeing tour?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 14: Bank ATM',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Excuse me, is there a bank or an ATM near here?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 15: Museum open',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Is the museum open on Sundays?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 16: What street',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Excuse me, what street is this?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 17: Taxi stand',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Where is the taxi stand?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 18: Turn directions',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Go straight for two blocks, then turn left.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 19: Around corner',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'It is just around the corner, next to the supermarket.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Informações 20: Farewell help',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Thank you for your help, have a great day!',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      }
    ];

    const createdExercises = [];
    for (const data of speakingData) {
      // Check if it already exists by title
      let ex = await prisma.exercise.findFirst({
        where: { title: data.title }
      });

      if (!ex) {
        ex = await prisma.exercise.create({
          data: {
            title: data.title,
            type: data.type,
            level: data.level,
            isRpg: data.isRpg,
            content: data.content,
            planId: planId
          }
        });
        console.log(`✅ Created speaking exercise: "${data.title}"`);
      } else {
        // Update content to make sure it matches
        ex = await prisma.exercise.update({
          where: { id: ex.id },
          data: {
            content: data.content,
            isRpg: data.isRpg
          }
        });
        console.log(`ℹ️ Updated speaking exercise: "${data.title}"`);
      }
      createdExercises.push(ex);
    }

    // Assign to all students
    const students = await prisma.user.findMany({
      where: { role: 'student' }
    });

    console.log(`Found ${students.length} students to assign exercises.`);

    let assignedCount = 0;
    for (const student of students) {
      // Get all existing assignments for this student to avoid duplicates in memory
      const currentAssignments = await prisma.student_exercise.findMany({
        where: { userId: student.id },
        select: { exerciseId: true }
      });
      const assignedIds = new Set(currentAssignments.map(a => a.exerciseId));

      // Filter exercises that this student does not have assigned yet
      const missingExercises = createdExercises.filter(ex => !assignedIds.has(ex.id));

      if (missingExercises.length > 0) {
        const createData = missingExercises.map(ex => ({
          userId: student.id,
          exerciseId: ex.id,
          status: 'assigned'
        }));

        await prisma.student_exercise.createMany({
          data: createData,
          skipDuplicates: true
        });
        assignedCount += missingExercises.length;
      }
      console.log(`✓ Assigned speaking exercises to ${student.name} (${missingExercises.length} new)`);
    }

    console.log(`🎉 Finished seeding! Created/Updated ${createdExercises.length} exercises and made ${assignedCount} new assignments.`);
  } catch (err) {
    console.error('❌ Error seeding speaking exercises:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
