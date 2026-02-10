import { BadGatewayException, Inject, Injectable } from '@nestjs/common';
import { ReservationRepositoriesToken } from '../utils/repositoriesTokens';
import type { IReservationsRepository } from '../domain/repositories/Ireservations.repository';

@Injectable()
export class FindAllReservationsService {
  constructor(
    @Inject(ReservationRepositoriesToken)
    private readonly reservationsRepository: IReservationsRepository,
  ) {}

  async execute() {
    return await this.reservationsRepository.findAll();
  }
}
