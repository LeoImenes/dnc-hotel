import { Reservation } from '@prisma/client';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UpdateReservationDto } from '../dto/update-reservation.dto';

export interface IReservationsRepository {
  create(createReservationDto: CreateReservationDto): Promise<Reservation>;
  findById(id: string): Promise<Reservation | null>;
  findAll(): Promise<Reservation[]>;
  findByUserId(userId: string): Promise<Reservation[]>;
  findByHotelId(hotelId: string): Promise<Reservation[]>;
  updateReservation(
    id: string,
    body: UpdateReservationDto,
  ): Promise<Reservation>;
  deleteReservation(id: string): Promise<Reservation>;
}
