import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  try {
    const jsonPath = path.join(process.cwd(), '../atividades_true_false_longo.json');
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log(`Loaded ${data.length} exercises to update...`);

    const students = await prisma.user.findMany({ where: { role: 'student' } });
    console.log(`Found ${students.length} students.`);

    const plan = await prisma.plan.findFirst();
    const planId = plan ? plan.id : 1;

    for (const item of data) {
      console.log(`Processing: "${item.title}"`);

      let ex = await prisma.exercise.findFirst({
        where: { title: item.title }
      });

      if (ex) {
        ex = await prisma.exercise.update({
          where: { id: ex.id },
          data: {
            isRpg: false,
            level: item.level,
            type: item.type,
            content: item.content
          }
        });
        console.log(`  Updated existing exercise ID ${ex.id} to isRpg: false`);
      } else {
        ex = await prisma.exercise.create({
          data: {
            title: item.title,
            type: item.type,
            level: item.level,
            isRpg: false,
            planId: planId,
            content: item.content
          }
        });
        console.log(`  Created new exercise ID ${ex.id} with isRpg: false`);
      }

      for (const student of students) {
        const exists = await prisma.student_exercise.findUnique({
          where: {
            userId_exerciseId: {
              userId: student.id,
              exerciseId: ex.id
            }
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
          console.log(`    Assigned to student "${student.name}" (ID ${student.id})`);
        } else {
          console.log(`    Already assigned to student "${student.name}" (ID ${student.id})`);
        }
      }
    }

    console.log('🎉 Database updated successfully!');
  } catch (err) {
    console.error('Error running fix script:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
