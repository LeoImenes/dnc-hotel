import { Reservation } from "@prisma/client";
import { CreateReservationDto } from "../dto/create-reservation.dto";

export class IReservationsRepository {
    create(createReservationDto: CreateReservationDto): Promise<Reservation> {
        throw new Error('Method not implemented.');
    }
}