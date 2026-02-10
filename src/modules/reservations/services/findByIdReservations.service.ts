import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ReservationRepositoriesToken } from '../utils/repositoriesTokens';
import type { IReservationsRepository } from '../domain/repositories/Ireservations.repository';

@Injectable()
export class FindByIdReservationsService {
  constructor(
    @Inject(ReservationRepositoriesToken)
    private readonly reservationsRepository: IReservationsRepository,
  ) {}

  async execute(id: string) {
    const reservation = await this.reservationsRepository.findById(id);

    if (!reservation) {
      throw new BadGatewayException('Reservation not found');
    }
    return reservation;
  }
}
