import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controllers';
import { UserService } from './user.services';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [PrismaModule,
 forwardRef(() => AuthModule)],
  exports: [UserService],
})
export class UserModule {}
