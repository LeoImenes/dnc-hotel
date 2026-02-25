import { Inject, Injectable } from '@nestjs/common';
import type { IUserRepository } from '../domain/repositories/Iuser.repository';
import { USER_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';

@Injectable()
export class GetUserByIdService {
  constructor(
        @Inject(USER_REPOSITORY_TOKEN)
    private readonly usersRepository: IUserRepository) {}

  async execute(id: string) {
    return await this.usersRepository.getUserById(id);
  }
}
