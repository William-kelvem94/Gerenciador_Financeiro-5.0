const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Criando usuário demo...');

  const hashedPassword = await bcrypt.hash('cyberpunk2077', 12);

  const user = await prisma.user.upsert({
    where: { email: 'demo@willfinance.com' },
    update: {},
    create: {
      email: 'demo@willfinance.com',
      username: 'demo_user',
      firstName: 'Usuário',
      lastName: 'Demo',
      password: hashedPassword,
      emailVerified: true,
    },
  });

  console.log('✅ Demo user created:', user.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
