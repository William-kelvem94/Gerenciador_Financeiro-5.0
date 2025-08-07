import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const defaultCategories = [
  // Income categories
  {
    name: 'Salário',
    type: 'income' as const,
    icon: '💰',
    color: '#10B981',
    description: 'Salário mensal',
  },
  {
    name: 'Freelance',
    type: 'income' as const,
    icon: '💼',
    color: '#3B82F6',
    description: 'Trabalhos freelancer',
  },
  {
    name: 'Investimentos',
    type: 'income' as const,
    icon: '📈',
    color: '#8B5CF6',
    description: 'Rendimentos de investimentos',
  },
  {
    name: 'Vendas',
    type: 'income' as const,
    icon: '🛍️',
    color: '#06B6D4',
    description: 'Vendas de produtos ou serviços',
  },
  {
    name: 'Outros Rendimentos',
    type: 'income' as const,
    icon: '💵',
    color: '#84CC16',
    description: 'Outras fontes de renda',
  },

  // Expense categories
  {
    name: 'Alimentação',
    type: 'expense' as const,
    icon: '🍽️',
    color: '#EF4444',
    description: 'Supermercado, restaurantes, delivery',
  },
  {
    name: 'Transporte',
    type: 'expense' as const,
    icon: '🚗',
    color: '#F59E0B',
    description: 'Combustível, transporte público, Uber',
  },
  {
    name: 'Moradia',
    type: 'expense' as const,
    icon: '🏠',
    color: '#8B5CF6',
    description: 'Aluguel, condomínio, IPTU',
  },
  {
    name: 'Saúde',
    type: 'expense' as const,
    icon: '🏥',
    color: '#10B981',
    description: 'Consultas, medicamentos, plano de saúde',
  },
  {
    name: 'Educação',
    type: 'expense' as const,
    icon: '📚',
    color: '#3B82F6',
    description: 'Cursos, livros, mensalidades',
  },
  {
    name: 'Lazer',
    type: 'expense' as const,
    icon: '🎬',
    color: '#EC4899',
    description: 'Cinema, jogos, hobbies',
  },
  {
    name: 'Vestuário',
    type: 'expense' as const,
    icon: '👕',
    color: '#06B6D4',
    description: 'Roupas, calçados, acessórios',
  },
  {
    name: 'Tecnologia',
    type: 'expense' as const,
    icon: '💻',
    color: '#6B7280',
    description: 'Eletrônicos, software, gadgets',
  },
  {
    name: 'Contas',
    type: 'expense' as const,
    icon: '📄',
    color: '#F59E0B',
    description: 'Água, luz, internet, telefone',
  },
  {
    name: 'Seguros',
    type: 'expense' as const,
    icon: '🛡️',
    color: '#84CC16',
    description: 'Seguro auto, vida, residencial',
  },
  {
    name: 'Impostos',
    type: 'expense' as const,
    icon: '📊',
    color: '#EF4444',
    description: 'IR, IPVA, taxas governamentais',
  },
  {
    name: 'Pets',
    type: 'expense' as const,
    icon: '🐕',
    color: '#8B5CF6',
    description: 'Veterinário, ração, acessórios',
  },
  {
    name: 'Viagens',
    type: 'expense' as const,
    icon: '✈️',
    color: '#06B6D4',
    description: 'Passagens, hospedagem, turismo',
  },
  {
    name: 'Doações',
    type: 'expense' as const,
    icon: '❤️',
    color: '#EC4899',
    description: 'Caridade, presentes, ajuda',
  },
  {
    name: 'Outros Gastos',
    type: 'expense' as const,
    icon: '💸',
    color: '#6B7280',
    description: 'Gastos diversos não categorizados',
  },
];

export async function seedCategories() {
  try {
    console.log('🌱 Seeding default categories...');

    // Verificar se já existem categorias padrão
    const existingCategories = await prisma.category.findMany({
      where: { userId: null },
    });

    if (existingCategories.length > 0) {
      console.log(`✅ Default categories already exist (${existingCategories.length} found)`);
      return;
    }

    // Criar categorias padrão em lote
    const createdCategories = await prisma.category.createMany({
      data: defaultCategories.map(cat => ({
        ...cat,
        userId: null, // categorias padrão do sistema
      })),
      // skipDuplicates não é suportado aqui, remova ou ajuste conforme a API do Prisma
    });

    console.log(`✅ Created ${createdCategories.count} default categories`);
    
    // Listar categorias criadas
    const categories = await prisma.category.findMany({
      where: { userId: null },
      orderBy: [{ type: 'asc' }, { name: 'asc' }],
    });

    console.log('\n📋 Default categories:');
    categories.forEach(cat => {
      console.log(`  ${cat.icon} ${cat.name} (${cat.type})`);
    });

  } catch (error) {
    console.error('❌ Error seeding categories:', error);
    throw error;
  }
}

export async function cleanupCategories() {
  try {
    console.log('🧹 Cleaning up default categories...');
    
    const deletedCategories = await prisma.category.deleteMany({
      where: { userId: null },
    });

    console.log(`✅ Deleted ${deletedCategories.count} default categories`);
  } catch (error) {
    console.error('❌ Error cleaning up categories:', error);
    throw error;
  }
}

// Se executado diretamente
if (require.main === module) {
  seedCategories()
    .then(() => {
      console.log('✅ Seed completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Seed failed:', error);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
