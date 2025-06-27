// Script de teste para validar se o Firebase está funcionando
const jwt = require('./server/node_modules/jsonwebtoken');

// Criar um token fake mas com estrutura correta do Firebase
const fakeFirebaseToken = {
  iss: 'https://securetoken.google.com/gerenciador-financeiro-707c4',
  aud: 'gerenciador-financeiro-707c4',
  auth_time: Math.floor(Date.now() / 1000),
  user_id: 'test-user-123',
  sub: 'test-user-123',
  iat: Math.floor(Date.now() / 1000),
  exp: Math.floor(Date.now() / 1000) + 3600,
  email: 'teste@firebase.com',
  email_verified: true,
  name: 'Usuário Teste Firebase',
  picture: 'https://example.com/avatar.jpg',
  firebase: {
    identities: {
      email: ['teste@firebase.com']
    },
    sign_in_provider: 'google.com'
  }
};

// Assinar o token (fake, mas com estrutura correta)
const fakeIdToken = jwt.sign(fakeFirebaseToken, 'fake-secret', { algorithm: 'HS256' });

console.log('🔥 Fake Firebase ID Token (para teste):');
console.log(fakeIdToken);
console.log('\n📋 Para testar, copie este token e use no endpoint /api/auth/firebase/login');

// Testar decodificação
const decoded = jwt.decode(fakeIdToken);
console.log('\n🔍 Token decodificado:');
console.log(JSON.stringify(decoded, null, 2));
