import { IsInt, IsOptional, IsDateString } from 'class-validator';

export class BorrowBookDto {
  @IsInt()
  bookId: number;

  @IsInt()
  @IsOptional()
  userId?: number;

  @IsDateString()
  @IsOptional()
  dueDate?: string;
}
