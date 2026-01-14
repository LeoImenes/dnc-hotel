import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class AuthForgotPasswordDTO {
    @IsEmail()
    @IsString()
    @IsNotEmpty()
    email: string;
}