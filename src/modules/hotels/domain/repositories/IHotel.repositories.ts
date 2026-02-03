import { Hotel } from "@prisma/client";
import { CreateHotelDto } from "../dto/create-hotel.dto";
import { UpdateHotelDto } from "../dto/update-hotel.dto";
import { AllHotelsDto } from "../dto/allHotels.dto";

export interface IHotelRepository {
  create(hotelData: CreateHotelDto, ownerId: string): Promise<Hotel>;
  findById(hotelId: string): Promise<Hotel | null>;
  findByName(hotelName: string): Promise<Hotel | null>;
  findByOwnerId(ownerId: string): Promise<Hotel | null>;
  update(hotelId: string, updateData: UpdateHotelDto): Promise<Hotel>;
  delete(hotelId: string): Promise<Hotel>;
  findAll(offset: number, limit?: number): Promise<AllHotelsDto>;
}