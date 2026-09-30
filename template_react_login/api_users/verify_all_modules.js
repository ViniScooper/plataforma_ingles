import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Auditing all RPG exercises across all modules in the database...');

  const exercises = await prisma.exercise.findMany({
    where: { isRpg: true },
    orderBy: { id: 'asc' }
  });

  console.log(`Found ${exercises.length} RPG exercises in database.`);

  const levels = {};
  let totalIssues = 0;

  for (const ex of exercises) {
    levels[ex.level] = (levels[ex.level] || 0) + 1;

    // Check sentence order
    if (ex.type === 'sentence-order') {
      const sentences = ex.content?.sentences || [];
      if (sentences.length === 0) {
        console.log(`❌ Empty sentence-order in ${ex.title} [${ex.level}]`);
        totalIssues++;
      }

      sentences.forEach((st, idx) => {
        const clean = (s) => (s || '').toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?'"]/g, '').replace(/\s+/g, ' ').trim();
        const wordsSorted = (st.words || []).map(clean).filter(Boolean).sort().join(' ');
        const correctSorted = (st.correct || '').split(/\s+/).map(clean).filter(Boolean).sort().join(' ');

        if (wordsSorted !== correctSorted) {
          console.log(`❌ Mismatch in [${ex.level}] ${ex.title} item ${idx}:`);
          console.log(`   Words:   [${st.words.join(', ')}]`);
          console.log(`   Correct: "${st.correct}"`);
          totalIssues++;
        }
      });
    }

    // Check quiz
    if (ex.type === 'quiz') {
      const questions = ex.content?.questions || [];
      if (questions.length === 0) {
        console.log(`❌ Empty questions in ${ex.title} [${ex.level}]`);
        totalIssues++;
      }
      questions.forEach((q, idx) => {
        if (!q.correct || !q.options || q.options.length < 2) {
          console.log(`❌ Malformed question in ${ex.title} item ${idx}`);
          totalIssues++;
        }
        if (!q.options.includes(q.correct)) {
          console.log(`❌ Correct answer not in options in ${ex.title} item ${idx}: "${q.correct}"`);
          totalIssues++;
        }
      });
    }

    // Check matching
    if (ex.type === 'matching') {
      const pairs = ex.content?.pairs || [];
      if (pairs.length === 0) {
        console.log(`❌ Empty pairs in ${ex.title} [${ex.level}]`);
        totalIssues++;
      }
      pairs.forEach((p, idx) => {
        if (!p.left || !p.right) {
          console.log(`❌ Incomplete pair in ${ex.title} item ${idx}`);
          totalIssues++;
        }
      });
    }

    // Check true-false
    if (ex.type === 'true-false') {
      const statements = ex.content?.statements || [];
      if (statements.length === 0) {
        console.log(`❌ Empty statements in ${ex.title} [${ex.level}]`);
        totalIssues++;
      }
      statements.forEach((s, idx) => {
        if (typeof s.correct !== 'boolean') {
          console.log(`❌ Missing boolean correct in ${ex.title} item ${idx}`);
          totalIssues++;
        }
      });
    }

    // Check flashcards
    if (ex.type === 'flashcards') {
      const cards = ex.content?.cards || [];
      if (cards.length === 0) {
        console.log(`❌ Empty flashcards in ${ex.title} [${ex.level}]`);
        totalIssues++;
      }
      cards.forEach((c, idx) => {
        if (!c.front || !c.back) {
          console.log(`❌ Incomplete card in ${ex.title} item ${idx}`);
          totalIssues++;
        }
      });
    }

    // Check bare text (forbidden in RPG)
    if (ex.type === 'text') {
      console.log(`❌ Bare text exercise found (cannot be completed): ${ex.title} [${ex.level}]`);
      totalIssues++;
    }
  }

  console.log('\n📊 Exercise distribution by level:', levels);

  if (totalIssues === 0) {
    console.log('\n🎉 ALL RPG exercises across all modules are 100% valid, solvable, and properly configured!');
  } else {
    console.log(`\n⚠️ Total issues found: ${totalIssues}`);
  }

  await prisma.$disconnect();
}

main();
