import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: number): Promise<{
        id: number;
        name: string;
        avatarUrl: string | null;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    findAll(params: {
        page: number;
        pageSize: number;
        keyword?: string;
    }): Promise<{
        items: {
            id: number;
            name: string;
            avatarUrl: string | null;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
            createdAt: Date;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    updateRole(id: number, role: string): Promise<{
        id: number;
        name: string;
        avatarUrl: string | null;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    deleteUser(id: number): Promise<{
        message: string;
    }>;
}
