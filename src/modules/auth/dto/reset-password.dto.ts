import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'token must be a string' })
  @IsNotEmpty({ message: 'token should not be empty' })
  token: string;

  @IsString({ message: 'newPassword must be a string' })
  @IsNotEmpty({ message: 'newPassword should not be empty' })
  @MinLength(6, { message: 'newPassword must be at least 6 characters' })
  newPassword: string;
}