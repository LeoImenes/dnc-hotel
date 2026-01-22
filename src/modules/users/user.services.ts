import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { UpdateUserDTO } from './domain/dto/updateUser.dto';
import { CreateUserDto } from './domain/dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { userSelectFields } from '../prisma/utils/userSelectFields';
import { join, resolve } from 'path';
import { stat, unlink } from 'fs/promises';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserbyId(id: string) {
    const user = this.isIdExistis(id);

    return user;
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

    return await this.prisma.user.update({
      where: { id },
      data: body,
      select: userSelectFields,
    });
  }

  async deleteUser(id: string) {
    await this.isIdExistis(id);

    return await this.prisma.user.delete({
      where: { id },
      select: userSelectFields,
    });
  }

  async isIdExistis(id: string): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: userSelectFields,
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async uploadAvatar(id: string, filename: string) {
    const user = await this.getUserbyId(id);

    const directory = resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      'uploads',
      'avatars',
    );

    if (user.avatar) {
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
