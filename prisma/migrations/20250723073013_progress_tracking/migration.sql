-- CreateTable
CREATE TABLE "Progress" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 1,
    "skillsMastered" INTEGER NOT NULL DEFAULT 0,
    "totalSkills" INTEGER NOT NULL DEFAULT 0,
    "percent" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressUnit" (
    "id" SERIAL NOT NULL,
    "progressId" INTEGER NOT NULL,
    "unitId" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ProgressUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressVideo" (
    "id" SERIAL NOT NULL,
    "progressUnitId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ProgressVideo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressQuiz" (
    "id" SERIAL NOT NULL,
    "progressUnitId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "score" INTEGER,
    "total" INTEGER,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastAttemptAt" TIMESTAMP(3),

    CONSTRAINT "ProgressQuiz_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProgressPractice" (
    "id" SERIAL NOT NULL,
    "progressUnitId" INTEGER NOT NULL,
    "lessonId" INTEGER NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "ProgressPractice_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressUnit" ADD CONSTRAINT "ProgressUnit_progressId_fkey" FOREIGN KEY ("progressId") REFERENCES "Progress"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressUnit" ADD CONSTRAINT "ProgressUnit_unitId_fkey" FOREIGN KEY ("unitId") REFERENCES "Unit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressVideo" ADD CONSTRAINT "ProgressVideo_progressUnitId_fkey" FOREIGN KEY ("progressUnitId") REFERENCES "ProgressUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressVideo" ADD CONSTRAINT "ProgressVideo_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressQuiz" ADD CONSTRAINT "ProgressQuiz_progressUnitId_fkey" FOREIGN KEY ("progressUnitId") REFERENCES "ProgressUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressQuiz" ADD CONSTRAINT "ProgressQuiz_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressPractice" ADD CONSTRAINT "ProgressPractice_progressUnitId_fkey" FOREIGN KEY ("progressUnitId") REFERENCES "ProgressUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProgressPractice" ADD CONSTRAINT "ProgressPractice_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "Lesson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
