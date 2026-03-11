import { BorrowRecordsService } from './borrow-records.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { QueryBorrowRecordsDto } from './dto/query-borrow-records.dto';
export declare class BorrowRecordsController {
    private readonly borrowRecordsService;
    constructor(borrowRecordsService: BorrowRecordsService);
    findAll(query: QueryBorrowRecordsDto): Promise<{
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
    findMy(user: any, page?: string, pageSize?: string, status?: string): Promise<{
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
    borrow(user: any, dto: BorrowBookDto): Promise<{
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
    returnBook(dto: ReturnBookDto): Promise<{
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
