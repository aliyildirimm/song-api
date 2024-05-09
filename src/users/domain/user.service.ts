import { Inject, Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { UsersRepository } from "../data/repository/users.repository";

@Injectable()
export class UserService {
    constructor(@Inject(UsersRepository) private readonly usersRepository: UsersRepository) {}

    async createUser(username: string, password: string) {
        const salt = bcrypt.genSaltSync(10);
        const hashesPassword = bcrypt.hashSync(password, salt);

        const user = await this.usersRepository.createUser(username, hashesPassword);
        console.log('User created', user);
        return user;
    }

    async getUserById(id: number) {
        return this.usersRepository.getUserById(id);
    }
}