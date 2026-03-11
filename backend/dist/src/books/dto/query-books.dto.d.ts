declare enum BookStatus {
    AVAILABLE = "AVAILABLE",
    DISABLED = "DISABLED"
}
export declare class QueryBooksDto {
    keyword?: string;
    categoryId?: number;
    status?: BookStatus;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
export {};
