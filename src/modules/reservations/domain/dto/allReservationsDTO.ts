import { Reservation } from "@prisma/client";

export class AllReservationsDTO {
    reservations : Reservation[]
    total: number
}