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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const prisma_service_1 = require("../prisma/prisma.service");
const wechat_service_1 = require("./wechat.service");
let AuthService = class AuthService {
    prisma;
    jwtService;
    wechatService;
    constructor(prisma, jwtService, wechatService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.wechatService = wechatService;
    }
    async login(loginDto) {
        const openid = await this.wechatService.code2Session(loginDto.code);
        if (!openid) {
            throw new common_1.UnauthorizedException('Invalid WeChat login code');
        }
        let user = await this.prisma.user.findUnique({ where: { openid } });
        if (!user) {
            user = await this.prisma.user.create({
                data: {
                    openid,
                    name: loginDto.nickname || 'WeChat User',
                    avatarUrl: loginDto.avatarUrl,
                },
            });
        }
        else if (loginDto.nickname || loginDto.avatarUrl) {
            user = await this.prisma.user.update({
                where: { id: user.id },
                data: {
                    ...(loginDto.nickname && { name: loginDto.nickname }),
                    ...(loginDto.avatarUrl && { avatarUrl: loginDto.avatarUrl }),
                },
            });
        }
        const payload = { sub: user.id, role: user.role };
        const token = this.jwtService.sign(payload);
        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                avatarUrl: user.avatarUrl,
                role: user.role,
            },
        };
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
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
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        wechat_service_1.WechatService])
], AuthService);
//# sourceMappingURL=auth.service.js.map