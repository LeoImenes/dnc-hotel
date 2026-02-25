import { User } from '@prisma/client';
import { CreateUserDto } from '../domain/dto/createUser.dto';
import { UpdateUserDTO } from '../domain/dto/updateUser.dto';
import { IUserRepository } from '../domain/repositories/Iuser.repository';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { join, resolve } from 'path';
import { stat, unlink } from 'fs/promises';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { userSelectFields } from 'src/modules/prisma/utils/userSelectFields';
import * as bcrypt from 'bcrypt';

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
    const user = await this.getUserByEmail(body.email);
    if (user) {
      throw new HttpException('Email already in use', HttpStatus.BAD_REQUEST);
    }
    body.password = await this.hashPassword(body.password);

    return await this.prisma.user.create({
      data: body,
      select: userSelectFields,
    });
  }


  async updateUser(id: string, body: UpdateUserDTO) {
    await this.getUserById(id);

    if (body.password) {
      body.password = await this.hashPassword(body.password);
    }

    return await this.prisma.user.update({
      where: { id },
      data: body,
      select: userSelectFields,
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

  
    private async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
}
