import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { SongService } from '../domain/song.service';
import { CreateSongDto } from './dto';
import { ArtistGuard } from 'src/common/guards/artist.guard';
import { RequestWithUser } from 'src/common/guards/auth.guard';
import { SongOwnerGuard } from './guards/songOwner.guard';

@Controller('songs')
export class SongsController {
  constructor(private songService: SongService) {}
  @Get()
  findAll() {
    return this.songService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const song = await this.songService.findOne(id);
    if (!song) {
      throw new NotFoundException('Song not found');
    }
    return song;
  }

  @UseGuards(ArtistGuard)
  @Post()
  async publish(
    @Body() createSongDto: CreateSongDto,
    @Request() req: RequestWithUser,
  ) {
    // next check might need to be checked in a guard
    const artistId = req.user.artistId;
    if (!createSongDto.artists.includes(artistId)) {
      throw new BadRequestException(
        'The creator has to be in the artists list',
      );
    }

    return this.songService.create(createSongDto);
  }

  @UseGuards(ArtistGuard, SongOwnerGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.songService.delete(id);
  }
}
