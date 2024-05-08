import { Injectable } from '@nestjs/common';

@Injectable()
export class SongsService {
    private readonly songs = ["Ali", "Veli"]

    findAll() {
        return this.songs;
    }

    create(song: string) {
        this.songs.push(song);
    }
}
