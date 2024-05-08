import { Body, Controller, Delete, Get, Inject, Param, Post, UseGuards } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist-dto';
import { PlaylistService } from '../domain/playlist.service';

@Controller('playlists')
export class PlaylistsController {
    constructor(
        @Inject(PlaylistService) private playlistService: PlaylistService
    ) {}
    // constructor(private songService: SongService) {}
    @Post()
    create(@Body() createPlaylistDto: CreatePlaylistDto){
        return this.playlistService.createPlaylist(createPlaylistDto);
    }

}
