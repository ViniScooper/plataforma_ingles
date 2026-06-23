import { prisma } from './src/database/index.js';

async function main() {
  console.log('🌱 Starting seeding of speaking exercises...');
  try {
    // Fetch the first plan available in the database (fallback to ID 1)
    const firstPlan = await prisma.plan.findFirst();
    const planId = firstPlan ? firstPlan.id : 1;

    console.log(`Using plan ID: ${planId}`);

    const speakingData = [
      {
        title: 'Pronúncia 1: Greetings & How You Are',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false, // Goes to class activities (Pronúncia tab)
        content: {
          sentence: 'Hello, how are you doing today?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Pronúncia 2: Introducing Yourself',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Nice to meet you, my name is John.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Pronúncia 3: Cafe Conversation',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I would like a hot cup of coffee, please.',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Pronúncia 4: Asking for Help',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'Excuse me, could you tell me where the library is?',
          instructions: 'Ouça a frase clicando no botão e grave a sua pronúncia em inglês.'
        }
      },
      {
        title: 'Pronúncia 5: Future Plans',
        type: 'speaking',
        level: 'Beginner',
        isRpg: false,
        content: {
          sentence: 'I am going to study English every single day.',
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
        console.log(`ℹ️ Speaking exercise already exists: "${data.title}"`);
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
        // Check if student_exercise already exists
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

    console.log(`🎉 Finished seeding! Created ${createdExercises.length} exercises and made ${assignedCount} assignments.`);
  } catch (err) {
    console.error('❌ Error seeding speaking exercises:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
