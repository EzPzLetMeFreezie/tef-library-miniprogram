import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RecommendationsService {
  constructor(private readonly prisma: PrismaService) {}

  async getHomeData() {
    const [hotBooks, newArrivals, categories] = await Promise.all([
      this.getHotBooks(),
      this.getNewArrivals(),
      this.getCategoryShelves(),
    ]);

    return { hotBooks, newArrivals, categoryShelves: categories };
  }

  private async getHotBooks(limit = 10) {
    const books = await this.prisma.book.findMany({
      where: { status: 'AVAILABLE' },
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { borrowRecords: true } },
      },
      orderBy: { borrowRecords: { _count: 'desc' } },
      take: limit,
    });
    return books;
  }

  private async getNewArrivals(limit = 10) {
    return this.prisma.book.findMany({
      where: { status: 'AVAILABLE' },
      include: { category: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  private async getCategoryShelves(booksPerCategory = 6) {
    const categories = await this.prisma.category.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        books: {
          where: { status: 'AVAILABLE' },
          take: booksPerCategory,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            title: true,
            author: true,
            coverUrl: true,
            availableCount: true,
          },
        },
      },
    });

    return categories
      .filter((c) => c.books.length > 0)
      .map((c) => ({
        category: { id: c.id, name: c.name },
        books: c.books,
      }));
  }
}
