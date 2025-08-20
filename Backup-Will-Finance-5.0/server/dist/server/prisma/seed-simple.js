"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('🌱 Starting seed process...');
    const categories = [
        { name: 'Food & Dining', icon: '🍽️', color: '#ff6b6b', type: 'expense' },
        { name: 'Transportation', icon: '🚗', color: '#4ecdc4', type: 'expense' },
        { name: 'Shopping', icon: '🛍️', color: '#45b7d1', type: 'expense' },
        { name: 'Entertainment', icon: '🎬', color: '#f39c12', type: 'expense' },
        { name: 'Bills & Utilities', icon: '💡', color: '#e74c3c', type: 'expense' },
        { name: 'Healthcare', icon: '🏥', color: '#2ecc71', type: 'expense' },
        { name: 'Education', icon: '📚', color: '#9b59b6', type: 'expense' },
        { name: 'Travel', icon: '✈️', color: '#1abc9c', type: 'expense' },
        { name: 'Salary', icon: '💼', color: '#27ae60', type: 'income' },
        { name: 'Business', icon: '🏢', color: '#2980b9', type: 'income' },
        { name: 'Investments', icon: '📈', color: '#8e44ad', type: 'income' },
        { name: 'Other Income', icon: '💰', color: '#f39c12', type: 'income' },
        { name: 'Other Expense', icon: '❓', color: '#95a5a6', type: 'expense' },
    ];
    for (const category of categories) {
        try {
            const existingCategory = await prisma.category.findFirst({
                where: {
                    name: category.name,
                    userId: null,
                }
            });
            if (!existingCategory) {
                await prisma.category.create({
                    data: {
                        ...category,
                        userId: null,
                    },
                });
            }
        }
        catch (error) {
            console.error(`Error creating category ${category.name}:`, error);
        }
    }
    console.log('✅ Categories created');
    console.log('ℹ️ Skipping demo user, accounts, and transactions for development');
    console.log('✅ Seed completed successfully!');
}
main()
    .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed-simple.js.map