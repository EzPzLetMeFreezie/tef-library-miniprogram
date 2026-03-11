import { Module } from '@nestjs/common';
import { BorrowRecordsService } from './borrow-records.service';
import { BorrowRecordsController } from './borrow-records.controller';

@Module({
  controllers: [BorrowRecordsController],
  providers: [BorrowRecordsService],
  exports: [BorrowRecordsService],
})
export class BorrowRecordsModule {}
