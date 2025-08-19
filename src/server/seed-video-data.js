const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedVideoData() {
  try {
    console.log('🌱 Seeding video learning data...');

    // Create grades
    const grades = await Promise.all([
      prisma.grade.upsert({
        where: { name: 'Primary 1' },
        update: {},
        create: { name: 'Primary 1' }
      }),
      prisma.grade.upsert({
        where: { name: 'Primary 2' },
        update: {},
        create: { name: 'Primary 2' }
      }),
      prisma.grade.upsert({
        where: { name: 'Primary 3' },
        update: {},
        create: { name: 'Primary 3' }
      })
    ]);

    console.log('✅ Grades created:', grades.map(g => g.name));

    // Create subjects
    const subjects = await Promise.all([
      prisma.subject.upsert({
        where: { name: 'Mathematics' },
        update: {},
        create: { 
          name: 'Mathematics',
          icon: 'functions'
        }
      }),
      prisma.subject.upsert({
        where: { name: 'English' },
        update: {},
        create: { 
          name: 'English',
          icon: 'book'
        }
      }),
      prisma.subject.upsert({
        where: { name: 'Science' },
        update: {},
        create: { 
          name: 'Science',
          icon: 'science'
        }
      }),
      prisma.subject.upsert({
        where: { name: 'Social Studies' },
        update: {},
        create: { 
          name: 'Social Studies',
          icon: 'public'
        }
      })
    ]);

    console.log('✅ Subjects created:', subjects.map(s => s.name));

    // Create units for Mathematics Primary 1
    const mathUnits = await Promise.all([
      prisma.unit.upsert({
        where: { 
          subjectId_gradeId: {
            subjectId: subjects[0].id,
            gradeId: grades[0].id
          }
        },
        update: {},
        create: {
          name: 'Numbers and Counting',
          subjectId: subjects[0].id,
          gradeId: grades[0].id
        }
      }),
      prisma.unit.upsert({
        where: { 
          subjectId_gradeId: {
            subjectId: subjects[0].id,
            gradeId: grades[1].id
          }
        },
        update: {},
        create: {
          name: 'Addition and Subtraction',
          subjectId: subjects[0].id,
          gradeId: grades[1].id
        }
      })
    ]);

    console.log('✅ Math units created:', mathUnits.map(u => u.name));

    // Create units for English Primary 1
    const englishUnits = await Promise.all([
      prisma.unit.upsert({
        where: { 
          subjectId_gradeId: {
            subjectId: subjects[1].id,
            gradeId: grades[0].id
          }
        },
        update: {},
        create: {
          name: 'Basic Reading',
          subjectId: subjects[1].id,
          gradeId: grades[0].id
        }
      })
    ]);

    console.log('✅ English units created:', englishUnits.map(u => u.name));

    // Create lessons for Mathematics Numbers and Counting
    const mathLessons = await Promise.all([
      prisma.lesson.upsert({
        where: { 
          unitId_name: {
            unitId: mathUnits[0].id,
            name: 'Introduction to Numbers'
          }
        },
        update: {},
        create: {
          name: 'Introduction to Numbers',
          videoUrl: '/lessons/intro-numbers.mp4',
          content: 'In this lesson, we will learn about numbers and counting. We will practice recognizing numbers, writing them, and counting objects. This is a fun and interactive lesson designed for young learners.',
          unitId: mathUnits[0].id
        }
      }),
      prisma.lesson.upsert({
        where: { 
          unitId_name: {
            unitId: mathUnits[0].id,
            name: 'Counting 1-10'
          }
        },
        update: {},
        create: {
          name: 'Counting 1-10',
          videoUrl: '/lessons/counting-1-10.mp4',
          content: 'Learn to count from 1 to 10 with fun examples and interactive exercises.',
          unitId: mathUnits[0].id
        }
      }),
      prisma.lesson.upsert({
        where: { 
          unitId_name: {
            unitId: mathUnits[0].id,
            name: 'Writing Numbers'
          }
        },
        update: {},
        create: {
          name: 'Writing Numbers',
          videoUrl: '/lessons/writing-numbers.mp4',
          content: 'Practice writing numbers 1-10 with proper form and technique.',
          unitId: mathUnits[0].id
        }
      })
    ]);

    console.log('✅ Math lessons created:', mathLessons.map(l => l.name));

    // Create lessons for English Basic Reading
    const englishLessons = await Promise.all([
      prisma.lesson.upsert({
        where: { 
          unitId_name: {
            unitId: englishUnits[0].id,
            name: 'Alphabet Introduction'
          }
        },
        update: {},
        create: {
          name: 'Alphabet Introduction',
          videoUrl: '/lessons/alphabet-intro.mp4',
          content: 'Learn the alphabet with fun songs and examples.',
          unitId: englishUnits[0].id
        }
      }),
      prisma.lesson.upsert({
        where: { 
          unitId_name: {
            unitId: englishUnits[0].id,
            name: 'Simple Words'
          }
        },
        update: {},
        create: {
          name: 'Simple Words',
          videoUrl: '/lessons/simple-words.mp4',
          content: 'Start reading simple words and building vocabulary.',
          unitId: englishUnits[0].id
        }
      })
    ]);

    console.log('✅ English lessons created:', englishLessons.map(l => l.name));

    console.log('🎉 Video learning data seeded successfully!');
    
    // Display summary
    const summary = await prisma.$transaction([
      prisma.grade.count(),
      prisma.subject.count(),
      prisma.unit.count(),
      prisma.lesson.count()
    ]);

    console.log('\n📊 Database Summary:');
    console.log(`Grades: ${summary[0]}`);
    console.log(`Subjects: ${summary[1]}`);
    console.log(`Units: ${summary[2]}`);
    console.log(`Lessons: ${summary[3]}`);

  } catch (error) {
    console.error('❌ Error seeding video data:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedVideoData()
    .then(() => {
      console.log('✅ Seeding completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seeding failed:', error);
      process.exit(1);
    });
}

module.exports = { seedVideoData };



