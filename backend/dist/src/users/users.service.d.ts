import { PrismaService } from '../prisma/prisma.service';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findById(id: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        avatarUrl: string | null;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    findAll(params: {
        page: number;
        pageSize: number;
        keyword?: string;
    }): Promise<{
        items: {
            id: number;
            name: string;
            createdAt: Date;
            avatarUrl: string | null;
            phone: string | null;
            role: import("@prisma/client").$Enums.Role;
        }[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    updateRole(id: number, role: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        avatarUrl: string | null;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    deleteUser(id: number): Promise<{
        message: string;
    }>;
}
