import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: any): Promise<{
        id: number;
        name: string;
        avatarUrl: string | null;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    findAll(page?: string, pageSize?: string, keyword?: string): Promise<{
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
    updateRole(id: string, role: string): Promise<{
        id: number;
        name: string;
        avatarUrl: string | null;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
}
