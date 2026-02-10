import { Inject, Injectable } from '@nestjs/common';
import type { IReservationsRepository } from '../domain/repositories/Ireservations.repository';
import { ReservationRepositoriesToken } from '../utils/repositoriesTokens';

@Injectable()
export class FindByUserReservationsService {
  constructor(
    @Inject(ReservationRepositoriesToken)
    private readonly reservationsRepository: IReservationsRepository,
  ) {}
  async execute(userId: string) {
    return await this.reservationsRepository.findByUserId(userId);
  }
}
