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
exports.RecommendationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RecommendationsService = class RecommendationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getHomeData() {
        const [hotBooks, newArrivals, categories] = await Promise.all([
            this.getHotBooks(),
            this.getNewArrivals(),
            this.getCategoryShelves(),
        ]);
        return { hotBooks, newArrivals, categoryShelves: categories };
    }
    async getHotBooks(limit = 10) {
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
    async getNewArrivals(limit = 10) {
        return this.prisma.book.findMany({
            where: { status: 'AVAILABLE' },
            include: { category: { select: { id: true, name: true } } },
            orderBy: { createdAt: 'desc' },
            take: limit,
        });
    }
    async getCategoryShelves(booksPerCategory = 6) {
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
};
exports.RecommendationsService = RecommendationsService;
exports.RecommendationsService = RecommendationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RecommendationsService);
//# sourceMappingURL=recommendations.service.js.map