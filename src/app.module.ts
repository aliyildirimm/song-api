import { Module } from '@nestjs/common';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [SongsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
