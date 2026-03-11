"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportExportService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const XLSX = __importStar(require("xlsx"));
let ImportExportService = class ImportExportService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async importBooks(file) {
        if (!file) {
            throw new common_1.BadRequestException('No file uploaded');
        }
        const workbook = XLSX.read(file.buffer, { type: 'buffer' });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(sheet);
        const results = { success: 0, failed: 0, errors: [] };
        for (let i = 0; i < rows.length; i++) {
            const row = rows[i];
            try {
                if (!row.title || !row.author) {
                    results.errors.push(`Row ${i + 2}: title and author are required`);
                    results.failed++;
                    continue;
                }
                const data = {
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
                }
                else {
                    await this.prisma.book.create({ data });
                }
                results.success++;
            }
            catch (error) {
                results.errors.push(`Row ${i + 2}: ${error.message}`);
                results.failed++;
            }
        }
        return results;
    }
    async exportBooks() {
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
    async exportBorrowRecords(status) {
        const where = {};
        if (status)
            where.status = status;
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
};
exports.ImportExportService = ImportExportService;
exports.ImportExportService = ImportExportService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ImportExportService);
//# sourceMappingURL=import-export.service.js.map