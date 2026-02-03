import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { UpdateReservationDto } from '../domain/dto/update-reservation.dto';
import { CreateReservationsService } from '../services/createReservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: CreateReservationsService) {}

  @Post()
  create(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.create(createReservationDto);
  }

}
