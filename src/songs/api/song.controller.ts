import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { SongService } from '../domain/song.service';
import { CreateSongDto } from './dto';
import { ArtistService } from 'src/artist/domain/artist.domain';
import { ArtistGuard } from 'src/common/guards/artist.guard';

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

    @UseGuards(ArtistGuard)
    @Post()
    // publish could be better naming
    // artist itself should be into incoming artists
    // but is this something we do in the controller or middleware?
    async create(
        @Body() createSongDto: CreateSongDto,
        @Req() req: Request
    ){
        // maybe convert this to validate artists etc? or maybe even middleware?
        const artists = await this.artistService.getArtists(createSongDto.artists);
        if (artists.length !== createSongDto.artists.length) {
            throw new Error('Some artists were not found');
        }

        return this.songService.create(createSongDto, artists);
    }

    @UseGuards(ArtistGuard)
    @Delete(':id')
    delete(@Param('id') id: string){
        return this.songService.delete(id);
    }
}
