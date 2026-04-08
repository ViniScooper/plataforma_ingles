import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3000/api'
});

async function testImport() {
  try {
    // 1. Sign in
    const loginRes = await api.post('/auth/signin', {
      email: 'admin@admin.com',
      password: 'admin'
    });
    const token = loginRes.data.token;
    const headers = { Authorization: token };

    // 2. Import "FLAT" writing activity (no 'content' key)
    const payload = {
      exercises: [
        {
          title: 'DYNAMIC IMPORT TEST - WRITING',
          // type: 'writing', // Let's see if it detects automatically too!
          level: 'Beginner',
          prompt: 'This should be moved into content automatically.',
          minWords: 30,
          tips: ['Dynamic Tip 1', 'Dynamic Tip 2']
        }
      ],
      planId: 1
    };

    console.log('Testing dynamic import...');
    const res = await api.post('/exercises/import', payload, { headers });
    console.log('Import result:', res.data);

    // 3. Verify it was created as 'writing' and has content
    const exRes = await api.get('/exercises', { headers });
    const lastOne = exRes.data[exRes.data.length - 1];
    console.log('Last Exercise Saved:', {
      id: lastOne.id,
      type: lastOne.type,
      content: lastOne.content
    });

    if (lastOne.type === 'writing' && lastOne.content.prompt) {
      console.log('SUCCESS: Dynamic import and type detection worked!');
    } else {
      console.log('FAILURE: Auto-detection or content move failed.');
    }

  } catch (err) {
    console.error('Test Error:', err.response?.data || err.message);
  }
}

testImport();
