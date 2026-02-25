import { Inject, Injectable } from '@nestjs/common';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { HotelsRepositoriesToken } from '../utils/repositoriesTokens';
import type { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { REDIS_HOTELS_KEY } from 'src/modules/reservations/utils/rediskey';

@Injectable()
export class FindAllHotelsService {
  constructor(
    @Inject(HotelsRepositoriesToken)
    private readonly hotelsRepository: IHotelRepository,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async findAll(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const cacheKey = REDIS_HOTELS_KEY(page, limit);
    const cached = await this.redis.get(cacheKey);

    let data = cached ? JSON.parse(cached) : null;

    if (!data) {
      data = await this.hotelsRepository.findAll(offset, limit);
      await this.redis.set(cacheKey, JSON.stringify(data), 'EX', 60);
    }

    return { page, per_page: limit, data };
  }
}
