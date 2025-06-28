const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createYourUser() {
  try {
    const hashedPassword = await bcrypt.hash('will123', 12);
    const user = await prisma.user.upsert({
      where: { email: 'williamkelvem64@gmail.com' },
      update: { 
        password: hashedPassword,
        username: 'williamkelvem' 
      },
      create: {
        email: 'williamkelvem64@gmail.com',
        username: 'williamkelvem',
        firstName: 'William',
        lastName: 'Kelvem',
        password: hashedPassword,
      },
    });
    
    console.log('✅ Seu usuário criado/atualizado:');
    console.log('📧 Email: williamkelvem64@gmail.com');
    console.log('🔑 Senha: will123');
    console.log('🆔 ID:', user.id);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createYourUser();
