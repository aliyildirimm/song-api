import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { UserEntity } from "./entitites";
import { mapUserEntityToUser } from "./mappers/userEntity.mapper";
import { User } from "src/users/domain/models/user.model";

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

    async deleteUser(id: number) {
        return this.repository.delete({ id });
    }

    async getUserByUsername(username: string): Promise<User | null> {
        const user = await this.repository.findOne({
            where: { username },
            select: ['username', 'id', 'password']
        });

        return user ? mapUserEntityToUser(user) : null;
    }

    async getUserById(id: number) {
        return this.repository.find({
            where: { id }
        });
    }
}