import { Inject, Injectable } from '@nestjs/common';
import type { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { HotelsRepositoriesToken } from '../utils/repositoriesTokens';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import {
  REDIS_HOTELS_KEY,
  REDIS_REMOVE_HOTELS_KEY,
} from 'src/modules/reservations/utils/rediskey';

@Injectable()
export class UpdateHotelsService {
  constructor(
    @Inject(HotelsRepositoriesToken)
    private readonly hotelsRepository: IHotelRepository,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async update(id: string, updateHotelDto: UpdateHotelDto) {
    const keys = await this.redis.del(REDIS_REMOVE_HOTELS_KEY);
    return await this.hotelsRepository.update(id, updateHotelDto);
  }
}
