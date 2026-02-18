import { Reservation, Status } from '@prisma/client';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { UpdateReservationDto } from '../dto/update-reservation.dto';
import { AllReservationsDTO } from '../dto/allReservationsDTO';

export interface IReservationsRepository {
  create(createReservationDto: CreateReservationDto): Promise<Reservation>;
  findById(id: string): Promise<Reservation | null>;
  findAll(limit: number, offset: number): Promise<AllReservationsDTO>;
  findByUserId(userId: string): Promise<Reservation[]>;
  findByHotelId(hotelId: string): Promise<Reservation[]>;
  updateReservation(
    id: string,
    body: UpdateReservationDto,
  ): Promise<Reservation>;
  deleteReservation(id: string): Promise<Reservation>;
  updateReservationStatus(id: string, status: Status): Promise<Reservation>;
}
