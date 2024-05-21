import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ArtistService } from './domain/artist.service';
import { ArtistRepository } from './data/repositories/artist.repository';
import { ArtistEntity } from './data/repositories/entities';

@Module({
  imports: [TypeOrmModule.forFeature([ArtistEntity])],
  providers: [ArtistService, ArtistRepository],
  exports: [ArtistService, ArtistRepository],
})
export class ArtistModule {}
