import { Inject, Injectable } from '@nestjs/common';

import type { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { HotelsRepositoriesToken } from '../utils/repositoriesTokens';

@Injectable()
export class FindByNameHotelsService {
  constructor(
    @Inject(HotelsRepositoriesToken)
    private readonly hotelsRepository: IHotelRepository,
  ) {}
  async findByName(name: string) {
    return await this.hotelsRepository.findByName(name);
  }
}
