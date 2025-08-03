const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Create Grades
  await prisma.grade.createMany({
    data: [
      { name: 'Primary 1' },
      { name: 'Primary 2' },
      { name: 'Primary 3' },
      { name: 'Primary 4' },
      { name: 'Primary 5' },
      { name: 'Primary 6' },
      { name: 'Primary 7' },
    ],
    skipDuplicates: true,
  });

  // Create Subjects
  const subjects = await prisma.subject.createMany({
    data: [
      { name: 'Math', icon: 'FaCalculator' },
      { name: 'English', icon: 'FaBook' },
      { name: 'Science', icon: 'FaFlask' },
      { name: 'Social Studies', icon: 'FaGlobeAfrica' },
      { name: 'Coding Club', icon: 'FaCode' },
      { name: 'Life Skills', icon: 'FaHandsHelping' },
    ],
    skipDuplicates: true,
  });

  // Fetch created grades and subjects
  const [math, english, science] = await Promise.all([
    prisma.subject.findUnique({ where: { name: 'Math' } }),
    prisma.subject.findUnique({ where: { name: 'English' } }),
    prisma.subject.findUnique({ where: { name: 'Science' } }),
  ]);
  const [p1, p2, p3] = await Promise.all([
    prisma.grade.findUnique({ where: { name: 'Primary 1' } }),
    prisma.grade.findUnique({ where: { name: 'Primary 2' } }),
    prisma.grade.findUnique({ where: { name: 'Primary 3' } }),
  ]);

  // Create Units for Math Primary 1
  const unit1 = await prisma.unit.create({
    data: {
      name: 'Addition & Subtraction',
      subjectId: math.id,
      gradeId: p1.id,
    },
  });
  // Create Lessons for the unit
  await prisma.lesson.createMany({
    data: [
      {
        name: 'Adding Numbers up to 10',
        videoUrl: 'https://www.youtube.com/embed/O-6q-siuMik',
        content: 'Learn how to add numbers up to 10 with fun examples!',
        unitId: unit1.id,
      },
      {
        name: 'Subtracting Numbers up to 10',
        videoUrl: 'https://www.youtube.com/embed/2FJD7jZqZEk',
        content: 'Learn how to subtract numbers up to 10 with fun examples!',
        unitId: unit1.id,
      },
    ],
    skipDuplicates: true,
  });

  // Create Units for English Primary 1
  const unit2 = await prisma.unit.create({
    data: {
      name: 'Reading Basics',
      subjectId: english.id,
      gradeId: p1.id,
    },
  });
  await prisma.lesson.create({
    data: {
      name: 'The Alphabet Song',
      videoUrl: 'https://www.youtube.com/embed/3FJD7jZqZEk',
      content: 'Sing along and learn the alphabet!',
      unitId: unit2.id,
    },
  });

  // Create Units for Science Primary 1
  const unit3 = await prisma.unit.create({
    data: {
      name: 'Our Senses',
      subjectId: science.id,
      gradeId: p1.id,
    },
  });
  await prisma.lesson.create({
    data: {
      name: 'The Five Senses',
      videoUrl: 'https://www.youtube.com/embed/4FJD7jZqZEk',
      content: 'Discover the five senses and how we use them every day.',
      unitId: unit3.id,
    },
  });

  // Create a test user
  const testUser = await prisma.user.upsert({
    where: { email: 'student1@example.com' },
    update: {},
    create: {
      email: 'student1@example.com',
      password: 'hashedpassword',
      name: 'Student One',
      role: 'learner',
    },
  });

  // Create or update the real user
  const realUser = await prisma.user.upsert({
    where: { email: 'shammahkahangi@gmail.com' },
    update: {},
    create: {
      email: 'shammahkahangi@gmail.com',
      password: 'hashedpassword', // Set a real hash if needed
      name: 'Shammah Kahangi',
      role: 'learner',
    },
  });

  // Fetch the lesson for progress
  const addLesson = await prisma.lesson.findFirst({ where: { name: 'Adding Numbers up to 10', unitId: unit1.id } });

  // Create Progress for Math (Primary 1) for the real user
  await prisma.progress.create({
    data: {
      userId: realUser.id,
      subjectId: math.id,
      level: 1,
      skillsMastered: 1,
      totalSkills: 2,
      percent: 50,
      units: {
        create: [
          {
            unitId: unit1.id,
            completed: false,
            videos: {
              create: [
                {
                  lessonId: addLesson.id,
                  completed: true,
                  completedAt: new Date(),
                },
              ],
            },
            quizzes: {
              create: [],
            },
            practices: {
              create: [],
            },
          },
        ],
      },
    },
  });

  // --- Seed Community Data ---
  // Create groups
  const mathClub = await prisma.communityGroup.create({
    data: {
      name: 'Math Club',
      description: 'A place to discuss math problems and puzzles.',
    },
  });
  const primary1Class = await prisma.communityGroup.create({
    data: {
      name: 'Primary 1 Class',
      description: 'All Primary 1 students gather here!',
    },
  });
  const scienceExplorers = await prisma.communityGroup.create({
    data: {
      name: 'Science Explorers',
      description: 'Let’s explore science together!',
    },
  });

  // Add user as member to Math Club
  const mathClubMember = await prisma.communityMembership.create({
    data: {
      userId: realUser.id,
      groupId: mathClub.id,
      role: 'member',
    },
  });

  // Add a post to Math Club
  const mathPost = await prisma.communityPost.create({
    data: {
      groupId: mathClub.id,
      userId: realUser.id,
      content: 'Welcome to the Math Club! What is your favorite math topic?',
    },
  });

  // Add a reply to the post
  await prisma.communityReply.create({
    data: {
      postId: mathPost.id,
      userId: realUser.id,
      content: 'I love learning about addition and subtraction!',
    },
  });

  // --- Seed Assignments ---
  const mathClass = await prisma.class.findFirst({ where: { subject: 'Math', grade: 'Primary 1' } });
  const englishClass = await prisma.class.findFirst({ where: { subject: 'English', grade: 'Primary 1' } });

  if (mathClass && englishClass) {
    await prisma.assignment.createMany({
      data: [
        {
          title: 'Math Quiz 2',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          classId: mathClass.id,
        },
        {
          title: 'Reading Comprehension',
          dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
          classId: englishClass.id,
        },
      ],
      skipDuplicates: true,
    });
  }

  // --- Seed Activities ---
  const scienceClass = await prisma.class.findFirst({ where: { subject: 'Science', grade: 'Primary 1' } });

  const activityData = [
    {
      type: 'lesson_completed',
      text: 'Amina completed 5 lessons in Math',
      icon: 'trophy',
      userId: realUser.id,
      classId: mathClass ? mathClass.id : null,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      type: 'homework_submitted',
      text: 'Samuel submitted Science Homework',
      icon: 'tasks',
      userId: testUser.id,
      classId: scienceClass ? scienceClass.id : null,
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
    },
    {
      type: 'streak',
      text: 'Fatima reached a 7-day streak',
      icon: 'user-check',
      userId: realUser.id,
      classId: mathClass ? mathClass.id : null,
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
  ];

  const validActivities = activityData.filter(a => a.classId !== null);
  if (validActivities.length > 0) {
    await prisma.activity.createMany({ data: validActivities });
  }

  // --- Set Tahoora's attendance to 0% for a specific class ---
  const tahoora = await prisma.user.findFirst({ where: { name: { contains: 'Tahoora', mode: 'insensitive' } } });
  const targetClass = await prisma.class.findFirst({ where: { subject: 'Math', grade: 'Primary 1' } }); // Change as needed
  if (tahoora && targetClass) {
    await prisma.attendance.deleteMany({ where: { userId: tahoora.id, classId: targetClass.id } });
    console.log(`Set Tahoora's attendance to 0% for class ${targetClass.name}`);
  }

  console.log('Seed data created!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 