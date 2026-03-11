import { IsInt } from 'class-validator';

export class ReturnBookDto {
  @IsInt()
  recordId: number;
}
