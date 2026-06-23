import { prisma } from './src/database/index.js';

async function main() {
  console.log('🔍 Comprehensive verification: Ensuring ALL 15 speaking exercises are assigned to ALL database users...');
  try {
    // Fetch all speaking exercises (should be 15 in total)
    const speakingExercises = await prisma.exercise.findMany({
      where: { type: 'speaking' }
    });
    console.log(`Found ${speakingExercises.length} total speaking exercises in the database.`);

    // Fetch all users in the database
    const allUsers = await prisma.user.findMany();
    console.log(`Found ${allUsers.length} total users in the database.`);

    let createdCount = 0;
    for (const user of allUsers) {
      let userAdded = 0;
      for (const ex of speakingExercises) {
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
          userAdded++;
        }
      }
      console.log(`✓ Checked user: ${user.email} (Role: ${user.role}) - Added ${userAdded} missing assignments`);
    }

    console.log(`🎉 Finished verification! Added ${createdCount} missing speaking exercise assignments.`);
  } catch (err) {
    console.error('❌ Error during verification:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
