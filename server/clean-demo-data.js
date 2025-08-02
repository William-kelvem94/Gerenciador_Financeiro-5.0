#!/usr/bin/env node

/**
 * Script para limpar todos os dados demo/mock do Will Finance
 * Remove dados fictícios do banco de dados e limpa páginas com dados estáticos
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanDemoData() {
  console.log('🧹 WILL FINANCE - LIMPEZA DE DADOS DEMO/MOCK\n');
  console.log('==============================================\n');

  try {
    console.log('🗑️  1. Removendo dados demo/mock do banco...');

    // Remover transações demo/fictícias
    const deletedTransactions = await prisma.transaction.deleteMany({
      where: {
        OR: [
          { description: { contains: 'Demo' } },
          { description: { contains: 'Teste' } },
          { description: { contains: 'Sample' } },
          { description: { contains: 'Exemplo' } },
          { description: { contains: 'Mock' } },
          { description: { contains: 'Fictício' } },
          { description: { contains: 'Demonstração' } },
          // Dados específicos dos mocks
          { description: { contains: 'SALÁRIO EMPRESA TECH LTDA' } },
          { description: { contains: 'PIX ENVIADO JOÃO' } },
          { description: { contains: 'COMPRA DÉBITO SUPERMERCADO' } },
          { description: { contains: 'TRANSFERÊNCIA TED MARIA' } },
          { description: { contains: 'Uber' } },
          { description: { contains: 'iFood' } },
          { description: { contains: 'Amazon Livros' } },
          { description: { contains: 'Farmácia Drogasil' } }
        ]
      }
    });

    console.log(`   ✅ ${deletedTransactions.count} transações demo removidas`);

    // Remover categorias demo
    const deletedCategories = await prisma.category.deleteMany({
      where: {
        OR: [
          { name: { contains: 'Demo' } },
          { name: { contains: 'Teste' } },
          { name: { contains: 'Sample' } },
          { description: { contains: 'demonstração' } },
          { description: { contains: 'exemplo' } },
          { description: { contains: 'teste' } }
        ]
      }
    });

    console.log(`   ✅ ${deletedCategories.count} categorias demo removidas`);

    // Remover contas demo
    const deletedAccounts = await prisma.account.deleteMany({
      where: {
        OR: [
          { name: { contains: 'Demo' } },
          { name: { contains: 'Teste' } },
          { name: { contains: 'Sample' } },
          { description: { contains: 'demonstração' } },
          { description: { contains: 'exemplo' } },
          { description: { contains: 'fictícios' } }
        ]
      }
    });

    console.log(`   ✅ ${deletedAccounts.count} contas demo removidas`);

    // Remover usuário demo se existir
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        OR: [
          { email: 'demo@willfinance.com' },
          { name: { contains: 'Demo' } },
          { name: { contains: 'Usuário' } }
        ]
      }
    });

    console.log(`   ✅ ${deletedUsers.count} usuários demo removidos`);

    console.log('\n📊 2. Estatísticas após limpeza...');
    
    const stats = {
      transactions: await prisma.transaction.count(),
      categories: await prisma.category.count(),
      accounts: await prisma.account.count(),
      users: await prisma.user.count()
    };

    console.log(`   📈 Transações restantes: ${stats.transactions}`);
    console.log(`   🏷️  Categorias restantes: ${stats.categories}`);
    console.log(`   🏦 Contas restantes: ${stats.accounts}`);
    console.log(`   👤 Usuários restantes: ${stats.users}`);

    console.log('\n✅ LIMPEZA CONCLUÍDA COM SUCESSO!');
    console.log('\n📝 PRÓXIMOS PASSOS:');
    console.log('   1. As páginas no frontend agora mostrarão dados vazios/reais');
    console.log('   2. Use a funcionalidade de importação para adicionar dados reais');
    console.log('   3. Crie transações, categorias e contas conforme necessário');
    console.log('\n🚀 Sistema pronto para dados reais!');

  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Executar limpeza
cleanDemoData();
