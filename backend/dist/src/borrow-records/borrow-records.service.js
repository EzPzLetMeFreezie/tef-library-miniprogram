"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BorrowRecordsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BorrowRecordsService = class BorrowRecordsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(params) {
        const { page = 1, pageSize = 10, userId, bookId, status, keyword, sortBy = 'createdAt', sortOrder = 'desc', } = params;
        const where = {};
        if (userId)
            where.userId = userId;
        if (bookId)
            where.bookId = bookId;
        if (status)
            where.status = status;
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
    async findByUser(userId, params) {
        const { page, pageSize, status } = params;
        const where = { userId };
        if (status)
            where.status = status;
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
    async borrowBook(params) {
        const { userId, bookId, dueDate } = params;
        return this.prisma.$transaction(async (tx) => {
            const book = await tx.book.findUnique({ where: { id: bookId } });
            if (!book) {
                throw new common_1.NotFoundException('Book not found');
            }
            if (book.status !== 'AVAILABLE') {
                throw new common_1.BadRequestException('Book is not available for borrowing');
            }
            if (book.availableCount <= 0) {
                throw new common_1.BadRequestException('Book is out of stock');
            }
            const user = await tx.user.findUnique({ where: { id: userId } });
            if (!user) {
                throw new common_1.NotFoundException('User not found');
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
    async returnBook(recordId) {
        return this.prisma.$transaction(async (tx) => {
            const record = await tx.borrowRecord.findUnique({
                where: { id: recordId },
            });
            if (!record) {
                throw new common_1.NotFoundException('Borrow record not found');
            }
            if (record.status === 'RETURNED') {
                throw new common_1.BadRequestException('Book has already been returned');
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
};
exports.BorrowRecordsService = BorrowRecordsService;
exports.BorrowRecordsService = BorrowRecordsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BorrowRecordsService);
//# sourceMappingURL=borrow-records.service.js.map