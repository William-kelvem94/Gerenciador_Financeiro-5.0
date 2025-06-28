const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testUser() {
  try {
    // Criar usuário simples
    const hashedPassword = await bcrypt.hash('123456', 12);
    console.log('Hash criado:', hashedPassword);
    
    const user = await prisma.user.upsert({
      where: { email: 'test@test.com' },
      update: { password: hashedPassword },
      create: {
        email: 'test@test.com',
        username: 'test',
        firstName: 'Test',
        lastName: 'User',
        password: hashedPassword,
      },
    });
    
    console.log('Usuário:', user.email, user.id);
    
    // Testar comparação
    const isValid = await bcrypt.compare('123456', user.password);
    console.log('Senha válida:', isValid);
    
    // Listar todos os usuários
    const users = await prisma.user.findMany({
      select: { id: true, email: true, username: true }
    });
    console.log('Todos os usuários:', users);
    
  } catch (error) {
    console.error('Erro:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testUser();
