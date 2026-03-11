import { PrismaService } from '../prisma/prisma.service';
export declare class BorrowRecordsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(params: {
        page?: number;
        pageSize?: number;
        userId?: number;
        bookId?: number;
        status?: string;
        keyword?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
    }): Promise<{
        items: ({
            user: {
                id: number;
                name: string;
                avatarUrl: string | null;
            };
            book: {
                id: number;
                isbn: string | null;
                title: string;
                author: string;
                coverUrl: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BorrowStatus;
            borrowDate: Date;
            dueDate: Date;
            returnDate: Date | null;
            userId: number;
            bookId: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findByUser(userId: number, params: {
        page: number;
        pageSize: number;
        status?: string;
    }): Promise<{
        items: ({
            book: {
                id: number;
                isbn: string | null;
                title: string;
                author: string;
                coverUrl: string | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BorrowStatus;
            borrowDate: Date;
            dueDate: Date;
            returnDate: Date | null;
            userId: number;
            bookId: number;
        })[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    borrowBook(params: {
        userId: number;
        bookId: number;
        dueDate?: string;
    }): Promise<{
        user: {
            id: number;
            name: string;
        };
        book: {
            id: number;
            title: string;
            author: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BorrowStatus;
        borrowDate: Date;
        dueDate: Date;
        returnDate: Date | null;
        userId: number;
        bookId: number;
    }>;
    returnBook(recordId: number): Promise<{
        user: {
            id: number;
            name: string;
        };
        book: {
            id: number;
            title: string;
            author: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BorrowStatus;
        borrowDate: Date;
        dueDate: Date;
        returnDate: Date | null;
        userId: number;
        bookId: number;
    }>;
}
