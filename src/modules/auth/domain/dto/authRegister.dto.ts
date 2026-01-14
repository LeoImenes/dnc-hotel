import { PartialType } from "@nestjs/mapped-types";
import { CreateUserDto } from "src/modules/users/domain/dto/createUser.dto";

export class AuthRegisterDto extends PartialType(CreateUserDto) {}
