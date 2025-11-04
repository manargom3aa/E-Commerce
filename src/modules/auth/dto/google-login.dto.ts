import { IsNotEmpty, IsString } from 'class-validator';

export class GoogleLoginDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}

export class GoogleIdTokenDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}