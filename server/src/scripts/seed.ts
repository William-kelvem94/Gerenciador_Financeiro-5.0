import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

async function main() {
  logger.info('🌱 Starting database seed...');

  // Criar usuário demo
  const demoEmail = 'demo@willfinance.com';
  const existingDemo = await prisma.user.findUnique({
    where: { email: demoEmail }
  });

  if (!existingDemo) {
    const hashedPassword = await bcrypt.hash('cyberpunk2077', 12);
    
    await prisma.user.create({
      data: {
        email: demoEmail,
        username: 'demo_user',
        firstName: 'Demo',
        lastName: 'User',
        password: hashedPassword,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
      }
    });
    
    logger.info('👤 Created demo user: demo@willfinance.com / cyberpunk2077');
  }

  // Criar categorias padrão do sistema
  const defaultCategories = [
    // Categorias de Receita
    { name: 'Salário', description: 'Renda proveniente de trabalho CLT ou PJ', color: '#39FF14', icon: 'briefcase', type: 'INCOME' },
    { name: 'Freelances', description: 'Trabalhos independentes e projetos', color: '#00FFFF', icon: 'laptop', type: 'INCOME' },
    { name: 'Investimentos', description: 'Dividendos, juros e rendimentos', color: '#FFD700', icon: 'trending-up', type: 'INCOME' },
    { name: 'Vendas', description: 'Venda de produtos ou serviços', color: '#FF69B4', icon: 'shopping-cart', type: 'INCOME' },
    { name: 'Outros', description: 'Outras fontes de receita', color: '#00FF80', icon: 'plus-circle', type: 'INCOME' },
    
    // Categorias de Despesa
    { name: 'Alimentação', description: 'Supermercado, restaurantes, delivery', color: '#FF6B35', icon: 'utensils', type: 'EXPENSE' },
    { name: 'Transporte', description: 'Combustível, transporte público, manutenção', color: '#4ECDC4', icon: 'car', type: 'EXPENSE' },
    { name: 'Moradia', description: 'Aluguel, financiamento, condomínio', color: '#5F27CD', icon: 'home', type: 'EXPENSE' },
    { name: 'Contas', description: 'Luz, água, internet, telefone', color: '#FFEAA7', icon: 'zap', type: 'EXPENSE' },
    { name: 'Saúde', description: 'Médicos, medicamentos, plano de saúde', color: '#DDA0DD', icon: 'heart', type: 'EXPENSE' },
    { name: 'Educação', description: 'Cursos, livros, mensalidades', color: '#FF9FF3', icon: 'book', type: 'EXPENSE' },
    { name: 'Entretenimento', description: 'Cinema, shows, games, streaming', color: '#96CEB4', icon: 'play', type: 'EXPENSE' },
    { name: 'Compras', description: 'Roupas, eletrônicos, casa', color: '#45B7D1', icon: 'shopping-bag', type: 'EXPENSE' },
    { name: 'Viagens', description: 'Turismo, hospedagem, passagens', color: '#54A0FF', icon: 'plane', type: 'EXPENSE' },
    { name: 'Pets', description: 'Veterinário, ração, acessórios', color: '#FF6B6B', icon: 'heart', type: 'EXPENSE' },
    { name: 'Outros', description: 'Outras despesas diversas', color: '#A8A8A8', icon: 'more-horizontal', type: 'EXPENSE' },
    
    // Categoria de Transferência
    { name: 'Transferência', description: 'Transferências entre contas', color: '#FFD93D', icon: 'arrow-right-left', type: 'TRANSFER' },
  ];

  // Criar categorias padrão do sistema
  for (const category of defaultCategories) {
    // Verificar se já existe
    const existing = await prisma.category.findFirst({
      where: {
        name: category.name,
        isSystem: true
      }
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          name: category.name,
          description: category.description,
          color: category.color,
          icon: category.icon,
          type: category.type,
          userId: null,
          isSystem: true
        }
      });
    }
  }

  logger.info(`📊 Created ${defaultCategories.length} system categories`);
  logger.info('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    logger.error('❌ Database seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
