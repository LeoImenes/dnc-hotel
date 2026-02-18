import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { UpdateReservationDto } from '../domain/dto/update-reservation.dto';
import type { IReservationsRepository } from '../domain/repositories/Ireservations.repository';
import { ReservationRepositoriesToken } from '../utils/repositoriesTokens';
import { HotelsRepositoriesToken } from 'src/modules/hotels/utils/repositoriesTokens';
import type { IHotelRepository } from 'src/modules/hotels/domain/repositories/IHotel.repositories';
import { differenceInDays, parseISO } from 'date-fns';
import { Reservation } from '@prisma/client';
import { validateCheckinDates } from '../utils/validateCheckinDates';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/modules/users/user.services';

@Injectable()
export class CreateReservationsService {
  constructor(
    @Inject(ReservationRepositoriesToken)
    private readonly reservationsRepository: IReservationsRepository,
    @Inject(HotelsRepositoriesToken)
    private readonly hotelsRepository: IHotelRepository,
    private readonly mailerService: MailerService,
    private readonly userService: UserService,
  ) {}

  async create(data: CreateReservationDto) {
    console.log('Creating reservation with data:', data);
    const checkInDate = parseISO(data.checkIn);
    const checkOutDate = parseISO(data.checkOut);
    const daysOfStay = differenceInDays(checkOutDate, checkInDate);

    validateCheckinDates({ checkInDate, checkOutDate });

    const hotel = await this.hotelsRepository.findById(data.hotelId);

    if (typeof hotel?.price === 'undefined' || !hotel.price) {
      throw new BadRequestException('Hotel does not have a valid price.');
    }

    const totalPrice = Number(hotel.price) * daysOfStay;

    const reservationData = {
      ...data,
      checkIn: checkInDate.toISOString(),
      checkOut: checkOutDate.toISOString(),
      total: totalPrice,
    };

    const hotelOwner = await this.userService.getUserbyId(hotel.ownerId);

    this.mailerService.sendMail({
      to: hotelOwner?.email,
      subject: 'Pending Reservation Approval',
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      
      <h2 style="color: #2c3e50;">New Reservation Pending Approval</h2>

      <p>Hello ${hotelOwner?.name || 'Hotel Owner'},</p>

      <p>
        You have received a new reservation request that is currently pending your approval.
      </p>

      <hr style="margin: 20px 0;" />

      <h3 style="color: #34495e;">Reservation Details</h3>

      <p><strong>Check-in:</strong> ${checkInDate}</p>
      <p><strong>Check-out:</strong> ${checkOutDate}</p>
      <p><strong>Total Price:</strong> $${totalPrice}</p>

      <hr style="margin: 20px 0;" />

      <p>
        Please log in to your dashboard to approve or reject this reservation.
      </p>

      <div style="margin-top: 30px;">
        <a 
          href="${process.env.FRONTEND_URL}/owner/reservations"
          style="
            background-color: #3498db;
            color: #ffffff;
            padding: 12px 20px;
            text-decoration: none;
            border-radius: 5px;
            display: inline-block;
          "
        >
          View Reservation
        </a>
      </div>

      <p style="margin-top: 40px; font-size: 12px; color: #7f8c8d;">
        This is an automated message. Please do not reply to this email.
      </p>

    </div>
  `,
    });

    return this.reservationsRepository.create(reservationData);
  }
}
