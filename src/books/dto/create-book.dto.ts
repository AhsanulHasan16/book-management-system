import { IsString, IsNotEmpty, IsOptional, IsDateString, IsISBN } from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsISBN()
  @IsNotEmpty()
  isbn!: string;

  @IsOptional()
  @IsDateString()
  publishedDate?: Date;

  @IsOptional()
  @IsString()
  genre?: string;

  @IsString()
  @IsNotEmpty()
  authorId!: string;
}