import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  MaxFileSizeValidator,
  UseInterceptors,
} from '@nestjs/common';
import { HotelsService } from '../hotels.service';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { CreateHotelsService } from '../services/createHotel.service';
import { UpdateHotelsService } from '../services/updateHotel.service';
import { FindByIdHotelsService } from '../services/findByIdHotel.service';
import { FindAllHotelsService } from '../services/findAllHotel.service';
import { RemoveHotelsService } from '../services/removeHotel.service';
import { FindByOwnerHotelsService } from '../services/findByOwner.service';
import { FindByNameHotelsService } from '../services/findByName.service';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { OwnerHotelGuard } from 'src/shared/guards/ownerHotel.guard';
import { User } from 'src/shared/decorators/user.decorator';
import { Max } from 'class-validator';
import { uploadHotelImageService } from '../services/uploadImageHotel.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationInterceptor } from 'src/shared/interceptors/fileValidation.interceptor';
import { Multer } from 'multer';

@UseGuards(AuthGuard, RoleGuard)
@Controller('hotels')
export class HotelsController {
  constructor(
    private readonly createHotelServices: CreateHotelsService,
    private readonly updateHotelServices: UpdateHotelsService,
    private readonly findOneHotelServices: FindByIdHotelsService,
    private readonly findAllHotelsService: FindAllHotelsService,
    private readonly removeHotelServices: RemoveHotelsService,
    private readonly findHotelByOwnerIdService: FindByOwnerHotelsService,
    private readonly findHotelByNameService: FindByNameHotelsService,
    private readonly uploadHotelImageService: uploadHotelImageService,
  ) {}

  @Roles('ADMIN')
  @Post()
  create(@User('id') userId: string, @Body() createHotelDto: CreateHotelDto) {
    return this.createHotelServices.create(createHotelDto, userId);
  }

  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.findAllHotelsService.findAll(Number(page), Number(limit));
  }

  @Get('name')
  findByName(@Query('name') name: string) {
    console.log('here', name);
    return this.findHotelByNameService.findByName(name);
  }

  @Roles('ADMIN')
  @Get('owner')
  findByOwnerId(@User('id') ownerId: string) {
    return this.findHotelByOwnerIdService.findByOwner(ownerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findOneHotelServices.findOne(id);
  }

  @UseInterceptors(FileInterceptor('image'), FileValidationInterceptor)
  @Patch('image/:hotelId')
  uploadHotelImage(
    @Param('hotelId') hotelId: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
         // new FileTypeValidator({ fileType: 'image/png' }),
          // new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
        ],
      }),
    )
    //@ts-ignore
    image: Express.Multer.File,
  ) {
    console.log('Uploading image for hotel ID:', hotelId);
    return this.uploadHotelImageService.update(hotelId, image.filename);
  }

  @UseGuards(OwnerHotelGuard)
  @Roles('ADMIN')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHotelDto: UpdateHotelDto) {
    return this.updateHotelServices.update(id, updateHotelDto);
  }

  @UseGuards(OwnerHotelGuard)
  @Roles('ADMIN')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.removeHotelServices.remove(id);
  }
}
