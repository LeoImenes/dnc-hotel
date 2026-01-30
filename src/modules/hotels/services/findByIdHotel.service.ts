import { Inject, Injectable } from '@nestjs/common';

import type { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { HotelsRepositoriesToken } from '../utils/repositoriesTokens';

@Injectable()
export class FindByIdHotelsService {
  constructor(
    @Inject(HotelsRepositoriesToken)
    private readonly hotelsRepository: IHotelRepository,
  ) {}
 async findOne(id: string) {
    return await this.hotelsRepository.findById(id);
  }
}
