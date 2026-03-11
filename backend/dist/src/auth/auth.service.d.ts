import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { WechatService } from './wechat.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private readonly prisma;
    private readonly jwtService;
    private readonly wechatService;
    constructor(prisma: PrismaService, jwtService: JwtService, wechatService: WechatService);
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: number;
            name: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    getProfile(userId: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        avatarUrl: string | null;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
