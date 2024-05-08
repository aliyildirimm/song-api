import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { SongsService } from './songs.service';
import { connection } from 'src/common/constants/connection';
import { ConfigService } from 'src/common/providers/config.service';

@Module({
  controllers: [SongsController],
  providers: [SongsService,
    {
      provide: 'CONNECTION',
      useValue: connection
    },
    ConfigService
  ]
})
export class SongsModule {}
