import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { UpdateReservationDto } from '../domain/dto/update-reservation.dto';
import type { IReservationsRepository } from '../domain/repositories/Ireservations.repository';
import { ReservationRepositoriesToken } from '../utils/repositoriesTokens';
import { HotelsRepositoriesToken } from 'src/modules/hotels/utils/repositoriesTokens';
import type { IHotelRepository } from 'src/modules/hotels/domain/repositories/IHotel.repositories';
import { differenceInDays, parseISO } from 'date-fns';
import { Reservation } from '@prisma/client';
import { validateCheckinDates } from '../utils/validateCheckinDates';

@Injectable()
export class CreateReservationsService {
  constructor(
    @Inject(ReservationRepositoriesToken)
    private readonly reservationsRepository: IReservationsRepository,
    @Inject(HotelsRepositoriesToken)
    private readonly hotelsRepository: IHotelRepository,
  ) {}

  async create(data: CreateReservationDto) {
    console.log('Creating reservation with data:', data);
    const checkInDate = parseISO(data.checkIn);
    const checkOutDate = parseISO(data.checkOut);
    const daysOfStay = differenceInDays(checkOutDate, checkInDate);

    validateCheckinDates({checkInDate, checkOutDate});

    const hotel = await this.hotelsRepository.findById(data.hotelId);

    if (typeof hotel?.price === 'undefined' || !hotel.price) {
      throw new BadRequestException('Hotel does not have a valid price.');
    }

    const totalPrice = Number(hotel.price) * daysOfStay;

    const reservationData = {
      ...data,
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      total: totalPrice,
    };

    return this.reservationsRepository.create(reservationData);
  }
}
