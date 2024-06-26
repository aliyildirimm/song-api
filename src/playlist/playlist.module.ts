import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PlaylistsController } from './api/playlist.controller';
import { SongsModule } from 'src/songs/songs.module';
import { RequireSongsMiddleware } from './api/middleware/requireSongs.middleware';
import { PlaylistService } from './domain/playlist.service';
import { PlaylistRepository } from './data/repositories/playlist.repository';
import { PlaylistEntity } from './data/repositories/entities';

@Module({
  imports: [TypeOrmModule.forFeature([PlaylistEntity]), SongsModule],
  controllers: [PlaylistsController],
  providers: [PlaylistService, PlaylistRepository],
})
export class PlaylistModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequireSongsMiddleware)
      .forRoutes({ path: 'playlists', method: RequestMethod.POST });
  }
}
