import { Inject, Injectable } from "@nestjs/common";

import { PlaylistRepository } from "../data/repositories/playlist.repository";

@Injectable()
export class PlaylistService {
    constructor(
        @Inject(PlaylistRepository) private playlistRepository: PlaylistRepository
    ) {}
    async createPlaylist(
        playlist: {
            userId: number,
            name: string,
            songIds: number[],
        }
    ) {
        return this.playlistRepository.createPlaylist(playlist);
    }
}