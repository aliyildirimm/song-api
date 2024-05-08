import { Inject, Injectable } from '@nestjs/common';
import { Connection } from 'src/common/constants/connection';
import { ConfigService } from 'src/common/providers/config.service';

@Injectable()
export class SongsService {
    constructor(@Inject('CONNECTION') private connection: Connection, private configService: ConfigService) {
    }
    private readonly songs = ["Ali", "Veli"]

    findAll() {
        return this.songs;
    }

    create(song: string) {
        this.songs.push(song);
    }
}
