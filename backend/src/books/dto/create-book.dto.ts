import {
  IsString,
  IsOptional,
  IsInt,
  IsEnum,
  Min,
} from 'class-validator';

enum BookStatus {
  AVAILABLE = 'AVAILABLE',
  DISABLED = 'DISABLED',
}

export class CreateBookDto {
  @IsString()
  title: string;

  @IsString()
  author: string;

  @IsString()
  @IsOptional()
  publisher?: string;

  @IsString()
  @IsOptional()
  isbn?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  coverUrl?: string;

  @IsInt()
  @Min(0)
  @IsOptional()
  totalCount?: number;

  @IsInt()
  @Min(0)
  @IsOptional()
  availableCount?: number;

  @IsString()
  @IsOptional()
  location?: string;

  @IsEnum(BookStatus)
  @IsOptional()
  status?: BookStatus;

  @IsInt()
  @IsOptional()
  categoryId?: number;
}
