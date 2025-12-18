import { IsString, IsEmail, MinLength, IsNumber, IsDate } from 'class-validator';

export class CreateArticleDto {
    
  readonly article_id?: number;

  readonly article_user_id: number

  @IsString()
  readonly article_title: string

  @IsString()
  readonly article_desc: string

  @IsDate()
  readonly date: Date
}