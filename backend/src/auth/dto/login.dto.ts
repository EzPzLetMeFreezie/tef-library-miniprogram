import { IsString, IsOptional } from 'class-validator';

export class LoginDto {
  @IsString()
  code: string;

  @IsString()
  @IsOptional()
  nickname?: string;

  @IsString()
  @IsOptional()
  avatarUrl?: string;
}
