import type { Response } from 'express';
import { ImportExportService } from './import-export.service';
export declare class ImportExportController {
    private readonly importExportService;
    constructor(importExportService: ImportExportService);
    importBooks(file: Express.Multer.File): Promise<{
        success: number;
        failed: number;
        errors: string[];
    }>;
    exportBooks(res: Response): Promise<void>;
    exportBorrowRecords(res: Response, status?: string): Promise<void>;
}
