import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { QueryBooksDto } from './dto/query-books.dto';
export declare class BooksController {
    private readonly booksService;
    constructor(booksService: BooksService);
    findAll(query: QueryBooksDto): Promise<{
        items: ({
            category: {
                id: number;
                name: string;
            } | null;
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            isbn: string | null;
            title: string;
            author: string;
            publisher: string | null;
            description: string | null;
            coverUrl: string | null;
            totalCount: number;
            availableCount: number;
            location: string | null;
            status: import("@prisma/client").$Enums.BookStatus;
            categoryId: number | null;
        })[];
        total: number;
        page: number;
        pageSize: number;
    }>;
    findOne(id: number): Promise<{
        category: {
            id: number;
            name: string;
        } | null;
        _count: {
            borrowRecords: number;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isbn: string | null;
        title: string;
        author: string;
        publisher: string | null;
        description: string | null;
        coverUrl: string | null;
        totalCount: number;
        availableCount: number;
        location: string | null;
        status: import("@prisma/client").$Enums.BookStatus;
        categoryId: number | null;
    }>;
    create(dto: CreateBookDto): Promise<{
        category: {
            id: number;
            name: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isbn: string | null;
        title: string;
        author: string;
        publisher: string | null;
        description: string | null;
        coverUrl: string | null;
        totalCount: number;
        availableCount: number;
        location: string | null;
        status: import("@prisma/client").$Enums.BookStatus;
        categoryId: number | null;
    }>;
    update(id: number, dto: UpdateBookDto): Promise<{
        category: {
            id: number;
            name: string;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isbn: string | null;
        title: string;
        author: string;
        publisher: string | null;
        description: string | null;
        coverUrl: string | null;
        totalCount: number;
        availableCount: number;
        location: string | null;
        status: import("@prisma/client").$Enums.BookStatus;
        categoryId: number | null;
    }>;
    remove(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        isbn: string | null;
        title: string;
        author: string;
        publisher: string | null;
        description: string | null;
        coverUrl: string | null;
        totalCount: number;
        availableCount: number;
        location: string | null;
        status: import("@prisma/client").$Enums.BookStatus;
        categoryId: number | null;
    }>;
}
