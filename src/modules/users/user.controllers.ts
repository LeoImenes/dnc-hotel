import { Body, Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { UserService } from './user.services';
import { CreateUserDto } from './domain/dto/createUser.dto';
import { UpdateUserDTO } from './domain/dto/updateUser.dto';
import { ParamId } from 'src/shared/decorators/paramid.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Get(':id')
  getUserbyId(@ParamId() id: string) {
    return this.userService.getUserbyId(id);
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Patch(':id')
  updateUser(@ParamId() id: string, @Body() body: UpdateUserDTO) {
    return this.userService.updateUser(id, body);
  }

  @Delete(':id')
  deleteUser(@ParamId() id: string) {
    return this.userService.deleteUser(id);
  }
}
