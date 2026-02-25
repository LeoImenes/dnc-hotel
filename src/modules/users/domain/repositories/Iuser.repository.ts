import { User } from "@prisma/client";
import { CreateUserDto } from "../dto/createUser.dto";
import { UpdateUserDTO } from "../dto/updateUser.dto";

export interface IUserRepository {
    getUserById(id: string): Promise<User | null>;
    createUser(body: CreateUserDto): Promise<User>;
    getUsers(offset: number, limit: number): Promise<User[]>;
    updateUser(id: string, body: UpdateUserDTO): Promise<User>;
    deleteUser(id: string): Promise<User>;
    getUserByEmail(email: string): Promise<User | null>;
    uploadAvatar(id: string, filename: string): Promise<User>;
}
