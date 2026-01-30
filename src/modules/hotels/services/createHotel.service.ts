import { Inject, Injectable } from '@nestjs/common';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import type { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import  { HotelsRepositoriesToken } from '../utils/repositoriesTokens';

@Injectable()
export class CreateHotelsService {
  constructor(
    @Inject(HotelsRepositoriesToken)
    private readonly hotelsRepository: IHotelRepository
  ) 
    {

    }
  async create(createHotelDto: CreateHotelDto, ownerId: string) {
    return await this.hotelsRepository.create(createHotelDto, ownerId);
  }
}
