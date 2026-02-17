import { Inject, Injectable } from '@nestjs/common';
import type { IReservationsRepository } from '../domain/repositories/Ireservations.repository';
import { ReservationRepositoriesToken } from '../utils/repositoriesTokens';

@Injectable()
export class DeleteReservationsService {
  constructor(
    @Inject(ReservationRepositoriesToken)
    private readonly reservationsRepository: IReservationsRepository,
  ) {}
  async execute(id: string) {
    return await this.reservationsRepository.deleteReservation(id);
  }
}
