import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { IReservationsRepository } from '../domain/repositories/Ireservations.repository';
import { ReservationRepositoriesToken } from '../utils/repositoriesTokens';
import { UpdateReservationDto } from '../domain/dto/update-reservation.dto';
import { differenceInDays, parseISO } from 'date-fns';
import { validateCheckinDates } from '../utils/validateCheckinDates';
import { HotelsRepositoriesToken } from 'src/modules/hotels/utils/repositoriesTokens';
import type { IHotelRepository } from 'src/modules/hotels/domain/repositories/IHotel.repositories';

@Injectable()
export class UpdateReservationsService {
  constructor(
    @Inject(ReservationRepositoriesToken)
    private readonly reservationsRepository: IReservationsRepository,
    @Inject(HotelsRepositoriesToken)
    private readonly hotelsRepository: IHotelRepository,
  ) {}
  async execute(reservationId: string, data: UpdateReservationDto) {
    const hotel = await this.hotelsRepository.findById(String(data.hotelId));
    const lastReservation =
      await this.reservationsRepository.findById(reservationId);

    if (!lastReservation) {
      throw new BadRequestException('Reservation not Found');
    }

    const checkInDate = data.checkIn
      ? parseISO(String(data.checkIn))
      : new Date(lastReservation.checkIn);

    const checkOutDate = data.checkOut
      ? parseISO(String(data.checkOut))
      : new Date(lastReservation.checkOut);

    const daysOfStay = differenceInDays(checkOutDate, checkInDate);

    if (typeof hotel?.price === 'undefined' || !hotel.price) {
      throw new BadRequestException('Hotel does not have a valid price.');
    }

    validateCheckinDates({ checkInDate, checkOutDate });

    const totalPrice = Number(hotel.price) * daysOfStay;

    const reservationData = {
      ...data,
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      total: totalPrice,
    };

    return await this.reservationsRepository.updateReservation(
      reservationId,
      reservationData,
    );
  }
}
