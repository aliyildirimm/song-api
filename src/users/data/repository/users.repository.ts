import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "./entitites";

@Injectable()
export class UsersRepository {
    constructor(
        @InjectRepository(UserEntity) private readonly repository: Repository<UserEntity>
    ) {}

    async createUser(
        username: string,
        password: string
    ) {
        return this.repository.save({
            username,
            password
        });
    }

    async getUserById(id: number) {
        return this.repository.find({
            where: { id }
        });
    }
}