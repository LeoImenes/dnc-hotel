import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './user.controllers';
import { UserService } from './user.services';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';

@Module({
  controllers: [UserController],
  providers: [UserService],
  imports: [
    PrismaModule,
    forwardRef(() => AuthModule),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/avatars',
        filename: (req, file, cb) => {
          const filename: string = `${uuid()}-${file.originalname}`;
          return cb(null, filename);
        },
      }),
    }),
  ],
  exports: [UserService],
})
export class UserModule {}
