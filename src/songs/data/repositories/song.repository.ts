import { Repository } from "typeorm";
import { SongEntity } from "./entities/song.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable } from "@nestjs/common";

@Injectable()
export class SongRepository {
    // NOTE: @InjectRepository() and TypeormModule.forFeature() have to work together because 
    // Typescript cannot reflect generics properly. Normally with Nest we can use class names as
    // injection tokens, but something like Repository<TaskEntity> just comes back as Repository
    // so Nest wouldn't know which repository to inject. By using the @InjectRepository() decorator
    // we are able to set the injection token metadata and override the reflected class value.
    constructor(@InjectRepository(SongEntity) private readonly repository: Repository<SongEntity>) {}

    async findAll(): Promise<SongEntity[]> {
        return await this.repository.find();
    }

    async findOne(id: string): Promise<SongEntity> {
        return await this.repository.findOne({
            where: { id: +id }
        })
    }

    async create(song: Omit<SongEntity, 'id'>): Promise<SongEntity> {
        const lyrics = song.lyrics ?? '';
        return await this.repository.save({ ...song, lyrics });
    }

    async delete(id: string): Promise<void> {
        await this.repository.delete({ id: +id });
    }
}