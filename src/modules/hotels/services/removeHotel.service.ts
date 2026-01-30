import { Inject, Injectable } from '@nestjs/common';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import type { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { HotelsRepositoriesToken } from '../utils/repositoriesTokens';

@Injectable()
export class RemoveHotelsService {
    constructor(
      @Inject(HotelsRepositoriesToken)
      private readonly hotelsRepository: IHotelRepository,
    ) {}
  async remove(id: string) {
    return await this.hotelsRepository.delete(id);
  }
}
