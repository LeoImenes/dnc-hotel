import { Reservation } from "@prisma/client";
import { CreateReservationDto } from "../dto/create-reservation.dto";

export interface IReservationsRepository {
    create(createReservationDto: CreateReservationDto): Promise<Reservation>;
    findById(id: string): Promise<Reservation | null>;
    findAll(): Promise<Reservation[]>;
    findByUserId(userId: string): Promise<Reservation[]>;
    findByHotelId(hotelId: string): Promise<Reservation[]>;

}