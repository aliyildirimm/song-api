import { Body, Controller, Post } from '@nestjs/common';
import { CreatePlaylistDto } from './dto/create-playlist-dto';
import { PlaylistService } from '../domain/playlist.service';

@Controller('playlists')
export class PlaylistsController {
  constructor(private playlistService: PlaylistService) {}

  @Post()
  create(@Body() createPlaylistDto: CreatePlaylistDto) {
    return this.playlistService.createPlaylist(createPlaylistDto);
  }
}
