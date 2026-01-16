import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/modules/auth/auth.service';
import { UserService } from 'src/modules/users/user.services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return false;
    }

    const token = authorization.split(' ')[1];

    const { valid, decoded } = await this.authService.validateToken(token);

    console.log(decoded);

    if (!valid) return false;

    const user = await this.userService.getUserbyId(decoded.sub);

    request.user = user;
    return true;
  }
}
