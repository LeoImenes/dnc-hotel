import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Role, User } from '@prisma/client';
import { AuthLoginDTO } from './domain/dto/authLogin.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { AuthRegisterDto } from './domain/dto/authRegister.dto';
import { CreateUserDto } from '../users/domain/dto/createUser.dto';
import { AuthResetDTO } from './domain/dto/authResetPassword.dto';
import { ValidateTokenDTO } from './domain/dto/validateTokem.dto';
import { StringValue } from 'ms';
import { MailerService } from '@nestjs-modules/mailer';
import { GetUserByEmailService } from '../users/services/getUsersByEmail.service';
import { CreateUserService } from '../users/services/createUser.service';
import { UpdateUserService } from '../users/services/updateUser.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly getUserByEmailService: GetUserByEmailService,
    private readonly createUserService: CreateUserService,
    private readonly updateUserService: UpdateUserService,
    private readonly mailerService: MailerService,
  ) {}

  generateJWTToken(user: User, expiresIn: StringValue = '1d') {
    const payload = {
      sub: user.id.toString(),
      name: user.name,
    };

    const options: JwtSignOptions = {
      expiresIn,
      issuer: 'dnc-hotel',
      audience: 'users',
    };

    return {
      access_token: this.jwtService.sign(payload, options),
    };
  }
  async login({ email, password }: AuthLoginDTO) {
    const user = await this.getUserByEmailService.execute(email);

    console.log(email, password);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return this.generateJWTToken(user);
  }

  async register(body: AuthRegisterDto) {
    const newUser: CreateUserDto = {
      name: String(body.name),
      email: String(body.email),
      password: String(body.password),
      role: body.role ?? Role.USER,
    };
    const user = await this.createUserService.execute(newUser);

    

    return await this.generateJWTToken(user);
  }

  async resetPassword({ token, password }: AuthResetDTO) {

    console.log('Resetting password with token:', token);
    const { valid, decoded } = await this.validateToken(token);

    if (!valid) throw new UnauthorizedException('Invalid or expired token');

    const user = await this.updateUserService.execute(decoded.sub, { password });

    return this.generateJWTToken(user);
  }

  async forgotPassword(email: string) {
    const user = await this.getUserByEmailService.execute(email);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const token = await this.generateJWTToken(user, '15m');

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset',
      html: `
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Click the link below to reset your password:</p>
    ${token.access_token}
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    return `Token enviado para o email ${user.email}`;
  }

  async validateToken(token: string): Promise<ValidateTokenDTO> {
    try {
      //console.log('Validating token:', token);
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
        audience: 'users',
        issuer: 'dnc-hotel',
      });
      return { valid: true, decoded };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token', err);
    }
  }
}
