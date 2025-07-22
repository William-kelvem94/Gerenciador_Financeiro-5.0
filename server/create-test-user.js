// create-test-user.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  try {
    // Verificar se o usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: {
        email: 'teste@willfinance.com'
      }
    });

    if (existingUser) {
      console.log('⚠️ Usuário de teste já existe, pulando criação.');
      return;
    }

    // Criar um usuário de teste
    const hashedPassword = await bcrypt.hash('Senha@123', 10);
    
    const user = await prisma.user.create({
      data: {
        name: 'Usuário Teste',
        email: 'teste@willfinance.com',
        password: hashedPassword,
        avatar: null,
        // Criar conta associada ao usuário
        accounts: {
          create: [
            {
              name: 'Conta Corrente',
              type: 'CHECKING',
              balance: 1000.0,
              description: 'Minha conta principal'
            },
            {
              name: 'Poupança',
              type: 'SAVINGS',
              balance: 5000.0,
              description: 'Reserva de emergência'
            }
          ]
        },
        // Criar categorias
        categories: {
          create: [
            {
              name: 'Alimentação',
              type: 'EXPENSE',
              color: '#FF6B6B',
              icon: 'restaurant'
            },
            {
              name: 'Transporte',
              type: 'EXPENSE',
              color: '#4ECDC4',
              icon: 'car'
            },
            {
              name: 'Salário',
              type: 'INCOME',
              color: '#1A535C',
              icon: 'wallet'
            }
          ]
        }
      },
      include: {
        accounts: true,
        categories: true
      }
    });

    // Adicionar algumas transações
    if (user.accounts.length > 0 && user.categories.length > 0) {
      const checkingAccount = user.accounts.find(a => a.type === 'CHECKING');
      const salaryCategory = user.categories.find(c => c.name === 'Salário');
      const foodCategory = user.categories.find(c => c.name === 'Alimentação');
      
      if (checkingAccount && salaryCategory && foodCategory) {
        await prisma.transaction.create({
          data: {
            amount: 3000.0,
            description: 'Salário mensal',
            type: 'INCOME',
            date: new Date(),
            userId: user.id,
            accountId: checkingAccount.id,
            categoryId: salaryCategory.id
          }
        });
        
        await prisma.transaction.create({
          data: {
            amount: 150.0,
            description: 'Supermercado',
            type: 'EXPENSE',
            date: new Date(),
            userId: user.id,
            accountId: checkingAccount.id,
            categoryId: foodCategory.id
          }
        });
      }
    }

    console.log('✅ Usuário de teste e dados relacionados criados com sucesso!');
    console.log(`- Email: teste@willfinance.com`);
    console.log(`- Senha: Senha@123`);
  } catch (error) {
    console.error('❌ Erro ao criar usuário de teste:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
