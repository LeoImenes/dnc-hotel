import { Injectable } from '@nestjs/common';
import { IReservationsRepository } from '../domain/repositories/Ireservations.repository';
import { Reservation } from '@prisma/client';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
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
  // Repository methods would go here
}
