import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserbyId(id: string) {
    const user = this.isIdExistis(id);

    return user;
  }

  async createUser(body: any): Promise<User> {
    return await this.prisma.user.create({ data: body });
  }

  async getUsers() {
    return await this.prisma.user.findMany();
  }

  async updateUser(id: string, body: any) {
    await this.isIdExistis(id);

    return await this.prisma.user.update({ where: { id }, data: body });
  }

  async deleteUser(id: string) {
    await this.isIdExistis(id);

    return await this.prisma.user.delete({ where: { id } });
  }

  async isIdExistis(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
