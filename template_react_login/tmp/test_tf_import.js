import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3000/api'
});

async function testImport() {
  try {
    const loginRes = await api.post('/auth/signin', {
      email: 'admin@admin.com',
      password: 'admin'
    });
    const token = loginRes.data.token;
    const headers = { Authorization: token };

    // Let's send exactly what the frontend sends when pasting the "Social Media" text
    const payload = {
      exercises: [
         {
            "title": "True or False: Anna's Day",
            "type": "true-false",
            "level": "Beginner",
            "content": {
               "text": "Anna wakes up early, eats breakfast, and goes to school by bus.",
               "statements": [
                  { "statement": "Anna wakes up late.", "correct": false },
                  { "statement": "She eats breakfast.", "correct": true }
               ]
            }
         }
      ],
      planId: 1
    };

    console.log('Sending import...');
    const res = await api.post('/exercises/import', payload, { headers });
    console.log('Import Status:', res.status);
    
    // Check exercises created
    const exRes = await api.get('/exercises', { headers });
    const exercises = exRes.data;
    const lastEx = exercises[exercises.length - 1];
    console.log('LAST EXERCISE SAVED:', JSON.stringify(lastEx, null, 2));

  } catch (err) {
    if (err.response) {
      console.error('API Error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

testImport();
