import { BadRequestException } from '@nestjs/common';

type CheckInDates = {
  checkInDate: Date;
  checkOutDate: Date;
};

export const validateCheckinDates = ({
  checkInDate,
  checkOutDate,
}: CheckInDates) => {
  console.log(checkInDate, checkOutDate);

  if (checkInDate >= checkOutDate) {
    throw new BadRequestException(
      'Check-out date must be after check-in date.',
    );
  }
};
