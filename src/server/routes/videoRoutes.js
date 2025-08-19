const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const router = express.Router();

// Get all subjects with their units and lessons
router.get('/subjects', async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        units: {
          include: {
            grade: true,
            lessons: {
              include: {
                progressVideos: {
                  where: {
                    progressUnit: {
                      progress: {
                        userId: req.user?.id || 0
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    res.json(subjects);
  } catch (error) {
    console.error('Error fetching subjects:', error);
    res.status(500).json({ error: 'Failed to fetch subjects' });
  }
});

// Get courses by subject and grade
router.get('/courses/:subjectId/:gradeId', async (req, res) => {
  try {
    const { subjectId, gradeId } = req.params;
    
    const units = await prisma.unit.findMany({
      where: {
        subjectId: parseInt(subjectId),
        gradeId: parseInt(gradeId)
      },
      include: {
        subject: true,
        grade: true,
        lessons: {
          include: {
            progressVideos: {
              where: {
                progressUnit: {
                  progress: {
                    userId: req.user?.id || 0
                  }
                }
              }
            }
          }
        }
      }
    });

    // Transform units into course format
    const courses = units.map(unit => ({
      id: unit.id,
      title: `${unit.grade.name} ${unit.subject.name}`,
      subject: unit.subject.name,
      grade: unit.grade.name,
      progress: calculateUnitProgress(unit.lessons, req.user?.id),
      enrolled: true, // For now, assume enrolled
      units: [unit] // Each unit becomes a course in this context
    }));

    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Get unit details with lessons
router.get('/units/:unitId', async (req, res) => {
  try {
    const { unitId } = req.params;
    
    const unit = await prisma.unit.findUnique({
      where: { id: parseInt(unitId) },
      include: {
        subject: true,
        grade: true,
        lessons: {
          include: {
            progressVideos: {
              where: {
                progressUnit: {
                  progress: {
                    userId: req.user?.id || 0
                  }
                }
              }
            }
          },
          orderBy: { id: 'asc' }
        }
      }
    });

    if (!unit) {
      return res.status(404).json({ error: 'Unit not found' });
    }

    // Transform lessons into the expected format
    const transformedLessons = unit.lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.name,
      type: 'video',
      icon: 'play-circle',
      duration: '05:30', // Mock duration for now
      isCurrent: lesson.progressVideos.length > 0 && !lesson.progressVideos[0].completed,
      completed: lesson.progressVideos.length > 0 && lesson.progressVideos[0].completed
    }));

    const unitData = {
      id: unit.id,
      title: unit.name,
      course: `${unit.grade.name} ${unit.subject.name}`,
      masteryPoints: calculateMasteryPoints(unit.lessons, req.user?.id),
      totalMasteryPoints: unit.lessons.length * 10,
      masteryPercentage: calculateMasteryPercentage(unit.lessons, req.user?.id),
      lessons: transformedLessons
    };

    res.json(unitData);
  } catch (error) {
    console.error('Error fetching unit:', error);
    res.status(500).json({ error: 'Failed to fetch unit' });
  }
});

// Get lesson details
router.get('/lessons/:lessonId', async (req, res) => {
  try {
    const { lessonId } = req.params;
    
    const lesson = await prisma.lesson.findUnique({
      where: { id: parseInt(lessonId) },
      include: {
        unit: {
          include: {
            subject: true,
            grade: true
          }
        }
      }
    });

    if (!lesson) {
      return res.status(404).json({ error: 'Lesson not found' });
    }

    const lessonData = {
      id: lesson.id,
      title: lesson.name,
      subject: lesson.unit.subject.name,
      description: lesson.content || 'In this lesson, we will learn about the topic. This is a fun and interactive lesson designed for young learners.',
      videoUrl: lesson.videoUrl || null,
      duration: '05:30', // Mock duration for now
      currentProgress: '00:00',
      remainingTime: '05:30',
      progress: 0
    };

    res.json(lessonData);
  } catch (error) {
    console.error('Error fetching lesson:', error);
    res.status(500).json({ error: 'Failed to fetch lesson' });
  }
});

// Update video progress
router.post('/progress/video', async (req, res) => {
  try {
    const { lessonId, unitId, completed, currentTime, duration } = req.body;
    
    if (!req.user?.id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    // Find or create progress record
    let progress = await prisma.progress.findFirst({
      where: {
        userId: req.user.id,
        subjectId: (await prisma.unit.findUnique({ where: { id: unitId } })).subjectId
      }
    });

    if (!progress) {
      const unit = await prisma.unit.findUnique({ where: { id: unitId } });
      progress = await prisma.progress.create({
        data: {
          userId: req.user.id,
          subjectId: unit.subjectId,
          level: 1,
          skillsMastered: 0,
          totalSkills: 0,
          percent: 0
        }
      });
    }

    // Find or create progress unit record
    let progressUnit = await prisma.progressUnit.findFirst({
      where: {
        progressId: progress.id,
        unitId: unitId
      }
    });

    if (!progressUnit) {
      progressUnit = await prisma.progressUnit.create({
        data: {
          progressId: progress.id,
          unitId: unitId,
          completed: false
        }
      });
    }

    // Find or create progress video record
    let progressVideo = await prisma.progressVideo.findFirst({
      where: {
        progressUnitId: progressUnit.id,
        lessonId: lessonId
      }
    });

    if (!progressVideo) {
      progressVideo = await prisma.progressVideo.create({
        data: {
          progressUnitId: progressUnit.id,
          lessonId: lessonId,
          completed: false
        }
      });
    }

    // Update progress video
    await prisma.progressVideo.update({
      where: { id: progressVideo.id },
      data: {
        completed: completed,
        completedAt: completed ? new Date() : null
      }
    });

    // Update overall progress
    await updateOverallProgress(progress.id);

    res.json({ success: true, message: 'Progress updated successfully' });
  } catch (error) {
    console.error('Error updating video progress:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Helper functions
function calculateUnitProgress(lessons, userId) {
  if (!lessons || lessons.length === 0) return 0;
  
  const completedLessons = lessons.filter(lesson => 
    lesson.progressVideos.length > 0 && lesson.progressVideos[0].completed
  );
  
  return Math.round((completedLessons.length / lessons.length) * 100);
}

function calculateMasteryPoints(lessons, userId) {
  if (!lessons || lessons.length === 0) return 0;
  
  const completedLessons = lessons.filter(lesson => 
    lesson.progressVideos.length > 0 && lesson.progressVideos[0].completed
  );
  
  return completedLessons.length * 10;
}

function calculateMasteryPercentage(lessons, userId) {
  if (!lessons || lessons.length === 0) return 0;
  
  const completedLessons = lessons.filter(lesson => 
    lesson.progressVideos.length > 0 && lesson.progressVideos[0].completed
  );
  
  return Math.round((completedLessons.length / lessons.length) * 100);
}

async function updateOverallProgress(progressId) {
  const progressUnit = await prisma.progressUnit.findMany({
    where: { progressId: progressId },
    include: {
      videos: true,
      quizzes: true,
      practices: true
    }
  });

  let totalSkills = 0;
  let skillsMastered = 0;

  progressUnit.forEach(unit => {
    totalSkills += unit.videos.length + unit.quizzes.length + unit.practices.length;
    skillsMastered += unit.videos.filter(v => v.completed).length +
                     unit.quizzes.filter(q => q.passed).length +
                     unit.practices.filter(p => p.completed).length;
  });

  const percent = totalSkills > 0 ? Math.round((skillsMastered / totalSkills) * 100) : 0;

  await prisma.progress.update({
    where: { id: progressId },
    data: {
      skillsMastered: skillsMastered,
      totalSkills: totalSkills,
      percent: percent
    }
  });
}

module.exports = router;



