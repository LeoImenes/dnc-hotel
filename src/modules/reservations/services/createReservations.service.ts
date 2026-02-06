import { Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { UpdateReservationDto } from '../domain/dto/update-reservation.dto';
import { IReservationsRepository } from '../domain/repositories/Ireservations.repository';

@Injectable()
export class CreateReservationsService {
  constructor(
    @Inject('ReservationRepositoriesToken')
    private readonly reservationsRepository: IReservationsRepository,
  ) {}
  create(createReservationDto: CreateReservationDto) {
    return this.reservationsRepository.create(createReservationDto);
  }

}
