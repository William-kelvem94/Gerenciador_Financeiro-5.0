// test-prisma-connection.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    // Testar conexão com o banco de dados
    const connectionTest = await prisma.$queryRaw`SELECT 1 as result`;
    console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    
    // Listar todos os modelos e contagem
    const userCount = await prisma.user.count();
    const accountCount = await prisma.account.count();
    const categoryCount = await prisma.category.count();
    const transactionCount = await prisma.transaction.count();
    const budgetCount = await prisma.budget.count();
    const goalCount = await prisma.goal.count();
    const notificationCount = await prisma.notification.count();
    const aiInsightCount = await prisma.aiInsight.count();
    
    console.log('📊 Contagem de registros:');
    console.log(`- Usuários: ${userCount}`);
    console.log(`- Contas: ${accountCount}`);
    console.log(`- Categorias: ${categoryCount}`);
    console.log(`- Transações: ${transactionCount}`);
    console.log(`- Orçamentos: ${budgetCount}`);
    console.log(`- Metas: ${goalCount}`);
    console.log(`- Notificações: ${notificationCount}`);
    console.log(`- Insights IA: ${aiInsightCount}`);
    
    console.log('\n🚀 Schema do banco de dados funcionando corretamente!');
  } catch (error) {
    console.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
