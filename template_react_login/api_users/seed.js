import { prisma } from './src/database/index.js';
import bcryptjs from 'bcryptjs';

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    // Limpar dados existentes
    await prisma.enrollment.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.plan.deleteMany();
    await prisma.user.deleteMany();

    // Criar admin
    const adminPassword = await bcryptjs.hash('admin123', 10);
    const admin = await prisma.user.create({
      data: {
        email: 'admin@test.com',
        password: adminPassword,
        name: 'Admin User',
        username: 'admin',
        age: '30',
        role: 'admin'
      }
    });
    console.log('✅ Admin criado:', admin.email);

    // Criar alunos
    const studentPassword = await bcryptjs.hash('student123', 10);
    const student1 = await prisma.user.create({
      data: {
        email: 'aluno1@test.com',
        password: studentPassword,
        name: 'Maria Silva',
        username: 'maria_silva',
        age: '20',
        role: 'student'
      }
    });

    const student2 = await prisma.user.create({
      data: {
        email: 'aluno2@test.com',
        password: studentPassword,
        name: 'João Santos',
        username: 'joao_santos',
        age: '25',
        role: 'student'
      }
    });
    console.log('✅ Alunos criados:', student1.email, student2.email);

    // Criar planos
    const planBeginner = await prisma.plan.create({
      data: {
        name: 'English Basics',
        description: 'Curso de inglês para iniciantes',
        level: 'Beginner',
        price: 99.90,
        hours: 20
      }
    });

    const planIntermediate = await prisma.plan.create({
      data: {
        name: 'Intermediate English',
        description: 'Curso de inglês intermediário',
        level: 'Intermediate',
        price: 149.90,
        hours: 30
      }
    });
    console.log('✅ Planos criados:', planBeginner.name, planIntermediate.name);

    // Criar exercícios Beginner
    const beginnerExercises = [
      {
        sentence: 'I ___ (am/is) learning English.',
        gaps: [{ index: 0, correctAnswer: 'am', options: ['am', 'is', 'are'] }]
      },
      {
        sentence: 'She ___ (go/goes) to school every day.',
        gaps: [{ index: 0, correctAnswer: 'goes', options: ['go', 'goes', 'going'] }]
      },
      {
        sentence: 'We ___ (have/has) a dog.',
        gaps: [{ index: 0, correctAnswer: 'have', options: ['have', 'has', 'having'] }]
      },
      {
        sentence: 'They ___ (like/likes) pizza.',
        gaps: [{ index: 0, correctAnswer: 'like', options: ['like', 'likes', 'liking'] }]
      },
      {
        sentence: 'You ___ (is/are) a student.',
        gaps: [{ index: 0, correctAnswer: 'are', options: ['am', 'is', 'are'] }]
      }
    ];

    for (const ex of beginnerExercises) {
      await prisma.exercise.create({
        data: {
          level: 'Beginner',
          sentence: ex.sentence,
          gaps: JSON.stringify(ex.gaps),
          planId: planBeginner.id
        }
      });
    }
    console.log('✅ 5 exercícios Beginner criados');

    // Criar exercícios Intermediate
    const intermediateExercises = [
      {
        sentence: 'If I ___ (were/was) you, I would study harder.',
        gaps: [{ index: 0, correctAnswer: 'were', options: ['were', 'was', 'am'] }]
      },
      {
        sentence: 'She ___ (has been/have been) waiting for two hours.',
        gaps: [{ index: 0, correctAnswer: 'has been', options: ['has been', 'have been', 'had been'] }]
      },
      {
        sentence: 'The book ___ (was published/is published) last year.',
        gaps: [{ index: 0, correctAnswer: 'was published', options: ['was published', 'is published', 'published'] }]
      },
      {
        sentence: 'By tomorrow, we ___ (will finish/will have finished) the project.',
        gaps: [{ index: 0, correctAnswer: 'will have finished', options: ['will finish', 'will have finished', 'finish'] }]
      },
      {
        sentence: 'He suggested that I ___ (go/should go) to the doctor.',
        gaps: [{ index: 0, correctAnswer: 'should go', options: ['go', 'should go', 'goes'] }]
      }
    ];

    for (const ex of intermediateExercises) {
      await prisma.exercise.create({
        data: {
          level: 'Intermediate',
          sentence: ex.sentence,
          gaps: JSON.stringify(ex.gaps),
          planId: planIntermediate.id
        }
      });
    }
    console.log('✅ 5 exercícios Intermediate criados');

    // Criar inscrições
    await prisma.enrollment.create({
      data: {
        userId: student1.id,
        planId: planBeginner.id
      }
    });

    await prisma.enrollment.create({
      data: {
        userId: student2.id,
        planId: planBeginner.id
      }
    });

    await prisma.enrollment.create({
      data: {
        userId: student1.id,
        planId: planIntermediate.id
      }
    });
    console.log('✅ 3 inscrições criadas');

    console.log('\n🎉 Seed completado com sucesso!');
    console.log('\n📝 Credenciais de teste:');
    console.log('   Admin: admin@test.com / admin123');
    console.log('   Aluno 1: aluno1@test.com / student123');
    console.log('   Aluno 2: aluno2@test.com / student123');
  } catch (error) {
    console.error('❌ Erro durante seed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
