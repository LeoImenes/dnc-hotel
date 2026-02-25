import { forwardRef, Module } from '@nestjs/common';
import { UserController } from './infra/user.controllers';
//import { UserService } from './user.services';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthService } from '../auth/auth.service';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { CreateUserService } from './services/createUser.service';
import { DeleteUserService } from './services/deleteUser.service';
import { GetAllUsersService } from './services/getAllUsers.service';
import { GetUserByEmailService } from './services/getUsersByEmail.service';
import { GetUserByIdService } from './services/getUsersById.service';
import { UploadUserAvatarService } from './services/uploadUserAvatar.service';
import { UpdateUserService } from './services/updateUser.service';
import { UserService } from './user.services';
import { UsersRepository } from './infra/users.repository';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserService,
    UserService,
    DeleteUserService,
    GetAllUsersService,
    GetUserByEmailService,
    GetUserByIdService,
    UploadUserAvatarService,
    UpdateUserService,
    {provide: 'UserRepositoryToken', useClass: UsersRepository}
  ],
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
