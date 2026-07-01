import { prisma } from './src/database/index.js';

async function main() {
  console.log('🌱 Starting seeding of organized speaking exercises...');
  try {
    const firstPlan = await prisma.plan.findFirst();
    const planId = firstPlan ? firstPlan.id : 1;

    console.log(`Using plan ID: ${planId}`);

    const speakingData = [
      // Frases Básicas
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

      // Frases do Dia a Dia
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

      // Restaurante
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

      // Cafeteria
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

      // Aeroporto
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

      // Pedindo Informações
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
      for (const ex of createdExercises) {
        const exists = await prisma.student_exercise.findFirst({
          where: {
            userId: student.id,
            exerciseId: ex.id
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
          assignedCount++;
        }
      }
      console.log(`✓ Assigned speaking exercises to ${student.name}`);
    }

    console.log(`🎉 Finished seeding! Created/Updated ${createdExercises.length} exercises and made ${assignedCount} assignments.`);
  } catch (err) {
    console.error('❌ Error seeding speaking exercises:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
