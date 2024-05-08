import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { SongsService } from './songs.service';
import { CreateSongDto } from './dto/create-song-dto';

@Controller('songs')
export class SongsController {
    constructor(private songsService: SongsService) {}
    @Get()
    findAll(){
        return this.songsService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id:string) {
        return `only one song with ${id}`
    }

    @Post()
    create(@Body() createSongDto: CreateSongDto){
        return this.songsService.create(createSongDto.title);
    }
}
