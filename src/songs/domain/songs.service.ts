import { Inject, Injectable } from '@nestjs/common';
import { SongEntity } from '../data/repositories/entities/song.entity';
import { SongRepository } from '../data/repositories/songs.repository';

@Injectable()
export class SongService {
    constructor(@Inject(SongRepository) private readonly repository: SongRepository) {
    }
    private readonly songs = ["Ali", "Veli"]

    findAll() {
        return this.songs;
    }

    create(song: {
        title: string,
        artists: string[],
        duration: number,
        releaseDate: Date,
        lyrics: string,
    }): Promise<SongEntity> {
        return this.repository.create(song);
    }
}
