import { Module } from '@nestjs/common';
import { SongsController } from './api/song.controller';
import { SongService } from './domain/song.service';
import { SongRepository } from './data/repositories/song.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongEntity } from './data/repositories/entities/song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SongEntity])],
  controllers: [SongsController],
  providers: [SongService, SongRepository]
})
export class SongsModule {}
