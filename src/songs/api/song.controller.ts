import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Req, Request, UseGuards } from '@nestjs/common';
import { SongService } from '../domain/song.service';
import { CreateSongDto } from './dto';
import { ArtistService } from 'src/artist/domain/artist.domain';
import { ArtistGuard } from 'src/common/guards/artist.guard';
import { RequestWithUser } from 'src/common/guards/auth.guard';
import { SongOwnerGuard } from './guards/songOwner.guard';


@Controller('songs')
export class SongsController {
    constructor(private songService: SongService, private artistService: ArtistService) {}
    @Get()
    findAll() {
        return this.songService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id:string) {
        return this.songService.findOne(id);
    }

    @UseGuards(ArtistGuard)
    @Post()
    async publish(
        @Body() createSongDto: CreateSongDto,
        @Request() req: RequestWithUser,
    ){
        // next two checks might need to be checked in the guards
        const artistId = req.user.artistId;
        if (!createSongDto.artists.includes(artistId)) {
            throw new BadRequestException("The creator has to be in the artists list");
        }

        const artists = await this.artistService.getArtists(createSongDto.artists);
        if (artists.length !== createSongDto.artists.length) {
            throw new BadRequestException('Some artists were not found');
        }

        return this.songService.create(createSongDto, artists);
    }

    @UseGuards(ArtistGuard, SongOwnerGuard)
    @Delete(':id')
    async delete(
        @Param('id') id: string,
    ){
        return this.songService.delete(id);
    }
}

