import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { AuthLoginDTO } from './domain/dto/authLogin.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  generateToken(user: User) {
    const payload = {
      sub: user.id.toString(),
      name: user.name,
    };

    const options: JwtSignOptions = {
      expiresIn: '1d',
      issuer: 'dnc-hotel',
      audience: 'users',
    };

    return {
      access_token: this.jwtService.sign(payload, options),
    };
  }

  async login({ email, password }: AuthLoginDTO) {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    return this.generateToken(user);
  }
}
