import { IsString, IsEmail, MinLength, IsNumber } from 'class-validator';

export class CreateUserDto {
    
  readonly user_id?: number;

  @IsString()
  readonly user_login: string;

  @IsString()
  user_pass: string;
}

