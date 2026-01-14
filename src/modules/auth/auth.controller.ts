import { Body, Controller, HttpStatus, Patch, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthLoginDTO } from './domain/dto/authLogin.dto';
import { AuthResetDTO } from './domain/dto/authResetPassword.dto';
import { AuthForgotPasswordDTO } from './domain/dto/authForgotPassword.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() body: AuthLoginDTO) {
    return this.authService.login({
      email: body.email,
      password: body.password,
    });
  }

  @Post('register')
  register(@Body() body: AuthLoginDTO) {
    return this.authService.register(body);
  }

  @Patch('reset-password')
  resetPassword(@Body() body: AuthResetDTO) {
    return this.authService.resetPassword(body);
  }

  @Post('forgot-password')
  forgotPassword(@Body() body: AuthForgotPasswordDTO) {
    return this.authService.forgotPassword(body.email);
  }
}
