import { Injectable } from "@nestjs/common";
import { ArtistRepository } from "../data/repositories/artist.repository";
import { ArtistEntity } from "../data/repositories/entities/artist.entity";

@Injectable()
export class ArtistService {
    constructor(private artistRepository: ArtistRepository) {}
    getArtists(ids: number[]): Promise<ArtistEntity[]> {
        return this.artistRepository.getArtists(ids);
    }
}