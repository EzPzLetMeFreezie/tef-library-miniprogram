import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BorrowRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: {
    page?: number;
    pageSize?: number;
    userId?: number;
    bookId?: number;
    status?: string;
    keyword?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }) {
    const {
      page = 1,
      pageSize = 10,
      userId,
      bookId,
      status,
      keyword,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = params;

    const where: Prisma.BorrowRecordWhereInput = {};
    if (userId) where.userId = userId;
    if (bookId) where.bookId = bookId;
    if (status) where.status = status as any;
    if (keyword) {
      where.OR = [
        { book: { title: { contains: keyword } } },
        { user: { name: { contains: keyword } } },
      ];
    }

    const [items, total] = await Promise.all([
      this.prisma.borrowRecord.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          user: { select: { id: true, name: true, avatarUrl: true } },
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              coverUrl: true,
              isbn: true,
            },
          },
        },
        orderBy: sortBy === 'userName'
          ? { user: { name: sortOrder } }
          : sortBy === 'bookTitle'
            ? { book: { title: sortOrder } }
            : { [sortBy]: sortOrder },
      }),
      this.prisma.borrowRecord.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async findByUser(
    userId: number,
    params: { page: number; pageSize: number; status?: string },
  ) {
    const { page, pageSize, status } = params;
    const where: Prisma.BorrowRecordWhereInput = { userId };
    if (status) where.status = status as any;

    const [items, total] = await Promise.all([
      this.prisma.borrowRecord.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          book: {
            select: {
              id: true,
              title: true,
              author: true,
              coverUrl: true,
              isbn: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.borrowRecord.count({ where }),
    ]);

    return { items, total, page, pageSize };
  }

  async borrowBook(params: {
    userId: number;
    bookId: number;
    dueDate?: string;
  }) {
    const { userId, bookId, dueDate } = params;

    return this.prisma.$transaction(async (tx) => {
      const book = await tx.book.findUnique({ where: { id: bookId } });
      if (!book) {
        throw new NotFoundException('Book not found');
      }
      if (book.status !== 'AVAILABLE') {
        throw new BadRequestException('Book is not available for borrowing');
      }
      if (book.availableCount <= 0) {
        throw new BadRequestException('Book is out of stock');
      }

      const user = await tx.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const defaultDueDate = new Date();
      defaultDueDate.setDate(defaultDueDate.getDate() + 30);

      const record = await tx.borrowRecord.create({
        data: {
          userId,
          bookId,
          dueDate: dueDate ? new Date(dueDate) : defaultDueDate,
        },
        include: {
          user: { select: { id: true, name: true } },
          book: { select: { id: true, title: true, author: true } },
        },
      });

      await tx.book.update({
        where: { id: bookId },
        data: { availableCount: { decrement: 1 } },
      });

      return record;
    });
  }

  async returnBook(recordId: number) {
    return this.prisma.$transaction(async (tx) => {
      const record = await tx.borrowRecord.findUnique({
        where: { id: recordId },
      });
      if (!record) {
        throw new NotFoundException('Borrow record not found');
      }
      if (record.status === 'RETURNED') {
        throw new BadRequestException('Book has already been returned');
      }

      const updatedRecord = await tx.borrowRecord.update({
        where: { id: recordId },
        data: {
          status: 'RETURNED',
          returnDate: new Date(),
        },
        include: {
          user: { select: { id: true, name: true } },
          book: { select: { id: true, title: true, author: true } },
        },
      });

      await tx.book.update({
        where: { id: record.bookId },
        data: { availableCount: { increment: 1 } },
      });

      return updatedRecord;
    });
  }
}
