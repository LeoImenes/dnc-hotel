import { Injectable } from '@nestjs/common';
import { IReservationsRepository } from '../domain/repositories/Ireservations.repository';
import { Reservation } from '@prisma/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';

@Injectable()
export class ReservationsRepository implements IReservationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany();
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
  // Repository methods would go here
}
