import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PlaylistEntity } from "./entities";
import { Repository } from "typeorm";

@Injectable()
export class PlaylistRepository {
    constructor(
        @InjectRepository(PlaylistEntity) private readonly repository: Repository<PlaylistEntity>
    ) {}
    async createPlaylist(
        playlist: {
            userId: number,
            name: string,
            songIds: number[],
        }
    ) {
        return this.repository.save({
            name: playlist.name,
            user: { id: playlist.userId },
            songs: playlist.songIds.map(songId => ({ id: songId }))
        });
    }
}