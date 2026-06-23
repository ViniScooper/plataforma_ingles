import { prisma } from './src/database/index.js';

async function main() {
  console.log('🔍 Checking and force-assigning speaking exercises to all users...');
  try {
    const exercises = await prisma.exercise.findMany({
      where: { type: 'speaking' }
    });
    console.log(`Found ${exercises.length} speaking exercises in the database.`);

    const users = await prisma.user.findMany();
    console.log(`Found ${users.length} total users in the database.`);

    let createdCount = 0;
    for (const user of users) {
      let userAssigned = 0;
      for (const ex of exercises) {
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
          createdCount++;
          userAssigned++;
        }
      }
      console.log(`✓ Checked user: ${user.email} (Role: ${user.role}) - Added ${userAssigned} missing assignments`);
    }

    console.log(`🎉 Finished force-assigning! Added ${createdCount} missing exercise assignments.`);
  } catch (error) {
    console.error('❌ Error force-assigning:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
