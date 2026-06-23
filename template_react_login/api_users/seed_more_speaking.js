import { prisma } from './src/database/index.js';

async function main() {
  console.log('🌱 Starting seeding of 10 more speaking exercises (Restaurant & Daily Life)...');
  try {
    // Fetch the first plan available in the database (fallback to ID 1)
    const firstPlan = await prisma.plan.findFirst();
    const planId = firstPlan ? firstPlan.id : 1;

    console.log(`Using plan ID: ${planId}`);

    const speakingData = [
      {
        title: 'Restaurante 1: Reservas',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I would like to book a table for two people at seven p.m.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 2: Pedindo o Menu',
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
        title: 'Restaurante 4: Restrições Alimentares',
        type: 'speaking',
        level: 'Intermediate',
        isRpg: false,
        content: {
          sentence: 'Does this dish contain any nuts or dairy products?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Restaurante 5: Pedindo a Conta',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Could we have the check, please? We are ready to pay.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 1: Agradecimentos',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Thank you so much for your help, I really appreciate it.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 2: Direções',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Excuse me, is there a subway station near here?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 3: Compras & Preços',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'How much does this item cost, and is there a discount?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 4: O Clima',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'It looks like it is going to rain this afternoon.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Dia a Dia 5: Despedidas',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Have a wonderful evening and I hope to see you soon.',
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
        console.log(`✅ Created exercise: "${data.title}"`);
      } else {
        console.log(`ℹ️ Exercise already exists: "${data.title}"`);
      }
      createdExercises.push(ex);
    }

    // Assign to all users (students and admins)
    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} total users in database to assign exercises.`);

    let assignedCount = 0;
    for (const user of users) {
      for (const ex of createdExercises) {
        // Check if student_exercise already exists
        const exists = await prisma.student_exercise.findFirst({
          where: {
            userId: user.id,
            exerciseId: ex.id
          }
        });

        if (!exists) {
          await prisma.student_exercise.create({
            data: {
              userId: user.id,
              exerciseId: ex.id,
              status: 'assigned'
            }
          });
          assignedCount++;
        }
      }
      console.log(`✓ Assigned 10 new speaking exercises to user ${user.email}`);
    }

    console.log(`🎉 Finished seeding! Created ${createdExercises.length} exercises and made ${assignedCount} assignments.`);
  } catch (err) {
    console.error('❌ Error seeding speaking exercises:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
