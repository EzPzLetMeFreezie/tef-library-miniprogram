export declare class QueryBorrowRecordsDto {
    userId?: number;
    bookId?: number;
    status?: string;
    keyword?: string;
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
