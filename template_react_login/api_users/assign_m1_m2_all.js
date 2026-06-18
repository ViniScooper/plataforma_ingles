import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('🔗 Fetching all exercises for Module 1 (Beginner) and Module 2 (Intermediate)...');
    
    // Fetch all exercises with level 'Beginner' or 'Intermediate'
    const exercises = await prisma.exercise.findMany({
      where: {
        level: {
          in: ['Beginner', 'Intermediate']
        }
      }
    });

    console.log(`Found ${exercises.length} exercises.`);

    // Fetch all students
    const students = await prisma.user.findMany({
      where: {
        role: 'student'
      }
    });

    console.log(`Found ${students.length} students.`);

    let createdCount = 0;
    for (const student of students) {
      for (const ex of exercises) {
        // Check if assignment already exists
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
          createdCount++;
        }
      }
      console.log(`✓ Assigned Module 1 & 2 exercises to ${student.name}`);
    }

    console.log(`🎉 Finished! Assigned ${createdCount} new student exercises.`);
  } catch (error) {
    console.error('❌ Error during assignment:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
