import { Injectable } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { UsersRepository } from "../data/repository/users.repository";
import { User } from "./models/user.model";

@Injectable()
export class UserService {
    constructor(private readonly usersRepository: UsersRepository) {}

    async createUser(username: string, password: string) {
        // should i add one more key locally and make hash(hash(salt + secret) + password) ?
        const salt = bcrypt.genSaltSync(10);
        const hashesPassword = bcrypt.hashSync(password, salt);

        const user = await this.usersRepository.createUser(username, hashesPassword);
        return user;
    }

    async getUserByUsername(username: string): Promise<User | null> {
        return this.usersRepository.getUserByUsername(username);
    }

    async getUserById(id: number) {
        return this.usersRepository.getUserById(id);
    }
}