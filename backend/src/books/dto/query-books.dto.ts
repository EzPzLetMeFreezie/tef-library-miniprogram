import { IsOptional, IsString, IsInt, IsEnum, Min } from 'class-validator';

enum BookStatus {
  AVAILABLE = 'AVAILABLE',
  DISABLED = 'DISABLED',
}

export class QueryBooksDto {
  @IsString()
  @IsOptional()
  keyword?: string;

  @IsInt()
  @IsOptional()
  categoryId?: number;

  @IsEnum(BookStatus)
  @IsOptional()
  status?: BookStatus;

  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize?: number = 10;

  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';
}
