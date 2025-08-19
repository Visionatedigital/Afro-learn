const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3001';

async function testVideoAPI() {
  console.log('🧪 Testing Video API Endpoints...\n');

  try {
    // Test 1: Get all subjects
    console.log('1️⃣ Testing GET /api/video/subjects');
    const subjectsResponse = await fetch(`${BASE_URL}/api/video/subjects`);
    const subjects = await subjectsResponse.json();
    
    if (subjectsResponse.ok) {
      console.log('✅ Subjects endpoint working');
      console.log(`   Found ${subjects.length} subjects`);
      subjects.forEach(subject => {
        console.log(`   - ${subject.name} (${subject.units?.length || 0} units)`);
      });
    } else {
      console.log('❌ Subjects endpoint failed:', subjects.error || subjectsResponse.statusText);
    }

    console.log('');

    // Test 2: Get courses by subject and grade
    console.log('2️⃣ Testing GET /api/video/courses/1/1 (Math, Primary 1)');
    const coursesResponse = await fetch(`${BASE_URL}/api/video/courses/1/1`);
    const courses = await coursesResponse.json();
    
    if (coursesResponse.ok) {
      console.log('✅ Courses endpoint working');
      console.log(`   Found ${courses.length} courses`);
      courses.forEach(course => {
        console.log(`   - ${course.title} (${course.units?.length || 0} units)`);
      });
    } else {
      console.log('❌ Courses endpoint failed:', courses.error || coursesResponse.statusText);
    }

    console.log('');

    // Test 3: Get unit details
    console.log('3️⃣ Testing GET /api/video/units/1');
    const unitResponse = await fetch(`${BASE_URL}/api/video/units/1`);
    const unit = await unitResponse.json();
    
    if (unitResponse.ok) {
      console.log('✅ Unit endpoint working');
      console.log(`   Unit: ${unit.title}`);
      console.log(`   Course: ${unit.course}`);
      console.log(`   Lessons: ${unit.lessons?.length || 0}`);
      if (unit.lessons) {
        unit.lessons.forEach(lesson => {
          console.log(`     - ${lesson.title} (${lesson.duration})`);
        });
      }
    } else {
      console.log('❌ Unit endpoint failed:', unit.error || unitResponse.statusText);
    }

    console.log('');

    // Test 4: Get lesson details
    console.log('4️⃣ Testing GET /api/video/lessons/1');
    const lessonResponse = await fetch(`${BASE_URL}/api/video/lessons/1`);
    const lesson = await lessonResponse.json();
    
    if (lessonResponse.ok) {
      console.log('✅ Lesson endpoint working');
      console.log(`   Lesson: ${lesson.title}`);
      console.log(`   Subject: ${lesson.subject}`);
      console.log(`   Duration: ${lesson.duration}`);
      console.log(`   Description: ${lesson.description?.substring(0, 100)}...`);
    } else {
      console.log('❌ Lesson endpoint failed:', lesson.error || lessonResponse.statusText);
    }

    console.log('');

    // Test 5: Test progress update (without auth - should fail)
    console.log('5️⃣ Testing POST /api/video/progress/video (without auth - should fail)');
    const progressResponse = await fetch(`${BASE_URL}/api/video/progress/video`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        lessonId: 1,
        unitId: 1,
        completed: true
      })
    });
    
    if (progressResponse.status === 401) {
      console.log('✅ Progress endpoint correctly requires authentication');
    } else {
      console.log('❌ Progress endpoint should require authentication');
    }

    console.log('\n🎉 API Testing Complete!');

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    console.log('\n💡 Make sure the backend server is running on port 3001');
    console.log('   Run: npm run dev (in the afro-learn/src/server directory)');
  }
}

// Run the test
testVideoAPI();



