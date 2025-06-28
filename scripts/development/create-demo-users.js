#!/usr/bin/env node

/**
 * Script para criar usuários de demonstração
 */

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createDemoUsers() {
  console.log('🚀 Criando usuários de demonstração...');

  try {
    // Usuário administrador
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminUser = await prisma.user.upsert({
      where: { email: 'admin@willfinance.com' },
      update: {},
      create: {
        email: 'admin@willfinance.com',
        username: 'admin',
        firstName: 'Will',
        lastName: 'Finance Admin',
        password: adminPassword,
      },
    });

    console.log('✅ Usuário Admin criado:', {
      email: 'admin@willfinance.com',
      password: 'admin123',
      id: adminUser.id
    });

    // Usuário demonstração
    const demoPassword = await bcrypt.hash('demo123', 12);
    const demoUser = await prisma.user.upsert({
      where: { email: 'demo@willfinance.com' },
      update: {},
      create: {
        email: 'demo@willfinance.com',
        username: 'demo',
        firstName: 'Demo',
        lastName: 'User',
        password: demoPassword,
      },
    });

    console.log('✅ Usuário Demo criado:', {
      email: 'demo@willfinance.com',
      password: 'demo123',
      id: demoUser.id
    });

    // Usuário teste com seu email
    const testPassword = await bcrypt.hash('teste123', 12);
    const testUser = await prisma.user.upsert({
      where: { email: 'williamkelvem64@gmail.com' },
      update: {},
      create: {
        email: 'williamkelvem64@gmail.com',
        username: 'william',
        firstName: 'William',
        lastName: 'Kelvem',
        password: testPassword,
      },
    });

    console.log('✅ Usuário Teste criado:', {
      email: 'williamkelvem64@gmail.com',
      password: 'teste123',
      id: testUser.id
    });

    console.log('\n🎉 Usuários de demonstração criados com sucesso!');
    console.log('\n📝 Credenciais para login:');
    console.log('════════════════════════════════════════');
    console.log('👤 Admin:');
    console.log('   Email: admin@willfinance.com');
    console.log('   Senha: admin123');
    console.log('');
    console.log('👤 Demo:');
    console.log('   Email: demo@willfinance.com');
    console.log('   Senha: demo123');
    console.log('');
    console.log('👤 Seu usuário:');
    console.log('   Email: williamkelvem64@gmail.com');
    console.log('   Senha: teste123');
    console.log('════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Erro ao criar usuários:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoUsers();
