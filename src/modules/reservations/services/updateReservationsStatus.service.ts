import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { IReservationsRepository } from '../domain/repositories/Ireservations.repository';
import { ReservationRepositoriesToken } from '../utils/repositoriesTokens';
import { UpdateReservationDto } from '../domain/dto/update-reservation.dto';
import { differenceInDays, parseISO } from 'date-fns';
import { validateCheckinDates } from '../utils/validateCheckinDates';
import { HotelsRepositoriesToken } from 'src/modules/hotels/utils/repositoriesTokens';
import type { IHotelRepository } from 'src/modules/hotels/domain/repositories/IHotel.repositories';
import { Status } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';
import { GetUserByIdService } from 'src/modules/users/services/getUsersById.service';

@Injectable()
export class UpdateReservationsStatusService {
  constructor(
    @Inject(ReservationRepositoriesToken)
    private readonly reservationsRepository: IReservationsRepository,
    private readonly mailerService: MailerService,
    private readonly getUserByIdService: GetUserByIdService,
  ) {}
  async execute(reservationId: string, status: Status) {
    const reservation =
      await this.reservationsRepository.updateReservationStatus(
        reservationId,
        status,
      );
    const lastReservation =
      await this.reservationsRepository.findById(reservationId);

    const user = await this.getUserByIdService.execute(reservation.userId);

    if (!lastReservation) {
      throw new BadRequestException('Reservation not Found');
    }

    if (user?.email) {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Reservation Status Updated',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
        
        <h2 style="color: #2c3e50;">Reservation Status Update</h2>

        <p>Hello ${user.name},</p>

        <p>
          Your reservation status has been updated.
        </p>

        <p>
          <strong>Current Status:</strong> ${reservation.status}
        </p>

        <p style="margin-top: 30px; font-size: 12px; color: #7f8c8d;">
          This is an automated message. Please do not reply.
        </p>

      </div>
    `,
      });
    }
    return reservation;
  }
}
