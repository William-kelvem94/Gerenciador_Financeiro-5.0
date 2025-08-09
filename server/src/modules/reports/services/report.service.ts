import { ReportDTO, ReportSchema } from '../dto/report.dto';
import { PrismaClient } from '@prisma/client';

export class ReportService {
  constructor(private prisma: PrismaClient) {}

  async create(data: ReportDTO) {
    const validated = ReportSchema.parse(data);
    return this.prisma.report.create({ data: validated });
  }

  async findAll(userId: string) {
    return this.prisma.report.findMany({ where: { userId } });
  }

  async findById(id: string) {
    return this.prisma.report.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<ReportDTO>) {
    return this.prisma.report.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.report.delete({ where: { id } });
  }
}
