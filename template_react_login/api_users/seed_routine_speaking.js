import { prisma } from './src/database/index.js';

async function main() {
  console.log('🌱 Starting seeding of daily routine speaking exercise...');
  try {
    const firstPlan = await prisma.plan.findFirst();
    const planId = firstPlan ? firstPlan.id : 1;

    const data = {
      title: 'Rotina 1: Acordar e Vestir',
      type: 'speaking',
      level: 'Beginner',
      isRpg: false,
      content: {
        sentence: 'I wake up and get dressed.',
        instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
      }
    };

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

    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} total users in database to assign.`);

    let assignedCount = 0;
    for (const user of users) {
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
      console.log(`✓ Assigned routine exercise to user ${user.email}`);
    }

    console.log(`🎉 Success! Seeded exercise and created ${assignedCount} assignments.`);
  } catch (err) {
    console.error('❌ Error seeding routine speaking exercise:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
