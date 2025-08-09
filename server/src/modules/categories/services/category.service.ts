import { CategoryDTO, CategorySchema } from '../dto/category.dto';
import { PrismaClient } from '@prisma/client';

export class CategoryService {
  constructor(private prisma: PrismaClient) {}

  async create(data: CategoryDTO) {
    const validated = CategorySchema.parse(data);
    return this.prisma.category.create({ data: validated });
  }

  async findAll(userId: string) {
    return this.prisma.category.findMany({ where: { userId, isActive: true } });
  }

  async findById(id: string) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<CategoryDTO>) {
    return this.prisma.category.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.category.update({ where: { id }, data: { isActive: false } });
  }
}
