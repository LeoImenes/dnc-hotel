import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ReservationRepositoriesToken } from '../utils/repositoriesTokens';
import type { IReservationsRepository } from '../domain/repositories/Ireservations.repository';

@Injectable()
export class FindAllReservationsService {
  constructor(
    @Inject(ReservationRepositoriesToken)
    private readonly reservationsRepository: IReservationsRepository,
  ) {}

  async execute(page: number = 1, limit: number = 10) {
    const offset = (page - 1) * limit;
    const data = await this.reservationsRepository.findAll(offset, limit);
    return { page, per_page: limit, data };
  }
}
