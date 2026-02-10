import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { UpdateReservationDto } from '../domain/dto/update-reservation.dto';
import { CreateReservationsService } from '../services/createReservations.service';
import { User } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { FindAllReservationsService } from '../services/findAllReservations.service';
import { FindByIdReservationsService } from '../services/findByIdReservations.service';
import { ParamId } from 'src/shared/decorators/paramid.decorator';
import { FindByUserReservationsService } from '../services/findByUserReservations.service';

@UseGuards(AuthGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: CreateReservationsService,
    private readonly findAllReservationsService: FindAllReservationsService,
    private readonly findByIdReservationsService: FindByIdReservationsService,
    private readonly findByUserReservationsService: FindByUserReservationsService,
  ) {}


  @Get('user')
  findByUserId(@User('id') userId: string) {
    return this.findByUserReservationsService.execute(userId);
  }

  @Get(':id')
  findById(@ParamId() reservationId: string) {
    return this.findByIdReservationsService.execute(reservationId);
  }


  @Post()
  create(@User('id') id: string, @Body() body: CreateReservationDto) {
    console.log('Received reservation creation request with body:', body, 'and user ID:', id);
    return this.reservationsService.create({ ...body, userId: id });
  }

  @Get()
  findAll() {
    return this.findAllReservationsService.execute();
  }
}
