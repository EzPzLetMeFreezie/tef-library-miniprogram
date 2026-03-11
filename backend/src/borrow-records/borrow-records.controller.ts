import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BorrowRecordsService } from './borrow-records.service';
import { BorrowBookDto } from './dto/borrow-book.dto';
import { ReturnBookDto } from './dto/return-book.dto';
import { QueryBorrowRecordsDto } from './dto/query-borrow-records.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('borrow-records')
@UseGuards(JwtAuthGuard)
export class BorrowRecordsController {
  constructor(private readonly borrowRecordsService: BorrowRecordsService) {}

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  async findAll(@Query() query: QueryBorrowRecordsDto) {
    return this.borrowRecordsService.findAll(query);
  }

  @Get('my')
  async findMy(
    @CurrentUser() user: any,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    @Query('status') status?: string,
  ) {
    return this.borrowRecordsService.findByUser(user.id, {
      page: Number(page),
      pageSize: Number(pageSize),
      status,
    });
  }

  @Post('borrow')
  async borrow(@CurrentUser() user: any, @Body() dto: BorrowBookDto) {
    return this.borrowRecordsService.borrowBook({
      ...dto,
      userId: dto.userId || user.id,
    });
  }

  @Post('return')
  async returnBook(@Body() dto: ReturnBookDto) {
    return this.borrowRecordsService.returnBook(dto.recordId);
  }
}
