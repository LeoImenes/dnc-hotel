import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IHotelRepository } from '../domain/repositories/IHotel.repositories';
import { HotelsRepositoriesToken } from '../utils/repositoriesTokens';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { join, resolve } from 'path';
import { stat, unlink } from 'fs/promises';

@Injectable()
export class uploadHotelImageService {
  constructor(
    @Inject(HotelsRepositoriesToken)
    private readonly hotelsRepository: IHotelRepository,
  ) {}

  async update(id: string, imageFileName: string) {
    const hotel = await this.hotelsRepository.findById(id);

    console.log(id, imageFileName);

    const directory = resolve(
      __dirname,
      '..',
      '..',
      '..',
      '..',
      '..',
      'uploads',
      'hotels',
    );

    if (!hotel) {
      throw new NotFoundException('Hotel not found');
    }

    if (hotel.image) {
      const hotelImagePath = join(directory, hotel.image);
      const hotelImageFileExists = await stat(hotelImagePath);

      if (hotelImageFileExists) {
        // Delete the old avatar file
        await unlink(hotelImagePath);
      }
    }

    return await this.hotelsRepository.update(id, { image: imageFileName });
  }
}
