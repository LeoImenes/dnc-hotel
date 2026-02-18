import { Injectable } from '@nestjs/common';
import { IReservationsRepository } from '../domain/repositories/Ireservations.repository';
import { Reservation, Status } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { AllReservationsDTO } from '../domain/dto/allReservationsDTO';

@Injectable()
export class ReservationsRepository implements IReservationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(offset: number, limit: number): Promise<AllReservationsDTO> {
    const reservations = await this.prisma.reservation.findMany({
      take: Number(limit),
      skip: offset,
    });

    const total =  await this.prisma.reservation.count();

    return { reservations, total };
  }

  findByUserId(userId: string): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({
      where: { userId },
    });
  }
  findById(id: string): Promise<Reservation | null> {
    return this.prisma.reservation.findUnique({
      where: { id },
    });
  }

  findByHotelId(hotelId: string): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({
      where: { hotelId },
    });
  }

  create(data: any): Promise<Reservation> {
    return this.prisma.reservation.create({
      data,
    });
  }

  updateReservation(id: string, body: any): Promise<Reservation> {
    return this.prisma.reservation.update({ data: body, where: { id } });
  }

  deleteReservation(id: string): Promise<Reservation> {
    return this.prisma.reservation.delete({ where: { id } });
  }

  updateReservationStatus(id: string, status: Status): Promise<Reservation> {
    console.log(id, status);
    return this.prisma.reservation.update({
      data: { status },
      where: { id },
    });
  }
  // Repository methods would go here
}
