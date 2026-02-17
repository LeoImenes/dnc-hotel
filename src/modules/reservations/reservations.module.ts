import { Module, Res } from '@nestjs/common';
import { CreateReservationsService } from './services/createReservations.service';
import { ReservationsController } from './infra/reservations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { HotelsModule } from '../hotels/hotels.module';
import { ReservationsRepository } from './infra/reservations.repository';
import { ReservationRepositoriesToken } from './utils/repositoriesTokens';
import { FindAllReservationsService } from './services/findAllReservations.service';
import { FindByIdReservationsService } from './services/findByIdReservations.service';
import { FindByUserReservationsService } from './services/findByUserReservations.service';
import { UpdateReservationsService } from './services/updateReservations.service';
import { DeleteReservationsService } from './services/deleteReservations.service';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, HotelsModule],
  controllers: [ReservationsController],
  providers: [
    CreateReservationsService,
    FindAllReservationsService,
    FindByIdReservationsService,
    FindByUserReservationsService,
    UpdateReservationsService,
    DeleteReservationsService,
    { provide: ReservationRepositoriesToken, useClass: ReservationsRepository },
  ],
})
export class ReservationsModule {}
