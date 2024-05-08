import { Repository } from "typeorm";
import { SongEntity } from "./entities/song.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SongRepository {
    constructor(@InjectRepository(SongEntity) private readonly repository: Repository<SongEntity>) {}

    async findAll(): Promise<SongEntity[]> {
        return await this.repository.find();
    }

    async create(song: Omit<SongEntity, 'id'>): Promise<SongEntity> {
        const lyrics = song.lyrics ?? '';
        return await this.repository.save({ ...song, lyrics });
    }
}