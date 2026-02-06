import { Injectable } from "@nestjs/common";
import { IReservationsRepository } from "../domain/repositories/Ireservations.repository";
import { Reservation } from "@prisma/client";
import { CreateReservationDto } from "../domain/dto/create-reservation.dto";

@Injectable()
export class ReservationsRepository implements IReservationsRepository {
    create(createReservationDto: CreateReservationDto): Promise<Reservation> {
        throw new Error("Method not implemented.");
    }
  // Repository methods would go here
}