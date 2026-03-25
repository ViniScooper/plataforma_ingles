import axios from 'axios';

const testLogin = async () => {
  try {
    console.log('🔐 Testando login da API...\n');
    
    const response = await axios.post('http://127.0.0.1:3000/api/auth/signin', {
      email: 'admin@test.com',
      password: 'admin123'
    });

    console.log('✅ LOGIN SUCESSO!\n');
    console.log('Response Status:', response.status);
    console.log('\nDados retornados:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log('❌ ERRO NO LOGIN!\n');
    console.log('Status:', error.response?.status);
    console.log('Mensagem:', error.response?.data?.error || error.message);
    console.log('\nFull Error:');
    console.log(JSON.stringify(error.response?.data, null, 2));
  }
};

testLogin();
