import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando configuração do banco de dados...');

  // Criar categorias padrão do sistema (sem dados fictícios)
  const systemCategories = [
    { name: 'Alimentação', icon: '🍽️', color: '#ff6b6b', type: 'expense' },
    { name: 'Transporte', icon: '🚗', color: '#4ecdc4', type: 'expense' },
    { name: 'Compras', icon: '🛍️', color: '#45b7d1', type: 'expense' },
    { name: 'Entretenimento', icon: '🎬', color: '#f39c12', type: 'expense' },
    { name: 'Contas e Utilidades', icon: '💡', color: '#e74c3c', type: 'expense' },
    { name: 'Saúde', icon: '🏥', color: '#2ecc71', type: 'expense' },
    { name: 'Educação', icon: '📚', color: '#9b59b6', type: 'expense' },
    { name: 'Viagem', icon: '✈️', color: '#1abc9c', type: 'expense' },
    { name: 'Salário', icon: '💼', color: '#27ae60', type: 'income' },
    { name: 'Negócios', icon: '🏢', color: '#2980b9', type: 'income' },
    { name: 'Investimentos', icon: '📈', color: '#8e44ad', type: 'income' },
    { name: 'Outras Receitas', icon: '💰', color: '#f1c40f', type: 'income' },
    { name: 'Outras Despesas', icon: '❓', color: '#95a5a6', type: 'expense' },
  ];

  // Criar apenas categorias do sistema (sem dados de usuário)
  for (const category of systemCategories) {
    try {
      const existing = await prisma.category.findFirst({
        where: {
          name: category.name,
          userId: null
        }
      });

      if (!existing) {
        await prisma.category.create({
          data: {
            ...category,
            isSystem: true,
            userId: null,
          },
        });
        console.log(`✅ Categoria "${category.name}" criada`);
      } else {
        console.log(`ℹ️ Categoria "${category.name}" já existe`);
      }
    } catch (error: any) {
      console.error(`❌ Erro ao criar categoria "${category.name}":`, error.message);
    }
  }

  console.log('✅ Categorias do sistema configuradas');
  console.log('🎉 Banco de dados configurado com sucesso!');
  console.log('💡 Pronto para uso - sem dados fictícios');
}

main()
  .catch((e) => {
    console.error('❌ Erro na configuração:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
