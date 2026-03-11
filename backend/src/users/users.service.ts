import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(params: { page: number; pageSize: number; keyword?: string }) {
    const { page, pageSize, keyword } = params;
    const where: Prisma.UserWhereInput = {};
    if (keyword) {
      where.OR = [
        { name: { contains: keyword } },
        { phone: { contains: keyword } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        select: {
          id: true,
          name: true,
          avatarUrl: true,
          phone: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async updateRole(id: number, role: string) {
    if (role !== 'ADMIN' && role !== 'USER') {
      throw new BadRequestException('Role must be ADMIN or USER');
    }

    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: { role: role as any },
      select: {
        id: true,
        name: true,
        avatarUrl: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async deleteUser(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check for active borrows
    const activeBorrows = await this.prisma.borrowRecord.count({
      where: { userId: id, status: 'BORROWED' },
    });
    if (activeBorrows > 0) {
      throw new BadRequestException(
        `Cannot delete user with ${activeBorrows} active borrow(s). Return books first.`,
      );
    }

    // Delete borrow records first, then user
    await this.prisma.borrowRecord.deleteMany({ where: { userId: id } });
    await this.prisma.user.delete({ where: { id } });

    return { message: 'User deleted successfully' };
  }
}
