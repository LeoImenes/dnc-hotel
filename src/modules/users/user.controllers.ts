import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.services';
import { CreateUserDto } from './domain/dto/createUser.dto';
import { UpdateUserDTO } from './domain/dto/updateUser.dto';
import { ParamId } from 'src/shared/decorators/paramid.decorator';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { User } from 'src/shared/decorators/user.decorator';
import type { User as UserType } from '@prisma/client';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { UserMatchGuard } from 'src/shared/guards/userMatch.guard';

@UseGuards(AuthGuard, RoleGuard)
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers(@User('email') user: UserType) {
    console.log(user);
    return this.userService.getUsers();
  }

  @Get(':id')
  getUserbyId(@ParamId() id: string) {
    return this.userService.getUserbyId(id);
  }

  @Roles('ADMIN')
  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @UseGuards(UserMatchGuard)
  @Patch(':id')
  updateUser(@ParamId() id: string, @Body() body: UpdateUserDTO) {
    return this.userService.updateUser(id, body);
  }
  
  @UseGuards(UserMatchGuard)
  @Delete(':id')
  deleteUser(@ParamId() id: string) {
    return this.userService.deleteUser(id);
  }
}
