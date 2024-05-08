import { Module } from '@nestjs/common';
import { SongsController } from './api/song.controller';
import { SongService } from './domain/song.service';
import { SongRepository } from './data/repositories/song.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongEntity, ArtistEntity } from './data/repositories/entities';

@Module({
  imports: [TypeOrmModule.forFeature([SongEntity, ArtistEntity])],
  controllers: [SongsController],
  providers: [SongService, SongRepository]
})
export class SongsModule {}
