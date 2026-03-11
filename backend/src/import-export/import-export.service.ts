import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as XLSX from 'xlsx';

@Injectable()
export class ImportExportService {
  constructor(private readonly prisma: PrismaService) {}

  async importBooks(file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows: any[] = XLSX.utils.sheet_to_json(sheet);

    const results = { success: 0, failed: 0, errors: [] as string[] };

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      try {
        if (!row.title || !row.author) {
          results.errors.push(`Row ${i + 2}: title and author are required`);
          results.failed++;
          continue;
        }

        const data: any = {
          title: String(row.title),
          author: String(row.author),
          publisher: row.publisher ? String(row.publisher) : null,
          isbn: row.isbn ? String(row.isbn) : null,
          description: row.description ? String(row.description) : null,
          coverUrl: row.coverUrl ? String(row.coverUrl) : null,
          totalCount: row.totalCount ? Number(row.totalCount) : 1,
          availableCount: row.availableCount ? Number(row.availableCount) : 1,
          location: row.location ? String(row.location) : null,
        };

        if (row.categoryName) {
          const category = await this.prisma.category.findUnique({
            where: { name: String(row.categoryName) },
          });
          if (category) {
            data.categoryId = category.id;
          }
        }

        if (data.isbn) {
          await this.prisma.book.upsert({
            where: { isbn: data.isbn },
            update: data,
            create: data,
          });
        } else {
          await this.prisma.book.create({ data });
        }
        results.success++;
      } catch (error) {
        results.errors.push(`Row ${i + 2}: ${error.message}`);
        results.failed++;
      }
    }

    return results;
  }

  async exportBooks(): Promise<Buffer> {
    const books = await this.prisma.book.findMany({
      include: { category: { select: { name: true } } },
      orderBy: { id: 'asc' },
    });

    const data = books.map((b) => ({
      ID: b.id,
      Title: b.title,
      Author: b.author,
      Publisher: b.publisher || '',
      ISBN: b.isbn || '',
      Description: b.description || '',
      Category: b.category?.name || '',
      Location: b.location || '',
      TotalCount: b.totalCount,
      AvailableCount: b.availableCount,
      Status: b.status,
      CreatedAt: b.createdAt.toISOString(),
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Books');
    return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
  }

  async exportBorrowRecords(status?: string): Promise<Buffer> {
    const where: any = {};
    if (status) where.status = status;

    const records = await this.prisma.borrowRecord.findMany({
      where,
      include: {
        user: { select: { name: true } },
        book: { select: { title: true, isbn: true } },
      },
      orderBy: { id: 'asc' },
    });

    const data = records.map((r) => ({
      ID: r.id,
      UserName: r.user.name,
      BookTitle: r.book.title,
      BookISBN: r.book.isbn || '',
      BorrowDate: r.borrowDate.toISOString(),
      DueDate: r.dueDate.toISOString(),
      ReturnDate: r.returnDate?.toISOString() || '',
      Status: r.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BorrowRecords');
    return Buffer.from(XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }));
  }
}
