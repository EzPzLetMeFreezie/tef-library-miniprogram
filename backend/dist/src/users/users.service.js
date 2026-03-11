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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
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
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async findAll(params) {
        const { page, pageSize, keyword } = params;
        const where = {};
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
    async updateRole(id, role) {
        if (role !== 'ADMIN' && role !== 'USER') {
            throw new common_1.BadRequestException('Role must be ADMIN or USER');
        }
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.prisma.user.update({
            where: { id },
            data: { role: role },
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
    async deleteUser(id) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const activeBorrows = await this.prisma.borrowRecord.count({
            where: { userId: id, status: 'BORROWED' },
        });
        if (activeBorrows > 0) {
            throw new common_1.BadRequestException(`Cannot delete user with ${activeBorrows} active borrow(s). Return books first.`);
        }
        await this.prisma.borrowRecord.deleteMany({ where: { userId: id } });
        await this.prisma.user.delete({ where: { id } });
        return { message: 'User deleted successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map