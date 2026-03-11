import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryBooksDto) {
    const {
      keyword,
      categoryId,
      status,
      page = 1,
      pageSize = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const where: Prisma.BookWhereInput = {};

    if (keyword) {
      where.OR = [
        { title: { contains: keyword } },
        { author: { contains: keyword } },
        { isbn: { contains: keyword } },
      ];
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (status) {
      where.status = status;
    }

    const orderBy: Prisma.BookOrderByWithRelationInput = {
      [sortBy]: sortOrder,
    };

    const [items, total] = await Promise.all([
      this.prisma.book.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy,
        include: { category: { select: { id: true, name: true } } },
      }),
      this.prisma.book.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async findOne(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { borrowRecords: true } },
      },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return book;
  }

  async create(dto: CreateBookDto) {
    return this.prisma.book.create({
      data: dto,
      include: { category: { select: { id: true, name: true } } },
    });
  }

  async update(id: number, dto: UpdateBookDto) {
    const book = await this.prisma.book.findUnique({ where: { id } });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    return this.prisma.book.update({
      where: { id },
      data: dto,
      include: { category: { select: { id: true, name: true } } },
    });
  }

  async remove(id: number) {
    const book = await this.prisma.book.findUnique({
      where: { id },
      include: {
        borrowRecords: {
          where: { status: 'BORROWED' },
          select: { id: true },
        },
      },
    });
    if (!book) {
      throw new NotFoundException('Book not found');
    }
    if (book.borrowRecords.length > 0) {
      throw new BadRequestException(
        'Cannot delete book with active borrow records',
      );
    }
    return this.prisma.book.delete({ where: { id } });
  }
}
