import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const email = 'cecilia@test.com';
  console.log(`🔗 Assigning all exercises to user: ${email} in batch...`);

  try {
    // 1. Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      console.error(`❌ User ${email} not found.`);
      return;
    }

    console.log(`Found user: ${user.name} (ID: ${user.id}, Username: ${user.username})`);

    // 2. Fetch all exercises in the database
    const exercises = await prisma.exercise.findMany({
      select: { id: true }
    });
    console.log(`Found ${exercises.length} total exercises in the database.`);

    // 3. Prepare bulk data
    const data = exercises.map(ex => ({
      userId: user.id,
      exerciseId: ex.id,
      status: 'assigned'
    }));

    // 4. Create many student_exercises
    const result = await prisma.student_exercise.createMany({
      data,
      skipDuplicates: true
    });

    console.log(`🎉 Finished! Successfully assigned missing exercises. Count: ${result.count}`);

  } catch (error) {
    console.error('❌ Error during assignment:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
