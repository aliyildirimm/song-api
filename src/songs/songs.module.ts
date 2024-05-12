import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SongsController } from './api/song.controller';
import { SongService } from './domain/song.service';
import { SongRepository } from './data/repositories/song.repository';
import { SongEntity } from './data/repositories/entities';
import { ArtistModule } from 'src/artist/artist.module';
import { ArtistEntity } from 'src/artist/data/repositories/entities/artist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SongEntity, ArtistEntity]), ArtistModule],
  controllers: [SongsController],
  providers: [SongService, SongRepository],
  exports: [SongService],
})
export class SongsModule {}
