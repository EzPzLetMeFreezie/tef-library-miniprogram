import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(loginDto: LoginDto): Promise<{
        token: string;
        user: {
            id: number;
            name: string;
            avatarUrl: string | null;
            role: import("@prisma/client").$Enums.Role;
        };
    }>;
    getProfile(user: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        avatarUrl: string | null;
        phone: string | null;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
