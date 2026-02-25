import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  ParseFilePipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from '../domain/dto/createUser.dto';
import { UpdateUserDTO } from '../domain/dto/updateUser.dto';
import { ParamId } from 'src/shared/decorators/paramid.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import type { User as UserType } from '@prisma/client';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { UserMatchGuard } from 'src/shared/guards/userMatch.guard';
import { ThrottlerGuard } from '@nestjs/throttler';
import { FileInterceptor } from '@nestjs/platform-express/multer/interceptors/file.interceptor';
import { FileValidationInterceptor } from 'src/shared/interceptors/fileValidation.interceptor';
import { GetAllUsersService } from '../services/getAllUsers.service';
import { GetUserByEmailService } from '../services/getUsersByEmail.service';
import { GetUserByIdService } from '../services/getUsersById.service';
import { CreateUserService } from '../services/createUser.service';
import { UpdateUserService } from '../services/updateUser.service';
import { DeleteUserService } from '../services/deleteUser.service';
import { UploadUserAvatarService } from '../services/uploadUserAvatar.service';

@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(
    private getallUsersService: GetAllUsersService,
    private getUserByIdService: GetUserByIdService,
    private createUserService: CreateUserService,
    private updateUserService: UpdateUserService,
    private deleteUserService: DeleteUserService,
    private uploadAvatarService: UploadUserAvatarService,

  ) {}

  @UseGuards(ThrottlerGuard)
  @Get()
  getUsers(page = 1, limit = 10) {
    console.log('Get users called with page:', page, 'and limit:', limit);
    return this.getallUsersService.execute(page, limit);
  }

  @Get(':id')
  getUserbyId(@ParamId() id: string) {
    return this.getUserByIdService.execute(id);
  }

  @Roles('ADMIN')
  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.createUserService.execute(body);
  }

  @UseGuards(UserMatchGuard)
  @Patch(':id')
  updateUser(@ParamId() id: string, @Body() body: CreateUserDto) {
    return this.updateUserService.execute(id, body);
  }

  @UseGuards(UserMatchGuard)
  @Delete(':id')
  deleteUser(@ParamId() id: string) {
    return this.deleteUserService.execute(id);
  }

  @UseInterceptors(FileInterceptor('avatar'), FileValidationInterceptor)
  @Post('avatar')
  uploadAvatar(
    @User('id') id: string,
    @UploadedFile(
      new ParseFilePipe(),
    )
    avatar //@ts-ignore
    : Express.Multer.File,
  ) {
    console.log(avatar);
    return this.uploadAvatarService.execute(id, avatar.filename);
  }
}
