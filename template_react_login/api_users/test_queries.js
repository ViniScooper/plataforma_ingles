import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const userId = 22; // Bella
  console.log('Testing student_exercise...');
  try {
    const progress = await prisma.student_exercise.findMany({
      where: { userId: parseInt(userId) },
      include: { exercise: true }
    });
    console.log('student_exercise Success:', progress.length, 'records');
  } catch (err) {
    console.error('student_exercise Error:', err);
  }

  console.log('Testing attendance...');
  try {
    const records = await prisma.attendance.findMany({
      where: { userId: parseInt(userId) },
      orderBy: { date: 'desc' }
    });
    console.log('attendance Success:', records.length, 'records');
  } catch (err) {
    console.error('attendance Error:', err);
  }

  await prisma.$disconnect();
}

main();
