import { Hotel } from '@prisma/client';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AllHotelsDto } from '../domain/dto/allHotels.dto';

@Injectable()
export class HotelsRepositories implements IHotelRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(hotelData: CreateHotelDto, ownerId: string): Promise<Hotel> {
    return this.prisma.hotel.create({
      data: { ...hotelData, ownerId },
    });
  }
  findById(hotelId: string): Promise<Hotel | null> {
    return this.prisma.hotel.findUnique({
      where: {
        id: hotelId,
      },
    });
  }

  findByName(hotelName: string): Promise<Hotel | null> {
    return this.prisma.hotel.findFirst({
      where: {
        name: { contains: hotelName, mode: 'insensitive' },
      },
    });
  }

  findByOwnerId(ownerId: string): Promise<Hotel | null> {
    return this.prisma.hotel.findFirst({
      where: {
        ownerId: ownerId,
      },
    });
  }

  update(hotelId: string, updateData: CreateHotelDto): Promise<Hotel> {
    return this.prisma.hotel.update({
      where: { id: hotelId },
      data: updateData,
    });
  }

  delete(hotelId: string): Promise<Hotel> {
    return this.prisma.hotel.delete({ where: { id: hotelId } });
  }

  async findAll(offset: number, limit: number): Promise<AllHotelsDto> {
    const hotels =  await this.prisma.hotel.findMany({
      take: limit,
      skip: offset,
      include: { owner: true },
    });

    const total = await this.prisma.hotel.count();

    return {hotels, total};
  }
}
