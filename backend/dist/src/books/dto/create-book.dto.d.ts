declare enum BookStatus {
    AVAILABLE = "AVAILABLE",
    DISABLED = "DISABLED"
}
export declare class CreateBookDto {
    title: string;
    author: string;
    publisher?: string;
    isbn?: string;
    description?: string;
    coverUrl?: string;
    totalCount?: number;
    availableCount?: number;
    location?: string;
    status?: BookStatus;
    categoryId?: number;
}
export {};
