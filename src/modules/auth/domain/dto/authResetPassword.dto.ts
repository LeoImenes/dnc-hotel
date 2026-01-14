import { IsNotEmpty, IsString } from 'class-validator';

export class AuthResetDTO {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
