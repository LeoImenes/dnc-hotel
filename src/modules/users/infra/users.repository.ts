import { User } from '@prisma/client';
import { CreateUserDto } from '../domain/dto/createUser.dto';
import { UpdateUserDTO } from '../domain/dto/updateUser.dto';
import { IUserRepository } from '../domain/repositories/Iuser.repository';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { join, resolve } from 'path';
import { stat, unlink } from 'fs/promises';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}
  async getUsers(offset: number, limit: number): Promise<User[]> {
    return await this.prisma.user.findMany({
      skip: offset,
      take: limit,
    });
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(body: CreateUserDto): Promise<User> {
    return await this.prisma.user.create({
      data: body,
    });
  }

  async updateUser(id: string, body: UpdateUserDTO): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: body,
    });
  }

  async deleteUser(id: string): Promise<User> {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async uploadAvatar(id: string, filename: string): Promise<User> {
    const user = await this.getUserById(id);

    const directory = resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'uploads',
      'avatars',
    );

    if (user?.avatar) {
      const userAvatarPath = join(directory, user.avatar);
      const userAvatarFileExists = await stat(userAvatarPath);

      if (userAvatarFileExists) {
        // Delete the old avatar file
        await unlink(userAvatarPath);
      }
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { avatar: filename },
    });
    return updatedUser;
  }
}
