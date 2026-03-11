import { PrismaService } from '../prisma/prisma.service';
export declare class ImportExportService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    importBooks(file: Express.Multer.File): Promise<{
        success: number;
        failed: number;
        errors: string[];
    }>;
    exportBooks(): Promise<Buffer>;
    exportBorrowRecords(status?: string): Promise<Buffer>;
}
