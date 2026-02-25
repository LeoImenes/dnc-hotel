import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../domain/repositories/Iuser.repository';
import { CreateUserDto } from '../domain/dto/createUser.dto';
import { USER_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';

@Injectable()
export class CreateUserService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly usersRepository: IUserRepository,
  ) {}

  async execute(body: CreateUserDto) {
    return await this.usersRepository.createUser(body);
  }
}
