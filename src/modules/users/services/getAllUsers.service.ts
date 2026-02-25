import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../domain/repositories/Iuser.repository';
import { USER_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';

@Injectable()
export class GetAllUsersService {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly usersRepository: IUserRepository,
  ) {}

  async execute(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    console.log('GetAllUsersService called with page:', page, 'limit:', limit, 'offset:', offset);
    return await this.usersRepository.getUsers(offset, limit);
  }
}
