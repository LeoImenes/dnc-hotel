import { Inject, Injectable } from '@nestjs/common';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import type { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { HotelsRepositoriesToken } from '../utils/repositoriesTokens';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { REDIS_HOTELS_KEY, REDIS_REMOVE_HOTELS_KEY } from 'src/modules/reservations/utils/rediskey';

@Injectable()
export class CreateHotelsService {
  constructor(
    @Inject(HotelsRepositoriesToken)
    private readonly hotelsRepository: IHotelRepository,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}
  async create(createHotelDto: CreateHotelDto, ownerId: string) {
    const keys = await this.redis.del(REDIS_REMOVE_HOTELS_KEY);
    return await this.hotelsRepository.create(createHotelDto, ownerId);
  }
}
