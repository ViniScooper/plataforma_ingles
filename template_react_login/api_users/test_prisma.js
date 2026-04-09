import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function simulateImport() {
  const exercises = [
      {
      "title": "Travel Vocabulary Flashcards",
      "type": "flashcards",
      "level": "Beginner",
      "content": {
        "instructions": "Click on each card to see the translation.",
        "cards": [
          { "front": "Airport", "back": "Aeroporto" },
          { "front": "Luggage", "back": "Bagagem", "example": "My luggage is too heavy." },
          { "front": "Flight", "back": "Voo" }
        ]
      }
    }
  ];

  const defaultPlan = await prisma.plan.findFirst();
  const planId = defaultPlan ? defaultPlan.id : 1;

  const dataArray = Array.isArray(exercises) ? exercises : [exercises];
  console.log(`📦 Importing ${dataArray.length} exercises...`);

  try {
    const created = await Promise.all(
      dataArray.map((ex, exIdx) => {
        let exContent;
        if (ex.content && typeof ex.content === 'object') {
          exContent = ex.content;
        } else {
          const { title, level, type, planId, ...rest } = ex;
          exContent = rest;
        }

        let exType = ex.type;
        const typeMap = {
          'escrita': 'writing',
          'Escrita': 'writing',
          'writing': 'writing',
          'v-ou-f': 'true-false',
          'v ou f': 'true-false',
          'true-false': 'true-false',
          'Quiz': 'quiz',
          'quiz': 'quiz',
          'leitura': 'text',
          'texto': 'text',
          'text': 'text',
          'gap-fill': 'gap-fill',
          'matching': 'matching',
          'Relacionar': 'matching',
          'sentence-order': 'sentence-order',
          'Frases': 'sentence-order'
        };

        if (exType && typeMap[exType]) {
          exType = typeMap[exType];
        }

        if (!exType) {
          if (exContent.prompt) exType = 'writing';
          else if (exContent.statements) exType = 'true-false';
          else if (exContent.sentences) exType = 'sentence-order';
          else if (exContent.pairs) exType = 'matching';
          else if (exContent.questions || ex.questions) exType = 'quiz';
          else exType = 'text';
        }

        if (exType === 'quiz' && !exContent.questions && ex.questions) {
          exContent.questions = ex.questions;
        }

        return prisma.exercise.create({
          data: {
            level: ex.level || 'Beginner',
            type: exType,
            title: ex.title || 'Imported Activity',
            content: exContent,
            planId: parseInt(ex.planId || planId)
          }
        });
      })
    );

    console.log('✅ Created Exercises:', JSON.stringify(created, null, 2));

  } catch (err) {
    console.error('Error during creation:', err);
  } finally {
    await prisma.$disconnect();
  }
}

simulateImport();
