const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:3000/api/v2'
});

async function test() {
  try {
    // 1. Sign in as admin
    const loginRes = await api.post('/auth/signin', {
      email: 'admin@admin.com', // Assuming this admin exists
      password: 'admin'
    });
    
    const token = loginRes.data.token;
    console.log('Logged in, token:', token);
    
    const headers = { Authorization: token };
    
    // 2. Create writing exercise
    const payload = {
      title: 'TEST WRITING ACTIVITY',
      type: 'writing',
      level: 'Beginner',
      planId: 1, // Assuming plan 1 exists
      content: {
        prompt: 'Write about your life.',
        minWords: 30,
        tips: ['Tip 1', 'Tip 2']
      }
    };
    
    console.log('Sending payload:', JSON.stringify(payload, null, 2));
    
    const createRes = await api.post('/exercises', payload, { headers });
    console.log('Create Response:', JSON.stringify(createRes.data, null, 2));
    
  } catch (err) {
    console.error('Error:', err.response?.data || err.message);
  }
}

test();
