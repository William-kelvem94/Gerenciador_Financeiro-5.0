import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createWilliamUser() {
  try {
    console.log('🔍 Verificando usuário williamkelvem64@gmail.com...');
    
    // Verificar se já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: 'williamkelvem64@gmail.com' }
    });

    if (existingUser) {
      console.log('✅ Usuário já existe!');
      console.log('   Email:', existingUser.email);
      console.log('   Nome:', existingUser.name);
      console.log('   ID:', existingUser.id);
      return;
    }

    console.log('👤 Criando novo usuário...');
    
    // Hash da senha (assumindo que você usa 123456789 como senha)
    const hashedPassword = await bcrypt.hash('123456789', 10);
    
    // Criar usuário
    const user = await prisma.user.create({
      data: {
        email: 'williamkelvem64@gmail.com',
        name: 'William Kelvem',
        password: hashedPassword,
      }
    });
    
    console.log('✅ Usuário criado com sucesso!');
    console.log('   Email:', user.email);
    console.log('   Nome:', user.name);
    console.log('   ID:', user.id);
    console.log('   Senha: 123456789');
    
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Erro:', errorMessage);
  } finally {
    await prisma.$disconnect();
  }
}

createWilliamUser();
