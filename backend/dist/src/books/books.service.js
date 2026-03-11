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
exports.BooksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BooksService = class BooksService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { keyword, categoryId, status, page = 1, pageSize = 10, sortBy = 'createdAt', sortOrder = 'desc', } = query;
        const where = {};
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
        const orderBy = {
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
    async findOne(id) {
        const book = await this.prisma.book.findUnique({
            where: { id },
            include: {
                category: { select: { id: true, name: true } },
                _count: { select: { borrowRecords: true } },
            },
        });
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        return book;
    }
    async create(dto) {
        return this.prisma.book.create({
            data: dto,
            include: { category: { select: { id: true, name: true } } },
        });
    }
    async update(id, dto) {
        const book = await this.prisma.book.findUnique({ where: { id } });
        if (!book) {
            throw new common_1.NotFoundException('Book not found');
        }
        return this.prisma.book.update({
            where: { id },
            data: dto,
            include: { category: { select: { id: true, name: true } } },
        });
    }
    async remove(id) {
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
            throw new common_1.NotFoundException('Book not found');
        }
        if (book.borrowRecords.length > 0) {
            throw new common_1.BadRequestException('Cannot delete book with active borrow records');
        }
        return this.prisma.book.delete({ where: { id } });
    }
};
exports.BooksService = BooksService;
exports.BooksService = BooksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BooksService);
//# sourceMappingURL=books.service.js.map