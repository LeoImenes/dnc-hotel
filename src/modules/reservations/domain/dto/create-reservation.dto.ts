import { Status } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  @IsNotEmpty()
  hotelId: string;

  @IsString()
  @IsOptional()
  userId:string;
  
  @IsString()
  @IsNotEmpty()
  checkIn: string;

  @IsString()
  @IsNotEmpty()
  checkOut: string;

  @IsEnum(Status)
  @IsOptional()
  @Transform(({ value }) => value ?? 'PENDING')
  status?: string;
}
