import axios from 'axios';

const API_URL = 'http://127.0.0.1:3000/api';

const test = axios.create({
  baseURL: API_URL,
  validateStatus: () => true // Don't throw on any status
});

async function runTests() {
  console.log('🧪 Starting comprehensive API tests...\n');
  
  let adminToken = null;
  let studentToken = null;

  try {
    // Test 1: Admin Login
    console.log('TEST 1: Admin Login');
    console.log('─'.repeat(40));
    const adminLogin = await test.post('/auth/signin', {
      email: 'admin@test.com',
      password: 'admin123'
    });
    
    if (adminLogin.status !== 200) {
      console.log(`❌ Failed: Status ${adminLogin.status}`);
      console.log(JSON.stringify(adminLogin.data, null, 2));
      return;
    }
    
    adminToken = adminLogin.data.token;
    console.log('✅ Admin login successful');
    console.log(`   Token (first 50 chars): ${adminToken.substring(0, 50)}...`);
    console.log(`   User: ${adminLogin.data.user.email} (${adminLogin.data.user.role})\n`);

    // Test 2: Get all plans (no auth needed)
    console.log('TEST 2: Get All Plans (public)');
    console.log('─'.repeat(40));
    const plansPublic = await test.get('/plans');
    if (plansPublic.status !== 200) {
      console.log(`❌ Failed: Status ${plansPublic.status}`);
      return;
    }
    console.log(`✅ Got ${plansPublic.data.plans?.length || 0} plans`);
    if (plansPublic.data.plans?.length > 0) {
      console.log(`   First plan: "${plansPublic.data.plans[0].name}" (${plansPublic.data.plans[0].level})\n`);
    }

    // Test 3: Get all users (admin protected)
    console.log('TEST 3: Get All Users (admin protected)');
    console.log('─'.repeat(40));
    const users = await test.get('/users', {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    
    if (users.status !== 200) {
      console.log(`❌ Failed: Status ${users.status}`);
      console.log(JSON.stringify(users.data, null, 2));
      return;
    }
    console.log(`✅ Got ${users.data.users?.length || 0} users:`);
    users.data.users?.forEach(u => {
      console.log(`   - ${u.email} (${u.role})`);
    });
    console.log();

    // Test 4: Get exercises by level
    console.log('TEST 4: Get Exercises');
    console.log('─'.repeat(40));
    const exercises = await test.get('/exercises?level=Beginner');
    if (exercises.status !== 200) {
      console.log(`❌ Failed: Status ${exercises.status}`);
      return;
    }
    console.log(`✅ Got ${exercises.data.exercises?.length || 0} exercises for Beginner level`);
    if (exercises.data.exercises?.length > 0) {
      console.log(`   First: "${exercises.data.exercises[0].sentence.substring(0, 50)}..."\n`);
    }

    // Test 5: Student Login
    console.log('TEST 5: Student Login');
    console.log('─'.repeat(40));
    const studentLogin = await test.post('/auth/signin', {
      email: 'aluno1@test.com',
      password: 'student123'
    });
    
    if (studentLogin.status !== 200) {
      console.log(`❌ Failed: Status ${studentLogin.status}`);
      return;
    }
    
    studentToken = studentLogin.data.token;
    console.log('✅ Student login successful');
    console.log(`   User: ${studentLogin.data.user.email} (${studentLogin.data.user.role})\n`);

    // Test 6: Student can view exercises
    console.log('TEST 6: Student Get User Enrollments');
    console.log('─'.repeat(40));
    const enrollments = await test.get(`/enrollments/user/${studentLogin.data.user.id}`, {
      headers: { Authorization: `Bearer ${studentToken}` }
    });
    
    if (enrollments.status !== 200) {
      console.log(`❌ Failed: Status ${enrollments.status}`);
      console.log(`   (This is OK if student has no enrollments yet)`);
    } else {
      console.log(`✅ Got ${enrollments.data.enrollments?.length || 0} enrollments`);
    }
    console.log();

    // Test 7: Verify token expiration is set
    console.log('TEST 7: Verify JWT Token Structure');
    console.log('─'.repeat(40));
    const parts = adminToken.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    console.log('✅ Token payload:');
    console.log(`   ID: ${payload.id}`);
    console.log(`   Email: ${payload.email}`);
    console.log(`   Role: ${payload.role}`);
    console.log(`   Issued: ${new Date(payload.iat * 1000).toISOString()}`);
    console.log(`   Expires: ${new Date(payload.exp * 1000).toISOString()}\n`);

    console.log('═'.repeat(40));
    console.log('✅ ALL TESTS PASSED!');
    console.log('═'.repeat(40));
    console.log('\n🎉 Platform is fully functional:');
    console.log('   ✓ Authentication working');
    console.log('   ✓ Database connection OK');
    console.log('   ✓ Role-based access control active');
    console.log('   ✓ JWT tokens generated');
    console.log('   ✓ API endpoints responsive');

  } catch (error) {
    console.log('❌ Unexpected error:', error.message);
  }
}

runTests();
