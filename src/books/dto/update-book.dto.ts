import { IsOptional, IsString, IsDateString, IsISBN } from 'class-validator';

export class UpdateBookDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsISBN()
  @IsString()
  isbn?: string;

  @IsOptional()
  @IsDateString()
  publishedDate?: Date;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsOptional()
  authorId?: string;
}