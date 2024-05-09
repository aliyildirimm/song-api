import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SongService } from '../domain/song.service';
import { CreateSongDto } from './dto';
import { ArtistService } from 'src/artist/domain/artist.domain';

@Controller('songs')
export class SongsController {
    constructor(private songService: SongService, private artistService: ArtistService) {}
    @Get()
    findAll(){
        return this.songService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id:string) {
        return this.songService.findOne(id);
    }

    @Post()
    async create(@Body() createSongDto: CreateSongDto){
        // maybe convert this to validate artists etc? or maybe even middleware?
        const artists = await this.artistService.getArtists(createSongDto.artists);
        if (artists.length !== createSongDto.artists.length) {
            throw new Error('Some artists were not found');
        }

        return this.songService.create(createSongDto, artists);
    }

    @Delete(':id')
    delete(@Param('id') id: string){
        return this.songService.delete(id);
    }
}
