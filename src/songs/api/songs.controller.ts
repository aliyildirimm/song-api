import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SongService } from '../domain/songs.service';
import { CreateSongDto } from './dto/create-song-dto';

@Controller('songs')
export class SongsController {
    constructor(private songService: SongService) {}
    @Get()
    findAll(){
        return this.songService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id:string) {
        return `only one song with ${id}`
    }

    @Post()
    create(@Body() createSongDto: CreateSongDto){
        return this.songService.create(createSongDto);
    }
}
