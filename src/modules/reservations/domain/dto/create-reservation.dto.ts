import { Status } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsNotEmpty()
  checkInDate: string;

  @IsString()
  @IsNotEmpty()
  checkOutDate: string;

  @IsEnum(Status)
  @IsOptional()
  @Transform(({ value }) => value ?? 'PENDING')
  status?: string;
}
