import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ArtistEntity } from "./entities/artist.entity";
import { Repository } from "typeorm";

@Injectable()
export class ArtistRepository {
    constructor(
        @InjectRepository(ArtistEntity) private readonly repository: Repository<ArtistEntity>
    ) {}
    getArtists(ids: number[]): Promise<ArtistEntity[]> {
        return this.repository.findBy(
            ids.map(artistId => ({ id: artistId }))
        );
    }
}