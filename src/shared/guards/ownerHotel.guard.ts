import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/modules/auth/auth.service';
import { FindByIdHotelsService } from 'src/modules/hotels/services/findByIdHotel.service';

@Injectable()
export class OwnerHotelGuard implements CanActivate {
  constructor(
    private readonly hotelService: FindByIdHotelsService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const hotelId = request.params.id;

    const user = request.user;

    if (!user) {
      return false;
    }

    const hotel = await this.hotelService.findOne(hotelId);

    if (!hotel) {
      return false;
    }

    return hotel.ownerId === user.id;
  }
}
