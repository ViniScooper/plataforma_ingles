async function test() {
  try {
    console.log('1. Signing in...');
    const loginRes = await fetch('http://127.0.0.1:3005/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@test.com', password: 'admin123' })
    });
    console.log('Login Status:', loginRes.status);
    const loginData = await loginRes.json();
    if (loginRes.status !== 200) {
      console.log('Login failed:', loginData);
      return;
    }
    const token = loginData.token;
    const userId = loginData.user.id;
    console.log('Logged in successfully. Token grabbed. User ID:', userId);

    console.log('\n2. Fetching progress...');
    const progRes = await fetch(`http://127.0.0.1:3005/api/progress/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Progress Status:', progRes.status);
    const progData = await progRes.json();
    console.log('Progress Response:', progData);

    console.log('\n3. Fetching attendance...');
    const attRes = await fetch(`http://127.0.0.1:3005/api/attendance/${userId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log('Attendance Status:', attRes.status);
    const attData = await attRes.json();
    console.log('Attendance Response:', attData);

  } catch (err) {
    console.error('Error during test:', err);
  }
}

test();
