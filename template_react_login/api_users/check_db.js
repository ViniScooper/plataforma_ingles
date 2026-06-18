import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const totalExercises = await prisma.exercise.count();
    console.log(`Total exercises: ${totalExercises}`);

    const exercises = await prisma.exercise.findMany({
      select: {
        id: true,
        title: true,
        type: true,
        level: true,
        isRpg: true
      }
    });

    // Count by level
    const counts = {};
    for (const ex of exercises) {
      counts[ex.level] = (counts[ex.level] || 0) + 1;
    }
    console.log('Counts by level:', counts);

  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
