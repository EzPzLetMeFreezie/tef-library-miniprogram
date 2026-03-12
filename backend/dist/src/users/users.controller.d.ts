import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getMe(user: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        avatarUrl: string | null;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    findAll(page?: string, pageSize?: string, keyword?: string): Promise<{
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
    updateRole(id: string, role: string): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        avatarUrl: string | null;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
    deleteUser(id: string): Promise<{
        message: string;
    }>;
}
