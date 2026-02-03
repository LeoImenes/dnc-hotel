import { Module, Res } from '@nestjs/common';
import { CreateReservationsService } from './services/createReservations.service';
import { ReservationsController } from './infra/reservations.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { HotelsModule } from '../hotels/hotels.module';
import { ReservationsRepository } from './infra/reservations.repository';
import { ReservationRepositoriesToken } from './utils/repositoriesTokens';

@Module({
  imports: [PrismaModule, AuthModule, UserModule, HotelsModule],
  controllers: [ReservationsController],
  providers: [
    CreateReservationsService,
    { provide: ReservationRepositoriesToken, useClass: ReservationsRepository },
  ],
})
export class ReservationsModule {}
