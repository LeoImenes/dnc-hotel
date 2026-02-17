import { Controller, Post, Body, UseGuards, Get, Patch } from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { UpdateReservationDto } from '../domain/dto/update-reservation.dto';
import { CreateReservationsService } from '../services/createReservations.service';
import { User } from 'src/shared/decorators/user.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { FindAllReservationsService } from '../services/findAllReservations.service';
import { FindByIdReservationsService } from '../services/findByIdReservations.service';
import { ParamId } from 'src/shared/decorators/paramid.decorator';
import { FindByUserReservationsService } from '../services/findByUserReservations.service';
import { UpdateReservationsService } from '../services/updateReservations.service';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RoleGuard } from 'src/shared/guards/role.guard';

@UseGuards(AuthGuard,RoleGuard)
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: CreateReservationsService,
    private readonly findAllReservationsService: FindAllReservationsService,
    private readonly findByIdReservationsService: FindByIdReservationsService,
    private readonly findByUserReservationsService: FindByUserReservationsService,
    private readonly updateReservationService: UpdateReservationsService,
  ) {}

  @Get('user')
  findByUserId(@User('id') userId: string) {
    console.log('OI');

    return this.findByUserReservationsService.execute(userId);
  }

  @Get(':id')
  findById(@ParamId() reservationId: string) {
    console.log('OI');
    return this.findByIdReservationsService.execute(reservationId);
  }

  @Roles('USER')
  @Post()
  create(@User('id') id: string, @Body() body: CreateReservationDto) {
    console.log(
      'Received reservation creation request with body:',
      body,
      'and user ID:',
      id,
    );
    return this.reservationsService.create({ ...body, userId: id });
  }

  @Roles('ADMIN')
  @Patch(':id')
  patch(@ParamId() reservationId: string, @Body() body: UpdateReservationDto) {
    console.log(reservationId, body, 'UPDATE');
    return this.updateReservationService.execute(reservationId, body);
  }

  @Get()
  findAll() {
    return this.findAllReservationsService.execute();
  }
}
