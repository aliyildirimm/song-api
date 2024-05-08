import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SongService } from '../domain/song.service';
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
        return this.songService.findOne(id);
    }

    @Post()
    create(@Body() createSongDto: CreateSongDto){
        return this.songService.create(createSongDto);
    }

    @Delete(':id')
    delete(@Param('id') id: string){
        return this.songService.delete(id);
    }
}
