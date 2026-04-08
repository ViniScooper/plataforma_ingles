import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:3000/api'
});

async function testImportScreenshot() {
  try {
    // 1. Sign in (Assuming the user can log in locally if the connection works)
    console.log('Logging in...');
    const loginRes = await api.post('/auth/signin', {
      email: 'admin@admin.com',
      password: 'admin'
    });
    const token = loginRes.data.token;
    const headers = { Authorization: token };

    // 2. Exact JSON from user screenshot (Social Media activity)
    const payload = {
      exercises: [
        {
          "title": "Social Media: Advantage vs Disadvantage",
          "level": "Intermediate",
          "prompt": "Write a short paragraph about the advantages and disadvantages of social media based on the ideas below.",
          "minWords": 30,
          "tips": [
            "Advantage ideas: connecting with people, information quickly",
            "Disadvantage ideas: waste of time, cyberbullying, fake news",
            "End with: 'In my opinion, social media is... because...'"
          ]
        }
      ],
      planId: 1
    };

    console.log('Sending import request...');
    const res = await api.post('/exercises/import', payload, { headers });
    console.log('Import Status:', res.status);
    console.log('API Response:', JSON.stringify(res.data, null, 2));

    // 3. Verify the type in the database response
    const createdArr = res.data.created || [];
    if (createdArr.length > 0) {
       console.log('Success! Created exercise:', {
         title: createdArr[0].title,
         type: createdArr[0].type,
         contentKeys: Object.keys(createdArr[0].content || {})
       });
       
       if (createdArr[0].type === 'writing') {
         console.log('✅ TYPE IS CORRECT: writing');
       } else {
         console.log('❌ TYPE IS WRONG:', createdArr[0].type);
       }
    }

  } catch (err) {
    if (err.response) {
      console.error('API Error:', err.response.status, err.response.data);
    } else {
      console.error('Error:', err.message);
    }
  }
}

testImportScreenshot();
