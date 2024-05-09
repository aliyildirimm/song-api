import { HttpException, HttpStatus, Inject, Injectable, NestMiddleware } from "@nestjs/common";
import { Request, NextFunction } from "express";
import { SongService } from "src/songs/domain/song.service";

interface RequesWithSongs extends Request {
    body: {
        songIds: number[];
    };
}

@Injectable()
export class RequireSongsMiddleware implements NestMiddleware {
    constructor(@Inject(SongService) private readonly songsService: SongService) {}

    async use(req: RequesWithSongs, _res: Response, next: NextFunction) {
        const songIds: number[] = req.body.songIds;
        const songs = await this.songsService.findMany(songIds);
        if (songs.length !== songIds.length) {
            throw new HttpException('Some songs do not exist', HttpStatus.BAD_REQUEST);
        }
        next();
    }
}