import { IsBoolean, IsNotEmpty } from 'class-validator';

export interface JWTPayload {
  sub: string;
  name: string;
  expiresIn: number;
  iat: number;
  audience: string;
  issuer: string;
}

export class ValidateTokenDTO {
  @IsBoolean()
  @IsNotEmpty()
  valid: boolean;

  decoded: JWTPayload;
}
