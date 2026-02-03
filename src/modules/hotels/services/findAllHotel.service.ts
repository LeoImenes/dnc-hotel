import { Inject, Injectable } from '@nestjs/common';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { HotelsRepositoriesToken } from '../utils/repositoriesTokens';
import type { IHotelRepository } from '../domain/repositories/IHotel.repositories';

@Injectable()
export class FindAllHotelsService {
  constructor(
    @Inject(HotelsRepositoriesToken)
    private readonly hotelsRepository: IHotelRepository,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;

    const data = await this.hotelsRepository.findAll(offset, limit);

    return { page, per_page: limit, data };
  }
}
