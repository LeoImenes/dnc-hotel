import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDTO } from './domain/dto/updateUser.dto';
import { CreateUserDto } from './domain/dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { userSelectFields } from '../prisma/utils/userSelectFields';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserbyId(id: string) {
    const user = this.isIdExistis(id);

    return user;
  }

  async createUser(body: CreateUserDto): Promise<User> {
    body.password = await this.hashPassword(body.password);

    return await this.prisma.user.create({
      data: body,
      select: userSelectFields,
    });
  }

  async getUsers() {
    return await this.prisma.user.findMany({
      select: userSelectFields,
    });
  }

  async updateUser(id: string, body: UpdateUserDTO) {
    await this.isIdExistis(id);

    if (body.password) {
      body.password = await this.hashPassword(body.password);
    }

    return await this.prisma.user.update({ where: { id }, data: body, select: userSelectFields });
  }

  async deleteUser(id: string) {
    await this.isIdExistis(id);

    return await this.prisma.user.delete({ where: { id }, select: userSelectFields });
  }

  async isIdExistis(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id }, select: userSelectFields });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
