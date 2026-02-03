import { Module } from '@nestjs/common';
import { HotelsService } from './hotels.service';
import { HotelsController } from './infra/hotels.controller';
import { CreateHotelsService } from './services/createHotel.service';
import { UpdateHotelsService } from './services/updateHotel.service';
import { FindByIdHotelsService } from './services/findByIdHotel.service';
import { FindAllHotelsService } from './services/findAllHotel.service';
import { RemoveHotelsService } from './services/removeHotel.service';
import { PrismaModule } from '../prisma/prisma.module';
import { HotelsRepositories } from './infra/hotels.repositories';
import { HotelsRepositoriesToken } from './utils/repositoriesTokens';
import { FindByNameHotelsService } from './services/findByName.service';
import { FindByOwnerHotelsService } from './services/findByOwner.service';
import { UserModule } from '../users/user.module';
import { AuthModule } from '../auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuid } from 'uuid';
import { uploadHotelImageService } from './services/uploadImageHotel.service';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads/hotels',
        filename: (req, file, cb) => {
          const filename: string = `${uuid()}-${file.originalname}`;
          return cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [HotelsController],
  providers: [
    CreateHotelsService,
    UpdateHotelsService,
    FindByIdHotelsService,
    FindAllHotelsService,
    RemoveHotelsService,
    FindByNameHotelsService,
    FindByOwnerHotelsService,
    uploadHotelImageService,
    {
      provide: HotelsRepositoriesToken,
      useClass: HotelsRepositories,
    },
  ],
})
export class HotelsModule {}
