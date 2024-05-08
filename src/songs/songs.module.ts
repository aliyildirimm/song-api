import { Module } from '@nestjs/common';
import { SongsController } from './api/songs.controller';
import { SongService } from './domain/songs.service';
import { SongRepository } from './data/repositories/songs.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongEntity } from './data/repositories/entities/song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SongEntity])],
  controllers: [SongsController],
  providers: [SongService, SongRepository]
})
export class SongsModule {}
