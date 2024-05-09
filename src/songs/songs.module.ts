import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SongsController } from './api/song.controller';
import { SongService } from './domain/song.service';
import { SongRepository } from './data/repositories/song.repository';
import { SongEntity } from './data/repositories/entities';
import { ArtistModule } from 'src/artist/artist.module';

@Module({
  imports: [TypeOrmModule.forFeature([SongEntity]), ArtistModule],
  controllers: [SongsController],
  providers: [SongService, SongRepository],
  exports: [SongService],
})
export class SongsModule {}
