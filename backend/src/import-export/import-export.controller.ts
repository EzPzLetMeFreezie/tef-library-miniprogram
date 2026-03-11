import {
  Controller,
  Post,
  Get,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { ImportExportService } from './import-export.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class ImportExportController {
  constructor(private readonly importExportService: ImportExportService) {}

  @Post('import/books')
  @UseInterceptors(FileInterceptor('file'))
  async importBooks(@UploadedFile() file: Express.Multer.File) {
    return this.importExportService.importBooks(file);
  }

  @Get('export/books')
  async exportBooks(@Res() res: Response) {
    const buffer = await this.importExportService.exportBooks();
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=books.xlsx',
    });
    res.send(buffer);
  }

  @Get('export/borrow-records')
  async exportBorrowRecords(
    @Res() res: Response,
    @Query('status') status?: string,
  ) {
    const buffer =
      await this.importExportService.exportBorrowRecords(status);
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename=borrow-records.xlsx',
    });
    res.send(buffer);
  }
}
